// Günlük içerik seçimi ve seri (streak) takibi için yerel saate göre gün hesabı.

/** Yerel takvime göre 1970-01-01'den bu yana geçen gün sayısı. */
export function dayIndex(date: Date = new Date()): number {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local / 86400000);
}

/** "2026-07-29" biçiminde yerel tarih anahtarı. */
export function dayKey(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Gün numarasını bir havuz uzunluğuna deterministik olarak eşler.
 * Aynı gün her açılışta aynı içerik gelir; havuz uzunluğu değişse de dağılım korunur.
 */
export function pickForDay<T>(pool: readonly T[], date: Date = new Date(), salt = 0): T {
  if (pool.length === 0) {
    throw new Error('pickForDay: havuz boş');
  }
  // salt sayesinde aynı gün farklı modüller (metin / belagat / tekerleme) farklı öğe seçer.
  const idx = Math.abs((dayIndex(date) + salt * 7) % pool.length);
  return pool[idx];
}

export function formatTime(hour: number, minute: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hour)}:${pad(minute)}`;
}

/** Saniyeyi "3:05" biçiminde gösterir. */
export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

const TR_MONTHS = [
  'OCAK',
  'ŞUBAT',
  'MART',
  'NİSAN',
  'MAYIS',
  'HAZİRAN',
  'TEMMUZ',
  'AĞUSTOS',
  'EYLÜL',
  'EKİM',
  'KASIM',
  'ARALIK',
];

/** Haber kartlarındaki "31 TEMMUZ 2026" biçimi. */
export function formatLongDate(date: Date): string {
  return `${date.getDate()} ${TR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Geçmiş listelerindeki "12.07.2026" biçimi. */
export function formatShortDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

/** Grafik ekseni için "04.06" biçimi. */
export function formatAxisDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
}
