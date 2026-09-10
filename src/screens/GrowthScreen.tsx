import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Briefcase,
  Mic,
  Feather,
  HeartPulse,
  BrainCircuit,
  CalendarCheck,
  ChartColumn,
  ChevronRight,
  Lock,
  Sparkles,
} from 'lucide-react-native';

import { AppScreen, TabHeader, SectionLabel, toneColor, toneSoft, type Tone } from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { useDailyPracticeSettings } from '../utils/dailyPracticeSettings';

// Gelişim sekmesi — yedi sütunun hub'ı.
//
// Ayrımı net tutmak için: **Gelişim = ne çalışacağım**, İlerleme = ne kadar yol
// aldım. İki sekmenin adı anlamca yakın olduğu için alt başlıklar bunu açıkça
// söylüyor; kullanıcı hangisinin ne olduğunu tahmin etmek zorunda kalmamalı.
//
// Mülakat burada yalnızca bir sütun. Eskiden uygulamanın giriş ekranıydı
// (YAPILACAKLAR Bölüm 0).

type Pillar = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tone: Tone;
  screen?: string;
  params?: any;
  /** Ayarlardan kapatılmışsa hub'da da görünmez. */
  enabled: boolean;
  /** Henüz yazılmamış sütunlar kilitli görünür, tıklanmaz. */
  soon?: boolean;
};

export default function GrowthScreen({ navigation }: any) {
  const t = useThemeTokens();
  const { settings } = useDailyPracticeSettings();

  const pillars: Pillar[] = [
    {
      id: 'kariyer',
      title: 'Kariyer & Mülakat',
      subtitle: 'Mülakat pratiği, geri bildirim, sektör takibi',
      icon: <Briefcase size={20} color={toneColor('blue', t.isLight)} />,
      tone: 'blue',
      screen: 'Interview',
      enabled: true,
    },
    {
      id: 'konusma',
      title: 'Konuşma & Diksiyon',
      subtitle: 'Artikülasyon, tekerleme, vurgu, dolgu kelime avı',
      icon: <Mic size={20} color={toneColor('rose', t.isLight)} />,
      tone: 'rose',
      screen: 'SpeechExercise',
      enabled: settings.speech.enabled,
    },
    {
      id: 'ifade',
      title: 'Dil & İfade',
      subtitle: 'Belagat müfredatı ve günün metni',
      icon: <Feather size={20} color={toneColor('violet', t.isLight)} />,
      tone: 'violet',
      screen: 'BelagatExercise',
      enabled: settings.belagat.enabled,
    },
    {
      id: 'nefes',
      title: 'Dinlenme & Denge',
      subtitle: 'Diyafram programları, nefes kontrolü ve göz dinlendirme egzersizleri',
      icon: <HeartPulse size={20} color={toneColor('emerald', t.isLight)} />,
      tone: 'emerald',
      screen: 'BrainExercises',
      params: {
        track: 'physiological',
        hideTrackToggle: true,
        title: 'Dinlenme & Denge',
        subtitle: 'Diyafram programları, nefes kontrolü ve göz dinlendirme egzersizleri',
      },
      enabled: settings.diaphragm.enabled,
    },
    {
      id: 'zihin',
      title: 'Zihin & Odak',
      subtitle: 'Mantık, kriz çözme, hafıza ve mekan pratikleri',
      icon: <BrainCircuit size={20} color={toneColor('violet', t.isLight)} />,
      tone: 'violet',
      screen: 'BrainExercises',
      params: {
        track: 'cognitive',
        hideTrackToggle: true,
        title: 'Zihin & Odak',
        subtitle: 'Mantık, kriz çözme, hafıza ve mekan pratikleri',
      },
      enabled: true,
    },
    {
      id: 'rutin',
      title: 'Alışkanlık & Rutin',
      subtitle: 'Aralıklı hatırlatıcılar ve günlük sayaçlar',
      icon: <CalendarCheck size={20} color={toneColor('amber', t.isLight)} />,
      tone: 'amber',
      enabled: true,
      soon: true,
    },
    {
      id: 'olcum',
      title: 'Ölçüm & Karne',
      subtitle: 'Testler ve gelişim eğrisi — İlerleme sekmesinde',
      icon: <ChartColumn size={20} color={toneColor('slate', t.isLight)} />,
      tone: 'slate',
      enabled: true,
      soon: true,
    },
  ];

  const visible = pillars.filter((p) => p.enabled);

  return (
    <AppScreen
      tabBar
      header={
        <TabHeader
          icon={<BrainCircuit size={24} color={toneColor('violet', t.isLight)} />}
          title="Gelişim"
          subtitle="Çalışabileceğin alanlar. Ayarlardan kapattığın alan burada görünmez."
        />
      }
    >
      {/* Tüm Egzersizler Hızlı Erişim Kartı (İsteğe bağlı - geçici gizlendi)
      <Pressable
        onPress={() =>
          navigation.navigate('BrainExercises', {
            title: 'Tüm Egzersiz Kataloğu',
            subtitle: 'Bilişsel lob haritası, nefes ve göz dinlendirme egzersizlerinin tamamı',
            hideTrackToggle: false,
          })
        }
        accessibilityRole="button"
        accessibilityLabel="Tüm egzersizler kataloğunu aç"
        className={`flex-row items-center justify-between rounded-2xl p-4 mt-1 mb-2 border ${
          t.isLight ? 'bg-violet-50/80 border-violet-200' : 'bg-[#221c35] border-violet-900/60'
        }`}
      >
        <View className="flex-row items-center flex-1 pr-2">
          <View className="w-10 h-10 rounded-xl bg-violet-500/15 items-center justify-center mr-3">
            <Sparkles size={20} color={toneColor('violet', t.isLight)} />
          </View>
          <View className="flex-1">
            <Text className={`text-[14px] font-bold ${t.title}`}>Tüm Egzersiz Kataloğu</Text>
            <Text className={`text-[11px] mt-0.5 leading-4 ${t.muted}`}>
              Bilişsel lob haritası, nefes ve göz dinlendirme egzersizlerinin tamamı
            </Text>
          </View>
        </View>
        <ChevronRight size={18} color={t.iconColor} />
      </Pressable>
      */}

      <View className="mt-1">
        <SectionLabel>ALANLAR · {visible.length}</SectionLabel>
      </View>

      <View className="gap-2">
        {visible.map((pillar) => (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            onPress={
              pillar.soon || !pillar.screen
                ? undefined
                : () => navigation.navigate(pillar.screen as string, pillar.params)
            }
          />
        ))}
      </View>
    </AppScreen>
  );
}

function PillarCard({ pillar, onPress }: { pillar: Pillar; onPress?: () => void }) {
  const t = useThemeTokens();
  const locked = !onPress;

  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityLabel={`${pillar.title}. ${pillar.subtitle}`}
      accessibilityState={{ disabled: locked }}
      className={`flex-row items-center rounded-2xl p-3.5 border ${
        t.isLight ? 'bg-white border-slate-200' : 'bg-[#1c1c1f] border-[#2e2e33]'
      }`}
      style={{ opacity: locked ? 0.55 : 1 }}
    >
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${toneSoft(pillar.tone, t.isLight)}`}
      >
        {pillar.icon}
      </View>
      <View className="flex-1 pr-2">
        <Text className={`text-[13px] font-bold ${t.title}`}>{pillar.title}</Text>
        <Text className={`text-[11px] mt-0.5 leading-4 ${t.muted}`}>{pillar.subtitle}</Text>
      </View>
      {locked ? (
        <Lock size={15} color={t.iconColor} />
      ) : (
        <ChevronRight size={17} color={t.iconColor} />
      )}
    </Pressable>
  );
}
