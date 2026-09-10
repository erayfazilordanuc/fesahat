import { createPersistentStore } from './store';
import type { ExerciseTrack } from '../data/exercises';

// Tamamlanan zihinsel / fizyolojik egzersiz kayıtları.

export type ExerciseLog = {
  id: string;
  exerciseId: string;
  title: string;
  /** "Problem Çözme", "Görsel Algı", "Nefes" gibi kısa etiket. */
  categoryLabel: string;
  track: ExerciseTrack;
  durationSeconds: number;
  /** 0-100 arası tamamlama/efor puanı — geçmiş ekranındaki trend grafiğini besler. */
  effort: number;
  timestamp: string;
  /** Egzersiz motorunun ürettiği kısa özet (kaç adım tamamlandı vb.). */
  summary?: string;
};

type HistoryState = { logs: ExerciseLog[] };

const store = createPersistentStore<HistoryState>('exercise-history', { logs: [] }, (stored) => {
  const logs = (stored as HistoryState | null)?.logs;
  return { logs: Array.isArray(logs) ? logs : [] };
});

export function useExerciseLogs(): ExerciseLog[] {
  return store.use().logs;
}

export function getExerciseLogs(): ExerciseLog[] {
  return store.get().logs;
}

export function getExerciseLog(id: string): ExerciseLog | undefined {
  return store.get().logs.find((log) => log.id === id);
}

export function addExerciseLog(log: ExerciseLog): void {
  store.set((prev) => ({ logs: [log, ...prev.logs] }));
}

export function removeExerciseLog(id: string): void {
  store.set((prev) => ({ logs: prev.logs.filter((log) => log.id !== id) }));
}

export function clearExerciseLogs(): void {
  store.set({ logs: [] });
}

/** Profil ve egzersiz geçmişi ekranlarının paylaştığı özet. */
export function exerciseStats(logs: ExerciseLog[]) {
  const totalMinutes = Math.round(logs.reduce((sum, log) => sum + log.durationSeconds, 0) / 60);

  // En çok tekrar edilen kategori "favori" sayılır.
  const counts = new Map<string, number>();
  for (const log of logs) {
    counts.set(log.categoryLabel, (counts.get(log.categoryLabel) ?? 0) + 1);
  }
  let favorite = '—';
  let best = 0;
  for (const [label, count] of counts) {
    if (count > best) {
      best = count;
      favorite = label;
    }
  }

  return { total: logs.length, totalMinutes, favorite };
}
