import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { Check, X as XIcon, Clock, Volume2, Square, RotateCcw, BookOpen } from 'lucide-react-native';

import {
  AppScreen,
  AppHeader,
  Surface,
  SectionLabel,
  ActionButton,
  EmptyState,
  Badge,
  toneColor,
  toneSoft,
  toneText,
} from '../components/AppUI';
import { useThemeTokens, ProgressBar } from '../components/practice/PracticeUI';
import { QUIZ_KIND_LABELS, QUIZ_SKILL_LABELS, type QuizSet, type QuizSkill } from '../data/quiz';
import { READING_SETS, LISTENING_SETS } from '../data/comprehension';
import { VERBAL_SETS } from '../data/verbalReasoning';
import { recordQuizAttempt } from '../utils/comprehensionProgress';
import { trUpper } from '../utils/text';

// Soru seti oynatıcı — okuma, dinleme ve sözel setlerin hepsi bu tek ekranda.
//
// Rota: 'Quiz', params: { setId }. Set üç havuzda id ile aranır; bulunamazsa
// ekran çökmez, sade bir "bulunamadı" durumu gösterir.
//
// Dinleme: metin soru sırasında gizli. Cihaz TTS'i Türkçe okuyabiliyorsa
// "Dinle" ile okunur; okuyamıyorsa (ses yok / hata) metin ekranda gösterilir
// ve kullanıcıya sade bir cümleyle söylenir — alıştırma TTS'siz de çalışır.
//
// Süre sayaç olarak görünür (geri sayım değil), hedefi ve baskısı yoktur.

const ALL_SETS: QuizSet[] = [...READING_SETS, ...LISTENING_SETS, ...VERBAL_SETS];

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

/** Android TTS tek istekte ~4000 karakterle sınırlı; uzun metin cümle sınırından bölünür. */
const SPEECH_CHUNK = 1500;

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function splitForSpeech(text: string): string[] {
  const sentences = text.match(/[^.!?…]+[.!?…]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current && current.length + sentence.length > SPEECH_CHUNK) {
      chunks.push(current.trim());
      current = '';
    }
    current += sentence;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

export default function QuizScreen({ route, navigation }: any) {
  const setId: string | undefined = route?.params?.setId;
  const set = React.useMemo(() => ALL_SETS.find((s) => s.id === setId), [setId]);

  if (!set || set.questions.length === 0) {
    return (
      <AppScreen header={<AppHeader title="Alıştırma" onBack={() => navigation.goBack()} />}>
        <EmptyState message="Bu alıştırma bulunamadı." />
        <ActionButton label="Geri dön" variant="outline" onPress={() => navigation.goBack()} />
      </AppScreen>
    );
  }

  return <QuizPlayer key={set.id} set={set} navigation={navigation} />;
}

/* ------------------------------------------------------------------ */
/* Oynatıcı                                                            */
/* ------------------------------------------------------------------ */

type Phase = 'listen' | 'questions' | 'done';

function QuizPlayer({ set, navigation }: { set: QuizSet; navigation: any }) {
  const t = useThemeTokens();
  const total = set.questions.length;
  const isListening = set.kind === 'dinleme';

  const [phase, setPhase] = React.useState<Phase>(isListening ? 'listen' : 'questions');
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<(number | null)[]>(() => set.questions.map(() => null));
  const [seconds, setSeconds] = React.useState(0);
  const [attempt, setAttempt] = React.useState(0); // "Tekrar çöz" sayacı

  const startedAt = React.useRef(Date.now());
  const savedFor = React.useRef<number>(-1);

  const tts = useSpeech(set.passage ?? '', isListening);

  // Süre: sayaç, dinleme aşaması dahil; tamamlanınca durur.
  React.useEffect(() => {
    if (phase === 'done') return;
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [phase, attempt]);

  const question = set.questions[index];
  const selected = answers[index];
  const revealed = selected !== null && selected !== undefined;

  const choose = (optionIndex: number) => {
    if (revealed) return;
    setAnswers((prev) => prev.map((a, i) => (i === index ? optionIndex : a)));
  };

  const finish = () => {
    const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
    setSeconds(elapsed);
    setPhase('done');
    if (savedFor.current === attempt) return;
    savedFor.current = attempt;

    const bySkill: Partial<Record<QuizSkill, { correct: number; total: number }>> = {};
    let correct = 0;
    set.questions.forEach((q, i) => {
      const entry = bySkill[q.skill] ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (answers[i] === q.answerIndex) {
        entry.correct += 1;
        correct += 1;
      }
      bySkill[q.skill] = entry;
    });
    recordQuizAttempt({
      setId: set.id,
      kind: set.kind,
      title: set.title,
      correct,
      total,
      seconds: elapsed,
      bySkill,
    });
  };

  const next = () => {
    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }
    finish();
  };

  const restart = () => {
    tts.stop();
    setAnswers(set.questions.map(() => null));
    setIndex(0);
    setSeconds(0);
    startedAt.current = Date.now();
    setAttempt((a) => a + 1);
    setPhase(isListening ? 'listen' : 'questions');
  };

  const subtitle =
    phase === 'questions'
      ? `${QUIZ_KIND_LABELS[set.kind]} · soru ${index + 1}/${total}`
      : phase === 'listen'
        ? `${QUIZ_KIND_LABELS[set.kind]} · dinleme`
        : `${QUIZ_KIND_LABELS[set.kind]} · tamamlandı`;

  const header = (
    <AppHeader
      title={set.title}
      subtitle={subtitle}
      onBack={() => navigation.goBack()}
      right={
        phase !== 'done' ? (
          <View
            className="flex-row items-center"
            accessible
            accessibilityLabel={`Geçen süre ${formatDuration(seconds)}`}
          >
            <Clock size={14} color={t.iconColor} />
            <Text className={`text-[12px] font-semibold ml-1 ${t.muted}`}>{formatDuration(seconds)}</Text>
          </View>
        ) : undefined
      }
    />
  );

  const footer =
    phase === 'questions' && revealed ? (
      <ActionButton
        label={index + 1 < total ? 'Sonraki' : 'Sonucu gör'}
        tone="emerald"
        onPress={next}
      />
    ) : phase === 'done' ? (
      <View className="flex-row gap-3">
        <View className="flex-1">
          <ActionButton
            label="Tekrar çöz"
            variant="outline"
            icon={<RotateCcw size={16} color={t.iconColor} />}
            onPress={restart}
          />
        </View>
        <View className="flex-1">
          <ActionButton label="Bitir" tone="emerald" onPress={() => navigation.goBack()} />
        </View>
      </View>
    ) : undefined;

  return (
    <AppScreen header={header} footer={footer}>
      {phase === 'listen' ? (
        <ListenIntro tts={tts} passage={set.passage ?? ''} onContinue={() => setPhase('questions')} />
      ) : null}

      {phase === 'questions' ? (
        <>
          <View className="mb-3 mt-1">
            <ProgressBar value={index / total} tone="emerald" />
          </View>

          {set.kind === 'okuma' && set.passage ? (
            <PassageCard passage={set.passage} source={set.passageSource} scrollable />
          ) : null}

          {isListening ? <ListenBar tts={tts} /> : null}

          <SectionLabel>{trUpper(QUIZ_SKILL_LABELS[question.skill])}</SectionLabel>
          <Text className={`text-[16px] font-semibold leading-6 mb-4 ${t.title}`}>{question.prompt}</Text>

          {question.options.map((option, optionIndex) => (
            <OptionRow
              key={optionIndex}
              letter={OPTION_LETTERS[optionIndex] ?? String(optionIndex + 1)}
              text={option}
              state={
                !revealed
                  ? 'idle'
                  : optionIndex === question.answerIndex
                    ? 'correct'
                    : optionIndex === selected
                      ? 'wrong'
                      : 'dim'
              }
              onPress={() => choose(optionIndex)}
            />
          ))}

          {revealed ? (
            <Surface className={`mt-2 ${toneSoft(selected === question.answerIndex ? 'emerald' : 'rose', t.isLight)}`}>
              <Text
                className={`text-[12px] font-bold mb-1 ${toneText(
                  selected === question.answerIndex ? 'emerald' : 'rose',
                  t.isLight,
                )}`}
              >
                {selected === question.answerIndex ? 'Doğru' : 'Yanlış'}
              </Text>
              <Text className={`text-[12px] leading-5 ${t.body}`}>{question.explanation}</Text>
            </Surface>
          ) : null}
        </>
      ) : null}

      {phase === 'done' ? (
        <Completion set={set} answers={answers} seconds={seconds} />
      ) : null}
    </AppScreen>
  );
}

/* ------------------------------------------------------------------ */
/* Seçenek satırı                                                      */
/* ------------------------------------------------------------------ */

function OptionRow({
  letter,
  text,
  state,
  onPress,
}: {
  letter: string;
  text: string;
  state: 'idle' | 'correct' | 'wrong' | 'dim';
  onPress: () => void;
}) {
  const t = useThemeTokens();
  const surface =
    state === 'correct'
      ? `${toneSoft('emerald', t.isLight)} border-transparent`
      : state === 'wrong'
        ? `${toneSoft('rose', t.isLight)} border-transparent`
        : `${t.cardBg} ${t.cardBorder}`;
  const answered = state !== 'idle';
  const suffix = state === 'correct' ? ', doğru cevap' : state === 'wrong' ? ', senin cevabın, yanlış' : '';

  return (
    <Pressable
      onPress={onPress}
      disabled={answered}
      accessibilityRole="button"
      accessibilityLabel={`${letter} seçeneği: ${text}${suffix}`}
      accessibilityState={{ disabled: answered, selected: state === 'correct' || state === 'wrong' }}
      className={`flex-row items-center rounded-2xl border p-4 mb-2 ${surface} ${state === 'dim' ? 'opacity-50' : ''}`}
    >
      <Text className={`text-[13px] font-bold w-6 ${t.muted}`}>{letter}</Text>
      <Text className={`text-[14px] flex-1 leading-5 ${t.title}`}>{text}</Text>
      {state === 'correct' ? <Check size={18} color={toneColor('emerald', t.isLight)} /> : null}
      {state === 'wrong' ? <XIcon size={18} color={toneColor('rose', t.isLight)} /> : null}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Metin kartı                                                         */
/* ------------------------------------------------------------------ */

function PassageCard({
  passage,
  source,
  scrollable,
}: {
  passage: string;
  source?: string;
  scrollable?: boolean;
}) {
  const t = useThemeTokens();
  const body = <Text className={`text-[14px] leading-6 ${t.body}`}>{passage}</Text>;
  return (
    <Surface>
      {scrollable ? (
        <ScrollView style={{ maxHeight: 240 }} nestedScrollEnabled showsVerticalScrollIndicator>
          {body}
        </ScrollView>
      ) : (
        body
      )}
      {source ? <Text className={`text-[11px] mt-3 ${t.muted}`}>— {source}</Text> : null}
    </Surface>
  );
}

/* ------------------------------------------------------------------ */
/* Dinleme                                                             */
/* ------------------------------------------------------------------ */

type SpeechControls = {
  /** Sesli okuma çalışıyor mu. */
  speaking: boolean;
  /** Cihaz Türkçe okuyamıyor — metin ekranda gösterilir. */
  fallback: boolean;
  /** En az bir kez dinlendi. */
  heard: boolean;
  play: () => void;
  stop: () => void;
};

/**
 * `expo-speech` sarmalayıcısı. Cihazda TTS yoksa / Türkçe ses yoksa / okuma
 * hata verirse `fallback` açılır; teknik hata metni hiçbir yerde gösterilmez.
 */
function useSpeech(text: string, enabled: boolean): SpeechControls {
  const [speaking, setSpeaking] = React.useState(false);
  const [fallback, setFallback] = React.useState(false);
  const [heard, setHeard] = React.useState(false);
  // Eski okumaların geç gelen geri çağrıları yeni durumu bozmasın.
  const token = React.useRef(0);

  const stop = React.useCallback(() => {
    token.current += 1;
    setSpeaking(false);
    try {
      Speech.stop();
    } catch {
      // Ses motoru yoksa durduracak bir şey de yoktur.
    }
  }, []);

  // Türkçe ses var mı? Liste boş dönerse (Android'de olabilir) belirsiz sayılır
  // ve okuma denenir; hata olursa onError yedeğe düşürür.
  React.useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    Speech.getAvailableVoicesAsync()
      .then((voices) => {
        if (cancelled) return;
        if (voices.length > 0 && !voices.some((v) => v.language?.toLowerCase().startsWith('tr'))) {
          setFallback(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFallback(true);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  // Ekran kapanırken sesi kes.
  React.useEffect(() => {
    return () => {
      token.current += 1;
      try {
        Speech.stop();
      } catch {
        // yok say
      }
    };
  }, []);

  const play = React.useCallback(() => {
    if (!text) return;
    token.current += 1;
    const mine = token.current;
    try {
      Speech.stop();
      const chunks = splitForSpeech(text);
      setSpeaking(true);
      setHeard(true);
      chunks.forEach((chunk, i) => {
        Speech.speak(chunk, {
          language: 'tr-TR',
          onDone: () => {
            if (token.current === mine && i === chunks.length - 1) setSpeaking(false);
          },
          onStopped: () => {
            if (token.current === mine) setSpeaking(false);
          },
          onError: () => {
            if (token.current !== mine) return;
            token.current += 1;
            setSpeaking(false);
            setFallback(true);
          },
        });
      });
    } catch {
      setSpeaking(false);
      setFallback(true);
    }
  }, [text]);

  return { speaking, fallback, heard, play, stop };
}

function ListenIntro({
  tts,
  passage,
  onContinue,
}: {
  tts: SpeechControls;
  passage: string;
  onContinue: () => void;
}) {
  const t = useThemeTokens();

  if (tts.fallback) {
    return (
      <View className="mt-2">
        <Surface>
          <Text className={`text-[13px] leading-5 mb-3 ${t.body}`}>
            Bu cihazda Türkçe sesli okuma kullanılamıyor. Metni kendin oku; ardından sorulara geç —
            sorular sırasında metin gizli kalır.
          </Text>
          <Text className={`text-[14px] leading-6 ${t.title}`}>{passage}</Text>
        </Surface>
        <View className="mt-4">
          <ActionButton label="Okudum, sorulara geç" tone="emerald" onPress={onContinue} />
        </View>
      </View>
    );
  }

  return (
    <View className="mt-2">
      <Surface>
        <Text className={`text-[13px] leading-5 mb-4 ${t.body}`}>
          Metin yüksek sesle okunacak ve ekranda görünmeyecek. Dinle, sonra soruları yanıtla.
        </Text>
        <ActionButton
          label={tts.speaking ? 'Okunuyor…' : tts.heard ? 'Tekrar dinle' : 'Dinle'}
          tone="emerald"
          disabled={tts.speaking}
          icon={<Volume2 size={16} color="#ffffff" />}
          onPress={tts.play}
        />
        {tts.speaking ? (
          <View className="mt-3">
            <ActionButton
              label="Durdur"
              variant="outline"
              icon={<Square size={14} color={t.iconColor} />}
              onPress={tts.stop}
            />
          </View>
        ) : null}
      </Surface>
      <View className="mt-4">
        <ActionButton
          label={tts.heard ? 'Sorulara geç' : 'Dinlemeden sorulara geç'}
          variant={tts.heard ? 'solid' : 'outline'}
          tone="emerald"
          onPress={() => {
            tts.stop();
            onContinue();
          }}
        />
      </View>
    </View>
  );
}

/** Sorular sırasında küçük oynatıcı şeridi; yedek yolda gösterilmez (metin gizli kalır). */
function ListenBar({ tts }: { tts: SpeechControls }) {
  const t = useThemeTokens();
  if (tts.fallback) return null;
  return (
    <Surface className="flex-row items-center">
      <Volume2 size={16} color={toneColor('emerald', t.isLight)} />
      <Text className={`text-[12px] flex-1 ml-2 ${t.muted}`}>
        {tts.speaking ? 'Okunuyor…' : 'Metni yeniden dinleyebilirsin.'}
      </Text>
      {tts.speaking ? (
        <Pressable
          onPress={tts.stop}
          accessibilityRole="button"
          accessibilityLabel="Okumayı durdur"
          hitSlop={8}
          className="px-3 py-1.5"
        >
          <Text className={`text-[12px] font-bold ${toneText('rose', t.isLight)}`}>Durdur</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={tts.play}
          accessibilityRole="button"
          accessibilityLabel="Metni tekrar dinle"
          hitSlop={8}
          className="px-3 py-1.5"
        >
          <Text className={`text-[12px] font-bold ${toneText('emerald', t.isLight)}`}>Tekrar dinle</Text>
        </Pressable>
      )}
    </Surface>
  );
}

/* ------------------------------------------------------------------ */
/* Tamamlama kartı                                                     */
/* ------------------------------------------------------------------ */

function Completion({
  set,
  answers,
  seconds,
}: {
  set: QuizSet;
  answers: (number | null)[];
  seconds: number;
}) {
  const t = useThemeTokens();
  const total = set.questions.length;

  const skills = React.useMemo(() => {
    const map = new Map<QuizSkill, { correct: number; total: number }>();
    set.questions.forEach((q, i) => {
      const entry = map.get(q.skill) ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (answers[i] === q.answerIndex) entry.correct += 1;
      map.set(q.skill, entry);
    });
    return [...map.entries()];
  }, [set, answers]);

  const correct = skills.reduce((sum, [, c]) => sum + c.correct, 0);

  return (
    <View className="mt-2">
      <Surface>
        <Text className={`text-[28px] font-black ${t.title}`}>
          {correct}/{total}
        </Text>
        <Text className={`text-[13px] mt-0.5 ${t.body}`}>doğru cevap</Text>
        <View className="flex-row items-center mt-3">
          <Clock size={14} color={t.iconColor} />
          <Text className={`text-[12px] ml-1.5 ${t.muted}`}>Geçen süre {formatDuration(seconds)}</Text>
        </View>
      </Surface>

      <SectionLabel>BECERİ KIRILIMI</SectionLabel>
      <Surface>
        {skills.map(([skill, c], i) => (
          <View
            key={skill}
            className={`flex-row items-center justify-between py-2 ${i > 0 ? `border-t ${t.dividerColor}` : ''}`}
          >
            <Text className={`text-[13px] flex-1 ${t.body}`}>{QUIZ_SKILL_LABELS[skill]}</Text>
            <Badge
              label={`${c.correct}/${c.total}`}
              tone={c.correct === c.total ? 'emerald' : c.correct === 0 ? 'rose' : 'amber'}
            />
          </View>
        ))}
      </Surface>

      {set.passage ? (
        <>
          <SectionLabel>{set.kind === 'dinleme' ? 'DİNLEDİĞİN METİN' : 'METİN'}</SectionLabel>
          {set.kind === 'dinleme' ? (
            <View className="flex-row items-center mb-2">
              <BookOpen size={14} color={t.iconColor} />
              <Text className={`text-[11px] ml-1.5 ${t.muted}`}>
                Cevaplarını metinle karşılaştırabilirsin.
              </Text>
            </View>
          ) : null}
          <PassageCard passage={set.passage} source={set.passageSource} />
        </>
      ) : null}
    </View>
  );
}
