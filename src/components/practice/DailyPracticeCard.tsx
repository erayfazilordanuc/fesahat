import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Wind, Mic, Feather, BookOpen, Check, ChevronRight } from 'lucide-react-native';

import { Card, ProgressBar, useThemeTokens } from './PracticeUI';
import { useDailyPracticeSettings } from '../../utils/dailyPracticeSettings';
import {
  isCompletedToday,
  useDailyProgress,
  type PracticeModule,
} from '../../utils/dailyPracticeProgress';
import { getBreathingProgram } from '../../data/breathingPrograms';
import { pickDailyDrill } from '../../data/dictionDrills';
import { pickDailyBelagatArt } from '../../data/belagat';
import { pickDailyPrayer, pickDailyText } from '../../data/dailyTexts';
import { formatTime } from '../../utils/dateUtils';

// Ana ekran (Mülakat sekmesi) kartları.
// Yalnızca ayarlarda açık olan modüller görünür; hepsi kapalıysa kart hiç render edilmez.

type Row = {
  module: PracticeModule;
  screen: string;
  title: string;
  detail: string;
  time: string;
  icon: React.ReactNode;
};

export function DailyPracticeCard({ navigation }: { navigation?: any }) {
  const t = useThemeTokens();
  const { settings } = useDailyPracticeSettings();
  const { progress } = useDailyProgress();

  const rows = React.useMemo<Row[]>(() => {
    const iconColor = t.isLight ? '#475569' : '#cbd5e1';
    const list: Row[] = [];

    if (settings.dailyText.enabled && settings.dailyText.showOnHome) {
      const text = pickDailyText(settings);
      list.push({
        module: 'dailyText',
        screen: 'DailyText',
        title: 'Günün metni',
        detail: `${text.title} · ${text.source}`,
        time: formatTime(settings.dailyText.time.hour, settings.dailyText.time.minute),
        icon: <BookOpen size={18} color={iconColor} />,
      });
    }

    if (settings.diaphragm.enabled) {
      const program = getBreathingProgram(settings.diaphragm.mode, settings.diaphragm.level);
      list.push({
        module: 'diaphragm',
        screen: 'DiaphragmExercise',
        title: 'Diyafram egzersizi',
        detail: `${program.title} · ${program.durationLabel}`,
        time: formatTime(settings.diaphragm.time.hour, settings.diaphragm.time.minute),
        icon: <Wind size={18} color={iconColor} />,
      });
    }

    if (settings.speech.enabled) {
      const drill = pickDailyDrill(settings.speech);
      list.push({
        module: 'speech',
        screen: 'SpeechExercise',
        title: 'Konuşma egzersizi',
        detail: drill.title,
        time: formatTime(settings.speech.time.hour, settings.speech.time.minute),
        icon: <Mic size={18} color={iconColor} />,
      });
    }

    if (settings.belagat.enabled) {
      const art = pickDailyBelagatArt(settings.belagat.branch);
      list.push({
        module: 'belagat',
        screen: 'BelagatExercise',
        title: 'Belagat',
        detail: art.name,
        time: formatTime(settings.belagat.time.hour, settings.belagat.time.minute),
        icon: <Feather size={18} color={iconColor} />,
      });
    }

    return list;
  }, [settings, t.isLight]);

  if (rows.length === 0) return null;

  const doneCount = rows.filter((row) => isCompletedToday(progress, row.module)).length;

  return (
    <Card className="mt-4" style={{paddingBottom: 6}}>
      <View className="flex-row items-center justify-between mb-1">
        <Text className={`text-[11px] font-bold uppercase tracking-widest ${t.muted}`}>
          Günlük Pratik
        </Text>
        <Text className={`text-[11px] font-bold ${doneCount === rows.length ? (t.isLight ? 'text-emerald-600' : 'text-emerald-400') : t.muted}`}>
          {doneCount}/{rows.length}
        </Text>
      </View>

      <View className="mt-2 mb-2">
        <ProgressBar value={rows.length === 0 ? 0 : doneCount / rows.length} tone="emerald" />
      </View>

      {rows.map((row, index) => {
        const done = isCompletedToday(progress, row.module);
        return (
          <Pressable
            key={row.module}
            onPress={() => navigation?.navigate?.(row.screen)}
            accessibilityRole="button"
            // Satırları çizgi değil boşluk ayırıyor: dört modülün arasına çizgi
            // çekmek listeyi tablo gibi gösteriyor ve kartı kalabalıklaştırıyordu.
            className={`flex-row items-center py-3.5 ${index > 0 ? 'mt-0.5' : ''}`}
          >
            <View
              className={`w-9 h-9 rounded-xl items-center justify-center ${
                done
                  ? t.isLight
                    ? 'bg-emerald-100'
                    : 'bg-emerald-900'
                  : t.isLight
                    ? 'bg-slate-100'
                    : 'bg-slate-800'
              }`}
            >
              {done ? <Check size={18} color={t.isLight ? '#059669' : '#34d399'} /> : row.icon}
            </View>
            <View className="flex-1 ml-3 pr-2">
              <Text
                className={`text-[13px] font-bold ${done ? t.muted : t.title}`}
                numberOfLines={1}
              >
                {row.title}
              </Text>
              <Text className={`text-[11px] mt-0.5 ${t.muted}`} numberOfLines={1}>
                {row.detail}
              </Text>
            </View>
            <Text className={`text-[11px] mr-1 ${t.muted}`}>{row.time}</Text>
            <ChevronRight size={16} color={t.iconColor} />
          </Pressable>
        );
      })}
    </Card>
  );
}

/**
 * Günün duası kartı — web sürümündeki "Günün Duası" bloğunun mobil karşılığı.
 * Yalnızca ayarlarda dinî içerik açıkken görünür.
 */
export function DailyPrayerCard({ navigation }: { navigation?: any }) {
  const t = useThemeTokens();
  const { settings } = useDailyPracticeSettings();
  const prayer = React.useMemo(() => pickDailyPrayer(), []);

  if (!settings.religiousMode) return null;

  const openDailyText = settings.dailyText.enabled
    ? () => navigation?.navigate?.('DailyText')
    : undefined;

  const Wrapper: any = openDailyText ? Pressable : View;

  return (
    <Wrapper onPress={openDailyText} className="mt-4">
      <View
        className={`rounded-2xl border p-4 items-center justify-center ${
          t.isLight
            ? 'bg-emerald-50/80 border-emerald-300'
            : 'bg-[#061e19] border-emerald-800/60'
        }`}
      >
        <Text
          className={`text-[12px] italic font-medium text-center leading-5 ${
            t.isLight ? 'text-emerald-800' : 'text-emerald-400'
          }`}
        >
          “{prayer.text}”
        </Text>
        {prayer.meaning ? (
          <Text
            className={`text-[11px] italic text-center mt-1 ${
              t.isLight ? 'text-emerald-700' : 'text-emerald-400/80'
            }`}
          >
            ({prayer.meaning})
          </Text>
        ) : null}
      </View>
    </Wrapper>
  );
}
