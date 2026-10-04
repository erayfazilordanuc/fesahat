import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Quote, Check, X as XIcon, ArrowRight } from 'lucide-react-native';

import { Badge, ActionButton, toneColor, toneSoft, toneText, type Tone } from '../components/AppUI';
import { ScreenShell, Card, SectionTitle, useThemeTokens } from '../components/practice/PracticeUI';
import {
  LISTENING_EXERCISES,
  SCENARIO_EFFECT_LABELS,
  findListeningExercise,
  type ListeningExercise,
  type ScenarioEffect,
} from '../data/communication';
import { recordListening, useComm } from '../utils/commProgress';
import { trUpper } from '../utils/text';

// Etkin dinleme alıştırması.
// Üç adım: (1) duyguyu adlandır, (2) ihtiyacı adlandır, (3) yansıtıcı cevap seç.
// Duygu ve ihtiyaç adımlarında tek doğru vardır; yansıtıcı cevapta doğru/yanlış
// yok, yalnızca seçeneğin karşı tarafta bırakacağı etki ve gerekçesi gösterilir.

type Step = 'feeling' | 'need' | 'reflect';

const EFFECT_TONE: Record<ScenarioEffect, Tone> = {
  isler: 'emerald',
  kismen: 'amber',
  islemez: 'rose',
};

const STEP_META: Record<Step, { index: number; title: string; question: string }> = {
  feeling: { index: 1, title: 'Duyguyu adlandır', question: 'Konuşan kişi şu an ne hissediyor olabilir?' },
  need: { index: 2, title: 'İhtiyacı adlandır', question: 'Bu duygunun arkasında nasıl bir ihtiyaç olabilir?' },
  reflect: { index: 3, title: 'Yansıtıcı cevap seç', question: 'Hangi cevap onu dinlediğini en iyi hissettirir?' },
};

export default function ListeningSkillScreen({ navigation, route }: any) {
  const comm = useComm();
  const exerciseId: string | undefined = route?.params?.exerciseId;
  const close = () => navigation?.goBack?.();

  // Başlangıç alıştırması ekran açılırken bir kez seçilir; tamamlanınca kayıt
  // değişse de oturum ortasında başka alıştırmaya atlamasın.
  const [currentId, setCurrentId] = React.useState<string | undefined>(() => {
    if (exerciseId) return exerciseId;
    const doneIds = new Set(comm.listening.map((l) => l.exerciseId));
    return (LISTENING_EXERCISES.find((e) => !doneIds.has(e.id)) ?? LISTENING_EXERCISES[0])?.id;
  });

  const exercise = currentId ? findListeningExercise(currentId) : undefined;

  if (!exercise) {
    return (
      <ScreenShell title="Etkin Dinleme" onClose={close} closeIcon="back">
        <NotFound onBack={close} />
      </ScreenShell>
    );
  }

  const nextExercise = () => {
    const start = LISTENING_EXERCISES.findIndex((e) => e.id === exercise.id);
    const after = [
      ...LISTENING_EXERCISES.slice(start + 1),
      ...LISTENING_EXERCISES.slice(0, Math.max(start, 0)),
    ];
    const doneIds = new Set(comm.listening.map((l) => l.exerciseId));
    const next = after.find((e) => !doneIds.has(e.id)) ?? after[0];
    if (next) setCurrentId(next.id);
    else close();
  };

  return (
    <ListeningPlayer
      key={exercise.id}
      exercise={exercise}
      onNext={nextExercise}
      onClose={close}
      hasOther={LISTENING_EXERCISES.length > 1}
    />
  );
}

function NotFound({ onBack }: { onBack: () => void }) {
  const t = useThemeTokens();
  return (
    <View className="items-center mt-16 px-4">
      <Text className={`text-[15px] font-bold text-center ${t.title}`}>Alıştırma bulunamadı</Text>
      <Text className={`text-[12px] leading-5 text-center mt-2 mb-6 ${t.muted}`}>
        Aradığın alıştırma artık listede yok. Katalogdan başka bir alıştırma seçebilirsin.
      </Text>
      <View className="self-stretch">
        <ActionButton label="Geri dön" tone="blue" variant="soft" onPress={onBack} />
      </View>
    </View>
  );
}

function ListeningPlayer({
  exercise,
  onNext,
  onClose,
  hasOther,
}: {
  exercise: ListeningExercise;
  onNext: () => void;
  onClose: () => void;
  hasOther: boolean;
}) {
  const t = useThemeTokens();
  const [step, setStep] = React.useState<Step>('feeling');
  const [feelingPick, setFeelingPick] = React.useState<number | null>(null);
  const [needPick, setNeedPick] = React.useState<number | null>(null);
  const [reflectPick, setReflectPick] = React.useState<number | null>(null);

  const feelingCorrect = feelingPick === exercise.feelingIndex;
  const needCorrect = needPick === exercise.needIndex;
  const finished = reflectPick !== null;
  const meta = STEP_META[step];

  const pickReflect = (index: number) => {
    if (reflectPick !== null) return;
    setReflectPick(index);
    recordListening({
      exerciseId: exercise.id,
      title: exercise.title,
      feelingCorrect,
      needCorrect,
      reflectEffect: exercise.reflectOptions[index].effect,
    });
  };

  return (
    <ScreenShell title={exercise.title} subtitle="Etkin dinleme" onClose={onClose} closeIcon="back">
      <Card className="mt-2">
        <View className="flex-row items-center mb-2">
          <Quote size={16} color={toneColor('blue', t.isLight)} />
          <Text className={`text-[10px] font-semibold ml-2 ${t.muted}`} style={{ letterSpacing: 1.4 }}>
            KONUŞAN KİŞİ
          </Text>
        </View>
        <Text className={`text-[15px] leading-7 italic ${t.title}`}>{exercise.utterance}</Text>
      </Card>

      <SectionTitle hint={meta.question}>{`ADIM ${meta.index}/3 · ${trUpper(meta.title)}`}</SectionTitle>

      {step === 'feeling' ? (
        <ChoiceStep
          options={exercise.feelingOptions}
          correctIndex={exercise.feelingIndex}
          picked={feelingPick}
          onPick={(i) => feelingPick === null && setFeelingPick(i)}
          nextLabel="İhtiyacı adlandır"
          onNext={() => setStep('need')}
        />
      ) : null}

      {step === 'need' ? (
        <ChoiceStep
          options={exercise.needOptions}
          correctIndex={exercise.needIndex}
          picked={needPick}
          onPick={(i) => needPick === null && setNeedPick(i)}
          nextLabel="Cevap seçmeye geç"
          onNext={() => setStep('reflect')}
        />
      ) : null}

      {step === 'reflect' ? (
        <>
          {exercise.reflectOptions.map((option, index) => (
            <ReflectCard
              key={index}
              index={index}
              text={option.text}
              why={option.why}
              effect={option.effect}
              revealed={finished}
              selected={reflectPick === index}
              onPress={() => pickReflect(index)}
            />
          ))}
        </>
      ) : null}

      {finished ? (
        <View className="mt-6 mb-2">
          {hasOther ? (
            <ActionButton
              label="Sonraki alıştırma"
              tone="emerald"
              icon={<ArrowRight size={16} color="#ffffff" />}
              onPress={onNext}
            />
          ) : (
            <ActionButton label="Kataloğa dön" tone="emerald" onPress={onClose} />
          )}
        </View>
      ) : null}
    </ScreenShell>
  );
}

/** Tek doğrusu olan adım: seçince doğru/yanlış gösterilir, "devam" düğmesi çıkar. */
function ChoiceStep({
  options,
  correctIndex,
  picked,
  onPick,
  nextLabel,
  onNext,
}: {
  options: string[];
  correctIndex: number;
  picked: number | null;
  onPick: (index: number) => void;
  nextLabel: string;
  onNext: () => void;
}) {
  const t = useThemeTokens();
  const answered = picked !== null;

  return (
    <View>
      {options.map((option, index) => {
        const isCorrect = index === correctIndex;
        const isPicked = picked === index;
        // Yanlış seçildiyse doğru olan da gösterilir; diğerleri nötr kalır.
        const tone: Tone | null = answered ? (isCorrect ? 'emerald' : isPicked ? 'rose' : null) : null;
        const surface = tone ? `${toneSoft(tone, t.isLight)} border-transparent` : `${t.cardBg} ${t.cardBorder}`;
        return (
          <Pressable
            key={index}
            onPress={() => onPick(index)}
            disabled={answered}
            accessibilityRole="button"
            accessibilityLabel={`${option}${
              answered ? (isCorrect ? ', doğru seçenek' : isPicked ? ', seçtiğin ama uygun olmayan' : '') : ''
            }`}
            accessibilityState={{ selected: isPicked, disabled: answered }}
            className={`rounded-2xl border p-4 mb-2.5 flex-row items-center ${surface}`}
          >
            <Text className={`text-[13px] leading-5 flex-1 ${t.title}`}>{option}</Text>
            {tone === 'emerald' ? <Check size={18} color={toneColor('emerald', t.isLight)} /> : null}
            {tone === 'rose' ? <XIcon size={18} color={toneColor('rose', t.isLight)} /> : null}
          </Pressable>
        );
      })}

      {answered ? (
        <View className="mt-3">
          <Text className={`text-[12px] leading-5 mb-3 ${t.body}`}>
            {picked === correctIndex
              ? 'Evet — konuşmada öne çıkan bu.'
              : `Konuşmada daha çok öne çıkan: ${options[correctIndex]}.`}
          </Text>
          <ActionButton label={nextLabel} tone="blue" onPress={onNext} />
        </View>
      ) : null}
    </View>
  );
}

/** Yansıtıcı cevap: doğru/yanlış damgası yok, etki ve gerekçe gösterilir. */
function ReflectCard({
  index,
  text,
  why,
  effect,
  revealed,
  selected,
  onPress,
}: {
  index: number;
  text: string;
  why: string;
  effect: ScenarioEffect;
  revealed: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const t = useThemeTokens();
  const tone = EFFECT_TONE[effect];
  const letter = String.fromCharCode(65 + index);
  const surface = revealed
    ? `${toneSoft(tone, t.isLight)} border-transparent`
    : `${t.cardBg} ${t.cardBorder}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={revealed}
      accessibilityRole="button"
      accessibilityLabel={`Cevap ${letter}: ${text}`}
      accessibilityState={{ selected, disabled: revealed }}
      className={`rounded-2xl border p-4 mb-2.5 ${surface}`}
    >
      <View className="flex-row">
        <Text className={`text-[13px] font-black mr-3 ${revealed ? toneText(tone, t.isLight) : t.muted}`}>
          {letter}
        </Text>
        <Text className={`text-[13px] leading-5 flex-1 ${t.title}`}>{text}</Text>
      </View>
      {revealed ? (
        <View className="mt-3">
          <View className="flex-row items-center flex-wrap">
            <Badge label={SCENARIO_EFFECT_LABELS[effect]} tone={tone} />
            {selected ? (
              <View className="ml-2">
                <Badge label="Senin seçimin" tone="slate" />
              </View>
            ) : null}
          </View>
          <Text className={`text-[12px] leading-5 mt-2 ${t.body}`}>{why}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
