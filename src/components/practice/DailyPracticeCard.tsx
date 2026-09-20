import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Wind,
  Mic,
  Feather,
  BookOpen,
  BookOpenText,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

import { Card, ProgressBar, useThemeTokens } from './PracticeUI';
import { useDailyPracticeSettings } from '../../utils/dailyPracticeSettings';
import {
  isCompletedToday,
  useDailyProgress,
  type PracticeModule,
} from '../../utils/dailyPracticeProgress';
import { getBreathingProgram } from '../../data/breathingPrograms';
import { drillSeconds, pickDailyDrill } from '../../data/dictionDrills';
import { pickDailyBelagatArt } from '../../data/belagat';
import { pickDailyPrayer, pickDailyText } from '../../data/dailyTexts';
import { pickDailyVecize } from '../../data/risale';
import { useDayKey } from '../../utils/today';
import { lugatProgressStore, todaysWords } from '../../utils/lugatProgress';
import { formatTime } from '../../utils/dateUtils';
import { useOnboarding, moduleOrderForGoals } from '../../utils/onboarding';

// Ana ekran (Mülakat sekmesi) kartları.
// Yalnızca ayarlarda açık olan modüller görünür; hepsi kapalıysa kart hiç render edilmez.

type Row = {
  module: PracticeModule;
  screen: string;
  title: string;
  detail: string;
  time: string;
  icon: React.ReactNode;
  /** Kaba süre tahmini (dk) — bkz. `minutesFromSeconds` altındaki not. */
  minutes: number;
};

/**
 * Modül başına kaba süre tahmini (dakika) — Bugün listesini
 * `onboarding.dailyMinutes` bütçesine sığdırmak için kullanılıyor
 * (YAPILACAKLAR Bölüm 0.1 → "Günlük süre Bugün listesini ayarlasın").
 *
 * Diyafram, konuşma ve günün metni günün gerçekten seçilen içeriğinden
 * (nefes programının toplam saniyesi, tekerlemenin öğe × saniye'si, metnin
 * `approxSeconds` alanı) hesaplanıyor. Lügat ve belagatin veri kaynağında
 * süre alanı olmadığı için sabit bir tahmin kullanılıyor.
 */
const LUGAT_SECONDS_PER_WORD = 25; // kelime + anlam + örnek okuma, kaba tahmin
const BELAGAT_ESTIMATED_MINUTES = 3; // tanım + örnek + alıştırma, süre verisi yok

function minutesFromSeconds(seconds: number): number {
  return Math.max(1, Math.round(seconds / 60));
}

export function DailyPracticeCard({ navigation }: { navigation?: any }) {
  const t = useThemeTokens();
  const { settings } = useDailyPracticeSettings();
  const { progress } = useDailyProgress();
  const lugatState = lugatProgressStore.use();
  const { goals, dailyMinutes, dailyMinutesChosen } = useOnboarding();
  const day = useDayKey();
  const [expanded, setExpanded] = React.useState(false);

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
        minutes: minutesFromSeconds(text.approxSeconds),
      });
    }

    if (settings.lugat.enabled) {
      const { words } = todaysWords(lugatState);
      const detail = words.map((w) => w.word).join(' · ');
      list.push({
        module: 'lugat',
        screen: 'Language',
        title: 'Günün kelimeleri',
        detail: detail || 'Kelimeler hazırlanıyor',
        time: formatTime(settings.lugat.time.hour, settings.lugat.time.minute),
        icon: <BookOpenText size={18} color={iconColor} />,
        minutes: minutesFromSeconds(words.length * LUGAT_SECONDS_PER_WORD),
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
        minutes: minutesFromSeconds(program.totalSeconds),
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
        minutes: minutesFromSeconds(drillSeconds(drill)),
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
        minutes: BELAGAT_ESTIMATED_MINUTES,
      });
    }

    // Hedeflenen modüller seçim sırasıyla öne alınır; hedef seçilmemişken
    // `moduleOrderForGoals([])` mevcut sırayı (yukarıdaki push sırasını) verir.
    const order = moduleOrderForGoals(goals);
    return [...list].sort((a, b) => order.indexOf(a.module) - order.indexOf(b.module));
    // `day`: gün dönümünde satırların içeriği (metin, tekerleme, sanat, kelime)
    // tazelensin (YAPILACAKLAR Bölüm 7 → "Gün dönümünde yenileme").
  }, [settings, t.isLight, lugatState, goals, day]);

  // Bütçeleme: hedef sırasına göre modülleri günlük dakika hedefine sığdırır.
  // En az bir modül her zaman görünür; bütçeye sığmayanlar "Daha fazlası"
  // altına düşer, kapanmaz (KARARLAR.md → "Kullanıcı karar turu (2026-09-19)").
  // 10 dk en üst kademe: kaba süre tahminleri toplamı 10'u aşabilse de bu
  // kademe "hepsini göster" anlamına geliyor, bütçe uygulanmıyor.
  const { visibleRows, hiddenCount } = React.useMemo(() => {
    // Süre seçilmediyse (eski kullanıcı, oryantasyonu atlayan) liste kısalmaz.
    if (!dailyMinutesChosen || dailyMinutes >= 10) return { visibleRows: rows, hiddenCount: 0 };
    // Sıra bozulmuyor: bütçeye sığmayan ilk modülde kesiliyor. Sığmayanı atlayıp
    // arkasındaki küçük modülü öne almak, kullanıcının hedef sırasını sessizce
    // değiştirirdi.
    let used = 0;
    const visible: Row[] = [];
    for (const row of rows) {
      if (visible.length > 0 && used + row.minutes > dailyMinutes) break;
      visible.push(row);
      used += row.minutes;
    }
    return { visibleRows: visible, hiddenCount: rows.length - visible.length };
  }, [rows, dailyMinutes, dailyMinutesChosen]);

  if (rows.length === 0) return null;

  const displayRows = expanded ? rows : visibleRows;
  // Gün hedefi görünür (bütçelenmiş) listeye göre; genişletilince açılan
  // ekstra modüller bonus sayılır, oranı değiştirmez.
  const doneCount = visibleRows.filter((row) => isCompletedToday(progress, row.module)).length;

  return (
    <Card className="mt-4" style={{paddingBottom: 6}}>
      <View className="flex-row items-center justify-between mb-1">
        <Text className={`text-[11px] font-bold tracking-widest ${t.muted}`}>
          GÜNLÜK PRATİK
        </Text>
        <Text className={`text-[11px] font-bold ${doneCount === visibleRows.length ? (t.isLight ? 'text-emerald-600' : 'text-emerald-400') : t.muted}`}>
          {doneCount}/{visibleRows.length}
        </Text>
      </View>

      <View className="mt-2 mb-2">
        <ProgressBar value={visibleRows.length === 0 ? 0 : doneCount / visibleRows.length} tone="emerald" />
      </View>

      {displayRows.map((row, index) => {
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

      {/* Bütçe dışında kalan modüller — kapanmaz, "Daha fazlası" ile açılır. */}
      {hiddenCount > 0 ? (
        <Pressable
          onPress={() => setExpanded((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={
            expanded ? 'Günlük pratik listesini daralt' : `Kalan ${hiddenCount} modülü göster`
          }
          className="flex-row items-center py-3.5 mt-0.5"
        >
          <View
            className={`w-9 h-9 rounded-xl items-center justify-center ${
              t.isLight ? 'bg-slate-100' : 'bg-slate-800'
            }`}
          >
            {expanded ? (
              <ChevronUp size={18} color={t.iconColor} />
            ) : (
              <ChevronDown size={18} color={t.iconColor} />
            )}
          </View>
          <View className="flex-1 ml-3 pr-2">
            <Text className={`text-[13px] font-bold ${t.title}`}>
              {expanded ? 'Daha az göster' : `Daha fazlası (${hiddenCount})`}
            </Text>
            {!expanded ? (
              <Text className={`text-[11px] mt-0.5 ${t.muted}`} numberOfLines={1}>
                Günlük hedefin {dailyMinutes} dk — daha fazlası için aç
              </Text>
            ) : null}
          </View>
        </Pressable>
      ) : null}
    </Card>
  );
}

/**
 * Günün duası + günün Risale-i Nur vecizesi — tek kartta.
 * Yalnızca ayarlarda dinî içerik açıkken görünür.
 *
 * 2026-09-18'de birleştirildi: ikisi de aynı şaltere bağlı ve Bugün sekmesinde
 * arka arkaya iki ayrı kutu olarak duruyordu; ekran gereksiz uzuyordu.
 *
 * ⚠️ KİŞİSEL İÇERİK: bu kart Fesahat ve İrtifa'ya taşınmaz (bkz.
 * `src/data/risale.ts` başlığı ve YAPILACAKLAR Bölüm 9).
 *
 * Başlıklar kaynakta doğrudan büyük harfle yazılı; `uppercase` sınıfı
 * kullanılmıyor, çünkü CSS/JS büyütmesi Türkçede 'i'yi 'I' yapıyor
 * (YAPILACAKLAR → "Türkçe büyük harf dönüşümü").
 */
export function DailyFaithCard({ navigation }: { navigation?: any }) {
  const t = useThemeTokens();
  const { settings } = useDailyPracticeSettings();
  // `day`: gün dönümünde dua ve vecize tazelensin (Bölüm 7).
  const day = useDayKey();
  const prayer = React.useMemo(() => pickDailyPrayer(), [day]);
  const vecize = React.useMemo(() => pickDailyVecize(), [day]);

  if (!settings.religiousMode) return null;

  const openDailyText = settings.dailyText.enabled
    ? () => navigation?.navigate?.('DailyText')
    : undefined;

  const Wrapper: any = openDailyText ? Pressable : View;

  return (
    <Wrapper onPress={openDailyText} className="mt-4">
      <Card>
        <Text className={`text-[10px] font-bold tracking-widest ${t.muted}`}>GÜNÜN DUASI</Text>
        <Text
          className={`text-[13px] italic leading-6 mt-2 ${
            t.isLight ? 'text-emerald-800' : 'text-emerald-400'
          }`}
        >
          “{prayer.text}”
        </Text>
        {prayer.meaning ? (
          <Text className={`text-[11px] mt-1 leading-5 ${t.muted}`}>{prayer.meaning}</Text>
        ) : null}

        <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
          <Text className={`text-[10px] font-bold tracking-widest ${t.muted}`}>
            GÜNÜN VECİZESİ
          </Text>
          <Text className={`text-[13px] italic leading-6 mt-2 ${t.title}`}>“{vecize.text}”</Text>
          {vecize.plain ? (
            <Text className={`text-[11px] mt-1.5 leading-5 ${t.muted}`}>{vecize.plain}</Text>
          ) : null}
          <Text className={`text-[10px] mt-2 ${t.muted}`}>{vecize.source}</Text>
        </View>
      </Card>
    </Wrapper>
  );
}
