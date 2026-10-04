// Çoktan seçmeli soru modeli — Anlayış & Kavrayış ayağının ortak dili.
//
// Okuduğunu anlama, dinlediğini anlama ve sözel kavrayış setleri **aynı**
// yapıyı paylaşır (YAPILACAKLAR → Anlayış: "ikinci bir soru modeli kurulmaz").
// Tek bir oynatıcı ekran (`QuizScreen`) hepsini çalıştırır; fark yalnızca
// setin türü (`kind`) ve metnin nasıl sunulduğu: okumada ekranda, dinlemede
// cihazın sesli okumasıyla (metin soru sırasında gizli).
//
// İletişim senaryoları bu modeli KULLANMAZ: orada tek doğru cevap iddiası yok,
// seçenekler "işler / kısmen / işlemez" diye açıklanır (`communication.ts`).
//
// Metin kuralı (KARARLAR → "Modüller abartılı vaat vermez"): açıklamalar
// cevabın *neden* doğru olduğunu anlatır; "zekânı ölçer" gibi cümle kurulmaz.

/** Sorunun çalıştırdığı beceri — Karne'de doğruluk bu kırılımla gösterilir. */
export type QuizSkill =
  | 'ana-fikir'
  | 'ayrinti'
  | 'cikarim'
  | 'kelime-baglam'
  | 'yazar-tutumu'
  | 'analoji'
  | 'cumle-tamamlama'
  | 'tutarsizlik';

export const QUIZ_SKILL_LABELS: Record<QuizSkill, string> = {
  'ana-fikir': 'Ana fikir',
  ayrinti: 'Ayrıntı',
  cikarim: 'Çıkarım',
  'kelime-baglam': 'Bağlamdan anlam',
  'yazar-tutumu': 'Yazarın tutumu',
  analoji: 'Sözel analoji',
  'cumle-tamamlama': 'Cümle tamamlama',
  tutarsizlik: 'Tutarsızlık yakalama',
};

export type QuizQuestion = {
  /** Set içinde benzersiz; kayıtlarda `setId:questionId` olarak tutulur. */
  id: string;
  prompt: string;
  /** 3-4 seçenek. Sıra ekranda karıştırılmaz — `answerIndex` buna göre. */
  options: string[];
  answerIndex: number;
  /** Cevaptan sonra gösterilir: doğru seçenek neden doğru. */
  explanation: string;
  skill: QuizSkill;
};

/**
 * okuma   → metin ekranda, sorular altında
 * dinleme → metin cihaz TTS'iyle okunur, sorular sırasında metin gizli
 * sozel  → metin yok ya da her sorunun içinde (analoji, cümle tamamlama…)
 */
export type QuizKind = 'okuma' | 'dinleme' | 'sozel';

export const QUIZ_KIND_LABELS: Record<QuizKind, string> = {
  okuma: 'Okuduğunu anlama',
  dinleme: 'Dinlediğini anlama',
  sozel: 'Sözel kavrayış',
};

export type QuizSet = {
  id: string;
  kind: QuizKind;
  title: string;
  /** okuma/dinleme setlerinde zorunlu; sözel setlerde boş. */
  passage?: string;
  /** Metnin künyesi ("Yunus Emre", "Fesahat için yazıldı"). */
  passageSource?: string;
  /** Okuma setleri günün metnine bağlanabilir (`dailyTexts.ts` → id). */
  dailyTextId?: string;
  questions: QuizQuestion[];
};
