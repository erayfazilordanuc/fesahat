import { hasApiKey, useApiKey } from './aiCredentials';

/**
 * Yapay zekânın o an kullanılabilir olup olmadığı — tek kaynak.
 *
 * Kural (KARARLAR → "Yapay zekâ uygulamayla gelir, ama şart değildir"):
 * uygulama yapay zekâ olmadan da **tam** çalışır. Bu yüzden yapay zekâ isteyen
 * her yer, çağrıyı yapıp hatayı yakalamak yerine önce buraya sorar.
 *
 * Aksi hâlde ekranlar çağrıyı yapıp `GeminiError` mesajını olduğu gibi
 * basardı; anahtarsız kullanıcı geliştirici talimatı görürdü.
 *
 * Tek koşul: kullanıcının kendi Gemini anahtarı (BYOK, bkz. `geminiClient.ts`).
 */
export function aiAvailable(): boolean {
  return hasApiKey();
}

/** Bileşen içinde canlı okuma; anahtar girilince ya da silinince yeniden render eder. */
export function useAiAvailable(): boolean {
  return Boolean(useApiKey());
}

/**
 * Yapay zekâ kapalıyken gösterilecek ortak, teknik olmayan açıklama.
 *
 * Yanında her zaman kuruluma götüren bir düğme bulunur (`AiInsightCard`) — eskiden yalnızca bu cümle vardı ve kullanıcı nereden
 * açacağını bulamıyordu.
 */
export const AI_UNAVAILABLE_HINT =
  'Yapay zekâ değerlendirmesi henüz açık değil. Kayıtların yerinde duruyor; ' +
  'ücretsiz bir Google anahtarı ekleyerek birkaç adımda açabilirsin.';
