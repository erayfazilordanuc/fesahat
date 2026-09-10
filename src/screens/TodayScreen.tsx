import React from 'react';
import { View, Text } from 'react-native';
import { Sunrise } from 'lucide-react-native';

import { AppScreen, TabHeader, Surface, toneColor, toneSoft, toneText } from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { DailyPracticeCard, DailyPrayerCard } from '../components/practice/DailyPracticeCard';
import { firstName, useProfile } from '../utils/profile';
import { useDailyProgress } from '../utils/dailyPracticeProgress';

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
  const { progress } = useDailyProgress();

  const bestStreak = Math.max(0, ...Object.values(progress.modules).map((m) => m.streak));

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
      {/* Günün duası — yalnızca ayarlarda dinî içerik açıkken görünür. */}
      <DailyPrayerCard navigation={navigation} />

      {/* Günlük pratik modülleri — hepsi kapalıysa hiç render edilmez. */}
      <DailyPracticeCard navigation={navigation} />

      {bestStreak > 0 ? (
        <Surface className="mt-3">
          <View className="flex-row items-center">
            <View
              className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${toneSoft('emerald', t.isLight)}`}
            >
              <Text className="text-[15px]">🔥</Text>
            </View>
            <View className="flex-1">
              <Text className={`text-[13px] font-bold ${t.title}`}>
                {bestStreak} günlük seri
              </Text>
              <Text className={`text-[11px] mt-0.5 ${t.muted}`}>
                En uzun güncel serin. Bugünü de tamamlarsan uzuyor.
              </Text>
            </View>
          </View>
        </Surface>
      ) : null}

      <Text className={`text-[11px] leading-5 mt-4 text-center ${t.muted}`}>
        Çalışacak yeni bir alan mı arıyorsun?{' '}
        <Text className={toneText('violet', t.isLight)}>Gelişim</Text> sekmesine bak.
      </Text>
    </AppScreen>
  );
}
