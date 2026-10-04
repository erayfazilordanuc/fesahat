import { createPersistentStore } from './store';
import { dayKey } from './dateUtils';
import type { QuizKind, QuizSkill } from '../data/quiz';

// Anlayış & Kavrayış ilerlemesi: çözülen soru setleri ve özetleme alıştırmaları.
//
// Neden ayrı depo: `dailyPracticeProgress` günlük modüllerin serisini ve
// ölçümlerini tutuyor; buradaki kayıt beceri kırılımlı doğruluk geçmişi, yani
// farklı bir şey. İkinci bir state kütüphanesi eklenmiyor —
// `createPersistentStore` deseni (KARARLAR → ortak ilkeler 5).
//
// ⚠️ Ölçüm dürüstlüğü (KARARLAR → "Ölçüm skalası norm uydurmaz"): burada
// tutulan doğruluk kişinin **kendi** geçmişidir; nüfus normu ya da "seviye"
// iddiası yok. Özetleme öz-değerlendirmedir ve doğruluk sayılarına GİRMEZ
// (KARARLAR → "otomatik kontrol ile öz-değerlendirmenin ayrımı"), ayrı sayılır.

export type QuizAttempt = {
  id: string;
  setId: string;
  kind: QuizKind;
  title: string;
  /** ISO zaman damgası. */
  at: string;
  /** "2026-10-04" — günlük seri ve "bugün yapıldı mı" için. */
  day: string;
  correct: number;
  total: number;
  /** Sette geçen süre (saniye); gösterilir ama bir hedefi yoktur. */
  seconds: number;
  /** Beceri kırılımı: her beceride kaç doğru / kaç soru. */
  bySkill: Partial<Record<QuizSkill, { correct: number; total: number }>>;
};

export type SummaryAttempt = {
  id: string;
  passageId: string;
  title: string;
  at: string;
  day: string;
  /** Kullanıcının yazdığı özet — Yanıt Defteri'nde de görünür. */
  text: string;
  wordCount: number;
  targetWords: number;
  /**
   * Öz-değerlendirme: anahtar kavramlardan kaçını yakaladığını kullanıcı
   * kendisi işaretler. Otomatik kontrol YOK — özetin tek doğru yazımı yok.
   */
  selfCheckedConcepts: number;
  totalConcepts: number;
};

export type ComprehensionState = {
  quizAttempts: QuizAttempt[];
  summaryAttempts: SummaryAttempt[];
};

const EMPTY: ComprehensionState = { quizAttempts: [], summaryAttempts: [] };

/** Depo sınırsız büyümesin; eski kayıtlar düşer (trend için en yenisi yeterli). */
const MAX_ATTEMPTS = 300;

export const comprehensionStore = createPersistentStore<ComprehensionState>(
  'comprehension-progress',
  EMPTY,
  (stored) => {
    if (!stored || typeof stored !== 'object') return EMPTY;
    const o = stored as Partial<ComprehensionState>;
    return {
      quizAttempts: Array.isArray(o.quizAttempts) ? o.quizAttempts : [],
      summaryAttempts: Array.isArray(o.summaryAttempts) ? o.summaryAttempts : [],
    };
  },
);

export function useComprehension(): ComprehensionState {
  return comprehensionStore.use();
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function recordQuizAttempt(
  attempt: Omit<QuizAttempt, 'id' | 'at' | 'day'>,
): QuizAttempt {
  const full: QuizAttempt = { ...attempt, id: newId(), at: new Date().toISOString(), day: dayKey() };
  comprehensionStore.set((prev) => ({
    ...prev,
    quizAttempts: [full, ...prev.quizAttempts].slice(0, MAX_ATTEMPTS),
  }));
  return full;
}

export function recordSummaryAttempt(
  attempt: Omit<SummaryAttempt, 'id' | 'at' | 'day'>,
): SummaryAttempt {
  const full: SummaryAttempt = {
    ...attempt,
    id: newId(),
    at: new Date().toISOString(),
    day: dayKey(),
  };
  comprehensionStore.set((prev) => ({
    ...prev,
    summaryAttempts: [full, ...prev.summaryAttempts].slice(0, MAX_ATTEMPTS),
  }));
  return full;
}

/** Bir setin daha önce çözülüp çözülmediği — hub ekranında "tamamlandı" rozeti. */
export function bestAttemptFor(state: ComprehensionState, setId: string): QuizAttempt | undefined {
  return state.quizAttempts
    .filter((a) => a.setId === setId)
    .sort((a, b) => b.correct / b.total - a.correct / a.total)[0];
}

/** Türe göre doğruluk yüzdesi; kayıt yoksa null (sıfır GÖSTERİLMEZ — veri yok demektir). */
export function accuracyFor(state: ComprehensionState, kind?: QuizKind): number | null {
  const pool = kind ? state.quizAttempts.filter((a) => a.kind === kind) : state.quizAttempts;
  if (pool.length === 0) return null;
  const correct = pool.reduce((sum, a) => sum + a.correct, 0);
  const total = pool.reduce((sum, a) => sum + a.total, 0);
  return total > 0 ? Math.round((correct / total) * 100) : null;
}

/** Beceri bazlı doğruluk — Karne'deki kırılım. En az bir kayıt olan beceriler döner. */
export function accuracyBySkill(
  state: ComprehensionState,
): { skill: QuizSkill; correct: number; total: number; percent: number }[] {
  const totals = new Map<QuizSkill, { correct: number; total: number }>();
  for (const attempt of state.quizAttempts) {
    for (const [skill, counts] of Object.entries(attempt.bySkill)) {
      if (!counts) continue;
      const prev = totals.get(skill as QuizSkill) ?? { correct: 0, total: 0 };
      totals.set(skill as QuizSkill, {
        correct: prev.correct + counts.correct,
        total: prev.total + counts.total,
      });
    }
  }
  return [...totals.entries()]
    .filter(([, c]) => c.total > 0)
    .map(([skill, c]) => ({
      skill,
      correct: c.correct,
      total: c.total,
      percent: Math.round((c.correct / c.total) * 100),
    }))
    .sort((a, b) => a.percent - b.percent);
}

/** Bugün bu türden bir set çözüldü mü — Bugün listesindeki tamamlanma işareti. */
export function doneToday(state: ComprehensionState, kind: QuizKind): boolean {
  const today = dayKey();
  return state.quizAttempts.some((a) => a.day === today && a.kind === kind);
}

export function summaryDoneToday(state: ComprehensionState): boolean {
  const today = dayKey();
  return state.summaryAttempts.some((a) => a.day === today);
}
