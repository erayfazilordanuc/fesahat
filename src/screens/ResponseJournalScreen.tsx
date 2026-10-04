import React from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Check, X, Trash2 } from 'lucide-react-native';

import {
  AppScreen,
  AppHeader,
  Surface,
  EmptyState,
  toneColor,
  toneFill,
  toneText,
  type Tone,
} from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import {
  useResponses,
  removeResponse,
  responsesOf,
  responseStats,
  RESPONSE_MODULE_LABELS,
  type PracticeResponse,
  type ResponseModule,
} from '../utils/responseHistory';
import { formatShortDate } from '../utils/dateUtils';

// Kullanıcının uygulamada verdiği bütün yanıtları modül modül gösteren defter
// (kullanıcı kararı 2026-09-20 — "her yerdeki yanıtlarım kaydedilsin").
// Sekmelerin hepsi `responseHistory`'den okur.

type ModuleFilter = ResponseModule | 'all';

/**
 * Sekme sırası ve rengi; tonlar satır etiketinde de kullanılır. Tonlar
 * uygulamanın başka yerlerdeki eşleşmesini izliyor, bu ekrana özgü seçilmiyor:
 * egzersiz mor ("Zihin & Odak", "Egzersiz geçmişi"), belagat yeşil (Belagat
 * ekranının kendi tonu). Lugat ekranı da yeşil kullanıyor ama defterde
 * belagattan ayrılması gerektiği için ona amber kaldı.
 */
const MODULE_TABS: { value: ModuleFilter; label: string; tone: Tone }[] = [
  { value: 'all', label: 'Tümü', tone: 'slate' },
  { value: 'belagat', label: 'Belagat', tone: 'emerald' },
  { value: 'exercise', label: 'Egzersiz', tone: 'violet' },
  { value: 'lugat', label: 'Lugat', tone: 'amber' },
  { value: 'summary', label: 'Özet', tone: 'blue' },
  { value: 'communication', label: 'İletişim', tone: 'amber' },
];

const RESPONSE_MODULE_TONE: Record<ResponseModule, Tone> = {
  belagat: 'emerald',
  exercise: 'violet',
  lugat: 'amber',
  summary: 'blue',
  communication: 'amber',
};

const EMPTY_MESSAGES: Record<ModuleFilter, string> = {
  all: 'Uygulamada verdiğin yanıtlar burada birikecek.',
  belagat: 'Belagat üretimlerin burada birikir.',
  exercise: 'Egzersiz yanıtların burada birikir.',
  lugat: 'Lugat yanıtların burada birikir.',
  summary: 'Yazdığın özetler burada birikir.',
  communication: 'İletişim senaryolarına yazdığın cevaplar burada birikir.',
};

/** Bir kerede gösterilen kayıt sayısı — uzun listede "Daha fazla göster" ile açılır. */
const PAGE_SIZE = 50;

export default function ResponseJournalScreen({ navigation, route }: any) {
  const t = useThemeTokens();
  const responses = useResponses();

  const [selectedModule, setSelectedModule] = React.useState<ModuleFilter>(
    route?.params?.module ?? 'all',
  );
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  // Ekran açık kalmışken farklı bir parametreyle tekrar açılırsa (aynı modal
  // örneği yeniden kullanılmaz normalde, ama savunma amaçlı) seçim güncellensin.
  React.useEffect(() => {
    if (route?.params?.module) setSelectedModule(route.params.module);
  }, [route?.params?.module]);

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setExpandedId(null);
  }, [selectedModule]);

  const entries = React.useMemo<PracticeResponse[]>(
    () => (selectedModule === 'all' ? responses : responsesOf(responses, selectedModule)),
    [selectedModule, responses],
  );

  const visibleEntries = entries.slice(0, visibleCount);
  const remaining = entries.length - visibleEntries.length;

  const stats = responseStats(responses);
  const subtitle =
    stats.total === 0
      ? 'Henüz kaydedilmiş yanıt yok.'
      : stats.checked > 0
        ? `${stats.total} yanıt · %${stats.accuracy} isabet (${stats.checked} kontrol edilebilir)`
        : `${stats.total} yanıt kaydedildi`;

  const confirmDelete = (response: PracticeResponse) => {
    Alert.alert('Yanıtı sil', `"${response.title}" için verdiğin yanıt defterden silinecek.`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => {
          if (expandedId === response.id) setExpandedId(null);
          removeResponse(response.id);
        },
      },
    ]);
  };

  return (
    <AppScreen
      header={
        <AppHeader
          title="Yanıt Defteri"
          subtitle={subtitle}
          onBack={() => navigation.goBack()}
          align="center"
        />
      }
    >
      <View className="mt-1">
        <ModuleTabs value={selectedModule} onChange={setSelectedModule} />
      </View>

      <View className="mt-4">
        {entries.length === 0 ? (
          <EmptyState message={EMPTY_MESSAGES[selectedModule]} />
        ) : (
          <Surface>
            {visibleEntries.map((response, index) => (
              <ResponseRow
                key={response.id}
                response={response}
                divider={index > 0}
                expanded={expandedId === response.id}
                onToggle={() =>
                  setExpandedId((current) => (current === response.id ? null : response.id))
                }
                onDelete={() => confirmDelete(response)}
              />
            ))}
          </Surface>
        )}

        {remaining > 0 ? (
          <Pressable
            onPress={() => setVisibleCount((count) => count + PAGE_SIZE)}
            accessibilityRole="button"
            accessibilityLabel="Daha fazla yanıt göster"
            className="items-center py-3.5 mt-2"
          >
            <Text className={`text-[12px] font-bold ${toneText('blue', t.isLight)}`}>
              Daha fazla göster ({remaining} kaldı)
            </Text>
          </Pressable>
        ) : null}
      </View>
    </AppScreen>
  );
}

function ModuleTabs({
  value,
  onChange,
}: {
  value: ModuleFilter;
  onChange: (next: ModuleFilter) => void;
}) {
  const t = useThemeTokens();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 4 }}
    >
      {MODULE_TABS.map((tab) => {
        const selected = tab.value === value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onChange(tab.value)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${tab.label} yanıtlarını göster`}
            className={`px-3.5 py-2 rounded-full mr-2 ${
              selected
                ? toneFill(tab.tone, t.isLight)
                : t.isLight
                  ? 'bg-slate-100'
                  : 'bg-[#2a2a2e]'
            }`}
          >
            <Text
              className={`text-[12px] font-bold ${selected ? 'text-white' : t.muted}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function ResponseRow({
  response,
  divider,
  expanded,
  onToggle,
  onDelete,
}: {
  response: PracticeResponse;
  divider: boolean;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const t = useThemeTokens();
  const tone = RESPONSE_MODULE_TONE[response.module];

  return (
    <Pressable
      onPress={onToggle}
      onLongPress={onDelete}
      accessibilityRole="button"
      accessibilityLabel={`${response.title} yanıtını ${expanded ? 'daralt' : 'genişlet'}`}
      className={`py-3.5 ${divider ? `border-t ${t.dividerColor}` : ''}`}
    >
      <View className="flex-row items-center mb-1">
        <Text className={`text-[10px] font-bold uppercase tracking-widest ${toneText(tone, t.isLight)}`}>
          {RESPONSE_MODULE_LABELS[response.module]}
        </Text>
        <Text className={`text-[10px] ml-2 ${t.muted}`}>
          {formatShortDate(new Date(response.timestamp))}
        </Text>
        <View className="flex-1" />
        {response.correct === true ? (
          <Check size={14} color={toneColor('emerald', t.isLight)} />
        ) : response.correct === false ? (
          <X size={14} color={toneColor('rose', t.isLight)} />
        ) : null}
      </View>

      <Text className={`text-[13px] font-bold leading-5 ${t.title}`} numberOfLines={1}>
        {response.title}
      </Text>
      <Text
        className={`text-[12px] mt-1 leading-5 ${t.body}`}
        numberOfLines={expanded ? undefined : 3}
      >
        {response.answer}
      </Text>

      {expanded ? (
        <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
          <Text className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${t.muted}`}>
            Soru
          </Text>
          <Text className={`text-[12px] leading-5 ${t.body}`}>{response.prompt}</Text>

          {response.expected ? (
            <>
              <Text className={`text-[10px] font-bold uppercase tracking-widest mt-2.5 mb-1 ${t.muted}`}>
                Beklenen cevap
              </Text>
              <Text className={`text-[12px] leading-5 ${t.body}`}>{response.expected}</Text>
            </>
          ) : null}

          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel="Bu yanıtı defterden sil"
            className="self-end flex-row items-center mt-3"
            hitSlop={8}
          >
            <Trash2 size={13} color={toneColor('rose', t.isLight)} />
            <Text className={`text-[11px] font-bold ml-1.5 ${toneText('rose', t.isLight)}`}>
              Sil
            </Text>
          </Pressable>
        </View>
      ) : null}
    </Pressable>
  );
}
