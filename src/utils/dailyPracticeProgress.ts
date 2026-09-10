import React from 'react';
import { readJson, writeJson } from './storage';
import { dayKey } from './dateUtils';

// Günlük pratik ilerlemesi: modül serileri (streak) ve belagat sanatı istatistikleri.
// Profil ekranı ve ana ekran kartları bu veriyi okur.

export type PracticeModule = 'diaphragm' | 'speech' | 'belagat' | 'dailyText';

export type ModuleProgress = {
  /** En son tamamlandığı gün ("2026-07-30"). */
  lastCompletedDay: string | null;
  /** Kesintisiz gün sayısı. */
  streak: number;
  bestStreak: number;
  totalSessions: number;
};

export type BelagatArtStat = {
  seen: number;
  correct: number;
  wrong: number;
  /** Üretim alıştırması en az bir kez yapıldı mı. */
  produced: boolean;
};

/**
 * Kasıtlı bir ölçümün tek sonucu.
 *
 * Uygulamanın diğer istatistikleri (mülakat puanı, egzersiz süresi) kullandıkça
 * kendiliğinden birikiyor. Testler farklı: kullanıcı "şimdi ölçüyorum" deyip
 * tekrarlıyor ve asıl değeri kendi geçmişiyle karşılaştırmasında.
 */
export type TestResult = {
  /** Ölçümün alındığı gün — dayKey(). */
  day: string;
  /** ISO zaman damgası; aynı gün birden fazla ölçüm ayırt edilebilsin diye. */
  at: string;
  value: number;
};

/** Kontrollü veriş süresi (saniye) — tek nefeste sabit "sss". */
export const TEST_EXHALE_CONTROL = 'exhaleControl';

/**
 * Dinlenik solunum hızı (nefes/dakika) — 60 saniye boyunca her nefes alışta dokunma.
 * Yetişkinde dinlenik aralık kabaca 12-20; burada amaç normale sokmak değil,
 * kişinin kendi eğilimini zaman içinde görmesi.
 */
export const TEST_BREATHING_RATE = 'breathingRate';

/**
 * Sesli okuma hızı (kelime/dakika) — kelime sayısı bilinen bir metni okuma süresi.
 * Sunum ve mülakat için tipik hedef aralık 120-150; hızlı konuşmak akıcılık değil,
 * çoğu zaman gerginlik göstergesi.
 */
export const TEST_READING_WPM = 'readingWpm';

/**
 * Test başına saklanan azami sonuç sayısı. storage.ts tüm durumu tek JSON
 * dosyasına yazdığı için liste sınırsız büyürse her yazma yavaşlar.
 */
const MAX_TEST_RESULTS = 100;

export type ProgressState = {
  modules: Record<PracticeModule, ModuleProgress>;
  belagatArts: Record<string, BelagatArtStat>;
  /** Test kimliği → ölçüm geçmişi (eskiden yeniye). */
  tests: Record<string, TestResult[]>;
  /**
   * "S" ile en uzun kesintisiz nefes verme süresi (saniye).
   * Veriş kontrolünün göstergesi; akciğer kapasitesi ölçüsü değil.
   */
  longestExhaleSeconds: number;
};

const STORAGE_KEY = 'daily-practice-progress';

const emptyModule = (): ModuleProgress => ({
  lastCompletedDay: null,
  streak: 0,
  bestStreak: 0,
  totalSessions: 0,
});

const EMPTY_PROGRESS: ProgressState = {
  modules: {
    diaphragm: emptyModule(),
    speech: emptyModule(),
    belagat: emptyModule(),
    dailyText: emptyModule(),
  },
  belagatArts: {},
  tests: {},
  longestExhaleSeconds: 0,
};

function normalize(stored: Partial<ProgressState> | null): ProgressState {
  if (!stored) return EMPTY_PROGRESS;
  const modules = { ...EMPTY_PROGRESS.modules };
  for (const key of Object.keys(modules) as PracticeModule[]) {
    modules[key] = { ...emptyModule(), ...(stored.modules?.[key] ?? {}) };
  }
  return {
    modules,
    belagatArts: stored.belagatArts ?? {},
    // Bu satır unutulursa `tests` eski kayıtlarda undefined gelir ve ekranlar patlar.
    tests: stored.tests ?? {},
    longestExhaleSeconds: stored.longestExhaleSeconds ?? 0,
  };
}

export function loadProgress(): ProgressState {
  return normalize(readJson<Partial<ProgressState> | null>(STORAGE_KEY, null));
}

function persist(state: ProgressState): void {
  writeJson(STORAGE_KEY, state);
}

/** Dünün gün anahtarı — seri hesabında kullanılır. */
function previousDayKey(date: Date): string {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return dayKey(prev);
}

/**
 * Bir modülü bugün için tamamlandı işaretler.
 * Aynı gün ikinci çağrı seriyi artırmaz; oturum sayısını da artırmaz.
 */
export function completeModule(
  state: ProgressState,
  module: PracticeModule,
  date: Date = new Date(),
): ProgressState {
  const today = dayKey(date);
  const current = state.modules[module];
  if (current.lastCompletedDay === today) return state;

  const continued = current.lastCompletedDay === previousDayKey(date);
  const streak = continued ? current.streak + 1 : 1;

  const next: ProgressState = {
    ...state,
    modules: {
      ...state.modules,
      [module]: {
        lastCompletedDay: today,
        streak,
        bestStreak: Math.max(current.bestStreak, streak),
        totalSessions: current.totalSessions + 1,
      },
    },
  };
  persist(next);
  return next;
}

export function recordBelagatAnswer(
  state: ProgressState,
  artId: string,
  correct: boolean,
): ProgressState {
  const prev = state.belagatArts[artId] ?? { seen: 0, correct: 0, wrong: 0, produced: false };
  const next: ProgressState = {
    ...state,
    belagatArts: {
      ...state.belagatArts,
      [artId]: {
        ...prev,
        seen: prev.seen + 1,
        correct: prev.correct + (correct ? 1 : 0),
        wrong: prev.wrong + (correct ? 0 : 1),
      },
    },
  };
  persist(next);
  return next;
}

export function markBelagatProduced(state: ProgressState, artId: string): ProgressState {
  const prev = state.belagatArts[artId] ?? { seen: 0, correct: 0, wrong: 0, produced: false };
  if (prev.produced) return state;
  const next: ProgressState = {
    ...state,
    belagatArts: { ...state.belagatArts, [artId]: { ...prev, produced: true } },
  };
  persist(next);
  return next;
}

/**
 * Bir test sonucunu geçmişe ekler. Eski kayıtlar sınırı aşınca baştan düşer.
 * Rekor ayrı tutulmuyor — geçmişten hesaplanabilir; yalnızca ekranların hâlâ
 * okuduğu `longestExhaleSeconds` uyumluluk için güncelleniyor.
 */
export function recordTest(
  state: ProgressState,
  testId: string,
  value: number,
  date: Date = new Date(),
): ProgressState {
  const history = state.tests[testId] ?? [];
  const entry: TestResult = { day: dayKey(date), at: date.toISOString(), value };
  const trimmed = [...history, entry].slice(-MAX_TEST_RESULTS);

  const next: ProgressState = {
    ...state,
    tests: { ...state.tests, [testId]: trimmed },
  };
  persist(next);
  return next;
}

/** Bir testin ölçüm geçmişi (eskiden yeniye). Hiç ölçüm yoksa boş dizi. */
export function testHistory(state: ProgressState, testId: string): TestResult[] {
  return state.tests[testId] ?? [];
}

/** Bir testin en iyi (en yüksek) sonucu; ölçüm yoksa 0. */
export function bestTestValue(state: ProgressState, testId: string): number {
  const history = testHistory(state, testId);
  return history.length === 0 ? 0 : Math.max(...history.map((r) => r.value));
}

/**
 * Kontrollü veriş ölçümünü kaydeder: hem geçmişe ekler hem rekoru günceller.
 * Rekor kırılmasa da ölçüm geçmişe giriyor — ilerleme ancak böyle görülebiliyor.
 */
export function recordExhaleRecord(state: ProgressState, seconds: number): ProgressState {
  const rounded = Math.round(seconds * 10) / 10;
  const withHistory = recordTest(state, TEST_EXHALE_CONTROL, rounded);

  if (rounded <= state.longestExhaleSeconds) return withHistory;

  const next: ProgressState = { ...withHistory, longestExhaleSeconds: Math.round(rounded) };
  persist(next);
  return next;
}

export function isCompletedToday(
  state: ProgressState,
  module: PracticeModule,
  date: Date = new Date(),
): boolean {
  return state.modules[module].lastCompletedDay === dayKey(date);
}

/** Belagat müfredatında kaç sanatın "öğrenilmiş" sayıldığı (en az bir doğru tanıma). */
export function masteredArtCount(state: ProgressState): number {
  return Object.values(state.belagatArts).filter((s) => s.correct > 0).length;
}

/** Ekranların paylaştığı canlı ilerleme durumu. */
export function useDailyProgress() {
  const [progress, setProgress] = React.useState<ProgressState>(() => loadProgress());

  const complete = React.useCallback((module: PracticeModule) => {
    setProgress((prev) => completeModule(prev, module));
  }, []);

  const answerBelagat = React.useCallback((artId: string, correct: boolean) => {
    setProgress((prev) => recordBelagatAnswer(prev, artId, correct));
  }, []);

  const produceBelagat = React.useCallback((artId: string) => {
    setProgress((prev) => markBelagatProduced(prev, artId));
  }, []);

  /** Genel test kaydı — yeni testler bunu kullanır, kendi fonksiyonunu yazmaz. */
  const logTest = React.useCallback((testId: string, value: number) => {
    setProgress((prev) => recordTest(prev, testId, value));
  }, []);

  const recordExhale = React.useCallback((seconds: number) => {
    setProgress((prev) => recordExhaleRecord(prev, seconds));
  }, []);

  const reload = React.useCallback(() => setProgress(loadProgress()), []);

  return { progress, complete, answerBelagat, produceBelagat, recordExhale, logTest, reload };
}
