import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BookOpen, Minus, Plus, Timer, Award, Feather } from 'lucide-react-native';

import { Segmented, Toggle } from '../components/AppUI';
import {
  ScreenShell,
  Card,
  SectionTitle,
  PrimaryButton,
  GhostButton,
  Chip,
  SettingsButton,
  SettingRow,
  useThemeTokens,
} from '../components/practice/PracticeUI';
import { ModuleSettingsSheet } from '../components/practice/ModuleSettingsSheet';
import {
  CATEGORY_LABELS,
  availableTexts,
  pickDailyText,
  countWords,
  textSegments,
  type DailyText,
} from '../data/dailyTexts';
import { BRANCH_LABELS, findArt } from '../data/belagat';
import { useDailyPracticeSettings } from '../utils/dailyPracticeSettings';
import {
  TEST_READING_WPM,
  testHistory,
  useDailyProgress,
  type TestResult,
} from '../utils/dailyPracticeProgress';
import { TestTrend } from '../components/practice/TestTrend';
import { MeasureCard, MeasureScale, CountStepper } from '../components/practice/MeasureTests';
import { DailySozCard } from '../components/practice/DailyPracticeCard';
import { useDayKey } from '../utils/today';
import { findMeasureTest, TEST_BREATHS_PER_TEXT } from '../data/measureTests';
import { formatDuration } from '../utils/dateUtils';

// Günün okunacak metni.
// Metin "|" işaretlerinden bölünerek satır satır gösterilir; her satır bir nefes demektir.
// Metinde geçen belagat sanatları altta rozetler halinde listelenir ve dokununca açıklanır.

const FONT_SIZES = [16, 19, 22, 26] as const;

export default function DailyTextScreen({ navigation, route }: any) {
  const t = useThemeTokens();
  const { settings, updateModule } = useDailyPracticeSettings();
  const { progress, complete, logTest } = useDailyProgress();

  // Karnedeki "Ölç" düğmesi Hız & Tahlil sekmesini doğrudan açabilsin diye.
  const [activeTab, setActiveTab] = React.useState<'okuma' | 'tahlil'>(
    route?.params?.tab === 'hiz' ? 'tahlil' : 'okuma',
  );
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  // `day`: gün dönümünde günün metni tazelensin (Bölüm 7).
  const day = useDayKey();
  const dailyText = React.useMemo(() => pickDailyText(settings), [settings, day]);
  const pool = React.useMemo(() => availableTexts(settings), [settings]);

  const [selected, setSelected] = React.useState<DailyText | null>(null);
  const [fontIndex, setFontIndex] = React.useState(1);
  const [openArtId, setOpenArtId] = React.useState<string | null>(null);
  const [elapsed, setElapsed] = React.useState(0);
  const [reading, setReading] = React.useState(false);

  const text = selected ?? dailyText;
  const segments = React.useMemo(() => textSegments(text.text), [text.text]);
  const wordCount = React.useMemo(() => countWords(text.text), [text.text]);

  // Okuma hızı yalnızca sayaç durdurulduğunda ve makul bir süre geçmişse hesaplanır.
  // Çok kısa süre (yarıda kesilmiş okuma) anlamsız bir kelime/dk üretir.
  const wpm = !reading && elapsed >= 10 ? Math.round(wordCount / (elapsed / 60)) : null;
  const [savedWpm, setSavedWpm] = React.useState<number | null>(null);
  const fontSize = FONT_SIZES[fontIndex];
  const moduleProgress = progress.modules.dailyText;

  React.useEffect(() => {
    if (!reading) return;
    const startedAt = Date.now() - elapsed * 1000;
    const id = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 250);
    return () => clearInterval(id);
    // elapsed kasten bağımlılıkta değil: sayaç kendi içinde ilerliyor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reading]);

  const resetTimer = () => {
    setReading(false);
    setElapsed(0);
    setSavedWpm(null);
  };

  return (
    <ScreenShell
      title="Günün Metni"
      subtitle={`${CATEGORY_LABELS[text.category]} · yaklaşık ${text.approxSeconds} saniye`}
      onClose={() => navigation?.goBack?.()}
      right={<SettingsButton onPress={() => setSettingsOpen(true)} />}
      footer={
        activeTab === 'okuma' || reading ? (
          <View className="gap-2">
            <PrimaryButton
              label="Okudum, tamamla"
              onPress={() => {
                complete('dailyText');
                navigation?.goBack?.();
              }}
              tone="emerald"
            />
            {reading ? (
              <GhostButton label={`Sayacı durdur · ${formatDuration(elapsed)}`} onPress={() => setReading(false)} />
            ) : (
              <GhostButton
                label={elapsed > 0 ? `Sayaç: ${formatDuration(elapsed)} · sıfırla` : 'Okuma sayacını başlat'}
                onPress={() => (elapsed > 0 ? resetTimer() : setReading(true))}
              />
            )}
          </View>
        ) : null
      }
    >
      {/* 2 Sekmeli Okuma Mimarisi */}
      <View className="mt-1 mb-3">
        <Segmented<'okuma' | 'tahlil'>
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: 'okuma', label: 'Okuma', icon: <BookOpen size={14} color={t.iconColor} /> },
            {
              value: 'tahlil',
              label: 'Hız & Tahlil',
              icon: <Timer size={14} color={t.iconColor} />,
            },
          ]}
        />
      </View>

      {/* 📖 OKUMA SEKMESİ (Varsayılan) */}
      {activeTab === 'okuma' ? (
        <>
          {/* Günün duası + vecizesi tek kartta; kendi içinde dinî içerik
              şalterine bakıyor. Bugün sekmesiyle aynı bileşen — iki ekranda iki
              ayrı dua kutusu bakımı zorlaştırıyordu. */}
          <DailySozCard />

          {/* Yazı boyutu */}
          <View className="flex-row items-center justify-between mt-4">
            <Text className={`text-[11px] font-bold uppercase tracking-widest ${t.muted}`}>
              Yazı Boyutu
            </Text>
            <View className="flex-row items-center">
              <Pressable
                onPress={() => setFontIndex((i) => Math.max(0, i - 1))}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Yazıyı küçült"
                className={`w-8 h-8 rounded-lg items-center justify-center border ${t.cardBorder}`}
              >
                <Minus size={14} color={t.iconColor} />
              </Pressable>
              <Text className={`text-[11px] font-bold mx-3 ${t.title}`}>{fontSize}</Text>
              <Pressable
                onPress={() => setFontIndex((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Yazıyı büyüt"
                className={`w-8 h-8 rounded-lg items-center justify-center border ${t.cardBorder}`}
              >
                <Plus size={14} color={t.iconColor} />
              </Pressable>
            </View>
          </View>

          {/* Metin */}
          <Card className="mt-3">
            <Text className={`text-[11px] font-bold uppercase tracking-widest ${t.muted}`}>
              {CATEGORY_LABELS[text.category]}
            </Text>
            <Text className={`text-[18px] font-black mt-1 ${t.title}`}>{text.title}</Text>
            <Text className={`text-[11px] mt-0.5 ${t.muted}`}>{text.source}</Text>

            <View className={`mt-4 pt-4 border-t ${t.dividerColor}`}>
              {segments.map((segment, index) => (
                <View key={`${segment}-${index}`} className="flex-row mb-3">
                  <Text
                    className={`font-bold mr-3 ${t.muted}`}
                    style={{ fontSize: fontSize * 0.7, lineHeight: fontSize * 1.6 }}
                  >
                    {index + 1}
                  </Text>
                  <Text
                    className={`flex-1 font-semibold ${t.title}`}
                    style={{ fontSize, lineHeight: fontSize * 1.6 }}
                  >
                    {segment}
                  </Text>
                </View>
              ))}
            </View>
            <Text className={`text-[11px] mt-1 ${t.muted}`}>
              Her satır bir nefes. Satır sonlarında bir saniye durun. · {wordCount} kelime
            </Text>
          </Card>
        </>
      ) : (
        <>
          {/* Okuma hızı — alttaki sayaç durdurulduğunda hesaplanır. */}
          <SectionTitle hint="Metni sesli okurken alttaki sayacı çalıştırın; durdurduğunuzda hızınız hesaplanır.">
            Okuma Hızı
          </SectionTitle>
          <Card>
            {wpm === null ? (
              <Text className={`text-[12px] leading-5 ${t.muted}`}>
                {reading
                  ? `Sayaç işliyor · ${formatDuration(elapsed)}. Metni sonuna kadar okuyup durdurun.`
                  : 'Sayacı başlatıp metni sesli okuyun. En az 10 saniye okumadan hız hesaplanmaz.'}
              </Text>
            ) : (
              <>
                <View className="flex-row items-end">
                  <Text className={`text-[30px] font-black ${t.title}`}>{wpm}</Text>
                  <Text className={`text-[12px] mb-1.5 ml-1.5 ${t.muted}`}>kelime/dakika</Text>
                </View>
                <Text className={`text-[11px] mt-1 ${t.muted}`}>
                  {wordCount} kelime · {formatDuration(elapsed)}
                </Text>

                <MeasureScale
                  test={findMeasureTest(TEST_READING_WPM)!}
                  value={wpm}
                  history={testHistory(progress, TEST_READING_WPM)}
                />

                <View className="mt-3">
                  {savedWpm === wpm ? (
                    <Text className={`text-[12px] font-bold ${t.accent}`}>Kaydedildi.</Text>
                  ) : (
                    <PrimaryButton
                      label="Bu ölçümü kaydet"
                      onPress={() => {
                        logTest(TEST_READING_WPM, wpm);
                        setSavedWpm(wpm);
                      }}
                    />
                  )}
                </View>
              </>
            )}

            <TestTrend
              history={testHistory(progress, TEST_READING_WPM)}
              unit="kelime/dk"
              decimals={0}
              improvement="none"
            />

            <Text className={`text-[11px] mt-3 leading-4 ${t.muted}`}>
              Sunum ve sesli okuma için tipik aralık 120-150 kelime/dakika. Hızlı konuşmak akıcılık
              değil; çoğu zaman gerginlik göstergesi. Amaç yükseltmek değil, kendi aralığını bilmek.
            </Text>
          </Card>

          {/* Nefes / metin oranı — `key={text.id}` metin değişince sayacı sıfırlar,
              çünkü aynı metinle karşılaştırmak dışında sayı anlamsızlaşır. */}
          <BreathsPerTextMeasure
            key={text.id}
            history={testHistory(progress, TEST_BREATHS_PER_TEXT)}
            onSave={(value) => logTest(TEST_BREATHS_PER_TEXT, value)}
            hint={`${text.title} · ${wordCount} kelime`}
          />

          {/* Anlam */}
          {text.meaning ? (
            <>
              <SectionTitle>Metnin Anlamı</SectionTitle>
              <Card>
                <Text className={`text-[12px] leading-6 ${t.body}`}>{text.meaning}</Text>
              </Card>
            </>
          ) : null}

          {/* Okuma odağı */}
          <SectionTitle>Okurken Dikkat Et</SectionTitle>
          <Card>
            <View className="flex-row">
              <Timer size={16} color={t.isLight ? '#2563eb' : '#60a5fa'} />
              <Text className={`text-[12px] ml-2 flex-1 leading-5 ${t.body}`}>{text.readingFocus}</Text>
            </View>
          </Card>

          {/* Metindeki belagat sanatları */}
          {text.belagatArtIds.length > 0 ? (
            <>
              <SectionTitle hint="Bu metinde geçen sanatlar. Dokununca tanımı açılır.">
                Metindeki Belagat Sanatları
              </SectionTitle>
              <View className="flex-row flex-wrap">
                {text.belagatArtIds.map((artId) => {
                  const art = findArt(artId);
                  const label = art ? art.name : artId;
                  return (
                    <Chip
                      key={artId}
                      label={label}
                      tone="emerald"
                      selected={openArtId === artId}
                      onPress={() => setOpenArtId(openArtId === artId ? null : artId)}
                    />
                  );
                })}
              </View>
              {openArtId ? <ArtDetail artId={openArtId} /> : null}
            </>
          ) : null}

          {/* Diğer metinler ve Kaynak Filtresi */}
          <SectionTitle hint="Metin kaynağını değiştirebilir veya aşağıdaki listeden başka bir metin seçebilirsiniz.">
            Metin Kaynağı & Havuz ({pool.length} metin)
          </SectionTitle>
          <View className="flex-row flex-wrap mb-3">
            {(
              [
                { value: 'karisik', label: 'Karışık' },
                { value: 'dini', label: 'Dinî' },
                { value: 'edebi', label: 'Edebî' },
                { value: 'hitabet', label: 'Hitabet' },
                { value: 'felsefi', label: 'Felsefî' },
              ] as const
            ).map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                tone="emerald"
                selected={settings.dailyText.source === option.value}
                onPress={() => updateModule('dailyText', { source: option.value })}
              />
            ))}
          </View>
          {pool.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => {
                setSelected(option);
                setOpenArtId(null);
                resetTimer();
                setActiveTab('okuma');
              }}
              accessibilityRole="button"
              accessibilityLabel={option.title}
              accessibilityState={{ selected: option.id === selected?.id }}
              className="mb-2"
            >
              <Card>
                <View className="flex-row items-center">
                  <View className="flex-1 pr-2">
                    <Text className={`text-[13px] font-bold ${t.title}`}>{option.title}</Text>
                    <Text className={`text-[11px] mt-0.5 ${t.muted}`}>
                      {CATEGORY_LABELS[option.category]} · {option.source}
                    </Text>
                  </View>
                  {option.id === text.id ? (
                    <View className={`px-2 py-1 rounded-full ${t.isLight ? 'bg-emerald-100' : 'bg-emerald-900'}`}>
                      <Text
                        className={`text-[10px] font-bold ${t.isLight ? 'text-emerald-700' : 'text-emerald-300'}`}
                      >
                        açık
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Card>
            </Pressable>
          ))}

          {/* Seri */}
          <Card className="mt-3 mb-2">
            <View className="flex-row items-center">
              <Award size={16} color={t.isLight ? '#059669' : '#34d399'} />
              <Text className={`text-[12px] font-bold ml-2 ${t.title}`}>
                {moduleProgress.streak} günlük okuma serisi
              </Text>
              <Text className={`text-[11px] ml-auto ${t.muted}`}>
                Toplam: {moduleProgress.totalSessions}
              </Text>
            </View>
          </Card>
        </>
      )}

      <ModuleSettingsSheet module="dailyText" visible={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <SettingRow
          title="Metin kaynağı"
          description={
            settings.religiousMode
              ? 'Dinî, edebî ve hitabet metinleri.'
              : 'Dinî içerik kapalı olduğu için dinî metinler listelenmez.'
          }
          right={<View />}
        />
        <View className="flex-row flex-wrap">
          {(
            [
              { value: 'karisik', label: 'Karışık' },
              { value: 'dini', label: 'Dinî' },
              { value: 'edebi', label: 'Edebî' },
              { value: 'hitabet', label: 'Hitabet' },
              { value: 'felsefi', label: 'Felsefî' },
            ] as const
          ).map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              tone="emerald"
              selected={settings.dailyText.source === option.value}
              onPress={() => updateModule('dailyText', { source: option.value })}
            />
          ))}
        </View>
        <View className={`border-t ${t.dividerColor}`}>
          <SettingRow
            title="Ana ekranda göster"
            description="Bugün sekmesinde günün metni kartı görünsün."
            right={
              <Toggle
                value={settings.dailyText.showOnHome}
                onValueChange={(v) => updateModule('dailyText', { showOnHome: v })}
              />
            }
          />
        </View>
      </ModuleSettingsSheet>
    </ScreenShell>
  );
}

/**
 * Nefes / metin oranı ölçümü — günün metnini kaç nefeste okuduğunu sayar
 * (Bölüm 5). Metin değişince (bkz. yukarıdaki `key={text.id}`) yeniden monte
 * olur ve sayaç sıfırlanır; aksi hâlde bir metnin sayısı başka metne taşınır.
 */
function BreathsPerTextMeasure({
  history,
  onSave,
  hint,
}: {
  history: TestResult[];
  onSave: (breaths: number) => void;
  hint: string;
}) {
  const [breaths, setBreaths] = React.useState(0);

  return (
    <MeasureCard
      test={findMeasureTest(TEST_BREATHS_PER_TEXT)!}
      history={history}
      value={breaths > 0 ? breaths : null}
      onSave={onSave}
      hint={hint}
      startLabel="Ölçüme başla"
      startHint="Metni sesli okumaya başla; her nefes alışında sayacı bir artır."
    >
      <CountStepper value={breaths} onChange={setBreaths} unit="nefes" min={0} max={100} />
    </MeasureCard>
  );
}

function ArtDetail({ artId }: { artId: string }) {
  const t = useThemeTokens();
  const art = findArt(artId);

  if (!art) {
    // Metin, fesahat kusuru gibi sanat listesinde olmayan bir id'ye işaret ediyorsa sessizce geç.
    return null;
  }

  return (
    <Card className="mt-1">
      <View className="flex-row items-center mb-2">
        <Feather size={14} color={t.isLight ? '#059669' : '#34d399'} />
        <Text className={`text-[10px] font-bold uppercase tracking-widest ml-2 ${t.muted}`}>
          {BRANCH_LABELS[art.branch]}
        </Text>
      </View>
      <Text className={`text-[14px] font-bold ${t.title}`}>{art.name}</Text>
      <Text className={`text-[12px] mt-1.5 leading-5 ${t.body}`}>{art.definition}</Text>
      <Text className={`text-[11px] mt-2 italic ${t.accent}`}>{art.practicalUse}</Text>
    </Card>
  );
}
