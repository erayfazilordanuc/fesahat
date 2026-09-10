import { createPersistentStore } from './store';
import type { CompanyId } from '../data/companies';

// Tamamlanan mülakat oturumları ve yapay zeka analizleri.
// Alan adları server/server.ts'in Gemini şemasıyla birebir aynı (test-schema.js).

export type InterviewMode = 'camera' | 'typing';

export type InterviewAnalysis = {
  /** 100 üzerinden teknik + stres puanı. */
  rating: number;
  defenseResilience: string;
  postureFeedback: string;
  fluencyFeedback: string;
  depthFeedback: string;
  fillerRating: string;
  successPoints: string[];
  improvementPoints: string[];
  finalVerdict: string;
  idealAnswer: string;
};

export type RecordedSession = {
  id: string;
  /** ISO zaman damgası. */
  timestamp: string;
  companyId: CompanyId;
  companyName: string;
  questionText: string;
  mode: InterviewMode;
  durationSeconds: number;
  /** Yazılı modda adayın yazdığı metin. */
  transcript?: string;
  /** Sessiz kalınan toplam süre (saniye) — kamera modunda ses seviyesinden hesaplanır. */
  silentSeconds?: number;
  analysis?: InterviewAnalysis;
};

type HistoryState = { sessions: RecordedSession[] };

const store = createPersistentStore<HistoryState>('interview-history', { sessions: [] }, (stored) => {
  const sessions = (stored as HistoryState | null)?.sessions;
  return { sessions: Array.isArray(sessions) ? sessions : [] };
});

export function useInterviewSessions(): RecordedSession[] {
  return store.use().sessions;
}

export function getInterviewSessions(): RecordedSession[] {
  return store.get().sessions;
}

export function getSession(id: string): RecordedSession | undefined {
  return store.get().sessions.find((session) => session.id === id);
}

/** Yeni oturumu listenin başına ekler (en yeni en üstte). */
export function addSession(session: RecordedSession): void {
  store.set((prev) => ({ sessions: [session, ...prev.sessions] }));
}

export function attachAnalysis(id: string, analysis: InterviewAnalysis): void {
  store.set((prev) => ({
    sessions: prev.sessions.map((session) =>
      session.id === id ? { ...session, analysis } : session,
    ),
  }));
}

export function removeSession(id: string): void {
  store.set((prev) => ({ sessions: prev.sessions.filter((session) => session.id !== id) }));
}

export function clearSessions(): void {
  store.set({ sessions: [] });
}

/** Profil ekranındaki özet kutuları. */
export function interviewStats(sessions: RecordedSession[]) {
  const scored = sessions.filter((s) => typeof s.analysis?.rating === 'number');
  const average =
    scored.length === 0
      ? 0
      : Math.round(scored.reduce((sum, s) => sum + (s.analysis?.rating ?? 0), 0) / scored.length);
  return { total: sessions.length, analyzed: scored.length, averageRating: average };
}
