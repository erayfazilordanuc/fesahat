import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Mic, ChevronRight, Award, BookOpen, Plus, RotateCcw } from 'lucide-react-native';

import { Segmented, Toggle } from '../components/AppUI';
import {
  ScreenShell,
  Card,
  SectionTitle,
  PrimaryButton,
  GhostButton,
  Chip,
  ProgressBar,
  useThemeTokens,
} from '../components/practice/PracticeUI';
import {
  DRILL_KIND_LABELS,
  allDrills,
  availableDrills,
  buildDailySession,
  drillSeconds,
  type DictionDrill,
} from '../data/dictionDrills';
import { FESAHAT_FLAWS, pickDailyFesahatFlaw } from '../data/belagat';
import { useDailyPracticeSettings } from '../utils/dailyPracticeSettings';
import { useDailyProgress } from '../utils/dailyPracticeProgress';
import { formatDuration } from '../utils/dateUtils';

// Günlük konuşma (diksiyon) egzersizi.
// Günün seansı bir artikülasyon ısınması + havuzdan seçilen bir ana egzersizden oluşur.
// Ayarlarda tekerleme veya dolgu kelime avı kapatılmışsa o türler havuza hiç girmez.

export default function SpeechExerciseScreen({ navigation }: any) {
  const t = useThemeTokens();
  const { settings, updateModule } = useDailyPracticeSettings();
  const { progress, complete } = useDailyProgress();

  const [activeTab, setActiveTab] = React.useState<'alistirma' | 'fesahat'>('alistirma');

  const session = React.useMemo(() => buildDailySession(settings.speech), [settings.speech]);
  const pool = React.useMemo(() => availableDrills(settings.speech), [settings.speech]);

  const [drillIndex, setDrillIndex] = React.useState(0);
  const [itemIndex, setItemIndex] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [remaining, setRemaining] = React.useState(0);
  const [fillerCount, setFillerCount] = React.useState(0);
  /** Seans dışından seçilen egzersiz; null ise günün seansı oynatılıyor. */
  const [extraDrill, setExtraDrill] = React.useState<DictionDrill | null>(null);
  const [sessionDone, setSessionDone] = React.useState(false);

  const drill = extraDrill ?? session[drillIndex];
  const item = drill.items[itemIndex];
  const deadlineRef = React.useRef<number | null>(null);
  // Sayaç efektinin her tıkta yeniden kurulmaması için kalan süre ayrıca ref'te tutulur.
  const remainingRef = React.useRef(remaining);

  React.useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  const fesahatFlaw = React.useMemo(() => pickDailyFesahatFlaw(), []);

  // Egzersiz veya öğe değişince sayacı yeni süreye ayarla.
  React.useEffect(() => {
    setRemaining(drill.secondsPerItem);
    setRunning(false);
    deadlineRef.current = null;
  }, [drill.id, itemIndex, drill.secondsPerItem]);

  React.useEffect(() => {
    if (!running) return;
    if (deadlineRef.current === null) {
      deadlineRef.current = Date.now() + remainingRef.current * 1000;
    }
    const id = setInterval(() => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      const left = (deadline - Date.now()) / 1000;
      if (left > 0) {
        setRemaining(left);
      } else {
        clearInterval(id);
        deadlineRef.current = null;
        setRunning(false);
        setRemaining(0);
      }
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  const goNextItem = () => {
    if (itemIndex + 1 < drill.items.length) {
      setItemIndex(itemIndex + 1);
      return;
    }
    // Egzersiz bitti — seanstaysa sıradaki egzersize geç.
    if (!extraDrill && drillIndex + 1 < session.length) {
      setDrillIndex(drillIndex + 1);
      setItemIndex(0);
      return;
    }
    finishSession();
  };

  const goPrevItem = () => {
    if (itemIndex > 0) {
      setItemIndex(itemIndex - 1);
      return;
    }
    if (!extraDrill && drillIndex > 0) {
      const prev = session[drillIndex - 1];
      setDrillIndex(drillIndex - 1);
      setItemIndex(prev.items.length - 1);
    }
  };

  const finishSession = () => {
    setSessionDone(true);
    setRunning(false);
    deadlineRef.current = null;
    complete('speech');
  };

  const restart = () => {
    setExtraDrill(null);
    setDrillIndex(0);
    setItemIndex(0);
    setFillerCount(0);
    setSessionDone(false);
  };

  const openDrill = (next: DictionDrill) => {
    setExtraDrill(next);
    setItemIndex(0);
    setFillerCount(0);
    setSessionDone(false);
    setActiveTab('alistirma');
  };

  const totalItems = extraDrill
    ? extraDrill.items.length
    : session.reduce((sum, d) => sum + d.items.length, 0);
  const doneItems = extraDrill
    ? itemIndex
    : session.slice(0, drillIndex).reduce((sum, d) => sum + d.items.length, 0) + itemIndex;

  const moduleProgress = progress.modules.speech;
  const isLastItem =
    itemIndex + 1 >= drill.items.length && (extraDrill != null || drillIndex + 1 >= session.length);

  return (
    <ScreenShell
      title="Konuşma Egzersizi"
      subtitle={
        extraDrill
          ? `Serbest çalışma · ${DRILL_KIND_LABELS[drill.kind]}`
          : `Günün seansı · ${session.length} egzersiz · ${formatDuration(
              session.reduce((sum, d) => sum + drillSeconds(d), 0),
            )}`
      }
      onClose={() => navigation?.goBack?.()}
      footer={
        sessionDone ? (
          <View className="gap-2">
            <PrimaryButton label="Baştan Yap" onPress={restart} tone="violet" />
            <GhostButton label="Kapat" onPress={() => navigation?.goBack?.()} />
          </View>
        ) : activeTab === 'alistirma' ? (
          <View className="gap-2">
            {running ? (
              <PrimaryButton
                label={`Duraklat · ${Math.ceil(remaining)}s`}
                onPress={() => {
                  deadlineRef.current = null;
                  setRunning(false);
                }}
                tone="slate"
              />
            ) : (
              <PrimaryButton
                label={remaining <= 0 ? 'Tekrar Say' : `Sayacı Başlat · ${Math.ceil(remaining)}s`}
                onPress={() => {
                  if (remaining <= 0) setRemaining(drill.secondsPerItem);
                  deadlineRef.current = null;
                  setRunning(true);
                }}
                tone="violet"
              />
            )}
            <View className="flex-row gap-2">
              <View className="flex-1">
                <GhostButton
                  label="Geri"
                  onPress={goPrevItem}
                  disabled={itemIndex === 0 && (extraDrill != null || drillIndex === 0)}
                />
              </View>
              <View className="flex-1">
                <PrimaryButton
                  label={isLastItem ? 'Bitir' : 'Sıradaki'}
                  onPress={goNextItem}
                  tone="violet"
                />
              </View>
            </View>
          </View>
        ) : null
      }
    >
      {/* 2 Sekmeli Akış Mimarisi */}
      <View className="mt-1 mb-3">
        <Segmented<'alistirma' | 'fesahat'>
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: 'alistirma', label: '🎙️ Alıştırma' },
            { value: 'fesahat', label: '📚 Fesahat & Kitaplık' },
          ]}
        />
      </View>

      {sessionDone ? (
        <SessionSummary
          streak={moduleProgress.streak}
          bestStreak={moduleProgress.bestStreak}
          total={moduleProgress.totalSessions}
          fillerCount={settings.speech.includeFillerHunt ? fillerCount : null}
          onOpenDailyText={
            settings.dailyText.enabled ? () => navigation?.navigate?.('DailyText') : undefined
          }
        />
      ) : activeTab === 'alistirma' ? (
        <>
          {/* İlerleme */}
          <View className="mt-1 mb-4">
            <ProgressBar value={totalItems === 0 ? 0 : doneItems / totalItems} tone="violet" />
            <Text className={`text-[11px] mt-2 ${t.muted}`}>
              {doneItems + 1} / {totalItems} alıştırma
            </Text>
          </View>

          {/* O anki egzersiz */}
          <Card>
            <View className="flex-row items-center mb-2">
              <Mic size={16} color={t.isLight ? '#7c3aed' : '#a78bfa'} />
              <Text className={`text-[11px] font-bold uppercase tracking-widest ml-2 ${t.muted}`}>
                {DRILL_KIND_LABELS[drill.kind]}
              </Text>
            </View>
            <Text className={`text-[17px] font-bold ${t.title}`}>{drill.title}</Text>
            <Text className={`text-[11px] mt-1 ${t.muted}`}>Odak: {drill.focus}</Text>
            <Text className={`text-[12px] mt-3 leading-5 ${t.body}`}>{drill.instruction}</Text>
          </Card>

          {/* Okunacak metin */}
          <Card className="mt-3">
            <Text className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${t.muted}`}>
              Alıştırma {itemIndex + 1}/{drill.items.length}
            </Text>
            <Text className={`text-[18px] font-bold leading-7 ${t.title}`}>{item.text}</Text>
            {item.note ? (
              <Text className={`text-[11px] mt-3 italic ${t.accent}`}>{item.note}</Text>
            ) : null}
          </Card>

          {/* Dolgu kelime sayacı */}
          {drill.kind === 'dolguAvi' ? (
            <FillerCounter count={fillerCount} onIncrement={() => setFillerCount((c) => c + 1)} onReset={() => setFillerCount(0)} />
          ) : null}

          {/* Kendini değerlendirme */}
          <Card className="mt-3">
            <Text className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${t.muted}`}>
              Kendini Kontrol Et
            </Text>
            <Text className={`text-[12px] leading-5 ${t.body}`}>{drill.selfCheck}</Text>
          </Card>
        </>
      ) : (
        <>
          {/* Günün fesahat kusuru — belagat tarafıyla köprü */}
          <SectionTitle hint="Belâgatin önkoşulu fesahattir: sözün açık, anlaşılır ve söylenmesi kolay olması.">
            Günün Fesahat Kusuru
          </SectionTitle>
          <Card>
            <Text className={`text-[14px] font-bold ${t.title}`}>{fesahatFlaw.name}</Text>
            <Text className={`text-[11px] mt-1 ${t.muted}`}>{fesahatFlaw.shortDefinition}</Text>
            <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
              <Text className={`text-[11px] font-bold mb-1 ${t.isLight ? 'text-red-600' : 'text-red-400'}`}>
                Kusurlu
              </Text>
              <Text className={`text-[12px] leading-5 ${t.body}`}>{fesahatFlaw.badExample}</Text>
              <Text
                className={`text-[11px] font-bold mt-3 mb-1 ${t.isLight ? 'text-emerald-600' : 'text-emerald-400'}`}
              >
                Düzeltilmiş
              </Text>
              <Text className={`text-[12px] leading-5 ${t.body}`}>{fesahatFlaw.goodExample}</Text>
            </View>
            <Text className={`text-[11px] mt-3 italic ${t.accent}`}>{fesahatFlaw.interviewRisk}</Text>
            <Text className={`text-[11px] mt-2 ${t.muted}`}>
              Toplam {FESAHAT_FLAWS.length} kusur var; her gün biri gösterilir.
            </Text>
          </Card>

          {/* Konuşma Tercihleri */}
          <SectionTitle hint="Günün seansına girecek alıştırma türlerini buradan değiştirebilirsiniz.">
            Konuşma Tercihleri
          </SectionTitle>
          <Card>
            <View className="flex-row items-center justify-between py-1">
              <View className="flex-1 pr-3">
                <Text className={`text-[13px] font-bold ${t.title}`}>Tekerlemeler</Text>
                <Text className={`text-[11px] mt-0.5 ${t.muted}`}>Seans havuzunda tekerleme kartları yer alsın.</Text>
              </View>
              <Toggle
                value={settings.speech.includeTongueTwisters}
                onValueChange={(v) => updateModule('speech', { includeTongueTwisters: v })}
                tone="violet"
              />
            </View>
            <View className={`flex-row items-center justify-between pt-3 mt-3 border-t ${t.dividerColor}`}>
              <View className="flex-1 pr-3">
                <Text className={`text-[13px] font-bold ${t.title}`}>Dolgu Kelime Avı</Text>
                <Text className={`text-[11px] mt-0.5 ${t.muted}`}>"yani, şey, eee" temizliği sayacı dahil edilsin.</Text>
              </View>
              <Toggle
                value={settings.speech.includeFillerHunt}
                onValueChange={(v) => updateModule('speech', { includeFillerHunt: v })}
                tone="violet"
              />
            </View>
          </Card>

          {/* Diğer egzersizler */}
          <SectionTitle hint="Günün seansı dışında serbest çalışmak için seçin.">
            Tüm Egzersizler Kataloğu
          </SectionTitle>
          <View className="flex-row flex-wrap">
            {pool.map((d) => (
              <Chip
                key={d.id}
                label={d.title}
                tone="violet"
                selected={d.id === drill.id}
                onPress={() => openDrill(d)}
              />
            ))}
          </View>
          {pool.length < allDrills().length ? (
            <Text className={`text-[11px] mt-1 mb-2 ${t.muted}`}>
              Bazı egzersiz türleri ayarlardan kapatıldığı için listede yok.
            </Text>
          ) : null}
        </>
      )}
    </ScreenShell>
  );
}

/** Dolgu kelime avı için manuel sayaç. Kullanıcı her "yani/şey/eee" için dokunur. */
function FillerCounter({
  count,
  onIncrement,
  onReset,
}: {
  count: number;
  onIncrement: () => void;
  onReset: () => void;
}) {
  const t = useThemeTokens();
  return (
    <Card className="mt-3">
      <Text className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${t.muted}`}>
        Dolgu Sayacı
      </Text>
      <View className="flex-row items-center">
        <Pressable
          onPress={onIncrement}
          accessibilityRole="button"
          accessibilityLabel="Dolgu kelime sayacını artır"
          className={`flex-1 rounded-2xl py-5 items-center justify-center border-2 ${
            t.isLight ? 'bg-violet-50 border-violet-300' : 'bg-violet-950 border-violet-700'
          }`}
        >
          <Plus size={18} color={t.isLight ? '#7c3aed' : '#a78bfa'} />
          <Text className={`text-[32px] font-black mt-1 ${t.title}`}>{count}</Text>
          <Text className={`text-[11px] mt-1 ${t.muted}`}>her dolgu kelimede dokun</Text>
        </Pressable>
        <Pressable
          onPress={onReset}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Sayacı sıfırla"
          className={`w-12 h-12 ml-3 rounded-2xl items-center justify-center border ${t.cardBorder}`}
        >
          <RotateCcw size={18} color={t.iconColor} />
        </Pressable>
      </View>
      <Text className={`text-[11px] mt-3 leading-4 ${t.muted}`}>
        Hedef: 60 saniyede sıfır. Üç ve üzeri, mülakat analizinde fark edilir düzeydedir.
      </Text>
    </Card>
  );
}

function SessionSummary({
  streak,
  bestStreak,
  total,
  fillerCount,
  onOpenDailyText,
}: {
  streak: number;
  bestStreak: number;
  total: number;
  fillerCount: number | null;
  onOpenDailyText?: () => void;
}) {
  const t = useThemeTokens();
  return (
    <View className="mt-2">
      <Card>
        <View className="flex-row items-center">
          <Award size={18} color={t.isLight ? '#059669' : '#34d399'} />
          <Text className={`text-[16px] font-bold ml-2 ${t.title}`}>Seans tamamlandı</Text>
        </View>
        <Text className={`text-[12px] mt-2 leading-5 ${t.body}`}>
          {streak} günlük seri. En iyi serin {bestStreak} gün, toplam {total} seans.
        </Text>
        {fillerCount !== null ? (
          <Text className={`text-[12px] mt-2 ${t.body}`}>
            Bu seansta {fillerCount} dolgu kelime saydın.
          </Text>
        ) : null}
      </Card>

      {onOpenDailyText ? (
        <Pressable
          onPress={onOpenDailyText}
          accessibilityRole="button"
          accessibilityLabel="Günün metnini sesli oku"
          className="mt-3"
        >
          <Card>
            <View className="flex-row items-center">
              <BookOpen size={16} color={t.isLight ? '#059669' : '#34d399'} />
              <View className="flex-1 ml-2">
                <Text className={`text-[13px] font-bold ${t.title}`}>Günün metnini sesli oku</Text>
                <Text className={`text-[11px] mt-0.5 ${t.muted}`}>
                  Isınma bitti; şimdi gerçek bir metinde uygula.
                </Text>
              </View>
              <ChevronRight size={18} color={t.iconColor} />
            </View>
          </Card>
        </Pressable>
      ) : null}
    </View>
  );
}
