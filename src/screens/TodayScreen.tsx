import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sunrise, Hammer, TrendingUp, User, Lightbulb, ChevronRight } from 'lucide-react-native';

import { AppScreen, TabHeader, Surface, toneColor, toneSoft, toneText } from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { DailyPracticeCard, DailySozCard } from '../components/practice/DailyPracticeCard';
import { DailyWordCard } from '../components/practice/DailyWordCard';
import { HabitCard } from '../components/practice/HabitCard';
import { firstName, useProfile } from '../utils/profile';
import { useOnboarding, dismissTour } from '../utils/onboarding';
import { useDailyPracticeSettings } from '../utils/dailyPracticeSettings';
import { pickDailyVerbalQuestion } from '../data/verbalReasoning';
import { useDayKey } from '../utils/today';

// Bugün sekmesi — uygulamanın giriş ekranı.
//
// Tek soruyu cevaplar: "bugün ne yapmalıyım?" O yüzden ekranda yalnızca günün
// işi var; alan kataloğu Atölye'de, ölçüm Karne'de duruyor.

export default function TodayScreen({ navigation }: any) {
  const t = useThemeTokens();
  const profile = useProfile();
  const { completed, tourDismissed } = useOnboarding();

  return (
    <AppScreen
      tabBar
      header={
        <TabHeader
          icon={<Sunrise size={24} color={toneColor('emerald', t.isLight)} />}
          title={firstName(profile) ? `Merhaba, ${firstName(profile)}` : 'Bugün'}
          subtitle="Günün işi burada. Bitirdiklerin serine sayılır."
        />
      }
    >
      {/* Hızlı tur — yalnızca oryantasyon bittiyse ve kart kapatılmadıysa görünür. */}
      {completed && !tourDismissed ? <QuickTourCard /> : null}

      {/* Günün sözü (dinî mod açıksa üstünde günün duası). */}
      <DailySozCard navigation={navigation} />

      {/* Günün kavrayış sorusu — tek satır, Anlayış & Kavrayış modülü açıkken. */}
      <DailyVerbalCard navigation={navigation} />

      {/* Günün kelimesi — lugat kapalıysa ya da ana ekranda gösterilmiyorsa çıkmaz. */}
      <DailyWordCard navigation={navigation} />

      {/* Aralıklı hatırlatıcı sayaçları — hiçbiri açık değilse çıkmaz. */}
      <HabitCard />

      {/* Günlük pratik modülleri — hepsi kapalıysa hiç render edilmez. */}
      <DailyPracticeCard navigation={navigation} />

      {/* Seri kartı ve "Atölye sekmesine bak" yönlendirmesi 2026-09-18'de
          kaldırıldı: seri bilgisi Karne sekmesinde zaten var, sekme çubuğu da
          hep ekranda. Bugün sekmesi tek soruya odaklı kalsın — "bugün ne
          yapmalıyım". */}
    </AppScreen>
  );
}

/**
 * Günün kavrayış sorusu — Bugün sekmesinde tek satırlık şerit.
 *
 * Kart değil şerit: Bugün ekranı "bugün ne yapmalıyım" sorusuna odaklı kalsın
 * diye her modül burada en fazla bir satır kaplıyor. Soruyu burada
 * cevaplatmıyoruz; dokununca setin tamamı `Quiz` ekranında açılıyor — tek
 * soruluk bir cevap kaydı ölçümü bölerdi (`comprehensionProgress` set
 * bazında kaydediyor).
 */
function DailyVerbalCard({ navigation }: any) {
  const t = useThemeTokens();
  const { settings } = useDailyPracticeSettings();
  // Gün dönümünde soru tazelensin.
  const day = useDayKey();
  const daily = React.useMemo(() => pickDailyVerbalQuestion(), [day]);

  if (!settings.comprehension.enabled || !settings.comprehension.showOnHome) return null;

  return (
    <Pressable
      onPress={() => navigation.navigate('Quiz', { setId: daily.set.id })}
      accessibilityRole="button"
      accessibilityLabel={`Günün kavrayış sorusu: ${daily.set.title}. Alıştırmayı açmak için dokun.`}
      className={`flex-row items-center rounded-2xl border mt-4 px-3 py-2.5 ${t.cardBg} ${t.cardBorder}`}
    >
      <View
        className={`w-8 h-8 rounded-lg items-center justify-center mr-2.5 ${toneSoft('blue', t.isLight)}`}
      >
        <Lightbulb size={15} color={toneColor('blue', t.isLight)} />
      </View>
      <View className="flex-1 pr-2">
        <Text className={`text-[12px] font-bold ${t.title}`} numberOfLines={1}>
          Günün kavrayış sorusu
        </Text>
        <Text className={`text-[11px] ${t.muted}`} numberOfLines={1}>
          {daily.set.title}
        </Text>
      </View>
      <ChevronRight size={14} color={t.iconColor} />
    </Pressable>
  );
}

/**
 * Bugün sekmesindeki kapatılabilir "hızlı tur" kartı. Oryantasyon bittikten
 * sonra dört sekmeyi tek cümleyle özetler; ilk günler için — sekmelere işaret
 * eden konumlu balonlar sonraki sürüme ertelendi (KARARLAR.md → "İlk açılış
 * oryantasyonu"). "Anladım" ile kalıcı olarak kapanır.
 */
const TOUR_ROWS: { icon: React.ComponentType<{ size?: number; color?: string }>; tone: 'emerald' | 'violet' | 'blue' | 'slate'; label: string; text: string }[] = [
  { icon: Sunrise, tone: 'emerald', label: 'Bugün', text: 'günün işi burada; bitirdiklerin serine sayılır.' },
  { icon: Hammer, tone: 'violet', label: 'Atölye', text: 'bütün alanlar; seçtiğin hedefler en üstte.' },
  { icon: TrendingUp, tone: 'blue', label: 'Karne', text: 'seriler, ölçümler ve geçmiş.' },
  { icon: User, tone: 'slate', label: 'Profil', text: 'hedeflerin, hatırlatıcılar ve ayarlar.' },
];

function QuickTourCard() {
  const t = useThemeTokens();

  return (
    <Surface className="mt-1">
      <Text className={`text-[13px] font-bold ${t.title}`}>Kısa tur</Text>
      <View className="mt-3">
        {TOUR_ROWS.map((row, index) => {
          const Icon = row.icon;
          return (
            <View
              key={row.label}
              className={`flex-row items-center ${index > 0 ? 'mt-2.5' : ''}`}
            >
              <View
                className={`w-7 h-7 rounded-lg items-center justify-center mr-2.5 ${toneSoft(row.tone, t.isLight)}`}
              >
                <Icon size={14} color={toneColor(row.tone, t.isLight)} />
              </View>
              <Text className={`flex-1 text-[12px] leading-4 ${t.body}`}>
                <Text className={`font-bold ${t.title}`}>{row.label}</Text> — {row.text}
              </Text>
            </View>
          );
        })}
      </View>

      <Pressable
        onPress={dismissTour}
        accessibilityRole="button"
        accessibilityLabel="Kısa turu kapat"
        className={`mt-4 rounded-2xl py-3 items-center justify-center ${toneSoft('emerald', t.isLight)}`}
      >
        <Text className={`text-[13px] font-bold ${toneText('emerald', t.isLight)}`}>Anladım</Text>
      </Pressable>
    </Surface>
  );
}
