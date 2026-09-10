import React from 'react';
import { View, Text, Pressable } from 'react-native';
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
      <View className="-mt-5">
        <SectionLabel>SERİLER</SectionLabel>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {modules.map(([id, m]) => {
          const active = m.totalSessions > 0;
          return (
            <View
              key={id}
              className={`w-[48.5%] p-3 rounded-xl border flex-row items-center ${
                t.isLight ? 'bg-white border-slate-200/80' : 'bg-[#1e1e22] border-[#2e2e34]'
              }`}
            >
              <View
                className={`w-7 h-7 rounded-lg items-center justify-center mr-2.5 ${
                  active ? toneSoft('emerald', t.isLight) : t.isLight ? 'bg-slate-100' : 'bg-slate-800'
                }`}
              >
                <Flame
                  size={14}
                  color={active ? toneColor('emerald', t.isLight) : t.isLight ? '#94a3b8' : '#64748b'}
                />
              </View>
              <View className="flex-1">
                <Text className={`text-[12px] font-semibold ${t.title}`} numberOfLines={1}>
                  {MODULE_LABELS[id]}
                </Text>
                <View className="flex-row items-baseline justify-between mt-0.5">
                  <Text
                    className={`text-[11px] font-bold ${
                      active ? toneText('emerald', t.isLight) : t.muted
                    }`}
                  >
                    {m.streak} gün
                  </Text>
                  {active && m.bestStreak > 0 ? (
                    <Text className={`text-[9px] ${t.muted}`}>en iyi {m.bestStreak}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View className="mt-4">
        <SectionLabel>KARİYER VE ZİHİN</SectionLabel>
      </View>
      <View className="flex-row gap-2.5">
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

      <View className="mt-4">
        <SectionLabel>GEÇMİŞ</SectionLabel>
      </View>
      <View className="flex-row gap-2.5">
        <Pressable
          onPress={() => navigation.navigate('InterviewHistory')}
          className={`flex-1 p-3 rounded-xl border flex-row items-center ${
            t.isLight ? 'bg-white border-slate-200/80' : 'bg-[#1e1e22] border-[#2e2e34]'
          }`}
        >
          <View className={`w-8 h-8 rounded-lg items-center justify-center mr-2.5 ${toneSoft('blue', t.isLight)}`}>
            <Award size={16} color={toneColor('blue', t.isLight)} />
          </View>
          <View className="flex-1">
            <Text className={`text-[12px] font-bold ${t.title}`} numberOfLines={1}>
              Mülakat
            </Text>
            <Text className={`text-[10px] ${t.muted}`} numberOfLines={1}>
              Kayıtlar & puanlar
            </Text>
          </View>
          <ChevronRight size={14} color={t.isLight ? '#94a3b8' : '#64748b'} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('ExerciseHistory')}
          className={`flex-1 p-3 rounded-xl border flex-row items-center ${
            t.isLight ? 'bg-white border-slate-200/80' : 'bg-[#1e1e22] border-[#2e2e34]'
          }`}
        >
          <View className={`w-8 h-8 rounded-lg items-center justify-center mr-2.5 ${toneSoft('violet', t.isLight)}`}>
            <Cpu size={16} color={toneColor('violet', t.isLight)} />
          </View>
          <View className="flex-1">
            <Text className={`text-[12px] font-bold ${t.title}`} numberOfLines={1}>
              Egzersiz
            </Text>
            <Text className={`text-[10px] ${t.muted}`} numberOfLines={1}>
              Zihin kayıtları
            </Text>
          </View>
          <ChevronRight size={14} color={t.isLight ? '#94a3b8' : '#64748b'} />
        </Pressable>
      </View>

      {tests.length > 0 ? (
        <>
          <View className="mt-4">
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

      <View className="flex-row items-center justify-between mt-4 mb-2">
        <Text className={`text-[14px] font-bold ${t.title}`}>Gelişim Eğrisi</Text>
        <View className="flex-row items-center">
          <LegendDot color={toneColor('blue', t.isLight)} label="Mülakat" />
          <View className="w-3" />
          <LegendDot color={toneColor('violet', t.isLight)} label="Egzersiz" />
        </View>
      </View>
      {hasChartData ? (
        <TrendChart
          height={115}
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
