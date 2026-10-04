import { getApiKey } from './aiCredentials';

// Gemini'ye giden tek kapı: kullanıcının kendi anahtarı (BYOK). Anahtar cihazın
// kasasında (`aiCredentials.ts`), çağrı doğrudan Google'a gidiyor. Sunucu yok;
// kota ve fatura kullanıcının kendi hesabında. Anahtar yoksa yapay zekâ kapalı
// sayılıyor (`aiAvailability.ts`) ve buraya hiç gelinmiyor.

const GOOGLE_API_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models';

export type GeminiCall = {
  prompt: string;
  /** Gemini'nin JSON şeması — verilirse yanıt application/json olarak istenir. */
  responseSchema?: Record<string, unknown>;
  /** Konuşma kaydının sesi (base64, m4a). */
  audioBase64?: string;
  /** Ses yüksekliği ölçümleri — prompt'a ekleniyor. */
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

const DEFAULT_MODEL = 'gemini-2.5-flash';

/**
 * Ses varsa çok-ortamlı (multimodal) parça listesi kurar.
 *
 * ⚠️ Ses MIME türü: `audio/m4a` IANA'da kayıtlı bir tür değil ve Gemini'nin
 * desteklenen türler listesinde geçmiyor; m4a dosyaları MPEG-4 kabı olduğu için
 * doğrusu `audio/mp4`.
 */
function buildParts(call: GeminiCall): Record<string, unknown>[] {
  let text = call.prompt;

  if (call.dbLogs && call.dbLogs.length > 0) {
    text += `\n\nSES YÜKSEKLİĞİ LOGLARI (dB):\n${JSON.stringify(call.dbLogs)}`;
    text +=
      '\nYukarıdaki desibel loglarını inceleyerek konuşmacının sesini nasıl kullandığını (bağırma, fısıldama, ani yükselmeler) değerlendir.';
  }

  const parts: Record<string, unknown>[] = [{ text }];

  if (call.audioBase64) {
    parts.push({ inlineData: { mimeType: 'audio/mp4', data: call.audioBase64 } });
  }

  return parts;
}

/** Google'ın REST gövdesi. SDK'daki `config` burada ikiye ayrılıyor. */
function buildRequestBody(call: GeminiCall): Record<string, unknown> {
  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: buildParts(call) }],
  };

  if (call.responseSchema) {
    body.generationConfig = {
      responseMimeType: 'application/json',
      responseSchema: call.responseSchema,
    };
  }
  if (call.useSearch) {
    body.tools = [{ google_search: {} }];
  }

  return body;
}

/** Google'ın hata gövdesinden kullanıcıya gösterilebilir bir cümle çıkarır. */
function describeGoogleError(status: number, payload: any): GeminiError {
  const reason: string = payload?.error?.status ?? '';
  const detail: string = payload?.error?.message ?? '';

  if (status === 400 && /API key not valid/i.test(detail)) {
    return new GeminiError(
      'Anahtar geçersiz görünüyor. Ayarlar → Yapay Zekâ bölümünden yeniden yapıştırabilirsin.',
      'BAD_KEY',
    );
  }
  if (status === 401 || status === 403) {
    return new GeminiError(
      'Anahtar kabul edilmedi. Google AI Studio\'da hâlâ geçerli mi kontrol et.',
      'BAD_KEY',
    );
  }
  if (status === 429 || reason === 'RESOURCE_EXHAUSTED') {
    return new GeminiError(
      'Günlük ücretsiz kotan dolmuş görünüyor. Bir süre sonra tekrar dene.',
      'QUOTA',
    );
  }
  if (status >= 500) {
    return new GeminiError('Google tarafında geçici bir sorun var. Birazdan tekrar dene.', 'UPSTREAM');
  }
  return new GeminiError(detail || 'Yapay zekâ yanıt veremedi.', reason || 'UNKNOWN');
}

/** Kullanıcının kendi anahtarıyla doğrudan Google'a. */
async function callDirect(call: GeminiCall, apiKey: string): Promise<string> {
  const model = call.model ?? DEFAULT_MODEL;
  const url = `${GOOGLE_API_ROOT}/${model}:generateContent`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Anahtar başlıkta gidiyor, sorgu dizesinde değil: URL'ler günlüklere
        // ve çökme raporlarına düşebiliyor, başlıklar düşmüyor.
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(buildRequestBody(call)),
      signal: call.signal,
    });
  } catch (e: any) {
    if (e?.name === 'AbortError') throw e;
    throw new GeminiError('İnternet bağlantısı kurulamadı. Bağlantını kontrol et.', 'NETWORK');
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) throw describeGoogleError(response.status, payload);

  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
}

export async function callGemini(call: GeminiCall): Promise<string> {
  const apiKey = getApiKey();
  if (apiKey) return callDirect(call, apiKey);

  // Buraya normalde hiç gelinmiyor: çağıran her yer önce `aiAvailable()`
  // soruyor. Yine de sessiz kalmaktansa açık bir kod dönülüyor.
  throw new GeminiError('Yapay zekâ henüz kurulmadı.', 'NOT_CONFIGURED');
}

/** Şemalı çağrı — yanıtı doğrudan nesne olarak döndürür. */
export async function callGeminiJson<T>(
  call: GeminiCall & { responseSchema: Record<string, unknown> },
): Promise<T> {
  const text = await callGemini(call);
  try {
    // Model bazen JSON'u ``` bloğunun içine koyuyor; ilk süslü paranteze kadar kırpıyoruz.
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const raw = start >= 0 && end > start ? text.slice(start, end + 1) : text;
    return JSON.parse(raw) as T;
  } catch {
    throw new GeminiError('Yapay zekâ yanıtı çözümlenemedi. Lütfen tekrar dene.', 'PARSE');
  }
}

export type ConnectionResult = { ok: boolean; message: string };

/**
 * Kurulum ekranındaki "Doğrula" ve "Bağlantıyı test et" düğmeleri.
 *
 * `overrideKey`: anahtarı kaydetmeden önce denemek için.
 */
export async function testConnection(overrideKey?: string): Promise<ConnectionResult> {
  const key = overrideKey?.trim() || getApiKey();

  if (!key) {
    return { ok: false, message: 'Önce bir anahtar gir.' };
  }

  try {
    const text = await callDirect({ prompt: 'ping' }, key);
    if (text.length === 0) {
      return { ok: false, message: 'Bağlantı kuruldu ama yanıt boş geldi. Tekrar dene.' };
    }
    return { ok: true, message: 'Anahtar çalışıyor. Yapay zekâ değerlendirmesi artık açık.' };
  } catch (e) {
    const error = e as GeminiError;
    return { ok: false, message: error.message || 'Bağlantı kurulamadı.' };
  }
}
