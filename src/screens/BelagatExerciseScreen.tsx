import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Feather, Check, X as XIcon, Award, Lightbulb, GraduationCap } from 'lucide-react-native';

import {
  ScreenShell,
  Card,
  SectionTitle,
  PrimaryButton,
  GhostButton,
  Chip,
  ProgressBar,
  useThemeTokens,
} from '../components/practice/PracticeUI';
import {
  BELAGAT_ARTS,
  BRANCH_DESCRIPTIONS,
  BRANCH_LABELS,
  FESAHAT_FLAWS,
  artsForBranch,
  buildRecognitionQuiz,
  pickDailyBelagatArt,
  type BelagatArt,
  type BelagatBranch,
  type RecognitionQuestion,
} from '../data/belagat';
import { useDailyPracticeSettings, type BelagatBranchFilter } from '../utils/dailyPracticeSettings';
import { masteredArtCount, useDailyProgress } from '../utils/dailyPracticeProgress';

// Belagat egzersizi.
// Üç aşama: günün sanatını öğrenme → tanıma alıştırması → üretim alıştırması.
// Ayrıca tüm müfredat (meânî / beyân / bedî' + fesahat kusurları) taranabilir.

type Tab = 'ogren' | 'tanima' | 'uretim' | 'mufredat';

const TAB_LABELS: Record<Tab, string> = {
  ogren: 'Günün Sanatı',
  tanima: 'Tanıma',
  uretim: 'Üretim',
  mufredat: 'Müfredat',
};

const BRANCH_FILTERS: { value: BelagatBranchFilter; label: string }[] = [
  { value: 'karisik', label: 'Tümü' },
  { value: 'meani', label: 'Meânî' },
  { value: 'beyan', label: 'Beyân' },
  { value: 'bedi', label: "Bedî'" },
];

export default function BelagatExerciseScreen({ navigation }: any) {
  const t = useThemeTokens();
  const { settings, updateModule } = useDailyPracticeSettings();
  const { progress, complete, answerBelagat, produceBelagat } = useDailyProgress();

  const [tab, setTab] = React.useState<Tab>('ogren');
  const filter = settings.belagat.branch;

  const dailyArt = React.useMemo(() => pickDailyBelagatArt(filter), [filter]);
  const quiz = React.useMemo(() => buildRecognitionQuiz(filter, 5), [filter]);

  const mastered = masteredArtCount(progress);
  const moduleProgress = progress.modules.belagat;

  return (
    <ScreenShell
      title="Belagat"
      subtitle={`${mastered}/${BELAGAT_ARTS.length} sanat öğrenildi · ${moduleProgress.streak} günlük seri`}
      onClose={() => navigation?.goBack?.()}
    >
      {/* Sekmeler */}
      <View className="flex-row flex-wrap mt-1">
        {(Object.keys(TAB_LABELS) as Tab[]).map((key) => (
          <Chip
            key={key}
            label={TAB_LABELS[key]}
            tone="emerald"
            selected={tab === key}
            onPress={() => setTab(key)}
          />
        ))}
      </View>

      {/* Kol filtresi — ayarlara yazılır */}
      <View className={`flex-row flex-wrap mt-2 pt-3 border-t ${t.dividerColor}`}>
        {BRANCH_FILTERS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={filter === option.value}
            onPress={() => updateModule('belagat', { branch: option.value })}
          />
        ))}
      </View>

      {tab === 'ogren' ? (
        <LearnTab
          art={dailyArt}
          onDone={() => {
            complete('belagat');
            setTab('tanima');
          }}
        />
      ) : null}

      {tab === 'tanima' ? (
        <RecognitionTab
          questions={quiz}
          onAnswer={answerBelagat}
          onFinish={() => {
            complete('belagat');
            setTab('uretim');
          }}
        />
      ) : null}

      {tab === 'uretim' ? (
        <ProductionTab
          art={dailyArt}
          produced={progress.belagatArts[dailyArt.id]?.produced ?? false}
          onProduced={() => {
            produceBelagat(dailyArt.id);
            complete('belagat');
          }}
        />
      ) : null}

      {tab === 'mufredat' ? <CurriculumTab filter={filter} progress={progress} /> : null}
    </ScreenShell>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Öğrenme                                                          */
/* ------------------------------------------------------------------ */

function LearnTab({ art, onDone }: { art: BelagatArt; onDone: () => void }) {
  const t = useThemeTokens();
  return (
    <View className="mt-2">
      <Card>
        <View className="flex-row items-center mb-2">
          <Feather size={16} color={t.isLight ? '#059669' : '#34d399'} />
          <Text className={`text-[11px] font-bold uppercase tracking-widest ml-2 ${t.muted}`}>
            {BRANCH_LABELS[art.branch]}
          </Text>
        </View>
        <Text className={`text-[21px] font-black ${t.title}`}>{art.name}</Text>
        {art.aka ? <Text className={`text-[12px] mt-0.5 ${t.muted}`}>{art.aka}</Text> : null}
        <Text className={`text-[14px] mt-3 leading-6 ${t.body}`}>{art.definition}</Text>
      </Card>

      <SectionTitle>Dinleyicide Ne Yapar</SectionTitle>
      <Card>
        <Text className={`text-[12px] leading-5 ${t.body}`}>{art.effect}</Text>
      </Card>

      <SectionTitle>Örnek</SectionTitle>
      <Card>
        <Text className={`text-[15px] font-bold leading-7 ${t.title}`}>{art.example.text}</Text>
        {art.example.source ? (
          <Text className={`text-[11px] mt-2 ${t.muted}`}>— {art.example.source}</Text>
        ) : null}
        <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
          <Text className={`text-[12px] leading-5 ${t.body}`}>{art.example.note}</Text>
        </View>
      </Card>

      <SectionTitle>Mülakatta Kullanımı</SectionTitle>
      <Card>
        <View className="flex-row">
          <Lightbulb size={16} color={t.isLight ? '#d97706' : '#fbbf24'} />
          <Text className={`text-[12px] ml-2 flex-1 leading-5 ${t.body}`}>{art.interviewUse}</Text>
        </View>
      </Card>

      <View className="mt-6 mb-2">
        <PrimaryButton label="Anladım, tanıma alıştırmasına geç" onPress={onDone} tone="emerald" />
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Tanıma                                                           */
/* ------------------------------------------------------------------ */

function RecognitionTab({
  questions,
  onAnswer,
  onFinish,
}: {
  questions: RecognitionQuestion[];
  onAnswer: (artId: string, correct: boolean) => void;
  onFinish: () => void;
}) {
  const t = useThemeTokens();
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);
  const [done, setDone] = React.useState(false);

  const question = questions[index];

  const choose = (optionId: string) => {
    if (selected !== null) return;
    setSelected(optionId);
    const correct = optionId === question.correctId;
    if (correct) setScore((s) => s + 1);
    onAnswer(question.correctId, correct);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
      return;
    }
    setDone(true);
    onFinish();
  };

  if (done) {
    return (
      <View className="mt-2">
        <Card>
          <View className="flex-row items-center">
            <Award size={18} color={t.isLight ? '#059669' : '#34d399'} />
            <Text className={`text-[16px] font-bold ml-2 ${t.title}`}>
              {score}/{questions.length} doğru
            </Text>
          </View>
          <Text className={`text-[12px] mt-2 leading-5 ${t.body}`}>
            {score === questions.length
              ? 'Tam isabet. Üretim alıştırmasına geçip bu sanatı kendi cümlenle kur.'
              : 'Yanlışların aynı koldan çeldiricilerdi — kollar arası ayrımı bir sonraki turda daha net göreceksin.'}
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
    <View className="mt-2">
      <View className="mb-4">
        <ProgressBar value={index / questions.length} tone="emerald" />
        <Text className={`text-[11px] mt-2 ${t.muted}`}>
          Soru {index + 1}/{questions.length} · {score} doğru
        </Text>
      </View>

      <Card>
        <Text className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${t.muted}`}>
          Bu örnekte hangi sanat var?
        </Text>
        <Text className={`text-[16px] font-bold leading-7 ${t.title}`}>{question.example.text}</Text>
        {question.example.source ? (
          <Text className={`text-[11px] mt-2 ${t.muted}`}>— {question.example.source}</Text>
        ) : null}
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
              onPress={() => choose(option.id)}
              disabled={revealed}
              accessibilityRole="button"
              className={`flex-row items-center rounded-2xl border p-4 mb-2 ${stateClasses}`}
            >
              <View className="flex-1">
                <Text className={`text-[13px] font-bold ${t.title}`}>{option.name}</Text>
                <Text className={`text-[11px] mt-0.5 ${t.muted}`}>
                  {BRANCH_LABELS[option.branch]}
                </Text>
              </View>
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
              label={index + 1 < questions.length ? 'Sıradaki soru' : 'Bitir'}
              onPress={next}
              tone="emerald"
            />
          </View>
        </>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Üretim                                                           */
/* ------------------------------------------------------------------ */

function ProductionTab({
  art,
  produced,
  onProduced,
}: {
  art: BelagatArt;
  produced: boolean;
  onProduced: () => void;
}) {
  const t = useThemeTokens();
  const [answer, setAnswer] = React.useState('');
  const [revealed, setRevealed] = React.useState(false);

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <View className="mt-2">
      <Card>
        <View className="flex-row items-center mb-2">
          <GraduationCap size={16} color={t.isLight ? '#059669' : '#34d399'} />
          <Text className={`text-[11px] font-bold uppercase tracking-widest ml-2 ${t.muted}`}>
            {art.name} ile üret
          </Text>
        </View>
        <Text className={`text-[15px] font-bold leading-6 ${t.title}`}>{art.exercise.prompt}</Text>
        <Text className={`text-[11px] mt-3 italic ${t.accent}`}>İpucu: {art.exercise.hint}</Text>
      </Card>

      <SectionTitle hint="Yazdıktan sonra yüksek sesle okuyun — belagat kâğıtta değil sesle sınanır.">
        Cevabınız
      </SectionTitle>
      <Card>
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          multiline
          placeholder="Cümlenizi buraya yazın..."
          placeholderTextColor={t.isLight ? '#94a3b8' : '#64748b'}
          className={`text-[14px] leading-6 min-h-[110px] ${t.title}`}
          style={{ textAlignVertical: 'top' }}
        />
        <View className={`flex-row justify-between mt-2 pt-2 border-t ${t.dividerColor}`}>
          <Text className={`text-[11px] ${t.muted}`}>{wordCount} kelime</Text>
          {produced ? (
            <Text className={`text-[11px] font-bold ${t.isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
              bu sanatta üretim yapıldı
            </Text>
          ) : null}
        </View>
      </Card>

      {revealed ? (
        <>
          <SectionTitle>Örnek Cevap</SectionTitle>
          <Card>
            <Text className={`text-[13px] leading-6 ${t.body}`}>{art.exercise.sampleAnswer}</Text>
          </Card>

          <SectionTitle>Kendini Değerlendir</SectionTitle>
          <Card>
            {[
              `Sanat gerçekten kullanıldı mı — ${art.shortDefinition.toLowerCase()}`,
              'Cümle sesli okunduğunda takılmadan çıkıyor mu (fesahat)?',
              'Mülakat ortamında bu cümleyi kurabilir miydin (muktezâ-yı hâl)?',
            ].map((criterion) => (
              <View key={criterion} className="flex-row mb-2">
                <Text className={`text-[12px] mr-2 ${t.accent}`}>•</Text>
                <Text className={`text-[12px] flex-1 leading-5 ${t.body}`}>{criterion}</Text>
              </View>
            ))}
          </Card>
        </>
      ) : null}

      <View className="mt-6 mb-2 gap-2">
        {!revealed ? (
          <PrimaryButton
            label="Örnek cevabı gör"
            onPress={() => setRevealed(true)}
            disabled={answer.trim().length === 0}
            tone="emerald"
          />
        ) : (
          <PrimaryButton label="Tamamladım" onPress={onProduced} tone="emerald" />
        )}
        {!revealed && answer.trim().length === 0 ? (
          <Text className={`text-[11px] text-center ${t.muted}`}>
            Önce kendi cümlenizi yazın; örneği önce görmek alıştırmayı boşa çıkarır.
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Müfredat                                                         */
/* ------------------------------------------------------------------ */

function CurriculumTab({
  filter,
  progress,
}: {
  filter: BelagatBranchFilter;
  progress: ReturnType<typeof useDailyProgress>['progress'];
}) {
  const t = useThemeTokens();
  const [openId, setOpenId] = React.useState<string | null>(null);
  const arts = artsForBranch(filter);

  const branches: BelagatBranch[] =
    filter === 'karisik' ? ['meani', 'beyan', 'bedi'] : [filter as BelagatBranch];

  return (
    <View className="mt-2">
      {branches.map((branch) => {
        const branchArts = arts.filter((a) => a.branch === branch);
        if (branchArts.length === 0) return null;
        return (
          <View key={branch}>
            <SectionTitle hint={BRANCH_DESCRIPTIONS[branch]}>
              {BRANCH_LABELS[branch]} · {branchArts.length} sanat
            </SectionTitle>
            {branchArts.map((art) => {
              const stat = progress.belagatArts[art.id];
              const isOpen = openId === art.id;
              return (
                <Pressable
                  key={art.id}
                  onPress={() => setOpenId(isOpen ? null : art.id)}
                  accessibilityRole="button"
                  accessibilityLabel={art.name}
                  accessibilityState={{ expanded: isOpen }}
                  className="mb-2"
                >
                  <Card>
                    <View className="flex-row items-center">
                      <View className="flex-1 pr-2">
                        <Text className={`text-[13px] font-bold ${t.title}`}>{art.name}</Text>
                        <Text className={`text-[11px] mt-0.5 leading-4 ${t.muted}`}>
                          {art.shortDefinition}
                        </Text>
                      </View>
                      {stat?.correct ? (
                        <View
                          className={`px-2 py-1 rounded-full ${
                            t.isLight ? 'bg-emerald-100' : 'bg-emerald-900'
                          }`}
                        >
                          <Text
                            className={`text-[10px] font-bold ${
                              t.isLight ? 'text-emerald-700' : 'text-emerald-300'
                            }`}
                          >
                            {stat.correct}✓
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {isOpen ? (
                      <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
                        <Text className={`text-[12px] leading-5 ${t.body}`}>{art.definition}</Text>
                        <Text className={`text-[13px] font-bold mt-3 leading-6 ${t.title}`}>
                          {art.example.text}
                        </Text>
                        {art.example.source ? (
                          <Text className={`text-[11px] mt-1 ${t.muted}`}>— {art.example.source}</Text>
                        ) : null}
                        <Text className={`text-[11px] mt-3 italic ${t.accent}`}>
                          {art.interviewUse}
                        </Text>
                      </View>
                    ) : null}
                  </Card>
                </Pressable>
              );
            })}
          </View>
        );
      })}

      {/* Fesahat kusurları — belagatin önkoşulu */}
      <SectionTitle hint="Belâgatin önkoşulu fesahattir. Bu kusurlar sözü belagatli olmaktan çıkarır ve diksiyonu doğrudan bozar.">
        Fesahat Kusurları · {FESAHAT_FLAWS.length}
      </SectionTitle>
      {FESAHAT_FLAWS.map((flaw) => (
        <Card key={flaw.id} className="mb-2">
          <Text className={`text-[13px] font-bold ${t.title}`}>{flaw.name}</Text>
          <Text className={`text-[11px] mt-0.5 ${t.muted}`}>{flaw.shortDefinition}</Text>
          <Text className={`text-[11px] mt-2 leading-5 ${t.body}`}>{flaw.definition}</Text>
          <Text className={`text-[11px] mt-2 italic ${t.accent}`}>{flaw.interviewRisk}</Text>
        </Card>
      ))}
    </View>
  );
}
