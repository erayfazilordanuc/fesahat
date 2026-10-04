import React from 'react';
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Lightbulb, ArrowRight } from 'lucide-react-native';

import { Badge, ActionButton, toneColor, toneSoft, toneText, type Tone } from '../components/AppUI';
import { ScreenShell, Card, SectionTitle, useThemeTokens } from '../components/practice/PracticeUI';
import { AiFeedbackCard } from '../components/AiFeedbackCard';
import {
  COMM_CATEGORY_META,
  COMM_SCENARIOS,
  SCENARIO_EFFECT_LABELS,
  findScenario,
  type CommScenario,
  type ScenarioEffect,
} from '../data/communication';
import { recordScenario, useComm, scenarioDone } from '../utils/commProgress';
import { addResponse } from '../utils/responseHistory';
import { useAiAvailable } from '../utils/aiAvailability';

// İletişim senaryosu oynatıcı.
//
// Çoktan seçmeli taban her zaman çalışır (çevrimdışı garanti): seçim yapılınca
// tüm seçeneklerin etkisi ve gerekçesi açılır, senaryo tamamlanmış sayılır.
// Yapay zekâ açıksa altına serbest cevap + `AiFeedbackCard` gelir. Doğru/yanlış
// ya da puan yok — yalnızca "karşı tarafta nasıl bir etki bırakır".

const EFFECT_TONE: Record<ScenarioEffect, Tone> = {
  isler: 'emerald',
  kismen: 'amber',
  islemez: 'rose',
};

const FREE_TEXT_MAX = 600;

export default function CommScenarioScreen({ navigation, route }: any) {
  const scenarioId: string | undefined = route?.params?.scenarioId;
  const scenario = scenarioId ? findScenario(scenarioId) : undefined;
  const close = () => navigation?.goBack?.();

  if (!scenario) {
    return (
      <ScreenShell title="Senaryo" onClose={close} closeIcon="back">
        <NotFound onBack={close} />
      </ScreenShell>
    );
  }

  // `key`: bir senaryodan ötekine geçerken durum (seçim, yazı) sıfırlansın.
  return <ScenarioPlayer key={scenario.id} scenario={scenario} navigation={navigation} />;
}

function NotFound({ onBack }: { onBack: () => void }) {
  const t = useThemeTokens();
  return (
    <View className="items-center mt-16 px-4">
      <Text className={`text-[15px] font-bold text-center ${t.title}`}>Senaryo bulunamadı</Text>
      <Text className={`text-[12px] leading-5 text-center mt-2 mb-6 ${t.muted}`}>
        Aradığın senaryo artık listede yok. Katalogdan başka bir senaryo seçebilirsin.
      </Text>
      <View className="self-stretch">
        <ActionButton label="Geri dön" tone="blue" variant="soft" onPress={onBack} />
      </View>
    </View>
  );
}

function ScenarioPlayer({ scenario, navigation }: { scenario: CommScenario; navigation: any }) {
  const t = useThemeTokens();
  const comm = useComm();
  const aiOn = useAiAvailable();
  const [chosen, setChosen] = React.useState<number | null>(null);
  const [text, setText] = React.useState('');

  const meta = COMM_CATEGORY_META[scenario.category];
  const trimmed = text.trim();

  const choose = (index: number) => {
    if (chosen !== null) return;
    setChosen(index);
    // Seçimden önce serbest cevap yazıldıysa birlikte kaydedilir; sonradan
    // yazılan metin depoya girmez, yalnızca yapay zekâ değerlendirmesinde kullanılır.
    recordScenario({
      scenarioId: scenario.id,
      category: scenario.category,
      title: scenario.title,
      effect: scenario.options[index].effect,
      ...(aiOn && trimmed ? { freeText: trimmed } : {}),
    });
    // Seçilen şık deftere de düşsün (belagat/lugat ile aynı desen).
    // `correct` yazılmıyor: senaryoda tek doğru cevap yok, yalnızca etki var.
    addResponse({
      module: 'communication',
      refId: scenario.id,
      title: scenario.title,
      prompt: scenario.prompt,
      answer: scenario.options[index].text,
      kind: 'choice',
    });
    if (aiOn && trimmed) {
      addResponse({
        module: 'communication',
        refId: scenario.id,
        title: `${scenario.title} — kendi cevabın`,
        prompt: scenario.prompt,
        answer: trimmed,
        kind: 'text',
      });
    }
  };

  // Sıradaki senaryo: listede bir sonraki, tamamlanmamışa öncelik.
  const nextScenario = React.useMemo(() => {
    const start = COMM_SCENARIOS.findIndex((s) => s.id === scenario.id);
    const after = [...COMM_SCENARIOS.slice(start + 1), ...COMM_SCENARIOS.slice(0, Math.max(start, 0))];
    return after.find((s) => !scenarioDone(comm, s.id)) ?? after[0];
    // Yalnızca senaryo değişince hesaplanır; seçimden sonra öneri kaymasın.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  const buildPrompt = () =>
    [
      'İletişim becerisi alıştırması. Kullanıcı aşağıdaki durumda ne söyleyeceğini yazdı.',
      '',
      `Durum: ${scenario.situation}`,
      `Soru: ${scenario.prompt}`,
      `Bağlam: ${scenario.aiContext}`,
      '',
      'Kullanıcının cevabı:',
      '"""',
      trimmed.slice(0, FREE_TEXT_MAX),
      '"""',
      '',
      'Görev: Cevabı yalnızca üç açıdan değerlendir: (1) tonu, (2) netliği, (3) karşı tarafta ' +
        'bırakacağı etki. Tek doğru cevap yok; cevabın bu durumda nasıl karşılanabileceğini anlat. ' +
        'Kullanıcının kişiliği, karakteri ya da psikolojik durumu hakkında hiçbir yorum yapma; ' +
        'teşhis, terapi veya danışmanlık dili kullanma. Yalnızca bu cevabın iletişim etkisini konuş. ' +
        '"rewrite" alanına aynı niyeti koruyan, daha net ve yumuşak bir örnek cümle yaz.',
    ].join('\n');

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenShell title={scenario.title} subtitle={meta.title} onClose={() => navigation?.goBack?.()} closeIcon="back">
        <Card className="mt-2">
          <Text className={`text-[10px] font-semibold mb-2 ${t.muted}`} style={{ letterSpacing: 1.4 }}>
            DURUM
          </Text>
          <Text className={`text-[14px] leading-6 ${t.body}`}>{scenario.situation}</Text>
          <View className={`mt-3 pt-3 border-t ${t.dividerColor}`}>
            <Text className={`text-[15px] font-bold leading-6 ${t.title}`}>{scenario.prompt}</Text>
          </View>
        </Card>

        <SectionTitle hint={chosen === null ? 'Bir seçenek seç; her birinin etkisi seçimden sonra açılır.' : undefined}>
          SEÇENEKLER
        </SectionTitle>

        {scenario.options.map((option, index) => (
          <OptionCard
            key={index}
            index={index}
            text={option.text}
            why={option.why}
            effect={option.effect}
            revealed={chosen !== null}
            selected={chosen === index}
            onPress={() => choose(index)}
          />
        ))}

        {chosen !== null ? (
          <>
            <Card className="mt-2">
              <View className="flex-row items-center mb-1.5">
                <Lightbulb size={16} color={toneColor('amber', t.isLight)} />
                <Text className={`text-[10px] font-semibold ml-2 ${t.muted}`} style={{ letterSpacing: 1.4 }}>
                  İLKE
                </Text>
              </View>
              <Text className={`text-[13px] font-semibold leading-6 ${t.title}`}>{scenario.takeaway}</Text>
            </Card>

            <SectionTitle hint="Yapay zekâ açıkken kendi cümleni yazıp değerlendirtebilirsin.">
              SERBEST CEVAP
            </SectionTitle>
          </>
        ) : (
          <SectionTitle>SERBEST CEVAP</SectionTitle>
        )}

        {aiOn ? (
          <>
            <Text className={`text-[12px] font-bold mb-1.5 ${t.title}`}>Sen nasıl söylerdin?</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Cevabını kendi cümlelerinle yaz…"
              placeholderTextColor={t.isLight ? '#94a3b8' : '#64748b'}
              multiline
              maxLength={FREE_TEXT_MAX}
              textAlignVertical="top"
              accessibilityLabel="Serbest cevap: sen nasıl söylerdin?"
              className={`rounded-2xl px-4 py-3 text-[13px] leading-5 border mb-3 ${
                t.isLight
                  ? 'bg-slate-100 text-slate-900 border-transparent'
                  : 'bg-[#141417] text-white border-[#2e2e33]'
              }`}
              style={{ minHeight: 110 }}
            />
          </>
        ) : null}

        <AiFeedbackCard
          title="Cevabını değerlendir"
          description="Yazdığın cevabın tonunu, netliğini ve karşı tarafta bırakacağı etkiyi değerlendirir. Kişiliğin hakkında yorum yapmaz."
          buttonLabel="Cevabımı değerlendir"
          buildPrompt={buildPrompt}
          disabled={!trimmed}
          disabledHint="Önce cevabını yaz."
          rewriteLabel="Örnek ifade"
        />

        {chosen !== null ? (
          <View className="mt-6 mb-2">
            {nextScenario && nextScenario.id !== scenario.id ? (
              <ActionButton
                label="Sonraki senaryo"
                tone="emerald"
                icon={<ArrowRight size={16} color="#ffffff" />}
                onPress={() => navigation?.replace?.('CommScenario', { scenarioId: nextScenario.id })}
              />
            ) : (
              <ActionButton label="Kataloğa dön" tone="emerald" onPress={() => navigation?.goBack?.()} />
            )}
          </View>
        ) : null}
      </ScreenShell>
    </KeyboardAvoidingView>
  );
}

function OptionCard({
  index,
  text,
  why,
  effect,
  revealed,
  selected,
  onPress,
}: {
  index: number;
  text: string;
  why: string;
  effect: ScenarioEffect;
  revealed: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const t = useThemeTokens();
  const tone = EFFECT_TONE[effect];
  const letter = String.fromCharCode(65 + index);
  const surface = revealed
    ? `${toneSoft(tone, t.isLight)} border-transparent`
    : `${t.cardBg} ${t.cardBorder}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={revealed}
      accessibilityRole="button"
      accessibilityLabel={`Seçenek ${letter}: ${text}`}
      accessibilityState={{ selected, disabled: revealed }}
      className={`rounded-2xl border p-4 mb-2.5 ${surface}`}
    >
      <View className="flex-row">
        <Text className={`text-[13px] font-black mr-3 ${revealed ? toneText(tone, t.isLight) : t.muted}`}>
          {letter}
        </Text>
        <Text className={`text-[13px] leading-5 flex-1 ${t.title}`}>{text}</Text>
      </View>
      {revealed ? (
        <View className="mt-3">
          <View className="flex-row items-center flex-wrap">
            <Badge label={SCENARIO_EFFECT_LABELS[effect]} tone={tone} />
            {selected ? (
              <View className="ml-2">
                <Badge label="Senin seçimin" tone="slate" />
              </View>
            ) : null}
          </View>
          <Text className={`text-[12px] leading-5 mt-2 ${t.body}`}>{why}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
