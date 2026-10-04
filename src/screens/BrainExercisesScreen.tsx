import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BrainCircuit, Zap, Shield, Clock, HeartPulse } from 'lucide-react-native';

import {
  AppScreen,
  TabHeader,
  Segmented,
  Surface,
  Badge,
  BenefitRow,
  toneColor,
  toneSoft,
  type Tone,
} from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import {
  categoriesForTrack,
  DIFFICULTY_LABELS,
  type Difficulty,
  type Exercise,
  type ExerciseCategory,
  type ExerciseTrack,
} from '../data/exercises';
import { MeasureCard, SelfCheckList } from '../components/practice/MeasureTests';
import { findMeasureTest, TEST_POSTURE_SELF_CHECK } from '../data/measureTests';
import { testHistory, useDailyProgress } from '../utils/dailyPracticeProgress';

// Egzersizler sekmesi.
// İki hat: bilişsel (hafıza, sözel muhakeme, örüntü) ve fizyolojik (nefes, ses, duruş).
// Kartlara dokunulduğunda egzersiz motoru tam ekran açılır.

const DIFFICULTY_TONES: Record<Difficulty, Tone> = {
  kolay: 'emerald',
  orta: 'amber',
  zor: 'rose',
};

const VIOLET = ['#7c3aed', '#c084fc'] as const;

export default function BrainExercisesScreen({ navigation, route }: any) {
  const t = useThemeTokens();
  const paramTrack: ExerciseTrack | undefined = route?.params?.track;
  const hideTrackToggle: boolean = route?.params?.hideTrackToggle ?? false;
  const customTitle: string | undefined = route?.params?.title;
  const customSubtitle: string | undefined = route?.params?.subtitle;

  const [track, setTrack] = React.useState<ExerciseTrack>(paramTrack ?? 'cognitive');

  React.useEffect(() => {
    if (paramTrack) setTrack(paramTrack);
  }, [paramTrack]);

  const groups = React.useMemo(() => categoriesForTrack(track), [track]);

  const headerTitle =
    customTitle ?? (track === 'physiological' ? 'Hitabet Nefesi & Duruş' : 'Zihin & Odak');
  const headerSubtitle =
    customSubtitle ??
    (track === 'physiological'
      ? 'Diyafram programları, nefes kontrolü ve duruş egzersizleri.'
      : 'Hafıza, sözel muhakeme ve örüntü alıştırmaları.');

  return (
    <AppScreen
      tabBar
      header={
        <TabHeader
          icon={
            track === 'physiological' ? (
              <HeartPulse size={24} color={toneColor('emerald', t.isLight)} />
            ) : (
              <BrainCircuit size={24} color={t.isLight ? VIOLET[0] : VIOLET[1]} />
            )
          }
          title={headerTitle}
          subtitle={headerSubtitle}
        />
      }
    >
      {!hideTrackToggle && (
        <View className="mt-3">
          <Segmented<ExerciseTrack>
            value={track}
            labelSize={14}
            onChange={setTrack}
            tone={track === 'cognitive' ? 'violet' : 'emerald'}
            options={[
              {
                value: 'cognitive',
                label: 'Bilişsel',
                icon: <BrainCircuit size={15} color={t.iconColor} />,
              },
              {
                value: 'physiological',
                label: 'Fizyolojik',
                icon: <HeartPulse size={15} color={t.iconColor} />,
              },
            ]}
          />
        </View>
      )}

      {groups.map(({ category, exercises }) => (
        <View key={category.id} className="mt-6">
          <CategoryHeader category={category} />
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              accent={category.accent}
              onPress={() => navigation.navigate('ExerciseEngine', { exerciseId: exercise.id })}
            />
          ))}
          {/* Duruş öz-kontrolü: egzersizlerin hemen yanında, Karne'deki "Duruş"
              alanının "Ölç" düğmesi de buraya açılır (measureTests.ts). */}
          {category.id === 'durus' ? <PostureSelfCheckCard /> : null}
        </View>
      ))}
    </AppScreen>
  );
}

function CategoryHeader({ category }: { category: ExerciseCategory }) {
  const t = useThemeTokens();
  return (
    <View className="flex-row mb-3">
      {/* Sol renk şeridi */}
      <View
        className="w-1 rounded-full mr-3"
        style={{ backgroundColor: toneColor(category.accent, t.isLight) }}
      />
      <View className="flex-1">
        <Text className={`text-[16px] font-bold ${t.title}`}>{category.title}</Text>
        <Text className={`text-[11px] mt-1 leading-5 ${t.muted}`}>{category.description}</Text>
      </View>
    </View>
  );
}

/** Duruş öz-kontrolü — işaretlenen madde sayısı ölçümün kendisi (bkz. `DiaphragmIsolationMeasure`). */
const POSTURE_SELF_CHECK_ITEMS = [
  'Kulaklarım omuz hizasında, öne doğru sarkmıyor.',
  'Omuzlarım öne kapanmış değil, geride ve gevşek duruyor.',
  'Sırtım sandalyenin arkasına yaslı, kambur oturmuyorum.',
  'Ekranın üst kenarı göz hizamda ya da altında.',
  'Ayaklarım yere tam basıyor, kalçam dizlerimden yukarıda değil.',
];

function PostureSelfCheckCard() {
  const { progress, logTest } = useDailyProgress();
  const history = testHistory(progress, TEST_POSTURE_SELF_CHECK);
  const [checked, setChecked] = React.useState<boolean[]>(() =>
    POSTURE_SELF_CHECK_ITEMS.map(() => false),
  );
  // Hiçbir maddeye dokunulmadıysa ölçüm henüz yapılmamış demektir; 0 işaretli
  // olsa bile kullanıcı bir kez dokunduysa bu geçerli bir sonuçtur.
  const [touched, setTouched] = React.useState(false);
  const checkedCount = checked.filter(Boolean).length;

  const toggle = (index: number) => {
    setTouched(true);
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));
  };

  return (
    <View className="mt-1">
      <MeasureCard
        test={findMeasureTest(TEST_POSTURE_SELF_CHECK)!}
        history={history}
        value={touched ? checkedCount : null}
        onSave={(value) => logTest(TEST_POSTURE_SELF_CHECK, value)}
        startLabel="Öz-kontrole başla"
        startHint="Aynada ya da telefon kamerasında otururken kendini gör, sonra maddeleri dürüstçe işaretle."
      >
        <SelfCheckList items={POSTURE_SELF_CHECK_ITEMS} checked={checked} onToggle={toggle} />
      </MeasureCard>
    </View>
  );
}

function ExerciseCard({
  exercise,
  accent,
  onPress,
}: {
  exercise: Exercise;
  accent: Tone;
  onPress: () => void;
}) {
  const t = useThemeTokens();
  const isBreath = exercise.engine.kind === 'breath';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.title}, ${exercise.minutes} dakika. Başlamak için aç.`}
      className="mb-3"
    >
      <Surface>
        <View className="flex-row items-start">
          <View
            className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${toneSoft(accent, t.isLight)}`}
          >
            {isBreath ? (
              <Shield size={18} color={toneColor(accent, t.isLight)} />
            ) : (
              <Zap size={18} color={toneColor(accent, t.isLight)} />
            )}
          </View>
          <Text className={`text-[15px] font-bold flex-1 pr-2 ${t.title}`}>{exercise.title}</Text>
          <Badge
            label={DIFFICULTY_LABELS[exercise.difficulty]}
            tone={DIFFICULTY_TONES[exercise.difficulty]}
          />
        </View>

        <Text className={`text-[12px] mt-2.5 leading-5 ${t.body}`}>{exercise.description}</Text>

        <View className="flex-row items-center mt-3">
          <Clock size={13} color={t.iconColor} />
          <Text className={`text-[11px] ml-1.5 ${t.muted}`}>{exercise.minutes} dk</Text>
          <View className="w-4" />
          {isBreath ? (
            <Shield size={13} color={t.iconColor} />
          ) : (
            <Zap size={13} color={t.iconColor} />
          )}
          <Text className={`text-[11px] ml-1.5 ${t.muted}`}>{exercise.categoryLabel}</Text>
        </View>

        <View className={`mt-3 pt-1 border-t ${t.dividerColor}`}>
          {exercise.benefits.map((benefit) => (
            <BenefitRow key={benefit} text={benefit} />
          ))}
        </View>
      </Surface>
    </Pressable>
  );
}
