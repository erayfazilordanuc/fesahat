import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  Mic,
  Feather,
  BookOpenCheck,
  MessagesSquare,
  Sparkles,
  CalendarCheck,
  ChevronRight,
  Lock,
  Hammer,
} from 'lucide-react-native';

import {
  AppScreen,
  TabHeader,
  SectionLabel,
  Badge,
  toneColor,
  toneSoft,
  type Tone,
} from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { useDailyPracticeSettings } from '../utils/dailyPracticeSettings';
import { useOnboarding, GOAL_META, type OnboardingGoal } from '../utils/onboarding';

// Atölye sekmesi — beş ayağın hub'ı.
//
// Ayrımı net tutmak için: **Atölye = ne çalışacağım**, Karne = ne kadar yol
// aldım. İki sekmenin işi birbirine yakın olduğu için alt başlıklar bunu
// açıkça söylüyor; kullanıcı hangisinin ne olduğunu tahmin etmek zorunda
// kalmamalı.
//
// ⚠️ **Neden beş kart** (karar 2026-10-04, YAPILACAKLAR_FESAHAT Bölüm 4):
// Fesahat'ın beş ayağı var (dil · konuşma · anlayış · kavrayış · iletişim) ve
// üstüne ikincil belagat. Her alt başlığa ayrı kart verilseydi liste yediye
// çıkıyor ve tek ekranda kalabalıklaşıyordu. Çözüm: ayaklar beş kartta
// toplandı — konuşma diksiyon + hitabet nefesini, anlayış & kavrayış ise
// okuma/dinleme/özet ile sözel muhakemeyi birlikte taşıyor. Kartın altındaki
// **kısayol çipleri** birleştirilen alt alanlara doğrudan giriyor, yani
// birleştirme erişimi kapatmıyor.

type Shortcut = {
  label: string;
  screen: string;
  params?: any;
};

type Pillar = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tone: Tone;
  screen?: string;
  params?: any;
  /** Kart altındaki küçük kısayollar — birleştirilen alt alanlara giriş. */
  shortcuts?: Shortcut[];
  /** Ayarlardan kapatılmışsa hub'da da görünmez. */
  enabled: boolean;
  /** Henüz yazılmamış alanlar kilitli görünür, tıklanmaz. */
  soon?: boolean;
  /** İkincil / ileri düzey alan — listenin altında, ayrı başlık altında. */
  advanced?: boolean;
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
      id: 'dil',
      title: 'Dil',
      subtitle: 'Kelime hazinesi, anlam ve köken, doğru Türkçe, deyim ve atasözü',
      icon: <Feather size={20} color={toneColor('violet', t.isLight)} />,
      tone: 'violet',
      screen: 'Language',
      enabled: settings.lugat.enabled,
    },
    {
      id: 'konusma',
      title: 'Konuşma',
      subtitle: 'Diksiyon, artikülasyon, tonlama, dolgu kelime avı ve hitabet nefesi',
      icon: <Mic size={20} color={toneColor('rose', t.isLight)} />,
      tone: 'rose',
      screen: 'SpeechExercise',
      shortcuts: [
        { label: 'Hitabet nefesi', screen: 'DiaphragmExercise' },
        {
          label: 'Duruş & beden',
          screen: 'BrainExercises',
          params: {
            track: 'physiological',
            hideTrackToggle: true,
            title: 'Hitabet Nefesi & Duruş',
            subtitle: 'Diyafram programları, nefes kontrolü ve duruş egzersizleri',
          },
        },
      ],
      enabled: settings.speech.enabled,
    },
    {
      id: 'anlayis',
      title: 'Anlayış & Kavrayış',
      subtitle: 'Okuduğunu ve dinlediğini anlama, özetleme, sözel muhakeme ve çıkarım',
      icon: <BookOpenCheck size={20} color={toneColor('blue', t.isLight)} />,
      tone: 'blue',
      screen: 'Comprehension',
      shortcuts: [
        { label: 'Günün metni', screen: 'DailyText' },
        {
          label: 'Hafıza & örüntü',
          screen: 'BrainExercises',
          params: {
            track: 'cognitive',
            hideTrackToggle: true,
            title: 'Hafıza & Örüntü',
            subtitle: 'Çalışma belleği, sözel muhakeme ve örüntü alıştırmaları',
          },
        },
      ],
      enabled: settings.comprehension.enabled,
    },
    {
      id: 'iletisim',
      title: 'İletişim',
      subtitle: 'Etkin dinleme, empati, ikna, geri bildirim ve zor konuşmalar',
      icon: <MessagesSquare size={20} color={toneColor('amber', t.isLight)} />,
      tone: 'amber',
      screen: 'Communication',
      shortcuts: [{ label: 'Etkin dinleme', screen: 'ListeningSkill' }],
      enabled: settings.communication.enabled,
    },
    {
      id: 'belagat',
      title: 'Belagat',
      subtitle: 'Meânî, Beyân, Bedîʿ — klasik söz sanatları müfredatı',
      icon: <Sparkles size={20} color={toneColor('emerald', t.isLight)} />,
      tone: 'emerald',
      screen: 'BelagatExercise',
      enabled: settings.belagat.enabled,
      advanced: true,
    },
  ];

  // Görünen alanlar arasında hedeflerin alanları seçim sırasıyla en üste alınır;
  // hedef yokken (goals boş) herkesin önceliği eşit (Infinity) kalır, sıra
  // değişmez — Array.prototype.sort kararlı (ES2019) olduğu için.
  const rank = (pillar: Pillar): number => {
    const goal = PILLAR_ID_TO_GOAL[pillar.id];
    const priority = goal ? goals.indexOf(goal) : -1;
    return priority === -1 ? Infinity : priority;
  };

  const enabled = pillars.filter((p) => p.enabled);
  // Belagat ikincil: hedef seçilse bile ana listeye karışmaz, altta durur
  // (YAPILACAKLAR_FESAHAT: "lugat & Türkçe temeli oturduktan sonra açılan
  // ikincil bölüm").
  const main = enabled.filter((p) => !p.advanced).slice().sort((a, b) => rank(a) - rank(b));
  const advanced = enabled.filter((p) => p.advanced);
  const goalPillarIds = new Set(goals.map((g) => GOAL_META[g].pillarId));

  const open = (screen?: string, params?: any) => {
    if (!screen) return undefined;
    return () => navigation.navigate(screen, params);
  };

  return (
    <AppScreen
      tabBar
      header={
        <TabHeader
          icon={<Hammer size={24} color={toneColor('violet', t.isLight)} />}
          title="Atölye"
          subtitle="Çalışabileceğin alanlar. Modül ayarlarından kapattığın alan burada görünmez."
        />
      }
    >
      <View>
        <SectionLabel>ALANLAR · {main.length}</SectionLabel>
      </View>

      <View className="gap-2">
        {main.map((pillar) => (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            isGoal={goalPillarIds.has(pillar.id)}
            onPress={pillar.soon ? undefined : open(pillar.screen, pillar.params)}
            onShortcut={(shortcut) => navigation.navigate(shortcut.screen, shortcut.params)}
          />
        ))}
      </View>

      {advanced.length > 0 ? (
        <View className="mt-5">
          <SectionLabel>İLERİ DÜZEY</SectionLabel>
          <View className="gap-2">
            {advanced.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                isGoal={goalPillarIds.has(pillar.id)}
                onPress={pillar.soon ? undefined : open(pillar.screen, pillar.params)}
                onShortcut={(shortcut) => navigation.navigate(shortcut.screen, shortcut.params)}
              />
            ))}
          </View>
        </View>
      ) : null}

      {/* Hatırlatıcılar bir "ayak" değil, araç — ayaklarla aynı listede durursa
          beş ayak anlatısı bulanıyor. */}
      <View className="mt-5">
        <SectionLabel>ARAÇLAR</SectionLabel>
        <Pressable
          onPress={() => navigation.navigate('Reminders')}
          accessibilityRole="button"
          accessibilityLabel="Hatırlatıcılar. Günlük pratik hatırlatmaları ve aralıklı hatırlatıcılar."
          className={`flex-row items-center rounded-2xl p-3.5 border ${t.cardBg} ${t.cardBorder}`}
        >
          <View
            className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${toneSoft('slate', t.isLight)}`}
          >
            <CalendarCheck size={20} color={toneColor('slate', t.isLight)} />
          </View>
          <View className="flex-1 pr-2">
            <Text className={`text-[13px] font-bold ${t.title}`}>Hatırlatıcılar</Text>
            <Text className={`text-[11px] mt-0.5 leading-4 ${t.muted}`}>
              Günlük pratik hatırlatmaları ve aralıklı hatırlatıcılar
            </Text>
          </View>
          <ChevronRight size={17} color={t.iconColor} />
        </Pressable>
      </View>
    </AppScreen>
  );
}

function PillarCard({
  pillar,
  isGoal,
  onPress,
  onShortcut,
}: {
  pillar: Pillar;
  /** Oryantasyonda seçilen hedeflerden birinin alanı mı. */
  isGoal?: boolean;
  onPress?: () => void;
  onShortcut: (shortcut: Shortcut) => void;
}) {
  const t = useThemeTokens();
  const locked = !onPress;

  return (
    <View
      className={`rounded-2xl border ${t.cardBg} ${t.cardBorder}`}
      style={{ opacity: locked ? 0.55 : 1 }}
    >
      <Pressable
        onPress={onPress}
        disabled={locked}
        accessibilityRole="button"
        accessibilityLabel={`${pillar.title}. ${pillar.subtitle}${isGoal ? '. Hedefin' : ''}`}
        accessibilityState={{ disabled: locked }}
        className="flex-row items-center p-3.5"
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
        {locked ? <Lock size={15} color={t.iconColor} /> : <ChevronRight size={17} color={t.iconColor} />}
      </Pressable>

      {!locked && pillar.shortcuts && pillar.shortcuts.length > 0 ? (
        <View className={`flex-row flex-wrap gap-2 px-3.5 pb-3.5 pt-0`}>
          {pillar.shortcuts.map((shortcut) => (
            <Pressable
              key={shortcut.label}
              onPress={() => onShortcut(shortcut)}
              accessibilityRole="button"
              accessibilityLabel={`${pillar.title} alanında ${shortcut.label}`}
              className={`rounded-xl px-3 py-1.5 border ${t.cardBorder} ${toneSoft(pillar.tone, t.isLight)}`}
            >
              <Text className={`text-[11px] font-bold ${t.body}`}>{shortcut.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
