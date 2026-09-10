import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Eye, RotateCcw, Check } from 'lucide-react-native';

import {
  AppScreen,
  AppHeader,
  Surface,
  ActionButton,
  toneColor,
  toneSoft,
  toneText,
  type Tone,
} from '../components/AppUI';
import { ProgressBar, useThemeTokens } from '../components/practice/PracticeUI';
import {
  BREATH_PHASE_LABELS,
  getCategory,
  getExercise,
  totalSteps,
  type BreathPhaseKind,
  type Exercise,
} from '../data/exercises';
import { addExerciseLog } from '../utils/exerciseHistory';
import { formatDuration } from '../utils/dateUtils';

// Egzersiz motoru: katalogdaki her egzersiz "prompt" (zamanlı komut kartları) ya da
// "breath" (nefes düzenleyici) motorunu bildirir. Bu ekran ikisini de çalıştırır.
//
// Efor puanı tamamlanan adım oranından hesaplanır; yarıda bırakılan egzersiz de kaydedilir.

const CIRCLE_SIZE = Math.min(Dimensions.get('window').width * 0.58, 260);
const MIN_SCALE = 0.55;

/** ProgressBar yalnızca üç ton biliyor; kategori vurgusunu en yakınına eşliyoruz. */
const PROGRESS_TONE: Record<Tone, 'blue' | 'violet' | 'emerald'> = {
  blue: 'blue',
  violet: 'violet',
  emerald: 'emerald',
  amber: 'blue',
  rose: 'violet',
  slate: 'blue',
};

/** Nefes fazlarını tek bir adım listesine açar. */
type BreathStep = { kind: BreathPhaseKind; seconds: number; cycle: number };

function flattenBreath(exercise: Exercise): BreathStep[] {
  if (exercise.engine.kind !== 'breath') return [];
  const steps: BreathStep[] = [];
  for (let cycle = 1; cycle <= exercise.engine.cycles; cycle += 1) {
    for (const phase of exercise.engine.phases) {
      steps.push({ kind: phase.kind, seconds: phase.seconds, cycle });
    }
  }
  return steps;
}

export default function ExerciseEngineScreen({ navigation, route }: any) {
  const t = useThemeTokens();
  const exercise = getExercise(route?.params?.exerciseId);

  if (!exercise) {
    return (
      <AppScreen header={<AppHeader title="Egzersiz" onBack={() => navigation.goBack()} backIcon="close" />}>
        <Surface className="mt-4">
          <Text className={`text-[12px] ${t.body}`}>Egzersiz bulunamadı.</Text>
        </Surface>
      </AppScreen>
    );
  }

  return <Engine exercise={exercise} navigation={navigation} />;
}

function Engine({ exercise, navigation }: { exercise: Exercise; navigation: any }) {
  const t = useThemeTokens();
  const category = getCategory(exercise.categoryId);
  const accent: Tone = category?.accent ?? 'violet';

  const steps = React.useMemo(
    () => (exercise.engine.kind === 'breath' ? flattenBreath(exercise) : []),
    [exercise],
  );
  const stepCount =
    exercise.engine.kind === 'prompt' ? exercise.engine.prompts.length : steps.length;
  const stepSeconds = (index: number) =>
    exercise.engine.kind === 'prompt' ? exercise.engine.secondsPerPrompt : (steps[index]?.seconds ?? 0);

  const [running, setRunning] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [remaining, setRemaining] = React.useState(() => stepSeconds(0));
  const [finished, setFinished] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [saved, setSaved] = React.useState(false);

  const deadlineRef = React.useRef<number | null>(null);
  const remainingRef = React.useRef(remaining);
  const scale = useSharedValue(MIN_SCALE);

  React.useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  /** Nefes fazının hedef ölçeğini faz süresi boyunca animasyona bağlar. */
  const animatePhase = React.useCallback(
    (kind: BreathPhaseKind, seconds: number) => {
      const target = kind === 'inhale' ? 1 : kind === 'exhale' ? MIN_SCALE : null;
      if (target === null) return; // tutma / bekleme fazlarında daire sabit kalır
      scale.value = withTiming(target, {
        duration: Math.max(seconds, 0.2) * 1000,
        easing: Easing.inOut(Easing.quad),
      });
    },
    [scale],
  );

  // Sayaç. Sapmayı önlemek için kalan süre bitiş anına göre hesaplanıyor.
  React.useEffect(() => {
    if (!running || finished) return;

    if (deadlineRef.current === null) {
      deadlineRef.current = Date.now() + remainingRef.current * 1000;
      if (exercise.engine.kind === 'breath' && steps[index]) {
        animatePhase(steps[index].kind, remainingRef.current);
      }
    }

    const id = setInterval(() => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      const left = (deadline - Date.now()) / 1000;

      if (left > 0) {
        setRemaining(left);
        return;
      }

      const next = index + 1;
      setElapsed((value) => value + stepSeconds(index));

      if (next >= stepCount) {
        clearInterval(id);
        deadlineRef.current = null;
        setRunning(false);
        setFinished(true);
        setRemaining(0);
        return;
      }

      deadlineRef.current = Date.now() + stepSeconds(next) * 1000;
      setIndex(next);
      setRemaining(stepSeconds(next));
      setRevealed(false);
      if (exercise.engine.kind === 'breath' && steps[next]) {
        animatePhase(steps[next].kind, steps[next].seconds);
      }
    }, 200);

    return () => clearInterval(id);
    // stepSeconds ve stepCount, exercise'a bağlı olduğu için bağımlılıklara ayrıca eklenmiyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, finished, index, steps, exercise, animatePhase, stepCount]);

  const completedSteps = finished ? stepCount : index;
  const effort = stepCount === 0 ? 0 : Math.round((completedSteps / stepCount) * 100);

  /** Kaydı yazar; hem tamamlanınca hem erken bitirince çağrılır. */
  const save = React.useCallback(() => {
    if (saved) return;
    setSaved(true);
    addExerciseLog({
      id: `exercise-${Date.now()}`,
      exerciseId: exercise.id,
      title: exercise.title,
      categoryLabel: exercise.categoryLabel,
      track: category?.track ?? 'cognitive',
      durationSeconds: Math.max(Math.round(elapsed), 1),
      effort,
      timestamp: new Date().toISOString(),
      summary: `${completedSteps}/${stepCount} adım tamamlandı.`,
    });
  }, [saved, exercise, category, elapsed, effort, completedSteps, stepCount]);

  // Egzersiz kendiliğinden bittiğinde kaydı hemen yaz.
  React.useEffect(() => {
    if (finished) save();
  }, [finished, save]);

  const start = () => {
    deadlineRef.current = null;
    setRunning(true);
  };

  const pause = () => {
    cancelAnimation(scale);
    deadlineRef.current = null;
    setRunning(false);
  };

  const restart = () => {
    cancelAnimation(scale);
    deadlineRef.current = null;
    setRunning(false);
    setFinished(false);
    setSaved(false);
    setIndex(0);
    setRemaining(stepSeconds(0));
    setRevealed(false);
    setElapsed(0);
    scale.value = MIN_SCALE;
  };

  const finishEarly = () => {
    pause();
    save();
    navigation.goBack();
  };

  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const prompt =
    exercise.engine.kind === 'prompt' ? exercise.engine.prompts[index] : undefined;
  const breathStep = exercise.engine.kind === 'breath' ? steps[index] : undefined;
  const totalStepCount = totalSteps(exercise);

  return (
    <AppScreen
      header={
        <AppHeader
          title={exercise.title}
          subtitle={`${exercise.categoryLabel} · ${exercise.minutes} dk`}
          onBack={() => navigation.goBack()}
          backIcon="close"
        />
      }
      footer={
        finished ? (
          <View className="gap-2">
            <ActionButton label="Kapat" tone={accent} onPress={() => navigation.goBack()} />
            <ActionButton
              label="Tekrar Yap"
              variant="outline"
              icon={<RotateCcw size={16} color={t.iconColor} />}
              onPress={restart}
            />
          </View>
        ) : (
          <View className="gap-2">
            {running ? (
              <ActionButton label="Duraklat" tone="slate" onPress={pause} />
            ) : (
              <ActionButton
                label={index === 0 && elapsed === 0 ? 'Başla' : 'Devam Et'}
                tone={accent}
                onPress={start}
              />
            )}
            {index > 0 || elapsed > 0 ? (
              <ActionButton label="Bitir ve Kaydet" variant="outline" onPress={finishEarly} />
            ) : null}
          </View>
        )
      }
    >
      {finished ? (
        <CompletionCard
          effort={effort}
          elapsed={elapsed}
          steps={`${completedSteps}/${stepCount}`}
          tone={accent}
          onOpenHistory={() => {
            navigation.goBack();
            navigation.navigate('ExerciseHistory');
          }}
        />
      ) : (
        <>
          {/* İlerleme */}
          <View className="mt-2 mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className={`text-[11px] font-bold uppercase tracking-widest ${t.muted}`}>
                {exercise.engine.kind === 'breath' ? 'Tur' : 'Adım'} {index + 1} / {totalStepCount}
              </Text>
              <Text className={`text-[11px] ${t.muted}`}>{formatDuration(elapsed)}</Text>
            </View>
            <ProgressBar
              value={stepCount === 0 ? 0 : index / stepCount}
              tone={PROGRESS_TONE[accent]}
            />
          </View>

          {exercise.engine.kind === 'breath' ? (
            <View className="items-center justify-center my-2" style={{ height: CIRCLE_SIZE + 24 }}>
              <View
                className={`absolute rounded-full border-2 ${
                  t.isLight ? 'border-emerald-200' : 'border-emerald-900'
                }`}
                style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2 }}
              />
              <Animated.View
                style={[
                  {
                    width: CIRCLE_SIZE,
                    height: CIRCLE_SIZE,
                    borderRadius: CIRCLE_SIZE / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: t.isLight ? 'rgba(5,150,105,0.10)' : 'rgba(52,211,153,0.16)',
                    borderWidth: 2,
                    borderColor: t.isLight ? 'rgba(5,150,105,0.35)' : 'rgba(52,211,153,0.45)',
                  },
                  circleStyle,
                ]}
              >
                <Text className={`text-5xl font-bold ${toneText('emerald', t.isLight)}`}>
                  {Math.ceil(remaining)}
                </Text>
                <Text className={`text-[14px] font-bold mt-1 ${t.title}`}>
                  {breathStep ? BREATH_PHASE_LABELS[breathStep.kind] : ''}
                </Text>
              </Animated.View>
            </View>
          ) : (
            <Surface className="items-center py-8">
              <Text className={`text-[32px] font-black ${toneText(accent, t.isLight)}`}>
                {Math.ceil(remaining)}
              </Text>
              <Text className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${t.muted}`}>
                Saniye
              </Text>
              <Text className={`text-[17px] font-bold text-center leading-7 mt-5 ${t.title}`}>
                {prompt?.text}
              </Text>

              {/* Cevabı olan alıştırmalarda kontrol imkânı */}
              {prompt?.answer ? (
                revealed ? (
                  <View className={`mt-4 px-4 py-3 rounded-2xl ${toneSoft('emerald', t.isLight)}`}>
                    <Text className={`text-[12px] font-bold ${toneText('emerald', t.isLight)}`}>
                      {prompt.answer}
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setRevealed(true)}
                    accessibilityRole="button"
                    className="flex-row items-center mt-4"
                  >
                    <Eye size={15} color={toneColor(accent, t.isLight)} />
                    <Text className={`text-[12px] font-bold ml-2 ${toneText(accent, t.isLight)}`}>
                      Cevabı göster
                    </Text>
                  </Pressable>
                )
              ) : null}
            </Surface>
          )}

          {/* Yönerge */}
          <Surface className="mt-3">
            <Text className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${t.muted}`}>
              Nasıl Yapılır
            </Text>
            <Text className={`text-[12px] leading-6 ${t.body}`}>
              {exercise.engine.kind === 'prompt'
                ? exercise.engine.instruction
                : 'Daire büyürken burnunuzdan nefes alın, sabitken tutun, küçülürken ağzınızdan verin. Omuzlarınız sabit kalsın, karnınız çalışsın.'}
            </Text>
          </Surface>
        </>
      )}
    </AppScreen>
  );
}

function CompletionCard({
  effort,
  elapsed,
  steps,
  tone,
  onOpenHistory,
}: {
  effort: number;
  elapsed: number;
  steps: string;
  tone: Tone;
  onOpenHistory: () => void;
}) {
  const t = useThemeTokens();
  return (
    <View className="mt-6">
      <Surface className="items-center py-8">
        <View
          className={`w-20 h-20 rounded-full items-center justify-center ${toneSoft('emerald', t.isLight)}`}
        >
          <Check size={34} color={toneColor('emerald', t.isLight)} />
        </View>
        <Text className={`text-[18px] font-black mt-4 ${t.title}`}>Egzersiz tamamlandı</Text>
        <Text className={`text-[12px] mt-1 ${t.muted}`}>Kayıt egzersiz geçmişinize eklendi.</Text>

        <View className="flex-row mt-6 w-full">
          <View className="flex-1 items-center">
            <Text className={`text-[21px] font-black ${toneText(tone, t.isLight)}`}>{effort}</Text>
            <Text className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${t.muted}`}>
              Efor
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className={`text-[21px] font-black ${t.title}`}>{formatDuration(elapsed)}</Text>
            <Text className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${t.muted}`}>
              Süre
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className={`text-[21px] font-black ${t.title}`}>{steps}</Text>
            <Text className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${t.muted}`}>
              Adım
            </Text>
          </View>
        </View>
      </Surface>

      <View className="mt-3">
        <ActionButton label="Egzersiz Geçmişini Aç" variant="outline" onPress={onOpenHistory} />
      </View>
    </View>
  );
}
