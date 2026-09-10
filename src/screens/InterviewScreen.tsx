import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Rocket,
  SlidersHorizontal,
  Newspaper,
  History,
  ChevronRight,
} from 'lucide-react-native';

import { AppScreen, AppHeader, ActionRow, toneColor } from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { pickDailyInterview } from '../data/questions';
import { getCompany } from '../data/companies';

// Kariyer & Mülakat sütunu.
//
// Eskiden bu içerik `SimulationScreen`'in üst yarısıydı ve uygulamanın giriş
// ekranıydı. Artık Gelişim sekmesindeki bir karttan açılıyor — mülakat bir
// sütun, ön kapı değil (YAPILACAKLAR Bölüm 0).

export default function InterviewScreen({ navigation }: any) {
  const t = useThemeTokens();

  // Günün kurumu gün numarasına göre sabit — açıklamada da aynı kurum görünsün.
  const daily = React.useMemo(() => pickDailyInterview(), []);
  const dailyCompany = getCompany(daily.companyId);

  return (
    <AppScreen
      header={
        <AppHeader
          title="Kariyer & Mülakat"
          subtitle="Baskı altında konuşma pratiği, geri bildirim ve sektör takibi."
          onBack={() => navigation.goBack()}
        />
      }
    >
      <View className="mt-3">
        <PrimaryAction
          title="Günlük Mülakata Başla"
          subtitle={`Günün kurumu: ${dailyCompany.shortName} · 120 saniye.`}
          icon={<Rocket size={24} color="#ffffff" />}
          onPress={() => navigation.navigate('DailyInterview')}
        />
      </View>

      <View className="gap-2 mt-3">
        <ActionRow
          icon={<SlidersHorizontal size={18} color={toneColor('blue', t.isLight)} />}
          tone="blue"
          title="Özelleştirilmiş Mülakat"
          subtitle="Kurum, tür ve giriş cihazı seçimi"
          onPress={() => navigation.navigate('CustomInterview')}
        />
        <ActionRow
          icon={<History size={18} color={toneColor('violet', t.isLight)} />}
          tone="violet"
          title="Mülakat Geçmişi"
          subtitle="Kayıtlar, puanlar ve değerlendirmeler"
          onPress={() => navigation.navigate('InterviewHistory')}
        />
        <ActionRow
          icon={<Newspaper size={18} color={toneColor('amber', t.isLight)} />}
          tone="amber"
          title="Sektörel Gelişmeler"
          subtitle="Savunma sanayii haberleri ve arşiv"
          onPress={() => navigation.navigate('NewsScreen')}
        />
      </View>
    </AppScreen>
  );
}

function PrimaryAction({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      className="rounded-2xl p-4 flex-row items-center bg-blue-600"
    >
      <View className="w-14 h-14 rounded-2xl items-center justify-center bg-white/20">{icon}</View>
      <View className="flex-1 ml-3">
        <Text className="text-[18px] font-black text-white">{title}</Text>
        <Text className="text-[11px] mt-0.5 text-blue-100">{subtitle}</Text>
      </View>
      <ChevronRight size={18} color="#ffffff" />
    </Pressable>
  );
}
