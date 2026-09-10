import { appSettingsStore, normalizeBaseUrl } from './appSettings';

// server/server.ts içindeki Express proxy'sine giden tek kapı.
// API anahtarı yalnızca sunucuda durur; uygulama anahtarı hiç görmez.

export type GeminiCall = {
  prompt: string;
  /** Gemini'nin JSON şeması — verilirse yanıt application/json olarak istenir. */
  responseSchema?: Record<string, unknown>;
  /** Mülakat kaydının sesi (base64, m4a). */
  audioBase64?: string;
  /** Mülakat sırasında yakalanan kareler (base64, jpeg). */
  capturedPhotos?: string[];
  /** Ses yüksekliği ölçümleri — sunucu bunları prompt'a ekliyor. */
  dbLogs?: number[];
  model?: string;
  /** Google arama ile temellendirme (haber/güncel bilgi soruları için). */
  useSearch?: boolean;
  signal?: AbortSignal;
};

export class GeminiError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

function requireBaseUrl(): string {
  const base = normalizeBaseUrl(appSettingsStore.get().apiBaseUrl);
  if (!base) {
    throw new GeminiError(
      'Sunucu adresi tanımlı değil. Ayarlar → Backend API Adresi alanını doldurun.',
      'NO_BASE_URL',
    );
  }
  return base;
}

async function post(path: string, body: unknown, signal?: AbortSignal): Promise<any> {
  const url = `${requireBaseUrl()}${path}`;
  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Sunucuda APP_TOKEN tanımlıysa gerekli; boşsa başlık hiç eklenmiyor.
        ...(appSettingsStore.get().appToken
          ? { 'x-app-token': appSettingsStore.get().appToken }
          : {}),
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (e: any) {
    if (e?.name === 'AbortError') throw e;
    // Ağ hatası: sunucu kapalı, IP yanlış ya da telefon farklı bir ağda.
    throw new GeminiError(
      `Sunucuya ulaşılamadı (${url}). Express sunucusu çalışıyor mu ve telefon aynı ağda mı?`,
      'NETWORK',
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    const code = payload?.error;
    if (code === 'API_KEY_MISSING') {
      throw new GeminiError(
        'Sunucuda GEMINI_API_KEY tanımlı değil. Sunucu klasöründeki .env dosyasını kontrol edin.',
        code,
      );
    }
    throw new GeminiError(
      payload?.message || payload?.error || 'Yapay zeka analiz motoru yanıt veremedi.',
      code,
    );
  }

  return payload;
}

export async function callGemini(call: GeminiCall): Promise<string> {
  const config: Record<string, unknown> = {};

  if (call.responseSchema) {
    config.responseMimeType = 'application/json';
    config.responseSchema = call.responseSchema;
  }
  if (call.useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  const payload = await post(
    '/api/gemini',
    {
      model: call.model ?? 'gemini-2.5-flash',
      contents: call.prompt,
      config: Object.keys(config).length > 0 ? config : undefined,
      audioBase64: call.audioBase64,
      capturedPhotos: call.capturedPhotos,
      dbLogs: call.dbLogs,
    },
    call.signal,
  );

  return typeof payload.text === 'string' ? payload.text : '';
}

/** Şemalı çağrı — yanıtı doğrudan nesne olarak döndürür. */
export async function callGeminiJson<T>(call: GeminiCall & { responseSchema: Record<string, unknown> }): Promise<T> {
  const text = await callGemini(call);
  try {
    // Model bazen JSON'u ``` bloğunun içine koyuyor; ilk süslü paranteze kadar kırpıyoruz.
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const raw = start >= 0 && end > start ? text.slice(start, end + 1) : text;
    return JSON.parse(raw) as T;
  } catch {
    throw new GeminiError('Yapay zeka yanıtı çözümlenemedi. Lütfen tekrar deneyin.', 'PARSE');
  }
}

export type ConnectionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

/**
 * Ayarlar ekranındaki "Bağlantıyı Test Et" düğmesi.
 * Sunucuya ulaşıldıysa anahtar eksik olsa bile bağlantı başarılı sayılır — iki sorun ayrı ayrı raporlanır.
 */
export async function testConnection(): Promise<ConnectionResult> {
  try {
    await callGemini({ prompt: 'ping', model: 'gemini-2.5-flash' });
    return { ok: true, message: 'Sunucuya ulaşıldı ve yapay zeka motoru yanıt verdi.' };
  } catch (e) {
    const error = e as GeminiError;
    if (error.code === 'API_KEY_MISSING') {
      return {
        ok: false,
        message: 'Sunucuya ulaşıldı fakat GEMINI_API_KEY tanımlı değil. Sunucudaki .env dosyasını kontrol edin.',
      };
    }
    return { ok: false, message: error.message || 'Bağlantı kurulamadı.' };
  }
}
