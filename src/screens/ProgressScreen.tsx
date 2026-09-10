import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, Award, Cpu, Flame, ChevronRight } from 'lucide-react-native';

import {
  AppScreen,
  TabHeader,
  Surface,
  SectionLabel,
  ActionRow,
  StatTile,
  EmptyState,
  toneColor,
  toneSoft,
  toneText,
} from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { TrendChart } from '../components/TrendChart';
import { TestTrend } from '../components/practice/TestTrend';
import {
  TEST_BREATHING_RATE,
  TEST_EXHALE_CONTROL,
  TEST_READING_WPM,
  testHistory,
  useDailyProgress,
  type PracticeModule,
} from '../utils/dailyPracticeProgress';
import { interviewStats, useInterviewSessions } from '../utils/interviewHistory';
import { exerciseStats, useExerciseLogs } from '../utils/exerciseHistory';

// İlerleme sekmesi — uygulamanın ölçtüğü **her şey**.
//
// Ayrımı net tutmak için: Gelişim = ne çalışacağım, **İlerleme = ne kadar yol
// aldım**. İki sekmenin adı anlamca yakın olduğu için alt başlıklar bunu açıkça
// söylüyor.
//
// Eskiden bu içerik `ProfileScreen`'in içindeydi ve yalnızca iki şey ölçüyordu:
// mülakat puanı ve egzersiz eforu. Metin, nefes, konuşma, belagat serileri
// tutuluyor ama hiçbir yerde görünmüyordu (YAPILACAKLAR Bölüm 0).

const MODULE_LABELS: Record<PracticeModule, string> = {
  dailyText: 'Günün metni',
  diaphragm: 'Diyafram nefesi',
  speech: 'Konuşma egzersizi',
  belagat: 'Belagat',
};

/** Grafiğe beslenecek son N kaydı eskiden yeniye sıralar. */
function lastValues<T>(items: T[], take: number, pick: (item: T) => number): number[] {
  return items.slice(0, take).reverse().map(pick);
}

export default function ProgressScreen({ navigation }: any) {
  const t = useThemeTokens();
  const { progress } = useDailyProgress();
  const sessions = useInterviewSessions();
  const logs = useExerciseLogs();

  const interviews = interviewStats(sessions);
  const exercises = exerciseStats(logs);

  const modules = Object.entries(progress.modules) as [PracticeModule, { streak: number; bestStreak: number; totalSessions: number }][];
  const activeModules = modules.filter(([, m]) => m.totalSessions > 0);

  const interviewSeries = lastValues(
    sessions.filter((session) => session.analysis),
    7,
    (session) => session.analysis?.rating ?? 0,
  );
  const exerciseSeries = lastValues(logs, 7, (log) => log.effort);
  const hasChartData = interviewSeries.length > 1 || exerciseSeries.length > 1;

  const tests = [
    { id: TEST_EXHALE_CONTROL, label: 'Kontrollü veriş süresi', unit: 's', decimals: 1, improvement: 'higher' as const },
    { id: TEST_BREATHING_RATE, label: 'Dinlenik solunum hızı', unit: 'nefes/dk', decimals: 0, improvement: 'none' as const },
    { id: TEST_READING_WPM, label: 'Okuma hızı', unit: 'kelime/dk', decimals: 0, improvement: 'higher' as const },
  ].map((test) => ({ ...test, history: testHistory(progress, test.id) }))
    .filter((test) => test.history.length > 0);

  return (
    <AppScreen
      tabBar
      header={
        <TabHeader
          icon={<TrendingUp size={24} color={toneColor('blue', t.isLight)} />}
          title="İlerleme"
          subtitle="Ne kadar yol aldın. Seriler, ölçümler ve geçmiş bir arada."
        />
      }
    >
      {/* Seriler — dört günlük pratik modülü */}
      <View className="mt-1">
        <SectionLabel>SERİLER</SectionLabel>
      </View>
      {activeModules.length > 0 ? (
        <Surface>
          {activeModules.map(([id, m], index) => (
            <View
              key={id}
              className={`flex-row items-center py-2.5 ${index > 0 ? `border-t ${t.dividerColor}` : ''}`}
            >
              <View
                className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${toneSoft('emerald', t.isLight)}`}
              >
                <Flame size={15} color={toneColor('emerald', t.isLight)} />
              </View>
              <Text className={`flex-1 text-[13px] font-semibold ${t.title}`}>
                {MODULE_LABELS[id]}
              </Text>
              <View className="items-end">
                <Text className={`text-[13px] font-bold ${toneText('emerald', t.isLight)}`}>
                  {m.streak} gün
                </Text>
                <Text className={`text-[10px] ${t.muted}`}>
                  en iyi {m.bestStreak} · {m.totalSessions} oturum
                </Text>
              </View>
            </View>
          ))}
        </Surface>
      ) : (
        <EmptyState message="Henüz tamamlanmış bir günlük pratik yok. Bugün sekmesinden başlayabilirsin." />
      )}

      {/* Ölçümler — testler kayıt üretmeye başlayınca görünür */}
      {tests.length > 0 ? (
        <>
          <View className="mt-6">
            <SectionLabel>ÖLÇÜMLER</SectionLabel>
          </View>
          <View className="gap-2">
            {tests.map((test) => (
              <Surface key={test.id}>
                <Text className={`text-[12px] font-bold mb-2 ${t.title}`}>{test.label}</Text>
                <TestTrend
                  history={test.history}
                  unit={test.unit}
                  decimals={test.decimals}
                  improvement={test.improvement}
                />
              </Surface>
            ))}
          </View>
        </>
      ) : null}

      {/* Kariyer ve zihin — sayı kutuları */}
      <View className="mt-6">
        <SectionLabel>KARİYER VE ZİHİN</SectionLabel>
      </View>
      <View className="flex-row gap-3">
        <StatTile
          label="Mülakat"
          icon={<Award size={14} color={toneColor('blue', t.isLight)} />}
          tone="blue"
          value={interviews.averageRating}
          unit="/100 ort."
          hint={`${interviews.total} oturum`}
        />
        <StatTile
          label="Egzersiz"
          icon={<Cpu size={14} color={toneColor('violet', t.isLight)} />}
          tone="violet"
          value={exercises.totalMinutes}
          unit="dk"
          hint={`${exercises.total} antrenman`}
        />
      </View>

      {/* Gelişim eğrisi */}
      <View className="flex-row items-center justify-between mt-6 mb-3">
        <Text className={`text-[16px] font-bold ${t.title}`}>Gelişim Eğrisi</Text>
        <View className="flex-row items-center">
          <LegendDot color={toneColor('blue', t.isLight)} label="Mülakat" />
          <View className="w-3" />
          <LegendDot color={toneColor('violet', t.isLight)} label="Egzersiz" />
        </View>
      </View>
      {hasChartData ? (
        <TrendChart
          height={140}
          maxValue={100}
          series={[
            ...(interviewSeries.length > 1
              ? [{ color: toneColor('blue', t.isLight), values: interviewSeries, fill: true }]
              : []),
            ...(exerciseSeries.length > 1
              ? [{ color: toneColor('violet', t.isLight), values: exerciseSeries, fill: true }]
              : []),
          ]}
        />
      ) : (
        <Surface>
          <Text className={`text-[11px] leading-5 ${t.muted}`}>
            Eğrinin oluşması için en az iki mülakat ya da iki egzersiz kaydı gerekiyor.
          </Text>
        </Surface>
      )}

      {/* Geçmiş */}
      <View className="mt-6">
        <SectionLabel>GEÇMİŞ</SectionLabel>
      </View>
      <View className="gap-2">
        <ActionRow
          icon={<Award size={18} color={toneColor('blue', t.isLight)} />}
          tone="blue"
          title="Mülakat Geçmişi"
          subtitle="Kayıtlar, puanlar ve değerlendirmeler"
          onPress={() => navigation.navigate('InterviewHistory')}
        />
        <ActionRow
          icon={<Cpu size={18} color={toneColor('violet', t.isLight)} />}
          tone="violet"
          title="Egzersiz Geçmişi"
          subtitle="Bilişsel antrenman kayıtları"
          onPress={() => navigation.navigate('ExerciseHistory')}
        />
      </View>
    </AppScreen>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  const t = useThemeTokens();
  return (
    <View className="flex-row items-center">
      <View className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: color }} />
      <Text className={`text-[10px] font-bold ${t.muted}`}>{label}</Text>
    </View>
  );
}
