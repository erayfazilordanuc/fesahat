import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Briefcase,
  Mic,
  Feather,
  HeartPulse,
  BrainCircuit,
  CalendarCheck,
  ChevronRight,
  Lock,
} from 'lucide-react-native';

import { AppScreen, TabHeader, SectionLabel, Badge, toneColor, toneSoft, type Tone } from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { useDailyPracticeSettings } from '../utils/dailyPracticeSettings';
import { useOnboarding, GOAL_META, type OnboardingGoal } from '../utils/onboarding';

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

// Oryantasyonda seçilen hedeflerin alanı (GOAL_META[goal].pillarId) → hedef.
// Hedefler kapatmaz, yalnızca sıralar (YAPILACAKLAR Bölüm 0.1).
const PILLAR_ID_TO_GOAL: Partial<Record<string, OnboardingGoal>> = Object.fromEntries(
  (Object.entries(GOAL_META) as [OnboardingGoal, (typeof GOAL_META)[OnboardingGoal]][]).map(
    ([goal, meta]) => [meta.pillarId, goal],
  ),
);

export default function GrowthScreen({ navigation }: any) {
  const t = useThemeTokens();
  const { settings } = useDailyPracticeSettings();
  const { goals } = useOnboarding();

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
      subtitle: 'Kelime hazinesi, doğru Türkçe, deyimler; ileri düzeyde söz sanatları',
      icon: <Feather size={20} color={toneColor('violet', t.isLight)} />,
      tone: 'violet',
      // Odak lugat ve Türkçe (KARARLAR 2026-09-11). Belagat bu ekrandan açılıyor.
      screen: 'Language',
      // Lugat artık kendi aç/kapa ayarına sahip (Bugün kartı da bu ayara bağlı);
      // belagat modülünün ayrı şalteri bu alanı gizlemez, o hâlâ ekran içinden açılıyor.
      enabled: settings.lugat.enabled,
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
      subtitle: 'Günlük pratik hatırlatmaları; aralıklı hatırlatıcılar ve alarmlar yakında',
      icon: <CalendarCheck size={20} color={toneColor('amber', t.isLight)} />,
      tone: 'amber',
      screen: 'Reminders',
      enabled: true,
    },
    // "Ölçüm & Karne" alanı 2026-09-18'de listeden kaldırıldı: tek yaptığı şey
    // alt sekme çubuğundaki İlerleme sekmesini açmaktı, yani zaten bir dokunuş
    // uzaktaki bir yeri tekrar ediyordu. Yedi sütun anlatısı belgelerde duruyor.
  ];

  // Görünen alanlar arasında hedeflerin alanları seçim sırasıyla en üste alınır;
  // hedef yokken (goals boş) herkesin önceliği eşit (Infinity) kalır, sıra
  // değişmez — Array.prototype.sort kararlı (ES2019) olduğu için.
  const visible = pillars
    .filter((p) => p.enabled)
    .slice()
    .sort((a, b) => {
      const goalA = PILLAR_ID_TO_GOAL[a.id];
      const goalB = PILLAR_ID_TO_GOAL[b.id];
      const priorityA = goalA ? goals.indexOf(goalA) : -1;
      const priorityB = goalB ? goals.indexOf(goalB) : -1;
      const rankA = priorityA === -1 ? Infinity : priorityA;
      const rankB = priorityB === -1 ? Infinity : priorityB;
      return rankA - rankB;
    });
  const goalPillarIds = new Set(goals.map((g) => GOAL_META[g].pillarId));

  return (
    <AppScreen
      tabBar
      header={
        <TabHeader
          icon={<BrainCircuit size={24} color={toneColor('violet', t.isLight)} />}
          title="Gelişim"
          subtitle="Çalışabileceğin alanlar. Modül ayarlarından kapattığın alan burada görünmez."
        />
      }
    >
      <View>
        <SectionLabel>ALANLAR · {visible.length}</SectionLabel>
      </View>

      <View className="gap-2">
        {visible.map((pillar) => (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            isGoal={goalPillarIds.has(pillar.id)}
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

function PillarCard({
  pillar,
  isGoal,
  onPress,
}: {
  pillar: Pillar;
  /** Oryantasyonda seçilen hedeflerden birinin alanı mı. */
  isGoal?: boolean;
  onPress?: () => void;
}) {
  const t = useThemeTokens();
  const locked = !onPress;

  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityLabel={`${pillar.title}. ${pillar.subtitle}${isGoal ? '. Hedefin' : ''}`}
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
        <View className="flex-row items-center">
          <Text className={`text-[13px] font-bold ${t.title}`}>{pillar.title}</Text>
          {isGoal ? (
            <View className="ml-2">
              <Badge label="Hedefin" tone={pillar.tone} />
            </View>
          ) : null}
        </View>
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
