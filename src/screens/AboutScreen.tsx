import React from 'react';
import { View, Text, Image } from 'react-native';
import { Feather, Mic, BookOpenCheck, MessagesSquare, Sparkles } from 'lucide-react-native';

import {
  AppScreen,
  AppHeader,
  Surface,
  SectionLabel,
  ActionButton,
  Badge,
  toneColor,
  toneSoft,
  useThemeTokens,
  type Tone,
} from '../components/AppUI';

// Uygulama içinde Fesahat'ın ne olduğunu anlatan tek yer — oryantasyon akışı
// hedef/süre/hatırlatma seçtirir ama beş ayağı ve BYOK yapay zekâ modelini
// anlatmaz. Ayarlar ekranından "Fesahat Nedir?" ile açılıyor.

type PillarInfo = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tone: Tone;
  advanced?: boolean;
};

export default function AboutScreen({ navigation }: any) {
  const t = useThemeTokens();

  // GrowthScreen'deki `pillars` dizisiyle birebir aynı beş kayıt
  // (src/screens/GrowthScreen.tsx) — iki yerde ayrı anlatı oluşmasın diye.
  const pillars: PillarInfo[] = [
    {
      title: 'Dil',
      subtitle: 'Kelime hazinesi, anlam ve köken, doğru Türkçe, deyim ve atasözü',
      icon: <Feather size={20} color={toneColor('violet', t.isLight)} />,
      tone: 'violet',
    },
    {
      title: 'Konuşma',
      subtitle: 'Diksiyon, artikülasyon, tonlama, dolgu kelime avı ve hitabet nefesi',
      icon: <Mic size={20} color={toneColor('rose', t.isLight)} />,
      tone: 'rose',
    },
    {
      title: 'Anlayış & Kavrayış',
      subtitle: 'Okuduğunu ve dinlediğini anlama, özetleme, sözel muhakeme ve çıkarım',
      icon: <BookOpenCheck size={20} color={toneColor('blue', t.isLight)} />,
      tone: 'blue',
    },
    {
      title: 'İletişim',
      subtitle: 'Etkin dinleme, empati, ikna, geri bildirim ve zor konuşmalar',
      icon: <MessagesSquare size={20} color={toneColor('amber', t.isLight)} />,
      tone: 'amber',
    },
    {
      title: 'Belagat',
      subtitle: 'Meânî, Beyân, Bedîʿ — klasik söz sanatları müfredatı',
      icon: <Sparkles size={20} color={toneColor('emerald', t.isLight)} />,
      tone: 'emerald',
      advanced: true,
    },
  ];

  return (
    <AppScreen header={<AppHeader title="Hakkında" onBack={() => navigation.goBack()} />}>
      <Image
        source={require('../../assets/splash-icon.png')}
        style={{ width: 88, height: 88, alignSelf: 'center', marginTop: 8, marginBottom: 12 }}
        resizeMode="contain"
      />
      <Text className={`text-[22px] font-black text-center ${t.title}`}>Fesahat</Text>
      <Text className={`text-[12px] text-center mt-1 ${t.muted}`}>
        Türkçeni ve ifade gücünü günlük pratikle geliştir.
      </Text>

      <SectionLabel>Fesahat Nedir?</SectionLabel>
      <Surface>
        <Text className={`text-[13px] leading-5 ${t.body}`}>
          Fesahat; kelime hazinesini, doğru Türkçeyi, konuşma netliğini, okuduğunu ve
          dinlediğini anlamayı, sözel muhakemeyi ve iletişim becerilerini günlük kısa
          pratiklerle geliştirmeyi hedefler. Hiçbir ayak sınav hazırlığı ya da iş performansı
          için değil — gündelik hayatta daha doğru, daha anlaşılır ve daha etkili konuşup
          yazmak için.
        </Text>
      </Surface>

      <SectionLabel>Beş Ayak</SectionLabel>
      <Surface>
        {pillars.map((pillar, index) => (
          <View
            key={pillar.title}
            className={`flex-row items-center py-3 ${index === 0 ? '' : `border-t ${t.dividerColor}`}`}
          >
            <View
              className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${toneSoft(pillar.tone, t.isLight)}`}
            >
              {pillar.icon}
            </View>
            <View className="flex-1 pr-3">
              <View className="flex-row items-center">
                <Text className={`text-[13px] font-bold ${t.title}`}>{pillar.title}</Text>
                {pillar.advanced ? (
                  <View className="ml-2">
                    <Badge label="İleri düzey" tone="slate" />
                  </View>
                ) : null}
              </View>
              <Text className={`text-[11px] mt-0.5 ${t.muted}`}>{pillar.subtitle}</Text>
            </View>
          </View>
        ))}
      </Surface>

      <SectionLabel>Yapay Zekâ İsteğe Bağlı</SectionLabel>
      <Surface>
        <Text className={`text-[13px] leading-5 ${t.body}`}>
          Uygulamanın tamamı internet ve yapay zekâ olmadan çalışır — bu bir sınır değil,
          güvence. Üstüne eklenen yapay zekâ katmanı BYOK (bring your own key) modeliyle
          çalışır: kendi Google Gemini anahtarını girersin, anahtar yalnızca cihazının kasasında
          durur, değerlendirme istekleri doğrudan Google'a gider. Ayakta tutulan bir sunucu yok.
        </Text>
        <View style={{ marginTop: 14 }}>
          <ActionButton
            label="Yapay Zekâyı Kur"
            variant="soft"
            tone="emerald"
            icon={<Sparkles size={15} color={toneColor('emerald', t.isLight)} />}
            onPress={() => navigation.navigate('AiSetup')}
          />
        </View>
      </Surface>
    </AppScreen>
  );
}
