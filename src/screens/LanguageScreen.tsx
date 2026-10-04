import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  X as XIcon,
  Award,
  Sparkles,
} from 'lucide-react-native';

import { Segmented, Badge, Toggle, type Tone } from '../components/AppUI';
import {
  ScreenShell,
  SettingsButton,
  Card,
  SectionTitle,
  PrimaryButton,
  GhostButton,
  Chip,
  ProgressBar,
  SettingRow,
  useThemeTokens,
} from '../components/practice/PracticeUI';
import { ModuleSettingsSheet } from '../components/practice/ModuleSettingsSheet';
import {
  USAGE_ITEMS,
  buildFillBlankQuiz,
  buildLevelQuiz,
  buildMeaningQuiz,
  findWord,
  pickDailyIdiom,
  type FillBlankQuestion,
  type Idiom,
  type LugatLevel,
  type LugatWord,
  type MeaningQuestion,
  type UsageItem,
} from '../data/lugat';
import { useLugatProgress, useTodaysWords, useDueCount, type LugatPrefs } from '../utils/lugatProgress';
import { useDailyPracticeSettings } from '../utils/dailyPracticeSettings';
import {
  useDailyProgress,
  isCompletedToday,
  testHistory,
  type ProgressState,
} from '../utils/dailyPracticeProgress';
import { TestTrend } from '../components/practice/TestTrend';
import { TEST_LUGAT_LEVEL, findMeasureTest } from '../data/measureTests';
import { MeasureScale } from '../components/practice/MeasureTests';
import { useDayKey } from '../utils/today';
import { useDueWordIds } from '../utils/lugatProgress';
import { addResponse } from '../utils/responseHistory';

// Dil ekranı (lugat & Türkçe).
// Amaç söz sanatları değil kelime öğrenmek: lugat (söz varlığı) geliştirme,
// Türkçeyi daha iyi anlama ve doğru kullanma. Belagat (söz sanatları) burada
// yalnızca "Daha fazla" altında, ileri düzey ayrı bir bölüme bağlantı olarak yer alır.
//
// Günün metni gibi tam bir günlük pratik modülü: kendi aç/kapa + hatırlatma
// ayarı (ModuleSettingsSheet module="lugat"), günlük kelime listesi
// (useTodaysWords) ve tamamlanma günlük pratik serisine işleniyor
// (bkz. utils/lugatProgress.ts markLearned / completeReview).

type Tab = 'kelimeler' | 'alistirma' | 'dogru-turkce' | 'lugatim';

const LEVEL_LABELS: Record<LugatLevel, string> = {
  temel: 'Temel',
  orta: 'Orta',
  ileri: 'İleri',
};

const LEVEL_TONE: Record<LugatLevel, Tone> = {
  temel: 'emerald',
  orta: 'blue',
  ileri: 'violet',
};

const USAGE_KIND_LABELS: Record<UsageItem['kind'], string> = {
  yazim: 'Yazım',
  anlam: 'Anlam',
  kullanim: 'Kullanım',
};

export default function LanguageScreen({ navigation, route }: any) {
  const t = useThemeTokens();
  const { settings, updateModule } = useDailyPracticeSettings();
  const {
    prefs,
    setPrefs,
    learnedCount,
    savedIds,
    learnedIds,
    state,
    markLearned,
    toggleSaved,
    recordAnswer,
    completeReview,
  } = useLugatProgress();
  const { progress, logTest } = useDailyProgress();
  const { words: dailyWords, isReview, learned: todaysLearned, total: todaysTotal } = useTodaysWords();

  // `Ölç` düğmesiyle (Karne → Kelime seviye tespiti) buraya gelindiğinde
  // Alıştırma sekmesi seçili başlasın; parametre yokken davranış aynı kalır.
  const [tab, setTab] = React.useState<Tab>(route?.params?.tab === 'alistirma' ? 'alistirma' : 'kelimeler');
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // `day`: gün dönümünde günün deyimi tazelensin (Bölüm 7). Kelime listesi
  // ayrıca `useTodaysWords` üzerinden aynı anahtara bağlı.
  const day = useDayKey();
  const dailyIdiom = React.useMemo(() => pickDailyIdiom(), [day]);
  const streak = progress.modules.lugat.streak;
  const reviewDone = isCompletedToday(progress, 'lugat');

  return (
    <ScreenShell
      title="Dil"
      subtitle={`${learnedCount} kelime öğrenildi · ${streak} günlük seri`}
      onClose={() => navigation?.goBack?.()}
      right={<SettingsButton onPress={() => setSheetOpen(true)} label="Dil ayarları" />}
    >
      <View className="mt-1 mb-2">
        <Segmented<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: 'kelimeler', label: 'Kelimeler' },
            { value: 'alistirma', label: 'Alıştırma' },
            { value: 'dogru-turkce', label: 'Doğru Türkçe' },
            { value: 'lugatim', label: 'Lugatım' },
          ]}
        />
      </View>

      {tab === 'kelimeler' ? (
        <WordsTab
          words={dailyWords}
          isReview={isReview}
          reviewDone={reviewDone}
          todaysLearned={todaysLearned}
          todaysTotal={todaysTotal}
          onCompleteReview={completeReview}
          idiom={dailyIdiom}
          progress={state.words}
          onLearn={markLearned}
          onToggleSave={toggleSaved}
          navigation={navigation}
        />
      ) : null}

      {tab === 'alistirma' ? (
        <ExerciseTab
          onAnswer={recordAnswer}
          progress={progress}
          logTest={logTest}
          prefs={prefs}
          setPrefs={setPrefs}
        />
      ) : null}

      {tab === 'dogru-turkce' ? <UsageTab /> : null}

      {tab === 'lugatim' ? (
        <MyWordsTab savedIds={savedIds} learnedIds={learnedIds} progress={state.words} />
      ) : null}

      <ModuleSettingsSheet module="lugat" visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <SettingsSheetContent prefs={prefs} onChange={setPrefs} />
        <View className={`border-t ${t.dividerColor}`}>
          <SettingRow
            title="Ana ekranda kelime kartı"
            description="Bugün sekmesinde günün kelimesi kartı görünsün."
            right={
              <Toggle
                value={settings.lugat.showOnHome}
                onValueChange={(v) => updateModule('lugat', { showOnHome: v })}
              />
            }
          />
        </View>
      </ModuleSettingsSheet>
    </ScreenShell>
  );
}

/* ------------------------------------------------------------------ */
/* Ayarlar paneli                                                      */
/* ------------------------------------------------------------------ */

function SettingsSheetContent({
  prefs,
  onChange,
}: {
  prefs: LugatPrefs;
  onChange: (patch: Partial<LugatPrefs>) => void;
}) {
  return (
    <View className="pb-2">
      <SectionTitle>Günlük Kelime Sayısı</SectionTitle>
      <View className="flex-row flex-wrap">
        {[3, 5].map((count) => (
          <Chip
            key={count}
            label={`${count} kelime`}
            selected={prefs.dailyCount === count}
            onPress={() => onChange({ dailyCount: count as 3 | 5 })}
          />
        ))}
      </View>

      <SectionTitle>Seviye</SectionTitle>
      <View className="flex-row flex-wrap">
        {(['hepsi', 'temel', 'orta', 'ileri'] as LugatPrefs['level'][]).map((lvl) => (
          <Chip
            key={lvl}
            label={lvl === 'hepsi' ? 'Hepsi' : LEVEL_LABELS[lvl]}
            selected={prefs.level === lvl}
            onPress={() => onChange({ level: lvl })}
          />
        ))}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Kelimeler                                                        */
/* ------------------------------------------------------------------ */

function WordsTab({
  words,
  isReview,
  reviewDone,
  todaysLearned,
  todaysTotal,
  onCompleteReview,
  idiom,
  progress,
  onLearn,
  onToggleSave,
  navigation,
}: {
  words: LugatWord[];
  /** Bu seviyedeki kelimelerin tamamı daha önce öğrenilmiş: liste tekrar için. */
  isReview: boolean;
  /** Tekrar günündeki tamamlama zaten işlendi mi (aynı gün ikinci kez sorulmasın). */
  reviewDone: boolean;
  todaysLearned: number;
  todaysTotal: number;
  onCompleteReview: () => void;
  idiom: Idiom;
  progress: Record<string, { learnedAt?: string; saved?: boolean }>;
  onLearn: (id: string) => void;
  onToggleSave: (id: string) => void;
  navigation: any;
}) {
  const t = useThemeTokens();
  return (
    <View className="mt-2">
      {/* Tekrar gününde aşağıdaki not kartı durumu anlatıyor; bu satır yalnızca yeni kelime günü için. */}
      {!isReview ? (
        <Text className={`text-[11px] leading-5 mb-3 ${t.muted}`}>
          {todaysTotal > 0 && todaysLearned === todaysTotal
            ? `Bugünün ${todaysTotal} kelimesi tamam — günlük pratik serine işlendi.`
            : `Bugün ${todaysLearned}/${todaysTotal} · Hepsini "Öğrendim" diye işaretleyince günlük pratik tamamlanır.`}
        </Text>
      ) : null}

      {isReview ? (
        <Card className="mb-3">
          <Text className={`text-[12px] leading-5 ${t.body}`}>
            Bu seviyedeki kelimelerin hepsini öğrendin; bugünkü liste tekrar için.
          </Text>
          <View className="mt-3">
            {reviewDone ? (
              <View
                className={`rounded-2xl py-3 items-center justify-center flex-row border ${
                  t.isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950 border-emerald-800'
                }`}
              >
                <Check size={16} color={t.isLight ? '#059669' : '#34d399'} />
                <Text
                  className={`ml-1.5 font-bold text-[13px] ${
                    t.isLight ? 'text-emerald-700' : 'text-emerald-300'
                  }`}
                >
                  Tekrar tamamlandı
                </Text>
              </View>
            ) : (
              <GhostButton label="Tekrarı tamamladım" onPress={onCompleteReview} />
            )}
          </View>
        </Card>
      ) : null}

      {words.map((word) => (
        <WordCard
          key={word.id}
          word={word}
          learned={!!progress[word.id]?.learnedAt}
          saved={!!progress[word.id]?.saved}
          onLearn={() => onLearn(word.id)}
          onToggleSave={() => onToggleSave(word.id)}
        />
      ))}

      <SectionTitle hint="Deyim ve atasözleri de söz varlığının bir parçasıdır.">
        Günün Deyimi / Atasözü
      </SectionTitle>
      <Card>
        <View className="flex-row items-center mb-2">
          <Text className={`text-[11px] font-bold uppercase tracking-widest ${t.muted}`}>
            {idiom.kind === 'deyim' ? 'Deyim' : 'Atasözü'}
          </Text>
        </View>
        <Text className={`text-[16px] font-bold leading-6 ${t.title}`}>{idiom.text}</Text>
        <Text className={`text-[12px] mt-2 leading-5 ${t.body}`}>{idiom.meaning}</Text>
        <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
          <Text className={`text-[12px] italic leading-5 ${t.accent}`}>{idiom.example}</Text>
        </View>
      </Card>

      <SectionTitle>Daha Fazla</SectionTitle>
      <Pressable
        onPress={() => navigation?.navigate?.('DailyText')}
        accessibilityRole="button"
        accessibilityLabel="Günün Metni ekranına git"
        className="mb-2"
      >
        <Card>
          <View className="flex-row items-center">
            <View
              className={`w-10 h-10 rounded-2xl items-center justify-center mr-3 ${
                t.isLight ? 'bg-blue-50' : 'bg-[#182642]'
              }`}
            >
              <BookOpen size={18} color={t.isLight ? '#2563eb' : '#60a5fa'} />
            </View>
            <View className="flex-1">
              <Text className={`text-[13px] font-bold ${t.title}`}>Günün Metni</Text>
              <Text className={`text-[11px] mt-0.5 ${t.muted}`}>Kısa bir metinle okuma pratiği.</Text>
            </View>
          </View>
        </Card>
      </Pressable>
      <Pressable
        onPress={() => navigation?.navigate?.('BelagatExercise')}
        accessibilityRole="button"
        accessibilityLabel="Söz Sanatları (Belagat) ekranına git"
      >
        <Card>
          <View className="flex-row items-center">
            <View
              className={`w-10 h-10 rounded-2xl items-center justify-center mr-3 ${
                t.isLight ? 'bg-violet-50' : 'bg-[#271b40]'
              }`}
            >
              <Sparkles size={18} color={t.isLight ? '#7c3aed' : '#a78bfa'} />
            </View>
            <View className="flex-1">
              <Text className={`text-[13px] font-bold ${t.title}`}>Söz Sanatları (Belâgat)</Text>
              <Text className={`text-[11px] mt-0.5 ${t.muted}`}>İleri düzey — teşbih, istiare, cinas...</Text>
            </View>
          </View>
        </Card>
      </Pressable>
    </View>
  );
}

function WordCard({
  word,
  learned,
  saved,
  onLearn,
  onToggleSave,
}: {
  word: LugatWord;
  learned: boolean;
  saved: boolean;
  onLearn: () => void;
  onToggleSave: () => void;
}) {
  const t = useThemeTokens();
  return (
    <Card className="mb-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center flex-wrap">
            <Text className={`text-[19px] font-black ${t.title}`}>{word.word}</Text>
            {word.origin ? (
              <View className="ml-2 mt-0.5">
                <Badge label={word.origin} tone={LEVEL_TONE[word.level]} />
              </View>
            ) : null}
          </View>
          <Text className={`text-[13px] mt-1 leading-5 ${t.body}`}>{word.short}</Text>
        </View>
        <Pressable
          onPress={onToggleSave}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Lugatımdan çıkar' : 'Lugatıma ekle'}
          accessibilityState={{ selected: saved }}
        >
          {saved ? (
            <BookmarkCheck size={20} color={t.isLight ? '#059669' : '#34d399'} />
          ) : (
            <Bookmark size={20} color={t.iconColor} />
          )}
        </Pressable>
      </View>

      {word.meanings.length > 1 ? (
        <View className="mt-3">
          {word.meanings.map((m, i) => (
            <View key={i} className="flex-row mb-1">
              <Text className={`text-[11px] mr-2 ${t.accent}`}>•</Text>
              <Text className={`text-[12px] flex-1 leading-5 ${t.body}`}>{m}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
        <Text className={`text-[13px] italic leading-5 ${t.title}`}>{word.example}</Text>
      </View>

      {word.synonyms.length > 0 || word.antonyms.length > 0 ? (
        <View className="mt-3">
          {word.synonyms.length > 0 ? (
            <Text className={`text-[11px] leading-5 ${t.muted}`}>
              Eş anlamlı: <Text className={t.body}>{word.synonyms.join(', ')}</Text>
            </Text>
          ) : null}
          {word.antonyms.length > 0 ? (
            <Text className={`text-[11px] leading-5 ${t.muted}`}>
              Zıt anlamlı: <Text className={t.body}>{word.antonyms.join(', ')}</Text>
            </Text>
          ) : null}
        </View>
      ) : null}

      {word.note ? (
        <View className={`mt-3 rounded-xl p-3 ${t.isLight ? 'bg-amber-50' : 'bg-[#2e1d0d]'}`}>
          <Text className={`text-[11px] leading-5 ${t.isLight ? 'text-amber-700' : 'text-amber-300'}`}>
            {word.note}
          </Text>
        </View>
      ) : null}

      <View className="flex-row mt-4" style={{ gap: 8 }}>
        <View className="flex-1">
          {learned ? (
            <View
              className={`rounded-2xl py-3 items-center justify-center flex-row border ${
                t.isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950 border-emerald-800'
              }`}
            >
              <Check size={16} color={t.isLight ? '#059669' : '#34d399'} />
              <Text
                className={`ml-1.5 font-bold text-[13px] ${
                  t.isLight ? 'text-emerald-700' : 'text-emerald-300'
                }`}
              >
                Öğrendim
              </Text>
            </View>
          ) : (
            <GhostButton label="Öğrendim" onPress={onLearn} />
          )}
        </View>
      </View>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Alıştırma                                                        */
/* ------------------------------------------------------------------ */

type ExerciseMode = 'anlam' | 'bosluk' | 'seviye';

/** Yüzdeye göre seviye ÖNERİSİ — otomatik uygulanmaz, kullanıcı onaylar. */
function suggestLevelFromPercent(percent: number): LugatLevel {
  if (percent < 50) return 'temel';
  if (percent < 80) return 'orta';
  return 'ileri';
}

type QuizItem = {
  id: string;
  /** Yanıt defteri satır başlığı için — kelimenin kendisi. */
  wordText: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
};

function meaningQuestionsToQuizItems(questions: MeaningQuestion[]): QuizItem[] {
  return questions.map((q) => ({
    id: q.word.id,
    wordText: q.word.word,
    prompt: `"${q.word.word}" kelimesinin anlamı nedir?`,
    options: q.options,
    correctId: q.correctId,
    explanation: `${q.word.word} — ${q.word.short}\nÖrnek: ${q.word.example}`,
  }));
}

function fillBlankQuestionsToQuizItems(questions: FillBlankQuestion[]): QuizItem[] {
  return questions.map((q) => ({
    id: q.word.id,
    wordText: q.word.word,
    prompt: q.sentence,
    options: q.options,
    correctId: q.correctId,
    explanation: `${q.word.word} — ${q.word.short}\nÖrnek: ${q.word.example}`,
  }));
}

/** Seçilen şıkkın ve doğru şıkkın METNİ — yanıt defterinde kimlik değil okunur şık görünsün diye. */
function optionTexts(question: QuizItem, chosenId: string) {
  const chosen = question.options.find((o) => o.id === chosenId)?.text ?? '';
  const expected = question.options.find((o) => o.id === question.correctId)?.text ?? '';
  return { chosen, expected };
}

function ExerciseTab({
  onAnswer,
  progress,
  logTest,
  prefs,
  setPrefs,
}: {
  onAnswer: (id: string, correct: boolean) => void;
  progress: ProgressState;
  logTest: (testId: string, value: number) => void;
  prefs: LugatPrefs;
  setPrefs: (patch: Partial<LugatPrefs>) => void;
}) {
  const t = useThemeTokens();
  const [mode, setMode] = React.useState<ExerciseMode>('anlam');

  // Aralıklı tekrar: sırası gelen kelimeler soruların başına alınır, kalan yer
  // günün normal karıştırmasından dolar (YAPILACAKLAR Bölüm 7).
  const dueIds = useDueWordIds(5);
  const dueWordCount = useDueCount();

  const items = React.useMemo(() => {
    if (mode === 'anlam') {
      return meaningQuestionsToQuizItems(buildMeaningQuiz(5, new Date(), dueIds));
    }
    if (mode === 'bosluk') {
      return fillBlankQuestionsToQuizItems(buildFillBlankQuiz(5, new Date(), dueIds));
    }
    return [];
  }, [mode, dueIds]);

  return (
    <View className="mt-2">
      <View className="flex-row flex-wrap mb-2">
        <Chip label="Anlam testi" selected={mode === 'anlam'} onPress={() => setMode('anlam')} />
        <Chip label="Boşluk doldurma" selected={mode === 'bosluk'} onPress={() => setMode('bosluk')} />
        <Chip label="Seviye tespiti" selected={mode === 'seviye'} onPress={() => setMode('seviye')} />
      </View>
      {dueWordCount > 0 && mode !== 'seviye' ? (
        <Text className={`text-[11px] leading-5 mb-3 ${t.accent}`}>
          Tekrar sırası gelen: {dueWordCount} kelime — testlerde önce bunlar sorulur.
        </Text>
      ) : null}
      {mode === 'seviye' ? (
        <LevelQuizTab
          onAnswer={onAnswer}
          progress={progress}
          logTest={logTest}
          prefs={prefs}
          setPrefs={setPrefs}
        />
      ) : (
        <QuizRunner key={mode} items={items} onAnswer={onAnswer} mode={mode} />
      )}
    </View>
  );
}

/** Soru + şıklar + açıklama + devam düğmesi — hem sıradan quiz hem seviye tespiti bunu paylaşır. */
function QuizQuestionView({
  question,
  index,
  total,
  score,
  selected,
  onChoose,
  onNext,
}: {
  question: QuizItem;
  index: number;
  total: number;
  score: number;
  selected: string | null;
  onChoose: (optionId: string) => void;
  onNext: () => void;
}) {
  const t = useThemeTokens();
  return (
    <View>
      <View className="mb-4">
        <ProgressBar value={index / total} tone="emerald" />
        <Text className={`text-[11px] mt-2 ${t.muted}`}>
          Soru {index + 1}/{total} · {score} doğru
        </Text>
      </View>

      <Card>
        <Text className={`text-[15px] font-bold leading-6 ${t.title}`}>{question.prompt}</Text>
      </Card>

      <View className="mt-4">
        {question.options.map((option) => {
          const isCorrect = option.id === question.correctId;
          const isPicked = option.id === selected;
          const revealed = selected !== null;

          let stateClasses = `${t.cardBg} ${t.cardBorder}`;
          if (revealed && isCorrect) {
            stateClasses = t.isLight
              ? 'bg-emerald-50 border-emerald-400'
              : 'bg-emerald-950 border-emerald-600';
          } else if (revealed && isPicked) {
            stateClasses = t.isLight ? 'bg-red-50 border-red-400' : 'bg-red-950 border-red-600';
          }

          return (
            <Pressable
              key={option.id}
              onPress={() => onChoose(option.id)}
              disabled={revealed}
              accessibilityRole="button"
              accessibilityLabel={option.text}
              className={`flex-row items-center rounded-2xl border p-4 mb-2 ${stateClasses}`}
            >
              <Text className={`text-[13px] flex-1 leading-5 ${t.title}`}>{option.text}</Text>
              {revealed && isCorrect ? (
                <Check size={18} color={t.isLight ? '#059669' : '#34d399'} />
              ) : null}
              {revealed && isPicked && !isCorrect ? (
                <XIcon size={18} color={t.isLight ? '#dc2626' : '#f87171'} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {selected !== null ? (
        <>
          <Card className="mt-2">
            <Text className={`text-[12px] leading-5 ${t.body}`}>{question.explanation}</Text>
          </Card>
          <View className="mt-4 mb-2">
            <PrimaryButton
              label={index + 1 < total ? 'Sıradaki soru' : 'Bitir'}
              onPress={onNext}
              tone="emerald"
            />
          </View>
        </>
      ) : null}
    </View>
  );
}

function QuizRunner({
  items,
  onAnswer,
  mode,
}: {
  items: QuizItem[];
  onAnswer: (id: string, correct: boolean) => void;
  /** Yanıt defterinde "anlam testi" ile "boşluk doldurma"yı ayırt etmek için. */
  mode: Extract<ExerciseMode, 'anlam' | 'bosluk'>;
}) {
  const t = useThemeTokens();
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);

  if (items.length === 0) {
    return (
      <Card>
        <Text className={`text-[12px] text-center ${t.muted}`}>
          Bu mod için henüz yeterli örnek cümle yok. Diğer modu deneyebilirsin.
        </Text>
      </Card>
    );
  }

  const question = items[Math.min(index, items.length - 1)];

  const choose = (optionId: string) => {
    if (selected !== null) return;
    setSelected(optionId);
    const correct = optionId === question.correctId;
    if (correct) setScore((s) => s + 1);
    onAnswer(question.id, correct);
    const { chosen, expected } = optionTexts(question, optionId);
    addResponse({
      module: 'lugat',
      refId: question.id,
      title: question.wordText,
      prompt: mode === 'bosluk' ? `Boşluk doldurma: ${question.prompt}` : question.prompt,
      answer: chosen,
      kind: 'choice',
      correct,
      expected,
    });
  };

  const next = () => {
    if (index + 1 < items.length) {
      setIndex(index + 1);
      setSelected(null);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <View className="mt-2">
        <Card>
          <View className="flex-row items-center">
            <Award size={18} color={t.isLight ? '#059669' : '#34d399'} />
            <Text className={`text-[16px] font-bold ml-2 ${t.title}`}>
              {score}/{items.length} doğru
            </Text>
          </View>
          <Text className={`text-[12px] mt-2 leading-5 ${t.body}`}>
            {score === items.length
              ? 'Tam isabet. Kelimeler sekmesinden yeni kelimeler öğrenmeye devam edebilirsin.'
              : 'Yanlış cevapladıklarını Kelimeler sekmesinde tekrar gözden geçirmek iyi olur.'}
          </Text>
        </Card>
        <View className="mt-4">
          <GhostButton
            label="Yeniden dene"
            onPress={() => {
              setIndex(0);
              setSelected(null);
              setScore(0);
              setDone(false);
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <QuizQuestionView
      question={question}
      index={index}
      total={items.length}
      score={score}
      selected={selected}
      onChoose={choose}
      onNext={next}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 2b. Alıştırma — Seviye tespiti                                      */
/* ------------------------------------------------------------------ */

function LevelQuizTab({
  onAnswer,
  progress,
  logTest,
  prefs,
  setPrefs,
}: {
  onAnswer: (id: string, correct: boolean) => void;
  progress: ProgressState;
  logTest: (testId: string, value: number) => void;
  prefs: LugatPrefs;
  setPrefs: (patch: Partial<LugatPrefs>) => void;
}) {
  const t = useThemeTokens();
  const [attempt, setAttempt] = React.useState(0);

  // `attempt` tohuma karışır: aynı gün her "yeniden dene" farklı sorular getirir
  // (bkz. src/data/lugat.ts → buildLevelQuiz), ama aynı deneme her zaman aynı
  // sonucu verir.
  const items = React.useMemo(
    () => meaningQuestionsToQuizItems(buildLevelQuiz(10, new Date(), attempt)),
    [attempt],
  );

  const history = testHistory(progress, TEST_LUGAT_LEVEL);

  return (
    <View>
      <Text className={`text-[11px] leading-5 mb-3 ${t.muted}`}>
        Temel, orta ve ileri düzeyden dengeli dağılmış 10 soru. Bu bir öz-değerlendirme; sonunda
        seviye ÖNERİSİ görürsün, mevcut seçimin kendiliğinden değişmez.
      </Text>

      <LevelQuizRunner
        key={attempt}
        items={items}
        onAnswer={onAnswer}
        onRetry={() => setAttempt((a) => a + 1)}
        onFinish={(score, total) => {
          const percent = total > 0 ? Math.round((score / total) * 100) : 0;
          logTest(TEST_LUGAT_LEVEL, percent);
        }}
        currentLevel={prefs.level}
        onApplyLevel={(level) => setPrefs({ level })}
      />

      {history.length > 0 ? (
        <View className="mt-4">
          <SectionTitle>Geçmiş</SectionTitle>
          <Card>
            <MeasureScale
              test={findMeasureTest(TEST_LUGAT_LEVEL)!}
              value={history[history.length - 1].value}
              history={history}
            />
            <TestTrend history={history} unit="%" decimals={0} improvement="higher" />
          </Card>
        </View>
      ) : null}
    </View>
  );
}

function LevelQuizRunner({
  items,
  onAnswer,
  onFinish,
  onRetry,
  currentLevel,
  onApplyLevel,
}: {
  items: QuizItem[];
  onAnswer: (id: string, correct: boolean) => void;
  /** Sınav bitince bir kez çağrılır — geçmişe kaydetmek için. */
  onFinish: (score: number, total: number) => void;
  onRetry: () => void;
  currentLevel: LugatPrefs['level'];
  onApplyLevel: (level: LugatLevel) => void;
}) {
  const t = useThemeTokens();
  // Sınav kendiliğinden başlamıyor: diğer ölçümlerde olduğu gibi burada da bir
  // "başla" anı var, yoksa ekrana gelen kişi ilk soruyu hazırlıksız görüyordu.
  // `key={attempt}` sayesinde "Yeniden dene" bu kapıyı da sıfırlar.
  const [started, setStarted] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  const finishedRef = React.useRef(false);

  if (items.length === 0) {
    return (
      <Card>
        <Text className={`text-[12px] text-center ${t.muted}`}>
          Seviye tespiti için yeterli soru oluşturulamadı.
        </Text>
      </Card>
    );
  }

  const question = items[Math.min(index, items.length - 1)];

  const choose = (optionId: string) => {
    if (selected !== null) return;
    setSelected(optionId);
    const correct = optionId === question.correctId;
    if (correct) setScore((s) => s + 1);
    onAnswer(question.id, correct);
    const { chosen, expected } = optionTexts(question, optionId);
    addResponse({
      module: 'lugat',
      refId: question.id,
      title: question.wordText,
      // Anlam testiyle aynı soru kalıbını kullanır; deftere karışmasınlar diye ayırt edici son ek.
      prompt: `${question.prompt} · Seviye tespiti`,
      answer: chosen,
      kind: 'choice',
      correct,
      expected,
    });
  };

  const next = () => {
    if (index + 1 < items.length) {
      setIndex(index + 1);
      setSelected(null);
      return;
    }
    setDone(true);
  };

  // Bitiş yalnızca bir kez geçmişe yazılır — `done`'a her yeniden render'da değil.
  React.useEffect(() => {
    if (done && !finishedRef.current) {
      finishedRef.current = true;
      onFinish(score, items.length);
    }
  }, [done, score, items.length, onFinish]);

  if (done) {
    const percent = items.length > 0 ? Math.round((score / items.length) * 100) : 0;
    const suggested = suggestLevelFromPercent(percent);
    const matchesCurrent = suggested === currentLevel;

    return (
      <View className="mt-2">
        <Card>
          <View className="flex-row items-center">
            <Award size={18} color={t.isLight ? '#059669' : '#34d399'} />
            <Text className={`text-[16px] font-bold ml-2 ${t.title}`}>
              {score}/{items.length} doğru · %{percent}
            </Text>
          </View>
          <Text className={`text-[12px] mt-2 leading-5 ${t.body}`}>
            {matchesCurrent
              ? 'Seviyen zaten uygun.'
              : `Bu sonuca göre öneri: ${LEVEL_LABELS[suggested]}. Bu bir öz-değerlendirme; seçimini biz değiştirmeyiz, kararı sen verirsin.`}
          </Text>
        </Card>

        {!matchesCurrent ? (
          <View className="mt-3">
            {applied ? (
              <Text className={`text-[12px] font-bold text-center ${t.accent}`}>
                Seviye {LEVEL_LABELS[suggested]} olarak ayarlandı.
              </Text>
            ) : (
              <GhostButton
                label={`Seviyemi ${LEVEL_LABELS[suggested]} yap`}
                onPress={() => {
                  onApplyLevel(suggested);
                  setApplied(true);
                }}
              />
            )}
          </View>
        ) : null}

        <View className="mt-3">
          <GhostButton label="Yeniden dene" onPress={onRetry} />
        </View>
      </View>
    );
  }

  if (!started) {
    return (
      <Card>
        <Text className={`text-[13px] font-bold ${t.title}`}>
          {items.length} soruluk anlam sınavı
        </Text>
        <Text className={`text-[12px] mt-1.5 mb-3 leading-5 ${t.muted}`}>
          Her soruda tek doğru şık var ve geri dönüş yok. Sonunda yüzdeni ve seviye önerini
          görürsün.
        </Text>
        <GhostButton label="Sınava başla" onPress={() => setStarted(true)} />
      </Card>
    );
  }

  return (
    <QuizQuestionView
      question={question}
      index={index}
      total={items.length}
      score={score}
      selected={selected}
      onChoose={choose}
      onNext={next}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 3. Doğru Türkçe                                                     */
/* ------------------------------------------------------------------ */

type UsageFilter = 'tumu' | UsageItem['kind'];

const USAGE_FILTERS: { value: UsageFilter; label: string }[] = [
  { value: 'tumu', label: 'Tümü' },
  { value: 'yazim', label: 'Yazım' },
  { value: 'anlam', label: 'Anlam' },
  { value: 'kullanim', label: 'Kullanım' },
];

function UsageTab() {
  const t = useThemeTokens();
  const [filter, setFilter] = React.useState<UsageFilter>('tumu');
  const [openId, setOpenId] = React.useState<string | null>(null);

  const items = filter === 'tumu' ? USAGE_ITEMS : USAGE_ITEMS.filter((u) => u.kind === filter);

  return (
    <View className="mt-2">
      <View className="flex-row flex-wrap mb-2">
        {USAGE_FILTERS.map((f) => (
          <Chip key={f.value} label={f.label} selected={filter === f.value} onPress={() => setFilter(f.value)} />
        ))}
      </View>

      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => setOpenId(isOpen ? null : item.id)}
            accessibilityRole="button"
            accessibilityLabel={`${item.right} — doğru kullanım`}
            accessibilityState={{ expanded: isOpen }}
            className="mb-2"
          >
            <Card>
              <Text className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${t.muted}`}>
                {USAGE_KIND_LABELS[item.kind]}
              </Text>
              <View className="flex-row items-center flex-wrap">
                <Text
                  className={`text-[14px] font-bold mr-2 ${t.isLight ? 'text-red-600' : 'text-red-400'}`}
                  style={{ textDecorationLine: 'line-through' }}
                >
                  {item.wrong}
                </Text>
                <Text className={`text-[13px] mr-2 ${t.muted}`}>→</Text>
                <Text
                  className={`text-[14px] font-bold ${t.isLight ? 'text-emerald-600' : 'text-emerald-400'}`}
                >
                  {item.right}
                </Text>
              </View>

              {isOpen ? (
                <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
                  <Text className={`text-[12px] leading-5 ${t.body}`}>{item.explanation}</Text>
                  <Text className={`text-[12px] italic leading-5 mt-2 ${t.accent}`}>{item.example}</Text>
                </View>
              ) : null}
            </Card>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Lugatım                                                          */
/* ------------------------------------------------------------------ */

function MyWordsTab({
  savedIds,
  learnedIds,
  progress,
}: {
  savedIds: string[];
  learnedIds: string[];
  progress: Record<string, { correct: number; wrong: number }>;
}) {
  const t = useThemeTokens();
  const [openId, setOpenId] = React.useState<string | null>(null);

  const savedWords = savedIds.map((id) => findWord(id)).filter((w): w is LugatWord => !!w);
  const learnedWords = learnedIds.map((id) => findWord(id)).filter((w): w is LugatWord => !!w);

  return (
    <View className="mt-2">
      <SectionTitle hint="Kaydettiğin kelimeler — hazır olduğunda alıştırmaya geçebilirsin.">
        Kaydettiklerim · {savedWords.length}
      </SectionTitle>
      {savedWords.length === 0 ? (
        <Card>
          <Text className={`text-[12px] text-center ${t.muted}`}>
            Henüz kelime kaydetmedin. Kelimeler sekmesinde bir karttaki işaret simgesine dokunarak lugatına
            ekleyebilirsin.
          </Text>
        </Card>
      ) : (
        savedWords.map((word) => (
          <MiniWordRow
            key={word.id}
            word={word}
            open={openId === word.id}
            onToggle={() => setOpenId(openId === word.id ? null : word.id)}
            stat={progress[word.id]}
          />
        ))
      )}

      <SectionTitle hint="Öğrendim olarak işaretlediğin kelimeler.">
        Öğrendiklerim · {learnedWords.length}
      </SectionTitle>
      {learnedWords.length === 0 ? (
        <Card>
          <Text className={`text-[12px] text-center ${t.muted}`}>
            Henüz "Öğrendim" olarak işaretlediğin bir kelime yok.
          </Text>
        </Card>
      ) : (
        learnedWords.map((word) => (
          <MiniWordRow
            key={word.id}
            word={word}
            open={openId === word.id}
            onToggle={() => setOpenId(openId === word.id ? null : word.id)}
            stat={progress[word.id]}
          />
        ))
      )}
    </View>
  );
}

function MiniWordRow({
  word,
  open,
  onToggle,
  stat,
}: {
  word: LugatWord;
  open: boolean;
  onToggle: () => void;
  stat?: { correct: number; wrong: number };
}) {
  const t = useThemeTokens();
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={word.word}
      accessibilityState={{ expanded: open }}
      className="mb-2"
    >
      <Card>
        <View className="flex-row items-center">
          <View className="flex-1 pr-2">
            <Text className={`text-[14px] font-bold ${t.title}`}>{word.word}</Text>
            <Text className={`text-[11px] mt-0.5 leading-4 ${t.muted}`}>{word.short}</Text>
          </View>
          {stat && stat.correct > 0 ? (
            <View className={`px-2 py-1 rounded-full ${t.isLight ? 'bg-emerald-100' : 'bg-emerald-900'}`}>
              <Text className={`text-[10px] font-bold ${t.isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
                {stat.correct}✓
              </Text>
            </View>
          ) : null}
        </View>
        {open ? (
          <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
            <Text className={`text-[12px] leading-5 ${t.body}`}>{word.example}</Text>
            {word.synonyms.length > 0 ? (
              <Text className={`text-[11px] mt-2 ${t.muted}`}>Eş anlamlı: {word.synonyms.join(', ')}</Text>
            ) : null}
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
}
