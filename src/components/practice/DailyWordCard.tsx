import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';

import { Badge, toneText } from '../AppUI';
import { Card, useThemeTokens } from './PracticeUI';
import { useDailyPracticeSettings } from '../../utils/dailyPracticeSettings';
import { useLugatProgress, useTodaysWords } from '../../utils/lugatProgress';
import { useDailyProgress, isCompletedToday } from '../../utils/dailyPracticeProgress';
import type { LugatWord } from '../../data/lugat';

// Ana ekran (Bugün sekmesi) kelime kartı — günün metni kartının hemen altında.
// Dil (lugat & Türkçe) modülü artık günün metni gibi tam bir günlük pratik: bu
// kart bugünün ilk henüz öğrenilmemiş kelimesini gösterir, "Öğrendim" ve
// "Tümü" ile Dil ekranına yönlendirir. Tamamlanma mantığı burada tekrar
// yazılmaz — hepsi lugatProgress.ts'teki markLearned/completeReview'dan gelir.

export function DailyWordCard({ navigation }: { navigation?: any }) {
  const t = useThemeTokens();
  const { settings } = useDailyPracticeSettings();
  const { state, markLearned, completeReview } = useLugatProgress();
  const { words, isReview, learned, total } = useTodaysWords();
  const { progress } = useDailyProgress();

  if (!settings.lugat.enabled || !settings.lugat.showOnHome) return null;
  if (words.length === 0) return null;

  const openLanguage = () => navigation?.navigate?.('Language');
  const current = words.find((w) => !state.words[w.id]?.learnedAt) ?? null;
  const doneToday = isCompletedToday(progress, 'lugat');

  return (
    <Card className="mt-4">
      <View className="flex-row items-center justify-between mb-1">
        <Text className={`text-[11px] font-bold uppercase tracking-widest ${t.muted}`}>
          GÜNÜN KELİMESİ
        </Text>
        <Text
          className={`text-[11px] font-bold ${
            learned === total ? (t.isLight ? 'text-emerald-600' : 'text-emerald-400') : t.muted
          }`}
        >
          {learned}/{total}
        </Text>
      </View>

      {isReview ? (
        <ReviewBody done={doneToday} onOpen={openLanguage} onComplete={completeReview} />
      ) : current ? (
        <WordBody word={current} total={total} onLearn={() => markLearned(current.id)} onOpen={openLanguage} />
      ) : (
        <View className="flex-row items-center py-2">
          <Check size={16} color={t.isLight ? '#059669' : '#34d399'} />
          <Text className={`text-[13px] font-bold ml-2 ${t.title}`}>Bugünün kelimeleri tamam</Text>
        </View>
      )}
    </Card>
  );
}

function WordBody({
  word,
  total,
  onLearn,
  onOpen,
}: {
  word: LugatWord;
  total: number;
  onLearn: () => void;
  onOpen: () => void;
}) {
  const t = useThemeTokens();
  return (
    <View>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`${word.word} — Dil ekranını aç`}
      >
        <View className="flex-row items-center flex-wrap mt-1">
          <Text className={`text-[20px] font-black ${t.title}`}>{word.word}</Text>
          {word.origin ? (
            <View className="ml-2 mt-0.5">
              <Badge label={word.origin} tone="violet" />
            </View>
          ) : null}
        </View>
        <Text className={`text-[13px] mt-1.5 leading-5 ${t.body}`}>{word.short}</Text>
        <Text className={`text-[12px] italic leading-5 mt-2 ${t.accent}`}>{word.example}</Text>
      </Pressable>

      <View className="flex-row mt-3" style={{ gap: 8 }}>
        <Pressable
          onPress={onLearn}
          accessibilityRole="button"
          accessibilityLabel="Kelimeyi öğrendim olarak işaretle"
          className={`flex-1 rounded-xl py-2.5 items-center justify-center border ${
            t.isLight ? 'bg-violet-50 border-violet-200' : 'bg-violet-950 border-violet-800'
          }`}
        >
          <Text className={`text-[12px] font-bold ${toneText('violet', t.isLight)}`}>Öğrendim</Text>
        </Pressable>
        <Pressable
          onPress={onOpen}
          accessibilityRole="button"
          accessibilityLabel="Günün tüm kelimelerini gör"
          className={`px-3.5 rounded-xl py-2.5 items-center justify-center border ${t.cardBorder}`}
        >
          <Text className={`text-[12px] font-bold ${t.body}`}>Tümü ({total})</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Tekrar günü: seviyedeki tüm kelimeler zaten öğrenilmiş, "Öğrendim" düğmeleri işe yaramaz. */
function ReviewBody({
  done,
  onOpen,
  onComplete,
}: {
  done: boolean;
  onOpen: () => void;
  onComplete: () => void;
}) {
  const t = useThemeTokens();
  return (
    <View>
      <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel="Dil ekranını aç">
        <Text className={`text-[12px] leading-5 mt-1 ${t.body}`}>
          Bu seviyedeki kelimelerin hepsini öğrendin; bugünkü liste tekrar için.
        </Text>
      </Pressable>

      {done ? (
        <View className="flex-row items-center mt-3">
          <Check size={16} color={t.isLight ? '#059669' : '#34d399'} />
          <Text className={`text-[12px] font-bold ml-2 ${t.title}`}>Tekrar tamamlandı</Text>
        </View>
      ) : (
        <Pressable
          onPress={onComplete}
          accessibilityRole="button"
          accessibilityLabel="Tekrarı tamamladım"
          className={`mt-3 rounded-xl py-2.5 items-center justify-center border ${
            t.isLight ? 'bg-violet-50 border-violet-200' : 'bg-violet-950 border-violet-800'
          }`}
        >
          <Text className={`text-[12px] font-bold ${toneText('violet', t.isLight)}`}>Tekrarı tamamladım</Text>
        </Pressable>
      )}
    </View>
  );
}
