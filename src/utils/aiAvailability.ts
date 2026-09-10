import { appSettingsStore, useAppSettings } from './appSettings';

/**
 * Yapay zekânın o an kullanılabilir olup olmadığı — tek kaynak.
 *
 * Kural (KARARLAR → "Yapay zekâ uygulamayla gelir, ama şart değildir"):
 * uygulama yapay zekâ olmadan da **tam** çalışır. Bu yüzden yapay zekâ isteyen
 * her yer, çağrıyı yapıp hatayı yakalamak yerine önce buraya sorar.
 *
 * Eskiden böyle değildi: ekranlar çağrıyı yapıyor, `GeminiError` yakalayıp
 * mesajını olduğu gibi basıyordu. Sunucu tanımsızken kullanıcı şunu görüyordu:
 * "Sunucu adresi tanımlı değil. Ayarlar → Backend API Adresi alanını doldurun."
 * Bu bir son kullanıcı cümlesi değil, geliştirici talimatı — üstelik yeni kuran
 * herkes bunu görüyordu.
 */
export function aiAvailable(): boolean {
  return appSettingsStore.get().apiBaseUrl.trim().length > 0;
}

/** Bileşen içinde canlı okuma; adres Ayarlar'dan değişince yeniden render eder. */
export function useAiAvailable(): boolean {
  const { apiBaseUrl } = useAppSettings();
  return apiBaseUrl.trim().length > 0;
}

/** Yapay zekâ kapalıyken gösterilecek ortak, teknik olmayan açıklama. */
export const AI_UNAVAILABLE_HINT =
  'Yapay zekâ değerlendirmesi şu an kullanılamıyor. Kayıtların yerinde duruyor; ' +
  'değerlendirme açıldığında buradan görebilirsin.';
