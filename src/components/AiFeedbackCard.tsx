import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Sparkles, Check, Target, PenLine } from 'lucide-react-native';

import { Surface, ActionButton, toneColor, toneText } from './AppUI';
import { useThemeTokens } from './practice/PracticeUI';
import { callGeminiJson, GeminiError } from '../utils/geminiClient';
import { AI_UNAVAILABLE_HINT, useAiAvailable } from '../utils/aiAvailability';

// Tek bir cevabın yapay zekâ değerlendirmesi — özet, iletişim senaryosuna
// serbest cevap, belagat "üret" cümlesi, diksiyon kaydı.
//
// `AiInsightCard` birikmiş kaydın tamamını yorumlar; bu kart **tek** bir
// cevaba geri bildirim verir. İkisi aynı kuralı izler (KARARLAR → "Yapay zekâ
// kullanıcının kendi anahtarıyla çalışır"): anahtar yokken düğme kapalı ve
// nedeni sade dille yazılı, yanında kuruluma götüren düğme var; teknik hata
// metni gösterilmez. Yapay zekâ kapıda durmaz — alıştırma bu kart olmadan da
// tamamlanmış sayılır, kart yalnızca üstüne gelen bir katman.

export type AiFeedback = {
  /** İki-üç cümlelik genel değerlendirme. */
  summary: string;
  /** İyi işleyen yönler. */
  strengths: string[];
  /** Somut iyileştirme önerileri. */
  improvements: string[];
  /** İsteğe bağlı: cevabın düzeltilmiş/örnek hâli. Boş dize olabilir. */
  rewrite: string;
};

const FEEDBACK_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING', description: 'İki-üç cümlelik, yargılamayan genel değerlendirme.' },
    strengths: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Cevapta iyi işleyen bir ila üç somut nokta.',
    },
    improvements: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Bir ila üç somut, uygulanabilir iyileştirme önerisi.',
    },
    rewrite: {
      type: 'STRING',
      description: 'Cevabın iyileştirilmiş örnek hâli. Gerekmiyorsa boş dize.',
    },
  },
  required: ['summary', 'strengths', 'improvements', 'rewrite'],
} as const;

/**
 * Her istemin sonuna eklenen ortak kurallar. Ekranlar yalnızca alıştırmaya
 * özgü bağlamı yazar; ton ve sınırlar burada tek yerde.
 */
export const FEEDBACK_RULES =
  'Kurallar: Türkçe yaz. Kullanıcıya "sen" diye hitap et. Öneri ver, kişiliğini ' +
  'ya da psikolojisini değerlendirme; terapi/danışmanlık dili kullanma. Puan ' +
  'verme. Abartılı övgü ya da sert eleştiri yok; somut ve kısa ol.';

export function AiFeedbackCard({
  title = 'Yapay zekâ geri bildirimi',
  description,
  buttonLabel = 'Değerlendir',
  buildPrompt,
  audioBase64,
  disabled,
  disabledHint,
  rewriteLabel = 'Örnek hâli',
  onResult,
}: {
  title?: string;
  description: string;
  buttonLabel?: string;
  /** Değerlendirme istemi; düğmeye basıldığı anda okunur. `FEEDBACK_RULES` otomatik eklenir. */
  buildPrompt: () => string;
  /** Diksiyon kaydı gibi sesli değerlendirmeler için (m4a, base64). */
  audioBase64?: () => Promise<string | null>;
  /** Ör. cevap alanı boşken. */
  disabled?: boolean;
  disabledHint?: string;
  rewriteLabel?: string;
  onResult?: (feedback: AiFeedback) => void;
}) {
  const t = useThemeTokens();
  const navigation = useNavigation<any>();
  const aiOn = useAiAvailable();
  const blocked = disabled || !aiOn;
  const blockedHint = !aiOn ? AI_UNAVAILABLE_HINT : disabledHint;
  const [loading, setLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState<AiFeedback | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const audio = audioBase64 ? await audioBase64() : undefined;
      const result = await callGeminiJson<AiFeedback>({
        prompt: `${buildPrompt()}\n\n${FEEDBACK_RULES}`,
        audioBase64: audio ?? undefined,
        responseSchema: FEEDBACK_SCHEMA as unknown as Record<string, unknown>,
      });
      setFeedback(result);
      onResult?.(result);
    } catch (e) {
      setError(e instanceof GeminiError ? e.message : 'Değerlendirme tamamlanamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Surface className={t.isLight ? 'bg-emerald-50' : 'bg-emerald-950'}>
        <View className="flex-row items-center mb-2">
          <Sparkles size={16} color={toneColor('emerald', t.isLight)} />
          <Text className={`text-[13px] font-bold ml-2 ${t.title}`}>{title}</Text>
        </View>
        <Text className={`text-[11px] leading-5 mb-3 ${t.body}`}>{description}</Text>

        <ActionButton
          label={loading ? 'Değerlendiriliyor…' : buttonLabel}
          tone="emerald"
          disabled={blocked || loading}
          icon={<Sparkles size={16} color="#ffffff" />}
          onPress={run}
        />

        {blocked && blockedHint ? (
          <Text className={`text-[11px] mt-2 text-center ${t.muted}`}>{blockedHint}</Text>
        ) : null}

        {!aiOn ? (
          <View className="mt-3">
            <ActionButton
              label="Yapay Zekâyı Aç"
              tone="emerald"
              variant="outline"
              icon={<Sparkles size={16} color={toneColor('emerald', t.isLight)} />}
              onPress={() => navigation.navigate('AiSetup')}
            />
          </View>
        ) : null}

        {loading ? (
          <View className="items-center mt-4">
            <ActivityIndicator color={toneColor('emerald', t.isLight)} />
          </View>
        ) : null}

        {error ? (
          <Text className={`text-[11px] mt-3 leading-5 ${toneText('rose', t.isLight)}`}>{error}</Text>
        ) : null}
      </Surface>

      {feedback ? <FeedbackResult feedback={feedback} rewriteLabel={rewriteLabel} /> : null}
    </View>
  );
}

function FeedbackResult({ feedback, rewriteLabel }: { feedback: AiFeedback; rewriteLabel: string }) {
  const t = useThemeTokens();
  return (
    <Surface className="mt-3">
      <Text className={`text-[12px] leading-6 ${t.body}`}>{feedback.summary}</Text>
      <FeedbackList
        icon={<Check size={15} color={toneColor('emerald', t.isLight)} />}
        title="İşleyen"
        items={feedback.strengths}
      />
      <FeedbackList
        icon={<Target size={15} color={toneColor('amber', t.isLight)} />}
        title="Geliştirilebilir"
        items={feedback.improvements}
      />
      {feedback.rewrite.trim() ? (
        <View className={`mt-4 pt-3 border-t ${t.dividerColor}`}>
          <View className="flex-row items-center mb-1">
            <PenLine size={15} color={toneColor('blue', t.isLight)} />
            <Text className={`text-[11px] font-bold uppercase tracking-widest ml-2 ${t.muted}`}>
              {rewriteLabel}
            </Text>
          </View>
          <Text className={`text-[12px] leading-5 mt-1 ${t.body}`}>{feedback.rewrite}</Text>
        </View>
      ) : null}
    </Surface>
  );
}

function FeedbackList({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  const t = useThemeTokens();
  if (items.length === 0) return null;
  return (
    <View className={`mt-4 pt-3 border-t ${t.dividerColor}`}>
      <View className="flex-row items-center mb-1">
        {icon}
        <Text className={`text-[11px] font-bold uppercase tracking-widest ml-2 ${t.muted}`}>{title}</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} className="flex-row mt-2">
          <Text className={`text-[12px] mr-2 font-bold ${t.muted}`}>•</Text>
          <Text className={`text-[12px] flex-1 leading-5 ${t.body}`}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
