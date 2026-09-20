import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sunrise, BrainCircuit, TrendingUp, User } from 'lucide-react-native';

import { AppScreen, TabHeader, Surface, toneColor, toneSoft, toneText } from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { DailyPracticeCard, DailyFaithCard } from '../components/practice/DailyPracticeCard';
import { DailyWordCard } from '../components/practice/DailyWordCard';
import { HabitCard } from '../components/practice/HabitCard';
import { firstName, useProfile } from '../utils/profile';
import { useOnboarding, dismissTour } from '../utils/onboarding';

// Bugün sekmesi — uygulamanın giriş ekranı.
//
// Tek soruyu cevaplar: "bugün ne yapmalıyım?" O yüzden ekranda yalnızca günün
// işi var; modül kataloğu Gelişim'de, ölçüm İlerleme'de duruyor.
//
// Eskiden bu ekran `SimulationScreen`'di ve en büyük öğesi "Günlük Mülakata
// Başla" idi; günlük pratik listesi en alttaydı. Uygulama mülakat uygulaması
// olmaktan çıkınca sıralama tersine döndü — mülakat artık Gelişim sekmesindeki
// bir sütun (YAPILACAKLAR Bölüm 0).

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

      {/* Günün duası + vecizesi tek kartta — yalnızca dinî içerik açıkken. */}
      <DailyFaithCard navigation={navigation} />

      {/* Günün kelimesi — lugat kapalıysa ya da ana ekranda gösterilmiyorsa çıkmaz. */}
      <DailyWordCard navigation={navigation} />

      {/* Aralıklı hatırlatıcı sayaçları — hiçbiri açık değilse çıkmaz. */}
      <HabitCard />

      {/* Günlük pratik modülleri — hepsi kapalıysa hiç render edilmez. */}
      <DailyPracticeCard navigation={navigation} />

      {/* Seri kartı ve "Gelişim sekmesine bak" yönlendirmesi 2026-09-18'de
          kaldırıldı: seri bilgisi İlerleme sekmesinde zaten var, sekme çubuğu da
          hep ekranda. Bugün sekmesi tek soruya odaklı kalsın — "bugün ne
          yapmalıyım". */}
    </AppScreen>
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
  { icon: BrainCircuit, tone: 'violet', label: 'Gelişim', text: 'bütün alanlar; seçtiğin hedefler en üstte.' },
  { icon: TrendingUp, tone: 'blue', label: 'İlerleme', text: 'seriler, ölçümler ve geçmiş.' },
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
