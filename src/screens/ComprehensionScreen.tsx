import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react-native';

import {
  AppScreen,
  TabHeader,
  RoundButton,
  SectionLabel,
  Surface,
  Segmented,
  Badge,
  toneColor,
} from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { trUpper } from '../utils/text';
import { QUIZ_KIND_LABELS, QUIZ_SKILL_LABELS, type QuizKind, type QuizSet, type QuizSkill } from '../data/quiz';
import { READING_SETS, LISTENING_SETS, SUMMARY_PASSAGES } from '../data/comprehension';
import { VERBAL_SETS } from '../data/verbalReasoning';
import {
  accuracyFor,
  bestAttemptFor,
  useComprehension,
  type ComprehensionState,
} from '../utils/comprehensionProgress';

// Anlayış & Kavrayış merkezi: okuma, dinleme, sözel kavrayış ve özetleme.
// Satıra dokunmak ilgili alıştırmayı açar ('Quiz' ya da 'Summary').

type Tab = 'okuma' | 'dinleme' | 'sozel' | 'ozet';

/** Sözel setler, ilk sorunun becerisine göre gruplanır (her set tek grupta görünür). */
function groupVerbalSets(): { skill: QuizSkill; sets: QuizSet[] }[] {
  const groups = new Map<QuizSkill, QuizSet[]>();
  for (const set of VERBAL_SETS) {
    const skill = set.questions[0]?.skill;
    if (!skill) continue;
    groups.set(skill, [...(groups.get(skill) ?? []), set]);
  }
  return [...groups.entries()].map(([skill, sets]) => ({ skill, sets }));
}

const VERBAL_GROUPS = groupVerbalSets();

export default function ComprehensionScreen({ navigation }: any) {
  const t = useThemeTokens();
  const state = useComprehension();
  const [tab, setTab] = React.useState<Tab>('okuma');

  const canGoBack = Boolean(navigation?.canGoBack?.());

  const openSet = (setId: string) => navigation.navigate('Quiz', { setId });

  return (
    <AppScreen
      header={
        <TabHeader
          icon={<BookOpen size={22} color={toneColor('emerald', t.isLight)} />}
          title="Anlayış & Kavrayış"
          subtitle="Okuduğunu, dinlediğini ve sözel olarak kavradığını çalış; özetlemeyi dene."
          right={
            canGoBack ? (
              <RoundButton
                icon={<ChevronLeft size={20} color={t.iconColor} />}
                onPress={() => navigation.goBack()}
                label="Geri"
              />
            ) : undefined
          }
        />
      }
    >
      <AccuracySummary state={state} />

      <View className="mt-4 mb-1">
        <Segmented<Tab>
          value={tab}
          onChange={setTab}
          tone="emerald"
          options={[
            { value: 'okuma', label: 'Okuma' },
            { value: 'dinleme', label: 'Dinleme' },
            { value: 'sozel', label: 'Sözel' },
            { value: 'ozet', label: 'Özet' },
          ]}
        />
      </View>

      {tab === 'okuma' ? (
        <SetList sets={READING_SETS} state={state} onOpen={openSet} />
      ) : null}

      {tab === 'dinleme' ? (
        <SetList sets={LISTENING_SETS} state={state} onOpen={openSet} />
      ) : null}

      {tab === 'sozel'
        ? VERBAL_GROUPS.map((group) => (
            <View key={group.skill}>
              <SectionLabel>{trUpper(QUIZ_SKILL_LABELS[group.skill])}</SectionLabel>
              <SetList sets={group.sets} state={state} onOpen={openSet} />
            </View>
          ))
        : null}

      {tab === 'ozet' ? (
        <View className="mt-3">
          {SUMMARY_PASSAGES.map((passage) => {
            const done = state.summaryAttempts.some((a) => a.passageId === passage.id);
            return (
              <Row
                key={passage.id}
                title={passage.title}
                subtitle={`Hedef yaklaşık ${passage.targetWords} kelime`}
                badge={done ? <Badge label="Yapıldı" tone="emerald" /> : undefined}
                accessibilityLabel={`${passage.title} özetleme alıştırması${done ? ', yapıldı' : ''}`}
                onPress={() => navigation.navigate('Summary', { passageId: passage.id })}
              />
            );
          })}
        </View>
      ) : null}
    </AppScreen>
  );
}

/* ------------------------------------------------------------------ */

const SUMMARY_KINDS: QuizKind[] = ['okuma', 'dinleme', 'sozel'];

/** Tür bazlı doğruluk. Kayıt yoksa yüzde gösterilmez: sıfır yanıltıcı olur. */
function AccuracySummary({ state }: { state: ComprehensionState }) {
  const t = useThemeTokens();
  return (
    <Surface>
      <Text className={`text-[11px] font-bold mb-3 ${t.muted}`}>DOĞRULUK · KENDİ GEÇMİŞİN</Text>
      <View className="flex-row">
        {SUMMARY_KINDS.map((kind) => {
          const accuracy = accuracyFor(state, kind);
          return (
            <View
              key={kind}
              className="flex-1 pr-2"
              accessible
              accessibilityLabel={`${QUIZ_KIND_LABELS[kind]}: ${
                accuracy === null ? 'henüz kayıt yok' : `yüzde ${accuracy}`
              }`}
            >
              {accuracy === null ? (
                <Text className={`text-[12px] font-semibold ${t.muted}`}>Henüz kayıt yok</Text>
              ) : (
                <Text className={`text-[22px] font-black ${t.title}`}>%{accuracy}</Text>
              )}
              <Text className={`text-[11px] mt-1 ${t.muted}`}>{QUIZ_KIND_LABELS[kind]}</Text>
            </View>
          );
        })}
      </View>
    </Surface>
  );
}

function SetList({
  sets,
  state,
  onOpen,
}: {
  sets: QuizSet[];
  state: ComprehensionState;
  onOpen: (setId: string) => void;
}) {
  return (
    <View className="mt-3">
      {sets.map((set) => {
        const best = bestAttemptFor(state, set.id);
        const subtitle = [set.passageSource, `${set.questions.length} soru`].filter(Boolean).join(' · ');
        return (
          <Row
            key={set.id}
            title={set.title}
            subtitle={subtitle}
            badge={
              best ? <Badge label={`${best.correct}/${best.total}`} tone="emerald" /> : undefined
            }
            accessibilityLabel={`${set.title}, ${set.questions.length} soru${
              best ? `, en iyi skor ${best.correct}/${best.total}` : ''
            }`}
            onPress={() => onOpen(set.id)}
          />
        );
      })}
    </View>
  );
}

function Row({
  title,
  subtitle,
  badge,
  accessibilityLabel,
  onPress,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  accessibilityLabel: string;
  onPress: () => void;
}) {
  const t = useThemeTokens();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`flex-row items-center rounded-2xl border p-4 mb-2 ${t.cardBg} ${t.cardBorder}`}
    >
      <View className="flex-1 pr-2">
        <Text className={`text-[14px] font-semibold ${t.title}`}>{title}</Text>
        {subtitle ? <Text className={`text-[11px] mt-0.5 ${t.muted}`}>{subtitle}</Text> : null}
      </View>
      {badge}
      <ChevronRight size={16} color={t.iconColor} style={{ marginLeft: 8 }} />
    </Pressable>
  );
}
