import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Lightbulb, CheckCircle2, ChevronRight, Circle } from 'lucide-react-native';

import { Segmented, toneColor } from '../components/AppUI';
import { ScreenShell, Card, SectionTitle, ProgressBar, useThemeTokens } from '../components/practice/PracticeUI';
import {
  COMM_CATEGORY_META,
  COMM_SCENARIOS,
  LISTENING_EXERCISES,
  pickDailyTip,
  scenariosByCategory,
  type CommCategory,
} from '../data/communication';
import { completedByCategory, completedScenarioCount, scenarioDone, useComm } from '../utils/commProgress';
import { useDayKey } from '../utils/today';
import { trUpper } from '../utils/text';

// İletişim Becerileri merkezi.
// İlerleme = tamamlanan senaryo sayısı; doğruluk yüzdesi ya da puan yok
// (bkz. `commProgress.ts` başlığı).

type Tab = 'senaryolar' | 'dinleme';

const CATEGORY_ORDER: CommCategory[] = [
  'zor-konusma',
  'geri-bildirim',
  'ikna',
  'catisma',
  'kucuk-konusma',
  'topluluk',
];

export default function CommunicationScreen({ navigation }: any) {
  const t = useThemeTokens();
  const comm = useComm();
  const [tab, setTab] = React.useState<Tab>('senaryolar');

  // `day`: gün dönümünde günün ipucu tazelensin.
  const day = useDayKey();
  const tip = React.useMemo(() => pickDailyTip(), [day]);

  const doneCount = completedScenarioCount(comm);
  const total = COMM_SCENARIOS.length;
  const listeningDone = new Set(comm.listening.map((l) => l.exerciseId));

  return (
    <ScreenShell
      title="İletişim"
      subtitle="Senaryolarla çalış, dinlemeyi alıştır"
      onClose={() => navigation?.goBack?.()}
      closeIcon="back"
    >
      <Card className="mt-2">
        <View className="flex-row items-center mb-2">
          <Lightbulb size={16} color={toneColor('amber', t.isLight)} />
          <Text className={`text-[10px] font-semibold ml-2 ${t.muted}`} style={{ letterSpacing: 1.4 }}>
            GÜNÜN İPUCU
          </Text>
        </View>
        <Text className={`text-[13px] leading-5 ${t.body}`}>{tip.text}</Text>
      </Card>

      <Card className="mt-3">
        <View className="flex-row items-baseline justify-between mb-2.5">
          <Text className={`text-[13px] font-bold ${t.title}`}>Tamamlanan senaryo</Text>
          <Text className={`text-[13px] font-bold ${t.title}`}>
            {doneCount} / {total}
          </Text>
        </View>
        <ProgressBar value={total > 0 ? doneCount / total : 0} tone="emerald" />
        <Text className={`text-[11px] mt-2 ${t.muted}`}>
          Tek doğru cevap yok; her senaryoda seçeneklerin karşı tarafta bırakacağı etkiyi karşılaştırırsın.
        </Text>
      </Card>

      <View className="mt-4 mb-1">
        <Segmented<Tab>
          value={tab}
          onChange={setTab}
          tone="emerald"
          options={[
            { value: 'senaryolar', label: 'Senaryolar' },
            { value: 'dinleme', label: 'Etkin Dinleme' },
          ]}
        />
      </View>

      {tab === 'senaryolar' ? (
        <>
          {CATEGORY_ORDER.map((category) => {
            const list = scenariosByCategory(category);
            if (list.length === 0) return null;
            const meta = COMM_CATEGORY_META[category];
            return (
              <View key={category}>
                <SectionTitle hint={meta.subtitle}>
                  {`${trUpper(meta.title)} · ${completedByCategory(comm, category)}/${list.length} TAMAMLANDI`}
                </SectionTitle>
                {list.map((scenario) => (
                  <ListRow
                    key={scenario.id}
                    title={scenario.title}
                    done={scenarioDone(comm, scenario.id)}
                    onPress={() => navigation?.navigate?.('CommScenario', { scenarioId: scenario.id })}
                  />
                ))}
              </View>
            );
          })}
        </>
      ) : (
        <>
          <SectionTitle hint="Duyguyu ve ihtiyacı adlandır, sonra yansıtıcı bir cevap seç.">
            {`ALIŞTIRMALAR · ${LISTENING_EXERCISES.filter((e) => listeningDone.has(e.id)).length}/${LISTENING_EXERCISES.length} TAMAMLANDI`}
          </SectionTitle>
          {LISTENING_EXERCISES.map((exercise) => (
            <ListRow
              key={exercise.id}
              title={exercise.title}
              done={listeningDone.has(exercise.id)}
              onPress={() => navigation?.navigate?.('ListeningSkill', { exerciseId: exercise.id })}
            />
          ))}
        </>
      )}
    </ScreenShell>
  );
}

function ListRow({ title, done, onPress }: { title: string; done: boolean; onPress: () => void }) {
  const t = useThemeTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={done ? `${title}, tamamlandı` : title}
      className={`flex-row items-center rounded-2xl border p-4 mb-2 ${t.cardBg} ${t.cardBorder}`}
    >
      {done ? (
        <CheckCircle2 size={18} color={toneColor('emerald', t.isLight)} />
      ) : (
        <Circle size={18} color={t.isLight ? '#cbd5e1' : '#52525b'} />
      )}
      <Text className={`text-[13px] font-semibold flex-1 ml-3 ${t.title}`} numberOfLines={2}>
        {title}
      </Text>
      <ChevronRight size={16} color={t.isLight ? '#94a3b8' : '#71717a'} />
    </Pressable>
  );
}
