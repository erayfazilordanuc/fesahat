import React from 'react';
import { View, Text, Pressable, Image, StyleSheet, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { ChevronLeft, Check } from 'lucide-react-native';

import {
  AppScreen,
  Surface,
  ActionButton,
  Badge,
  toneColor,
  toneText,
  useThemeTokens,
  SCREEN_PADDING,
} from '../components/AppUI';
import { Card, PrimaryButton, ProgressBar } from '../components/practice/PracticeUI';
import { useEnableNotifications } from '../components/practice/ModuleSettingsSheet';
import {
  useOnboarding,
  updateOnboarding,
  completeOnboarding,
  GOAL_ORDER,
  GOAL_META,
  REMINDER_SLOTS,
  type OnboardingGoal,
  type DailyMinutes,
  type ReminderSlot,
} from '../utils/onboarding';
import { useDailyPracticeSettings, type DailyModuleKey } from '../utils/dailyPracticeSettings';
import { useLugatProgress, todaysWords, lugatProgressStore } from '../utils/lugatProgress';
import type { LugatWord } from '../data/lugat';
import { allDrills, type DictionDrill } from '../data/dictionDrills';
import { pickForDay, formatTime } from '../utils/dateUtils';

// İlk açılış oryantasyonu (YAPILACAKLAR Bölüm 0.1, KARARLAR → "İlk açılış
// oryantasyonu"). Altı adım: hoş geldin → hedefler → günlük süre →
// hatırlatma → ısınma → bitiş. Seçimler her adımda `updateOnboarding` ile
// kaydedilir; akış yarıda bırakılsa da seçimler durur. Isınma seriye
// sayılmaz — bkz. `LugatWarmup` / `SpeechWarmup` / `BreathingWarmup`, hiçbiri
// `completeModule` çağırmaz.

const TOTAL_STEPS = 6; // 0: hoş geldin … 5: bitiş
const GRADIENT = ['#10B981', '#04614A'] as const; // SplashOverlay ile aynı marka degradesi

const BREATH_CYCLES = 3;
const INHALE_SECONDS = 4;
const EXHALE_SECONDS = 6;

function targetModulesForGoals(goals: OnboardingGoal[]): DailyModuleKey[] {
  const set = new Set<DailyModuleKey>();
  goals.forEach((g) => GOAL_META[g].modules.forEach((m) => set.add(m)));
  const arr = Array.from(set);
  return arr.length > 0 ? arr : ['dailyText'];
}

export default function OnboardingScreen({ navigation }: any) {
  const state = useOnboarding();
  const [step, setStep] = React.useState(0);
  const [warmupDone, setWarmupDone] = React.useState(false);
  const [reminderNote, setReminderNote] = React.useState<string | null>(null);
  const [reminderBusy, setReminderBusy] = React.useState(false);
  const enableNotifications = useEnableNotifications();
  const { updateModule } = useDailyPracticeSettings();

  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step > 0) {
        setStep((s) => Math.max(s - 1, 0));
        return true;
      }
      // Adım 0. Ayarlar'dan yeniden açıldıysa dönülecek bir ekran var: akış
      // tamamlanmış sayılır — yoksa `resetOnboarding` yüzünden bir sonraki
      // açılışta oryantasyon yeniden çıkardı. İlk açılışta varsayılan davranış.
      if (navigation.canGoBack()) {
        completeOnboarding();
        navigation.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [step, navigation]);

  const finish = React.useCallback(() => {
    completeOnboarding();
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  }, [navigation]);

  const toggleGoal = (goal: OnboardingGoal) => {
    if (state.goals.includes(goal)) {
      updateOnboarding({ goals: state.goals.filter((g) => g !== goal) });
    } else if (state.goals.length < 3) {
      updateOnboarding({ goals: [...state.goals, goal] });
    }
  };

  /** Isınmaya her girişte baştan başlanır; önceki bir ısınmanın "tamam"ı taşınmaz. */
  const goToWarmup = () => {
    setWarmupDone(false);
    setStep(4);
  };

  const selectReminder = (slot: ReminderSlot) => {
    updateOnboarding({ reminderSlot: slot });
    setReminderNote(null);
  };

  /**
   * "Devam". Saat seçiliyse izin ister; verilirse hedef modüllerine saat
   * atar. Reddedilirse (Alert zaten `useEnableNotifications` içinde
   * gösterildi) bu adımda kısa bir not bırakır — tekrar basınca izin tekrar
   * istenmeden hatırlatmasız devam edilir.
   */
  const confirmReminder = async () => {
    if (state.reminderSlot === 'yok') {
      goToWarmup();
      return;
    }
    if (reminderNote) {
      // İzin verilmedi: seçili saat kayıtlı kalırsa bitiş özeti kurulmamış bir
      // hatırlatmayı "Her gün 20:30" diye gösterirdi.
      updateOnboarding({ reminderSlot: 'yok' });
      goToWarmup();
      return;
    }
    setReminderBusy(true);
    const granted = await enableNotifications();
    setReminderBusy(false);
    if (granted) {
      const modules = targetModulesForGoals(state.goals);
      const slot = state.reminderSlot as Exclude<ReminderSlot, 'yok'>;
      modules.forEach((m) =>
        updateModule(m, { enabled: true, reminder: true, time: REMINDER_SLOTS[slot].time } as any),
      );
      goToWarmup();
    } else {
      setReminderNote('Bildirim izni verilmedi — hatırlatmasız devam edeceksin.');
    }
  };

  if (step === 0) {
    return <WelcomeStep onStart={() => setStep(1)} onSkip={finish} />;
  }

  const progress = step / (TOTAL_STEPS - 1);

  return (
    <AppScreen
      header={
        <StepHeader
          progress={progress}
          onBack={() => setStep((s) => Math.max(s - 1, 0))}
          onSkip={finish}
        />
      }
      footer={
        step === 1 ? (
          <ActionButton
            label="Devam"
            tone="emerald"
            disabled={state.goals.length === 0}
            onPress={() => setStep(2)}
          />
        ) : step === 2 ? (
          <ActionButton
            label="Devam"
            tone="emerald"
            // Ekranda görünen süre "Devam" ile onaylanmış sayılır: hiçbir çipe
            // dokunmayan da varsayılanı (5 dk) seçmiş olur, yoksa bitiş özeti
            // "5 dk" derken Bugün listesi bütçesiz kalırdı.
            onPress={() => {
              updateOnboarding({ dailyMinutes: state.dailyMinutes });
              setStep(3);
            }}
          />
        ) : step === 3 ? (
          <ActionButton
            label={reminderBusy ? 'Kontrol ediliyor…' : 'Devam'}
            tone="emerald"
            disabled={reminderBusy}
            onPress={confirmReminder}
          />
        ) : step === 4 ? (
          // Isınma isteğe bağlı: bitmeden de geçilebilir, ama üstteki "Atla"
          // gibi bütün akışı değil yalnızca bu adımı geçer.
          <ActionButton
            label={warmupDone ? 'Devam' : 'Isınmayı atla'}
            tone="emerald"
            variant={warmupDone ? 'solid' : 'outline'}
            onPress={() => setStep(5)}
          />
        ) : (
          <ActionButton label="Bugün'e git" tone="emerald" onPress={finish} />
        )
      }
    >
      {step === 1 ? (
        <GoalsStep goals={state.goals} onToggle={toggleGoal} />
      ) : step === 2 ? (
        <MinutesStep value={state.dailyMinutes} onSelect={(m) => updateOnboarding({ dailyMinutes: m })} />
      ) : step === 3 ? (
        <ReminderStep value={state.reminderSlot} onSelect={selectReminder} note={reminderNote} />
      ) : step === 4 ? (
        <WarmupStep goal={state.goals[0] ?? 'lugat'} onDone={() => setWarmupDone(true)} />
      ) : (
        <FinishStep goals={state.goals} dailyMinutes={state.dailyMinutes} reminderSlot={state.reminderSlot} />
      )}
    </AppScreen>
  );
}

/* ------------------------------------------------------------------ */
/* Adım 0 — Hoş geldin                                                 */
/* ------------------------------------------------------------------ */

function WelcomeStep({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ position: 'absolute', top: insets.top + 12, right: SCREEN_PADDING }}>
        <Pressable
          onPress={onSkip}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Oryantasyonu atla"
        >
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '700' }}>Atla</Text>
        </Pressable>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Image
          source={require('../../assets/splash-icon.png')}
          style={{ width: 120, height: 120, marginBottom: 28 }}
          resizeMode="contain"
        />
        <Text
          style={{
            color: '#ffffff',
            fontSize: 24,
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          Fesahat'a hoş geldin
        </Text>
        <Text
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 14,
            lineHeight: 21,
            textAlign: 'center',
          }}
        >
          Her gün birkaç dakikalık pratikle kelime, konuşma, nefes ve odak.
        </Text>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 20) + 8 }}>
        <Pressable
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel="Başlayalım"
          style={{ backgroundColor: '#ffffff', borderRadius: 16, paddingVertical: 16, alignItems: 'center' }}
        >
          <Text style={{ color: '#04614A', fontSize: 15, fontWeight: '800' }}>Başlayalım</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Ortak adım iskeleti                                                 */
/* ------------------------------------------------------------------ */

function StepHeader({
  progress,
  onBack,
  onSkip,
}: {
  progress: number;
  onBack: () => void;
  onSkip: () => void;
}) {
  const t = useThemeTokens();
  return (
    <View className="flex-row items-center px-5 pt-2 pb-3">
      <Pressable
        onPress={onBack}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Geri"
        className="mr-3"
      >
        <ChevronLeft size={20} color={t.iconColor} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <ProgressBar value={progress} tone="emerald" />
      </View>
      <Pressable
        onPress={onSkip}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Oryantasyonu atla"
        className="ml-3"
      >
        <Text className={`text-[13px] font-bold ${t.muted}`}>Atla</Text>
      </Pressable>
    </View>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const t = useThemeTokens();
  return (
    <View className="mb-5">
      <Text className={`text-[20px] font-black mb-1.5 ${t.title}`}>{title}</Text>
      {subtitle ? <Text className={`text-[12px] leading-5 ${t.muted}`}>{subtitle}</Text> : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Adım 1 — Hedefler                                                   */
/* ------------------------------------------------------------------ */

function GoalsStep({
  goals,
  onToggle,
}: {
  goals: OnboardingGoal[];
  onToggle: (goal: OnboardingGoal) => void;
}) {
  const t = useThemeTokens();
  return (
    <View>
      <StepTitle title="Neyi geliştirmek istiyorsun?" subtitle="En fazla 3 alan seç; seçim sıran önceliğini belirler." />
      {GOAL_ORDER.map((goal) => {
        const meta = GOAL_META[goal];
        const index = goals.indexOf(goal);
        const checked = index !== -1;
        return (
          <Pressable
            key={goal}
            onPress={() => onToggle(goal)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            accessibilityLabel={meta.title}
            className={`flex-row items-center rounded-2xl border p-4 mb-3 ${
              checked
                ? t.isLight
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-emerald-500 bg-[#0d2822]'
                : `${t.cardBorder} ${t.cardBg}`
            }`}
          >
            <View
              className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                checked ? 'bg-emerald-600' : t.isLight ? 'bg-slate-100' : 'bg-[#2a2a2e]'
              }`}
            >
              {checked ? <Text className="text-white text-[13px] font-black">{index + 1}</Text> : null}
            </View>
            <View className="flex-1">
              <Text className={`text-[14px] font-bold ${t.title}`}>{meta.title}</Text>
              <Text className={`text-[11px] mt-0.5 ${t.muted}`}>{meta.subtitle}</Text>
            </View>
          </Pressable>
        );
      })}
      <Text className={`text-[11px] leading-5 mt-1 ${t.muted}`}>
        Seçmediğin alanlar kaybolmaz; seçtiklerin öne alınır.
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Adım 2 — Günlük süre                                                */
/* ------------------------------------------------------------------ */

function MinutesStep({ value, onSelect }: { value: DailyMinutes; onSelect: (m: DailyMinutes) => void }) {
  const t = useThemeTokens();
  const options: DailyMinutes[] = [3, 5, 10];
  return (
    <View>
      <StepTitle title="Günde kaç dakika ayırabilirsin?" />
      <View className="flex-row" style={{ gap: 12 }}>
        {options.map((m) => {
          const selected = value === m;
          return (
            <Pressable
              key={m}
              onPress={() => onSelect(m)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${m} dakika`}
              className={`flex-1 items-center justify-center rounded-2xl border py-6 ${
                selected
                  ? t.isLight
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-emerald-500 bg-[#0d2822]'
                  : `${t.cardBorder} ${t.cardBg}`
              }`}
            >
              <Text className={`text-[22px] font-black ${selected ? toneText('emerald', t.isLight) : t.title}`}>
                {m}
              </Text>
              <Text
                className={`text-[11px] font-bold mt-1 ${selected ? toneText('emerald', t.isLight) : t.muted}`}
              >
                dakika
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text className={`text-[11px] leading-5 mt-4 ${t.muted}`}>
        Bu bir hedef; içerik süresi buna göre kısalmıyor.
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Adım 3 — Hatırlatma                                                 */
/* ------------------------------------------------------------------ */

function ReminderStep({
  value,
  onSelect,
  note,
}: {
  value: ReminderSlot;
  onSelect: (slot: ReminderSlot) => void;
  note: string | null;
}) {
  const t = useThemeTokens();
  const slots: ReminderSlot[] = ['sabah', 'ogle', 'aksam', 'yok'];
  return (
    <View>
      <StepTitle
        title="Günün hangi diliminde pratik yapacaksın?"
        subtitle="Seçersen o saatte kısa bir hatırlatma göndeririz."
      />
      {slots.map((slot) => {
        const selected = value === slot;
        const label = slot === 'yok' ? 'Şimdilik istemiyorum' : REMINDER_SLOTS[slot].label;
        const time = slot === 'yok' ? null : formatTime(REMINDER_SLOTS[slot].time.hour, REMINDER_SLOTS[slot].time.minute);
        return (
          <Pressable
            key={slot}
            onPress={() => onSelect(slot)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={label}
            className={`flex-row items-center justify-between rounded-2xl border p-4 mb-3 ${
              selected
                ? t.isLight
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-emerald-500 bg-[#0d2822]'
                : `${t.cardBorder} ${t.cardBg}`
            }`}
          >
            <Text className={`text-[14px] font-bold ${selected ? toneText('emerald', t.isLight) : t.title}`}>
              {label}
            </Text>
            {time ? (
              <Text className={`text-[12px] font-bold ${selected ? toneText('emerald', t.isLight) : t.muted}`}>
                {time}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
      {note ? <Text className={`text-[11px] leading-5 mt-1 ${t.muted}`}>{note}</Text> : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Adım 4 — Isınma                                                     */
/* ------------------------------------------------------------------ */

function WarmupStep({ goal, onDone }: { goal: OnboardingGoal; onDone: () => void }) {
  return (
    <View>
      <StepTitle title="Kısa bir ısınma yapalım" subtitle="30-60 saniye sürer, istersen atla. Seriye sayılmaz." />
      {goal === 'lugat' ? (
        <LugatWarmup onDone={onDone} />
      ) : goal === 'konusma' ? (
        <SpeechWarmup onDone={onDone} />
      ) : (
        // Anlayış, iletişim ve belagat hedeflerinin kendi ısınması henüz yok;
        // üçü de konuşmadan önce nefesi toparlamaktan fayda gördüğü için ortak
        // nefes ısınmasına düşüyor (YAPILACAKLAR → "Oryantasyon — kalanlar").
        <BreathingWarmup title="Odak nefesi — başlamadan önce 30 saniye" onDone={onDone} />
      )}
    </View>
  );
}

/** Bugünün ilk öğrenilmemiş kelimesi; "Öğrendim" gerçek kaydı `useLugatProgress().markLearned` ile yapar. */
function LugatWarmup({ onDone }: { onDone: () => void }) {
  const t = useThemeTokens();
  const { markLearned } = useLugatProgress();
  // Kart kelimesi donduruluyor: markLearned sonrası liste yeniden hesaplanıp
  // farklı bir kelime döndürebilir, kullanıcı "Öğrendim"e bastığı kelimeyi
  // görmeye devam etsin diye ilk seçim sabit tutuluyor.
  const [word] = React.useState<LugatWord | null>(() => {
    const store = lugatProgressStore.get();
    const { words } = todaysWords(store);
    return words.find((w) => !store.words[w.id]?.learnedAt) ?? words[0] ?? null;
  });
  const [learned, setLearned] = React.useState(false);

  React.useEffect(() => {
    if (!word) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLearn = () => {
    if (!word) return;
    markLearned(word.id);
    setLearned(true);
    onDone();
  };

  if (!word) {
    return (
      <Card>
        <Text className={`text-[13px] ${t.muted}`}>Bugün için gösterilecek kelime yok.</Text>
      </Card>
    );
  }

  return (
    <View>
      <Card>
        <View className="flex-row items-center justify-between mb-2">
          <Text className={`text-[20px] font-black ${t.title}`}>{word.word}</Text>
          {word.origin ? <Badge label={word.origin} tone="slate" /> : null}
        </View>
        <Text className={`text-[13px] leading-5 mb-2 ${t.body}`}>{word.short}</Text>
        <Text className={`text-[12px] italic leading-5 ${t.muted}`}>“{word.example}”</Text>
      </Card>
      <View className="mt-4">
        {learned ? (
          <View className="flex-row items-center justify-center py-4">
            <Check size={16} color={toneColor('emerald', t.isLight)} />
            <Text className={`ml-2 text-[13px] font-bold ${toneText('emerald', t.isLight)}`}>Öğrendim</Text>
          </View>
        ) : (
          <PrimaryButton label="Öğrendim" tone="emerald" onPress={handleLearn} />
        )}
      </View>
    </View>
  );
}

/** Günün bir tekerlemesi; 3 kez "Okudum" işaretlenince ısınma biter. */
function SpeechWarmup({ onDone }: { onDone: () => void }) {
  const t = useThemeTokens();
  const [drill] = React.useState<DictionDrill | null>(() => {
    const pool = allDrills().filter((d) => d.kind === 'tekerleme');
    return pool.length > 0 ? pickForDay(pool, new Date(), 3) : null;
  });
  const [readCount, setReadCount] = React.useState(0);

  React.useEffect(() => {
    if (!drill) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!drill) {
    return (
      <Card>
        <Text className={`text-[13px] ${t.muted}`}>Bugün için tekerleme bulunamadı.</Text>
      </Card>
    );
  }

  const text = drill.items[0]?.text ?? '';
  // onDone state güncelleyicisinin içinden çağrılmıyor: güncelleyici render
  // sırasında çalışır, orada üst bileşenin state'ini değiştirmek React uyarısı verir.
  const handleRead = () => {
    const next = Math.min(readCount + 1, 3);
    setReadCount(next);
    if (next >= 3) onDone();
  };

  return (
    <View>
      <Card>
        <Text className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${t.muted}`}>{drill.title}</Text>
        <Text className={`text-[16px] leading-7 font-semibold ${t.title}`}>{text}</Text>
      </Card>
      <Text className={`text-[12px] leading-5 mt-3 ${t.muted}`}>
        Önce yavaş, sonra normal hızda — 3 kez sesli oku.
      </Text>
      <View className="flex-row items-center mt-4">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginRight: 8,
              backgroundColor: i < readCount ? toneColor('emerald', t.isLight) : t.isLight ? '#e2e8f0' : '#2a2a2e',
            }}
          />
        ))}
        <Text className={`text-[12px] font-bold ml-1 ${t.muted}`}>{Math.min(readCount, 3)}/3</Text>
      </View>
      <View className="mt-4">
        {readCount < 3 ? (
          <PrimaryButton label="Okudum" onPress={handleRead} />
        ) : (
          <View className="flex-row items-center justify-center py-4">
            <Check size={16} color={toneColor('emerald', t.isLight)} />
            <Text className={`ml-2 text-[13px] font-bold ${toneText('emerald', t.isLight)}`}>Tamamlandı</Text>
          </View>
        )}
      </View>
    </View>
  );
}

/** 30 sn 4-6 nefesi: 3 döngü × (4 sn al + 6 sn ver). Zamanlayıcılar ve animasyon unmount'ta temizlenir. */
function BreathingWarmup({ title, onDone }: { title: string; onDone: () => void }) {
  const t = useThemeTokens();
  const [phase, setPhase] = React.useState<'idle' | 'inhale' | 'exhale' | 'done'>('idle');
  const [cycle, setCycle] = React.useState(1);
  const [secondsLeft, setSecondsLeft] = React.useState(INHALE_SECONDS);
  const scale = useSharedValue(0.72);

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimers();
      cancelAnimation(scale);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runPhase = React.useCallback(
    (nextPhase: 'inhale' | 'exhale', nextCycle: number) => {
      clearTimers();
      setPhase(nextPhase);
      setCycle(nextCycle);
      const durationMs = (nextPhase === 'inhale' ? INHALE_SECONDS : EXHALE_SECONDS) * 1000;
      setSecondsLeft(durationMs / 1000);
      scale.value = withTiming(nextPhase === 'inhale' ? 1 : 0.72, {
        duration: durationMs,
        easing: Easing.inOut(Easing.ease),
      });

      let remaining = durationMs / 1000;
      intervalRef.current = setInterval(() => {
        remaining -= 1;
        setSecondsLeft(Math.max(remaining, 0));
      }, 1000);

      timeoutRef.current = setTimeout(() => {
        clearTimers();
        if (nextPhase === 'inhale') {
          runPhase('exhale', nextCycle);
        } else if (nextCycle < BREATH_CYCLES) {
          runPhase('inhale', nextCycle + 1);
        } else {
          setPhase('done');
        }
      }, durationMs);
    },
    [clearTimers, scale],
  );

  React.useEffect(() => {
    if (phase === 'done') onDone();
  }, [phase, onDone]);

  const start = () => runPhase('inhale', 1);

  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const phaseLabel =
    phase === 'inhale'
      ? 'Burundan al'
      : phase === 'exhale'
        ? 'Ağızdan yavaşça ver'
        : phase === 'done'
          ? 'Tamamlandı'
          : 'Hazır olduğunda başla';

  return (
    <View>
      <Card>
        <Text className={`text-[13px] font-bold mb-4 ${t.title}`}>{title}</Text>
        <View className="items-center py-4">
          <Animated.View
            style={[
              {
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: t.isLight ? '#d1fae5' : '#0d2822',
                borderWidth: 2,
                borderColor: toneColor('emerald', t.isLight),
                alignItems: 'center',
                justifyContent: 'center',
              },
              circleStyle,
            ]}
          >
            {phase === 'inhale' || phase === 'exhale' ? (
              <Text className={`text-[22px] font-black ${toneText('emerald', t.isLight)}`}>
                {Math.ceil(secondsLeft)}
              </Text>
            ) : null}
          </Animated.View>
          <Text className={`text-[13px] font-bold mt-4 ${t.title}`}>{phaseLabel}</Text>
          {phase === 'inhale' || phase === 'exhale' ? (
            <Text className={`text-[11px] mt-1 ${t.muted}`}>
              {cycle}/{BREATH_CYCLES}
            </Text>
          ) : null}
        </View>
      </Card>
      <View className="mt-4">
        {phase === 'idle' ? (
          <PrimaryButton label="Başla" tone="emerald" onPress={start} />
        ) : phase === 'done' ? (
          <View className="flex-row items-center justify-center py-4">
            <Check size={16} color={toneColor('emerald', t.isLight)} />
            <Text className={`ml-2 text-[13px] font-bold ${toneText('emerald', t.isLight)}`}>Tamamlandı</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Adım 5 — Bitiş                                                      */
/* ------------------------------------------------------------------ */

function FinishStep({
  goals,
  dailyMinutes,
  reminderSlot,
}: {
  goals: OnboardingGoal[];
  dailyMinutes: DailyMinutes;
  reminderSlot: ReminderSlot;
}) {
  const goalTitles = goals.map((g) => GOAL_META[g].title).join(', ') || 'Henüz seçim yok';
  const reminderText =
    reminderSlot === 'yok'
      ? 'Hatırlatma yok'
      : `Her gün ${formatTime(REMINDER_SLOTS[reminderSlot].time.hour, REMINDER_SLOTS[reminderSlot].time.minute)}`;
  return (
    <View>
      <StepTitle title="İlk adımını attın" subtitle="Kalanını Bugün sekmesinden sürdürebilirsin." />
      <Surface>
        <SummaryRow label="Hedefler" value={goalTitles} />
        <SummaryRow label="Günlük hedef" value={`${dailyMinutes} dk`} divider />
        <SummaryRow label="Hatırlatma" value={reminderText} divider />
      </Surface>
    </View>
  );
}

function SummaryRow({ label, value, divider }: { label: string; value: string; divider?: boolean }) {
  const t = useThemeTokens();
  return (
    <View className={`py-2.5 ${divider ? `border-t ${t.dividerColor}` : ''}`}>
      <Text className={`text-[10px] font-bold uppercase tracking-widest ${t.muted}`}>{label}</Text>
      <Text className={`text-[14px] font-bold mt-1 ${t.title}`}>{value}</Text>
    </View>
  );
}
