import { createPersistentStore } from './store';
import { dayKey } from './dateUtils';
import type { CommCategory, ScenarioEffect } from '../data/communication';

// İletişim becerileri ilerlemesi.
//
// ⚠️ **Doğruluk değil tamamlanma** (YAPILACAKLAR_FESAHAT Bölüm 4, Karne):
// iletişim senaryolarında tek doğru cevap iddiası yok. Seçilen seçeneğin
// etkisi (`isler` / `kismen` / `islemez`) kaydedilir ki kullanıcı kendi
// eğilimini görebilsin, ama bu bir **puan değildir** ve Karne'de yüzde olarak
// "başarı" diye gösterilmez. Modül ilerlemesi = kaç senaryo tamamlandı.
//
// Etkin dinleme alıştırmasının duygu/ihtiyaç adımlarında tek doğru vardır
// (verilen cümlede adlandırılan duygu), o yüzden orası doğru/yanlış sayılır;
// yansıtıcı cevap seçimi yine etki olarak tutulur.

export type ScenarioAttempt = {
  id: string;
  scenarioId: string;
  category: CommCategory;
  title: string;
  at: string;
  day: string;
  /** Seçilen seçeneğin etkisi. */
  effect: ScenarioEffect;
  /** Yapay zekâ açıkken yazılan serbest cevap (varsa). Yanıt Defteri'nde görünür. */
  freeText?: string;
};

export type ListeningAttempt = {
  id: string;
  exerciseId: string;
  title: string;
  at: string;
  day: string;
  feelingCorrect: boolean;
  needCorrect: boolean;
  reflectEffect: ScenarioEffect;
};

export type CommState = {
  scenarios: ScenarioAttempt[];
  listening: ListeningAttempt[];
};

const EMPTY: CommState = { scenarios: [], listening: [] };
const MAX_ATTEMPTS = 300;

export const commStore = createPersistentStore<CommState>('comm-progress', EMPTY, (stored) => {
  if (!stored || typeof stored !== 'object') return EMPTY;
  const o = stored as Partial<CommState>;
  return {
    scenarios: Array.isArray(o.scenarios) ? o.scenarios : [],
    listening: Array.isArray(o.listening) ? o.listening : [],
  };
});

export function useComm(): CommState {
  return commStore.use();
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function recordScenario(attempt: Omit<ScenarioAttempt, 'id' | 'at' | 'day'>): ScenarioAttempt {
  const full: ScenarioAttempt = {
    ...attempt,
    id: newId(),
    at: new Date().toISOString(),
    day: dayKey(),
  };
  commStore.set((prev) => ({
    ...prev,
    scenarios: [full, ...prev.scenarios].slice(0, MAX_ATTEMPTS),
  }));
  return full;
}

export function recordListening(
  attempt: Omit<ListeningAttempt, 'id' | 'at' | 'day'>,
): ListeningAttempt {
  const full: ListeningAttempt = {
    ...attempt,
    id: newId(),
    at: new Date().toISOString(),
    day: dayKey(),
  };
  commStore.set((prev) => ({
    ...prev,
    listening: [full, ...prev.listening].slice(0, MAX_ATTEMPTS),
  }));
  return full;
}

/** Bir senaryo daha önce çalışıldı mı — katalogda "tamamlandı" işareti. */
export function scenarioDone(state: CommState, scenarioId: string): boolean {
  return state.scenarios.some((s) => s.scenarioId === scenarioId);
}

/** Kaç ayrı senaryo tamamlandı (tekrarlar bir sayılır) — modülün ilerlemesi. */
export function completedScenarioCount(state: CommState): number {
  return new Set(state.scenarios.map((s) => s.scenarioId)).size;
}

export function completedByCategory(state: CommState, category: CommCategory): number {
  return new Set(
    state.scenarios.filter((s) => s.category === category).map((s) => s.scenarioId),
  ).size;
}

export function doneToday(state: CommState): boolean {
  const today = dayKey();
  return state.scenarios.some((s) => s.day === today) || state.listening.some((l) => l.day === today);
}
