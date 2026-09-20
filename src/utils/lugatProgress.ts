import React from 'react';
import { createPersistentStore } from './store';
import { dayKey, dayIndex } from './dateUtils';
import {
  pickReviewIds,
  dueCount,
  reviewAfterAnswer,
  INITIAL_EASE,
  MIN_EASE,
  MAX_EASE,
  MAX_INTERVAL_DAYS,
  type ReviewState,
  type ReviewCandidate,
} from './spacedRepetition';
import { pickDailyWords, type LugatLevel, type LugatWord } from '../data/lugat';
import { useDayKey } from './today';
import { completeModule, progressStore } from './dailyPracticeProgress';

// Dil & İfade (lugat) modülünün kalıcı ilerlemesi ve tercihleri.
//
// Günlük pratik serisine (dailyPracticeProgress) burada tek noktadan bağlanır:
// bir gün için seçilen kelimelerin tamamı "Öğrendim" olunca ya da tekrar
// gününde "Tekrarı tamamladım" düğmesine basılınca `completeModule(prev, 'lugat')`
// çağrılır. Ekranlar (Bugün kartı, Dil & İfade) kendi tamamlanma mantığını
// yazmaz, hepsi `markLearned` / `completeReview` üzerinden buraya gelir.

export type LugatWordProgress = {
  /** İlk "Öğrendim" işaretlemesinin ISO zaman damgası. */
  learnedAt?: string;
  /** Lugatıma eklendi mi. */
  saved?: boolean;
  correct: number;
  wrong: number;
  /**
   * Aralıklı tekrar durumu (`spacedRepetition.ts`). Eski kayıtlarda yok —
   * `undefined` "hiç planlanmamış" demek ve o kelime tekrar sırasında en önde
   * sayılır.
   */
  review?: ReviewState;
};

export type LugatPrefs = {
  dailyCount: 3 | 5;
  level: 'hepsi' | 'temel' | 'orta' | 'ileri';
};

export type LugatProgressState = {
  words: Record<string, LugatWordProgress>;
  prefs: LugatPrefs;
};

const DEFAULTS: LugatProgressState = {
  words: {},
  prefs: { dailyCount: 5, level: 'hepsi' },
};

const STORAGE_KEY = 'lugat-progress';

function emptyEntry(): LugatWordProgress {
  return { correct: 0, wrong: 0 };
}

/** Sayısal alanı doğrular; eksik/bozuk kayıtta 0'a düşer, çökmez. */
function normalizeCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

/**
 * Tekrar durumunu sınırlarına çeker. Diskteki kayıt elle bozulmuş ya da eski bir
 * sürümden kalmış olabilir; saçma bir `ease` ya da negatif aralık, kelimeyi
 * sonsuza kadar sırada tutar veya hiç göstermez.
 */
function normalizeReview(value: unknown): ReviewState | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const v = value as Partial<ReviewState>;
  const num = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) ? x : null);
  const due = num(v.dueDayIndex);
  if (due === null) return undefined;
  const ease = num(v.ease);
  const interval = num(v.intervalDays);
  const reps = num(v.reps);
  return {
    reps: reps === null ? 0 : Math.max(0, Math.floor(reps)),
    intervalDays:
      interval === null ? 0 : Math.min(MAX_INTERVAL_DAYS, Math.max(0, Math.floor(interval))),
    ease: ease === null ? INITIAL_EASE : Math.min(MAX_EASE, Math.max(MIN_EASE, ease)),
    dueDayIndex: Math.floor(due),
  };
}

function normalizeWordEntry(value: unknown): LugatWordProgress {
  const v = (value ?? {}) as Partial<LugatWordProgress>;
  return {
    learnedAt: typeof v.learnedAt === 'string' ? v.learnedAt : undefined,
    saved: typeof v.saved === 'boolean' ? v.saved : undefined,
    correct: normalizeCount(v.correct),
    wrong: normalizeCount(v.wrong),
    review: normalizeReview(v.review),
  };
}

function normalizeDailyCount(value: unknown): 3 | 5 {
  return value === 3 ? 3 : 5;
}

function normalizeLevel(value: unknown): LugatPrefs['level'] {
  return value === 'temel' || value === 'orta' || value === 'ileri' ? value : 'hepsi';
}

/** Diskteki kayıt eksik ya da bozuk olsa da ekranı çökertmeyen normalize fonksiyonu. */
function normalize(stored: unknown): LugatProgressState {
  const v = (stored ?? {}) as Partial<LugatProgressState>;
  const wordsRaw = (v.words ?? {}) as Record<string, unknown>;
  const words: Record<string, LugatWordProgress> = {};
  if (wordsRaw && typeof wordsRaw === 'object') {
    for (const [id, entry] of Object.entries(wordsRaw)) {
      if (!id) continue;
      words[id] = normalizeWordEntry(entry);
    }
  }
  const prefsRaw = (v.prefs ?? {}) as Partial<LugatPrefs>;
  return {
    words,
    prefs: {
      dailyCount: normalizeDailyCount(prefsRaw.dailyCount),
      level: normalizeLevel(prefsRaw.level),
    },
  };
}

export const lugatProgressStore = createPersistentStore<LugatProgressState>(
  STORAGE_KEY,
  DEFAULTS,
  normalize,
);

export type TodaysWords = {
  words: LugatWord[];
  /**
   * Listedeki tüm kelimeler bugünden önce zaten öğrenilmişse true — havuz
   * tükendiği için gün "tekrar" günüdür, seri "Öğrendim" düğmeleriyle değil
   * ayrı bir "Tekrarı tamamladım" eylemiyle işaretlenir.
   */
  isReview: boolean;
};

/**
 * Bugünün kelime listesi. Gün içinde "Öğrendim"e basıldıkça değişmez: yalnızca
 * bugünden ÖNCE öğrenilmiş kelimeler havuzdan hariç tutulur, bugün öğrenilenler
 * hariç tutulmaz.
 */
export function todaysWords(state: LugatProgressState, date: Date = new Date()): TodaysWords {
  const level: LugatLevel | undefined = state.prefs.level === 'hepsi' ? undefined : state.prefs.level;
  const today = dayKey(date);

  const excludeIds = new Set(
    Object.entries(state.words)
      .filter(([, w]) => !!w.learnedAt && dayKey(new Date(w.learnedAt as string)) < today)
      .map(([id]) => id),
  );

  const words = pickDailyWords(state.prefs.dailyCount, level, date, excludeIds);
  const isReview =
    words.length > 0 &&
    words.every((w) => {
      const entry = state.words[w.id];
      return !!entry?.learnedAt && dayKey(new Date(entry.learnedAt)) < today;
    });

  return { words, isReview };
}

/** Bugünün listesinde kaç kelimenin "Öğrendim" olarak işaretlendiği. */
export function todaysProgress(
  state: LugatProgressState,
  date: Date = new Date(),
): { learned: number; total: number } {
  const { words } = todaysWords(state, date);
  const learned = words.filter((w) => !!state.words[w.id]?.learnedAt).length;
  return { learned, total: words.length };
}

/** Bugünün kelime listesi + ilerlemesi, canlı depoya abone. */
export function useTodaysWords(): TodaysWords & { learned: number; total: number } {
  const state = lugatProgressStore.use();
  // `day` bağımlılığı: uygulama gece yarısını açık geçirirse liste önceki günde
  // takılı kalmasın (YAPILACAKLAR Bölüm 7 → "Gün dönümünde yenileme").
  // Bu tek nokta hem Bugün'deki kelime kartını hem Dil & İfade'yi besliyor.
  const day = useDayKey();
  return React.useMemo(() => {
    const result = todaysWords(state);
    const { learned, total } = todaysProgress(state);
    return { ...result, learned, total };
  }, [state, day]);
}

/**
 * Tekrarı bugüne (ya da geçmişe) düşmüş kelimelerin kimlikleri — alıştırma
 * sorularını bunlara yönlendirmek için.
 *
 * Yalnızca daha önce cevaplanmış kelimeler aday: hiç görülmemiş kelime zaten
 * normal karıştırmayla geliyor, onu "tekrar" diye öne almak anlamsız olurdu.
 */
export function useDueWordIds(limit = 5): string[] {
  const state = lugatProgressStore.use();
  const day = useDayKey();
  return React.useMemo(() => {
    const candidates = Object.entries(state.words).map(([id, w]) => ({
      id,
      review: w.review,
      correct: w.correct,
      wrong: w.wrong,
    }));
    return pickReviewIds(candidates, limit, dayIndex());
    // `day`: gün dönümünde tekrar listesi yeniden hesaplansın.
  }, [state.words, limit, day]);
}

/**
 * Tekrarı bugüne (ya da geçmişe) düşmüş kelimelerin sayısı — ekranda gösterge için.
 * Yalnızca en az bir kez planlanmış (`review` alanı olan) kelimeler sayılır:
 * hiç sorulmamış kelimeler `isDue` için sırada sayılsa da bunlar "tekrar"
 * değildir; sayılsalar gösterge her "Öğrendim" ile şişerdi.
 */
export function useDueCount(): number {
  const state = lugatProgressStore.use();
  const day = useDayKey();
  return React.useMemo(() => {
    const candidates: ReviewCandidate[] = Object.entries(state.words)
      .filter(([, w]) => w.review != null)
      .map(([id, w]) => ({
      id,
      review: w.review,
      correct: w.correct,
      wrong: w.wrong,
    }));
    return dueCount(candidates, dayIndex());
    // `day`: gün dönümünde sayı yeniden hesaplansın.
  }, [state.words, day]);
}

/** Ekranların canlı okuduğu ilerleme durumu ve eylemler. */
export function useLugatProgress() {
  const state = lugatProgressStore.use();

  const markLearned = React.useCallback((id: string) => {
    lugatProgressStore.set((prev) => {
      const entry = prev.words[id] ?? emptyEntry();
      if (entry.learnedAt) return prev;
      return {
        ...prev,
        words: { ...prev.words, [id]: { ...entry, learnedAt: new Date().toISOString() } },
      };
    });

    // Bugünün listesindeki tüm kelimeler öğrenildiyse günlük pratik serisine
    // işlenir. Tekrar gününde bu otomatik tetiklenmez — o yalnızca
    // completeReview() ile, kullanıcının açık onayıyla tamamlanır.
    const updated = lugatProgressStore.get();
    const { words, isReview } = todaysWords(updated);
    if (!isReview && words.length > 0 && words.every((w) => !!updated.words[w.id]?.learnedAt)) {
      progressStore.set((prev) => completeModule(prev, 'lugat'));
    }
  }, []);

  /** Tekrar gününde "Öğrendim" düğmeleri zaten dolu göründüğü için seri buradan işaretlenir. */
  const completeReview = React.useCallback(() => {
    progressStore.set((prev) => completeModule(prev, 'lugat'));
  }, []);

  const toggleSaved = React.useCallback((id: string) => {
    lugatProgressStore.set((prev) => {
      const entry = prev.words[id] ?? emptyEntry();
      return { ...prev, words: { ...prev.words, [id]: { ...entry, saved: !entry.saved } } };
    });
  }, []);

  const recordAnswer = React.useCallback((id: string, correct: boolean) => {
    lugatProgressStore.set((prev) => {
      const entry = prev.words[id] ?? emptyEntry();
      return {
        ...prev,
        words: {
          ...prev.words,
          [id]: {
            ...entry,
            correct: entry.correct + (correct ? 1 : 0),
            wrong: entry.wrong + (correct ? 0 : 1),
            // Aralıklı tekrar: doğruda aralık uzar, yanlışta yarına düşer
            // (YAPILACAKLAR Bölüm 7 → "Aralıklı tekrar").
            review: reviewAfterAnswer(entry.review, correct, dayIndex()),
          },
        },
      };
    });
  }, []);

  const setPrefs = React.useCallback((patch: Partial<LugatPrefs>) => {
    lugatProgressStore.set((prev) => ({ ...prev, prefs: { ...prev.prefs, ...patch } }));
  }, []);

  const learnedCount = React.useMemo(
    () => Object.values(state.words).filter((w) => !!w.learnedAt).length,
    [state.words],
  );

  const savedIds = React.useMemo(
    () => Object.entries(state.words).filter(([, w]) => !!w.saved).map(([id]) => id),
    [state.words],
  );

  const learnedIds = React.useMemo(
    () => Object.entries(state.words).filter(([, w]) => !!w.learnedAt).map(([id]) => id),
    [state.words],
  );

  return {
    state,
    prefs: state.prefs,
    markLearned,
    toggleSaved,
    recordAnswer,
    setPrefs,
    completeReview,
    learnedCount,
    savedIds,
    learnedIds,
  };
}
