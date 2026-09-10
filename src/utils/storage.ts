import { AppState, Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';

// Basit JSON kalıcılık katmanı. AsyncStorage yerine expo-file-system kullanıyoruz;
// böylece yeni bir native bağımlılık (ve yeni bir prebuild) gerekmiyor.
//
// Yazma davranışı: `writeJson` diske ANINDA yazmaz. Değeri bellekteki önbelleğe
// koyar ve kısa bir gecikmeyle tek seferde diske aktarır. Sebebi, her ayar
// değişikliğinin (anahtar çevirme, saat ayarlama, sayaç artırma) senkron bir
// dosya yazımı tetiklemesi ve bunun JS thread'ini bloklamasıydı; art arda gelen
// değişikliklerde bu fark ediliyordu.
//
// Okuma senkron kalıyor: store'lar modül yüklenirken ilk değerlerini buradan
// alıyor. Önbellek okumada da devrede olduğu için yazdıktan hemen sonra okumak
// güncel değeri döndürür (diske henüz inmemiş olsa bile).
const STORE_DIR = 'savunma-store';

/** Yazma gecikmesi. Kullanıcı bir ayarla oynarken yazımları tek dosya işlemine indirir. */
const FLUSH_DELAY_MS = 250;

// Web hedefinde (expo start --web) dosya sistemi yok, localStorage'a düşüyoruz.
const isWeb = Platform.OS === 'web';

/** Diske inmeyi bekleyen değerler. Anahtar → serileştirilmiş JSON. */
const pending = new Map<string, string>();
/** Bu oturumda okunmuş/yazılmış değerler; diskten tekrar okumayı gereksiz kılar. */
const cache = new Map<string, string>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function storeFile(key: string): File {
  const dir = new Directory(Paths.document, STORE_DIR);
  if (!dir.exists) {
    dir.create({ intermediates: true, idempotent: true });
  }
  return new File(dir, `${key}.json`);
}

function writeNow(key: string, raw: string): void {
  try {
    if (isWeb) {
      globalThis.localStorage?.setItem(`${STORE_DIR}:${key}`, raw);
      return;
    }
    const file = storeFile(key);
    if (!file.exists) file.create({ intermediates: true, overwrite: true });
    file.write(raw);
  } catch (e) {
    console.warn(`[storage] "${key}" yazılamadı.`, e);
  }
}

/** Bekleyen tüm yazımları diske aktarır. */
export function flushPendingWrites(): void {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (pending.size === 0) return;
  for (const [key, raw] of pending) writeNow(key, raw);
  pending.clear();
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushPendingWrites();
  }, FLUSH_DELAY_MS);
}

// Uygulama arka plana alınırken bekleyen ne varsa hemen yazılır — aksi hâlde
// kullanıcı uygulamayı kapattığında son değişiklik kaybolabilirdi.
AppState.addEventListener('change', (state) => {
  if (state !== 'active') flushPendingWrites();
});

export function readJson<T>(key: string, fallback: T): T {
  try {
    const cached = cache.get(key);
    if (cached !== undefined) return JSON.parse(cached) as T;

    let raw: string | null | undefined;
    if (isWeb) {
      raw = globalThis.localStorage?.getItem(`${STORE_DIR}:${key}`);
    } else {
      const file = storeFile(key);
      raw = file.exists ? file.textSync() : null;
    }

    if (raw == null) return fallback;
    cache.set(key, raw);
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`[storage] "${key}" okunamadı, varsayılana dönülüyor.`, e);
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    const raw = JSON.stringify(value);
    cache.set(key, raw);
    pending.set(key, raw);
    scheduleFlush();
  } catch (e) {
    console.warn(`[storage] "${key}" serileştirilemedi.`, e);
  }
}

export function removeJson(key: string): void {
  cache.delete(key);
  pending.delete(key);
  try {
    if (isWeb) {
      globalThis.localStorage?.removeItem(`${STORE_DIR}:${key}`);
      return;
    }
    const file = storeFile(key);
    if (file.exists) file.delete();
  } catch (e) {
    console.warn(`[storage] "${key}" silinemedi.`, e);
  }
}
