import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { TrendingUp, Cpu, Flame, ChartColumn, NotebookPen } from 'lucide-react-native';

import {
  AppScreen,
  TabHeader,
  Surface,
  SectionLabel,
  StatTile,
  toneColor,
  toneSoft,
  toneText,
  type Tone,
} from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { TrendChart } from '../components/TrendChart';
import { testHistory, useDailyProgress, type PracticeModule } from '../utils/dailyPracticeProgress';
import { exerciseStats, useExerciseLogs } from '../utils/exerciseHistory';
import { MEASURE_TESTS } from '../data/measureTests';
import {
  useComprehension,
  accuracyFor,
  accuracyBySkill,
} from '../utils/comprehensionProgress';
import { useComm, completedScenarioCount } from '../utils/commProgress';
import { QUIZ_SKILL_LABELS } from '../data/quiz';
import { COMM_SCENARIOS } from '../data/communication';

// İlerleme sekmesi — uygulamanın ölçtüğü **her şey**.
//
// Ayrımı net tutmak için: Gelişim = ne çalışacağım, **İlerleme = ne kadar yol
// aldım**. İki sekmenin adı anlamca yakın olduğu için alt başlıklar bunu açıkça
// söylüyor.
//
// DÜZEN (2026-09-18'de sadeleştirildi): ekran üç bölüme indi — Özet, Seriler,
// Kayıtlar — ve gelişim eğrisi yalnızca verisi varken çiziliyor.
// Önceki hâlin iki sorunu vardı:
//   1. Beş seri kartı iki sütunlu ızgaraya diziliyordu; tek sayı olduğu için
//      sonuncusu yarım satırda yalnız kalıyor, sayfa "yamuk" duruyordu.
//      Artık tek bir kartın içinde eşit satırlar hâlinde.
//   2. Aynı ekranda üç ayrı kart biçimi vardı (ızgara kutusu, geçmiş kartı,
//      karne kartı). Hepsi tek bir satır biçimine indi.
//
// "Kayıtlar" ikişerli ızgarada (`RecordGrid`). Yukarıdaki 1. maddedeki "yamuk"
// sorunu burada yok: giriş sayısı tek kalırsa boş dolgu ekleniyor.

const MODULE_LABELS: Record<PracticeModule, string> = {
  dailyText: 'Günün metni',
  diaphragm: 'Diyafram nefesi',
  speech: 'Konuşma egzersizi',
  belagat: 'Belagat',
  lugat: 'Günün kelimeleri',
  comprehension: 'Anlayış & kavrayış',
  communication: 'İletişim',
};

/**
 * Anlayış & kavrayış doğruluğu ve iletişim ilerlemesi.
 *
 * ⚠️ İki ayrı ölçüm mantığı var ve kasıtlı olarak farklı sunuluyor
 * (KARARLAR → "Ölçüm skalası norm uydurmaz", YAPILACAKLAR_FESAHAT Bölüm 4):
 *  - Anlayış/kavrayış sorularının tek doğru cevabı var → **doğruluk yüzdesi**
 *    gösterilir, ama bu kişinin kendi geçmişidir; nüfus normu ya da "seviye"
 *    iddiası yok. Kayıt yoksa yüzde HİÇ gösterilmez (sıfır yazmak yanıltıcı).
 *  - İletişim senaryolarının tek doğru cevabı yok → yalnızca **tamamlanma**
 *    sayılır, yüzde başarı olarak sunulmaz.
 */
function ComprehensionSection() {
  const t = useThemeTokens();
  const comprehension = useComprehension();
  const comm = useComm();

  const overall = accuracyFor(comprehension);
  const skills = accuracyBySkill(comprehension).slice(0, 4);
  const completedScenarios = completedScenarioCount(comm);
  const summaryCount = comprehension.summaryAttempts.length;

  const hasAnything =
    overall !== null || completedScenarios > 0 || summaryCount > 0;
  if (!hasAnything) return null;

  return (
    <>
      <SectionLabel>ANLAYIŞ & İLETİŞİM</SectionLabel>
      <Surface>
        {overall !== null ? (
          <View className="flex-row items-center justify-between">
            <Text className={`text-[12px] ${t.body}`}>Soru doğruluğu (kendi geçmişin)</Text>
            <Text className={`text-[13px] font-bold ${t.title}`}>%{overall}</Text>
          </View>
        ) : null}

        {skills.length > 0 ? (
          <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
            <Text className={`text-[10px] font-bold tracking-widest mb-2 ${t.muted}`}>
              EN ÇOK ÇALIŞILACAK BECERİLER
            </Text>
            {skills.map((entry) => (
              <View key={entry.skill} className="flex-row items-center justify-between mt-1.5">
                <Text className={`text-[12px] flex-1 pr-2 ${t.body}`} numberOfLines={1}>
                  {QUIZ_SKILL_LABELS[entry.skill]}
                </Text>
                <Text className={`text-[11px] ${t.muted}`}>
                  {entry.correct}/{entry.total} · %{entry.percent}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {summaryCount > 0 ? (
          <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
            <View className="flex-row items-center justify-between">
              <Text className={`text-[12px] ${t.body}`}>Özetleme alıştırması</Text>
              <Text className={`text-[13px] font-bold ${t.title}`}>{summaryCount}</Text>
            </View>
            <Text className={`text-[10px] mt-1 ${t.muted}`}>
              Öz-değerlendirme — doğruluk olarak sayılmaz.
            </Text>
          </View>
        ) : null}

        {completedScenarios > 0 ? (
          <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
            <View className="flex-row items-center justify-between">
              <Text className={`text-[12px] ${t.body}`}>Tamamlanan iletişim senaryosu</Text>
              <Text className={`text-[13px] font-bold ${t.title}`}>
                {completedScenarios}/{COMM_SCENARIOS.length}
              </Text>
            </View>
            <Text className={`text-[10px] mt-1 ${t.muted}`}>
              Senaryolarda tek doğru cevap yok; başarı yüzdesi tutulmaz.
            </Text>
          </View>
        ) : null}
      </Surface>
    </>
  );
}

/** Grafiğe beslenecek son N kaydı eskiden yeniye sıralar. */
function lastValues<T>(items: T[], take: number, pick: (item: T) => number): number[] {
  return items.slice(0, take).reverse().map(pick);
}

export default function ProgressScreen({ navigation }: any) {
  const t = useThemeTokens();
  const { progress } = useDailyProgress();
  const logs = useExerciseLogs();

  const exercises = exerciseStats(logs);

  const modules = Object.entries(progress.modules) as [
    PracticeModule,
    { streak: number; bestStreak: number; totalSessions: number },
  ][];

  // Başlanmamış modüller satır olarak yer kaplamıyor; adları tek satırda
  // özetleniyor (2026-09-19). Eskiden beşi de listeleniyordu ve çoğu "0 gün"
  // yazan, bilgi vermeyen satırlardı.
  const started = modules.filter(([, m]) => m.totalSessions > 0);
  const notStarted = modules.filter(([, m]) => m.totalSessions === 0);

  const exerciseSeries = lastValues(logs, 7, (log) => log.effort);
  const hasChartData = exerciseSeries.length > 1;

  // Ölçümler satırının alt yazısı: kaç testte en az bir ölçüm var.
  const measuredCount = MEASURE_TESTS.filter(
    (test) => testHistory(progress, test.id).length > 0,
  ).length;

  return (
    <AppScreen
      tabBar
      header={
        <TabHeader
          icon={<TrendingUp size={24} color={toneColor('blue', t.isLight)} />}
          title="Karne"
          subtitle="Ne kadar yol aldın. Seriler, ölçümler ve geçmiş bir arada."
        />
      }
    >
      <View className="-mt-5">
        <SectionLabel>ÖZET</SectionLabel>
      </View>
      <View className="flex-row gap-2.5">
        {/* `compact`: tasarım aynı, kutular alçaldı — ekran kalabalık geliyordu. */}
        <StatTile
          compact
          label="Egzersiz"
          icon={<Cpu size={14} color={toneColor('violet', t.isLight)} />}
          tone="violet"
          value={exercises.totalMinutes}
          unit="dk"
          hint={`${exercises.total} antrenman`}
        />
      </View>

      <SectionLabel>SERİLER</SectionLabel>
      <Surface>
        {started.map(([id, m], index) => (
          <StreakRow
            key={id}
            label={MODULE_LABELS[id]}
            streak={m.streak}
            bestStreak={m.bestStreak}
            first={index === 0}
          />
        ))}
        {notStarted.length > 0 ? (
          <Text
            className={`text-[11px] leading-4 ${t.muted} ${
              started.length > 0 ? `mt-3 pt-3 border-t ${t.dividerColor}` : ''
            }`}
          >
            Henüz başlanmadı: {notStarted.map(([id]) => MODULE_LABELS[id]).join(' · ')}
          </Text>
        ) : null}
      </Surface>

      <ComprehensionSection />

      <SectionLabel>KAYITLAR</SectionLabel>
      <RecordGrid
        items={[
          {
            key: 'karne',
            icon: <ChartColumn size={16} color={toneColor('emerald', t.isLight)} />,
            tone: 'emerald',
            title: 'Ölçümler',
            subtitle: `${measuredCount}/${MEASURE_TESTS.length} ölçüm`,
            label: `Ölçümler. Bütün ölçümler; ${MEASURE_TESTS.length} testin ${measuredCount} tanesinde ölçümün var.`,
            onPress: () => navigation.navigate('Measurements'),
          },
          {
            key: 'egzersiz',
            icon: <Cpu size={16} color={toneColor('violet', t.isLight)} />,
            tone: 'violet',
            title: 'Egzersiz',
            subtitle: 'Zihin ve nefes',
            label: 'Egzersiz geçmişi. Zihin ve nefes kayıtları.',
            onPress: () => navigation.navigate('ExerciseHistory'),
          },
          {
            key: 'yanit',
            icon: <NotebookPen size={16} color={toneColor('amber', t.isLight)} />,
            tone: 'amber',
            title: 'Yanıt defteri',
            subtitle: 'Yazdıkların',
            label: 'Yanıt defteri. Yazdıkların ve verdiğin cevaplar.',
            onPress: () => navigation.navigate('ResponseJournal'),
          },
        ]}
      />

      {/* Eğri yalnızca çizilebiliyorsa görünüyor: veri yokken "veri yok" kartı
          koymak ekranı bir şey söylemeyen bir kutuyla uzatıyordu. */}
      {hasChartData ? (
        <>
          <SectionLabel>GELİŞİM EĞRİSİ</SectionLabel>
          <Surface>
            <View className="flex-row items-center justify-end mb-2">
              <LegendDot color={toneColor('violet', t.isLight)} label="Egzersiz" />
            </View>
            <TrendChart
              height={115}
              maxValue={100}
              series={[
                ...(exerciseSeries.length > 1
                  ? [{ color: toneColor('violet', t.isLight), values: exerciseSeries, fill: true }]
                  : []),
              ]}
            />
          </Surface>
        </>
      ) : null}
    </AppScreen>
  );
}

/** Seriler kartındaki tek satır: modül adı, güncel seri ve en iyi seri. */
function StreakRow({
  label,
  streak,
  bestStreak,
  first,
}: {
  label: string;
  streak: number;
  bestStreak: number;
  first: boolean;
}) {
  const t = useThemeTokens();

  // `active` ayrımı kalktı: artık yalnızca başlanmış modüller satır oluyor,
  // başlanmamışlar kartın altında adlarıyla özetleniyor.
  return (
    <View
      className={`flex-row items-center ${first ? '' : `mt-3 pt-3 border-t ${t.dividerColor}`}`}
    >
      <View
        className={`w-8 h-8 rounded-xl items-center justify-center mr-3 ${toneSoft('emerald', t.isLight)}`}
      >
        <Flame size={15} color={toneColor('emerald', t.isLight)} />
      </View>
      <Text className={`flex-1 text-[13px] font-semibold ${t.title}`} numberOfLines={1}>
        {label}
      </Text>
      {bestStreak > 0 ? (
        <Text className={`text-[11px] mr-3 ${t.muted}`}>en iyi {bestStreak}</Text>
      ) : null}
      <Text className={`text-[13px] font-bold ${toneText('emerald', t.isLight)}`}>
        {streak} gün
      </Text>
    </View>
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

/**
 * "Kayıtlar" girişlerinin ikişerli ızgarası.
 *
 * Girişler alt alta dizilince ekranın büyük kısmını kaplıyordu; ikişerli
 * dizilince hepsi tek bakışta görünüyor. Hücreler
 * `flex-1` ile eşit bölünüyor, satırlar ayrı ayrı sarılıyor — `flex-wrap` +
 * yüzde genişlik yerine bu, yazı tipi ölçeği büyüdüğünde de hizayı koruyor.
 *
 * Tek sayıda giriş kalırsa son hücre tüm satırı kaplamasın diye boş bir
 * dolgu ekleniyor.
 */
type RecordItem = {
  key: string;
  icon: React.ReactNode;
  tone: Tone;
  title: string;
  subtitle: string;
  /** Ekran okuyucu için uzun hâli — kart üstünde başlık ve alt satır kısaltılmış. */
  label: string;
  onPress: () => void;
};

function RecordGrid({ items }: { items: RecordItem[] }) {
  const rows: RecordItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <View className="gap-2">
      {rows.map((row) => (
        <View key={row[0].key} className="flex-row gap-2">
          {row.map((item) => (
            <View key={item.key} className="flex-1">
              <RecordTile item={item} />
            </View>
          ))}
          {row.length === 1 ? <View className="flex-1" /> : null}
        </View>
      ))}
    </View>
  );
}

/**
 * Hücre içi YATAY: ikon solda, iki satır yazı sağında.
 *
 * Önce ikon üstte / yazı altında dikey bir kart denendi ve iki satır ızgara
 * ~220 px tutuyordu — listeden az, ama hâlâ ekranın önemli bir kısmı. Yatay
 * düzende aynı bilgi hücre başına ~56 px'e iniyor, çünkü ikonun yüksekliği
 * yazıyla üst üste biniyor, arka arkaya eklenmiyor.
 */
function RecordTile({ item }: { item: RecordItem }) {
  const t = useThemeTokens();
  return (
    <Pressable
      onPress={item.onPress}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      className={`flex-row items-center rounded-2xl p-3 ${t.cardBg}`}
    >
      <View
        className={`w-8 h-8 rounded-xl items-center justify-center ${toneSoft(item.tone, t.isLight)}`}
      >
        {item.icon}
      </View>
      <View className="flex-1 ml-2.5">
        <Text className={`text-[12px] font-bold ${t.title}`} numberOfLines={1}>
          {item.title}
        </Text>
        <Text className={`text-[10px] mt-0.5 ${t.muted}`} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
