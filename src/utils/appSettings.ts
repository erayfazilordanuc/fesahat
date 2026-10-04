import { createPersistentStore } from './store';

// Uygulama düzeyi ayarlar (Ayarlar ekranı).
// Günlük pratik modüllerinin ayarları ayrı bir dosyada: dailyPracticeSettings.tsx

/** Hatırlatıcı sıklığı — "kapalı" seçilirse hiçbir hatırlatma kurulmaz. */
export type ReminderFrequency = 'off' | 'daily' | 'everyOtherDay';

export type AppSettings = {
  reminderFrequency: ReminderFrequency;
};

const DEFAULTS: AppSettings = {
  reminderFrequency: 'daily',
};

const FREQUENCIES: ReminderFrequency[] = ['off', 'daily', 'everyOtherDay'];

/**
 * Eski kayıtlarda (Terakki'den gelen `apiBaseUrl` / `appToken` gibi) artık
 * kullanılmayan alanlar olabilir; yalnızca bilinen alanlar okunur, gerisi
 * sessizce yok sayılır ve bir sonraki yazımda diskten düşer.
 */
function hydrate(stored: unknown): AppSettings {
  if (!stored || typeof stored !== 'object') return DEFAULTS;
  const freq = (stored as { reminderFrequency?: unknown }).reminderFrequency;
  return {
    reminderFrequency: FREQUENCIES.includes(freq as ReminderFrequency)
      ? (freq as ReminderFrequency)
      : DEFAULTS.reminderFrequency,
  };
}

export const appSettingsStore = createPersistentStore<AppSettings>('app-settings', DEFAULTS, hydrate);

export function useAppSettings() {
  return appSettingsStore.use();
}

export function updateAppSettings(patch: Partial<AppSettings>): void {
  appSettingsStore.set((prev) => ({ ...prev, ...patch }));
}

export const REMINDER_FREQUENCY_LABELS: Record<ReminderFrequency, string> = {
  off: 'Kapalı',
  daily: 'Her Gün',
  everyOtherDay: '2 Günde 1',
};
