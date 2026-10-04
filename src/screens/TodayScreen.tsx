import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Sunrise, BrainCircuit, TrendingUp, User, Mic, Cpu, ChevronRight } from 'lucide-react-native';

import { AppScreen, TabHeader, Surface, toneColor, toneSoft, toneText } from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { DailyPracticeCard, DailyFaithCard } from '../components/practice/DailyPracticeCard';
import { DailyWordCard } from '../components/practice/DailyWordCard';
import { HabitCard } from '../components/practice/HabitCard';
import { firstName, targetDepartmentLabel, useProfile } from '../utils/profile';
import { useOnboarding, dismissTour } from '../utils/onboarding';
import { getCompany } from '../data/companies';
import { pickDailyInterview, pickDailyTechnical } from '../data/questions';
import { useDayKey } from '../utils/today';

// Bugün sekmesi — uygulamanın giriş ekranı.
//
// Tek soruyu cevaplar: "bugün ne yapmalıyım?" O yüzden ekranda yalnızca günün
// işi var; modül kataloğu Gelişim'de, ölçüm İlerleme'de duruyor.
//
// Eskiden bu ekran `SimulationScreen`'di ve en büyük öğesi "Günlük Mülakata
// Başla" idi; günlük pratik listesi en alttaydı. Uygulama mülakat uygulaması
// olmaktan çıkınca sıralama tersine döndü — mülakat artık Gelişim sekmesindeki
// bir sütun (YAPILACAKLAR Bölüm 0).
//
// 2026-10-04: mülakat en üste **şerit** olarak geri geldi (`DailyInterviewStrip`)
// ama kart olarak değil, tek satır olarak — ekranı aşağı doğru uzatmaması şartı
// vardı. Kurgu ve geçmiş hâlâ Gelişim → Kariyer & Mülakat'ta; buradaki yalnızca
// günün genel sorusu ve hedef alanın günün teknik sorusu için kısayol.

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
      {/* Günün mülakatı + günün teknik sorusu — tek satırlık şerit, en üstte. */}
      <DailyInterviewStrip navigation={navigation} />

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
 * Günün mülakatı ve günün teknik sorusu — Bugün sekmesinin en üstündeki şerit.
 *
 * Neden kart değil şerit: mülakat 2026-09-18'de bu ekrandan çıkarılmıştı çünkü
 * kart olarak en büyük öğeydi ve Bugün'ü "günün işi" ekranı olmaktan çıkarıyordu.
 * Geri gelirken **tek satır** olarak geldi — iki dokunma hedefi yan yana, ekranı
 * aşağı doğru uzatmıyor. Asıl mülakat kurgusu (kurum/tür seçimi, geçmiş) hâlâ
 * Gelişim → Kariyer & Mülakat'ta; burası yalnızca kısayol.
 *
 * Sol taraf günün genel sorusu (`pickDailyInterview`), sağ taraf hedef alanın
 * günün teknik sorusu (`pickDailyTechnical`). Hedef alan seçilmemişse sağ taraf
 * "Alan seç" olup Profil'e götürüyor — soru havuzu departmansız seçilemiyor.
 */
function DailyInterviewStrip({ navigation }: any) {
  const t = useThemeTokens();
  const profile = useProfile();
  // Gün dönümünde (uygulama açıkken gece yarısı geçerse) soru tazelensin.
  const day = useDayKey();

  const daily = React.useMemo(() => pickDailyInterview(), [day]);
  const company = getCompany(daily.companyId);
  const department = targetDepartmentLabel(profile);
  const technicalCompany = React.useMemo(
    () =>
      profile.targetDepartment
        ? getCompany(pickDailyTechnical(profile.targetDepartment).companyId)
        : null,
    [day, profile.targetDepartment],
  );

  return (
    <View
      className={`flex-row items-stretch rounded-2xl border overflow-hidden mt-1 ${t.cardBg} ${t.cardBorder}`}
    >
      <Pressable
        onPress={() => navigation.navigate('DailyInterview')}
        accessibilityRole="button"
        accessibilityLabel={`Günün mülakatı, ${company.name}, genel soru. Başlamak için dokun.`}
        className="flex-1 flex-row items-center px-3 py-2.5"
      >
        <View
          className={`w-8 h-8 rounded-lg items-center justify-center mr-2.5 ${toneSoft('blue', t.isLight)}`}
        >
          <Mic size={15} color={toneColor('blue', t.isLight)} />
        </View>
        <View className="flex-1">
          <Text className={`text-[12px] font-bold ${t.title}`} numberOfLines={1}>
            Günün mülakatı
          </Text>
          <Text className={`text-[11px] ${t.muted}`} numberOfLines={1}>
            {company.name} · genel
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() =>
          profile.targetDepartment
            ? navigation.navigate('DailyInterview', {
                daily: true,
                type: 'teknik',
                department: profile.targetDepartment,
              })
            : navigation.navigate('Profil')
        }
        accessibilityRole="button"
        accessibilityLabel={
          department
            ? `Günün teknik sorusu, ${department}${technicalCompany ? `, ${technicalCompany.name}` : ''}. Başlamak için dokun.`
            : 'Hedef alan seçilmedi. Profilde seçmek için dokun.'
        }
        className={`flex-row items-center px-3 py-2.5 border-l ${t.dividerColor}`}
        style={{ maxWidth: '44%' }}
      >
        <View
          className={`w-8 h-8 rounded-lg items-center justify-center mr-2 ${toneSoft(
            department ? 'violet' : 'slate',
            t.isLight,
          )}`}
        >
          <Cpu size={15} color={toneColor(department ? 'violet' : 'slate', t.isLight)} />
        </View>
        <View className="flex-1">
          <Text className={`text-[12px] font-bold ${t.title}`} numberOfLines={1}>
            {department ? 'Teknik' : 'Alan seç'}
          </Text>
          <Text className={`text-[11px] ${t.muted}`} numberOfLines={1}>
            {department || 'Profil'}
          </Text>
        </View>
        <ChevronRight size={14} color={t.iconColor} />
      </Pressable>
    </View>
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
