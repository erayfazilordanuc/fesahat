import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Check, Square, CheckCircle2, Lightbulb } from 'lucide-react-native';

import {
  AppScreen,
  AppHeader,
  Surface,
  SectionLabel,
  ActionButton,
  EmptyState,
  toneColor,
  toneSoft,
  toneText,
} from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { AiFeedbackCard } from '../components/AiFeedbackCard';
import { SUMMARY_PASSAGES, pickDailySummary, type SummaryPassage } from '../data/comprehension';
import { recordSummaryAttempt } from '../utils/comprehensionProgress';
import { addResponse } from '../utils/responseHistory';

// Özetleme alıştırması.
//
// Rota: 'Summary', params: { passageId? } — verilmezse günün özeti.
// Bilinmeyen passageId çökmez; "bulunamadı" durumu gösterilir.
//
// Akış: metni oku → hedef kelime sayısına yakın özetle → "Tamamladım" →
// anahtar kavramları KENDİN işaretle (öz-değerlendirme; otomatik kontrol yok,
// çünkü özetin tek doğru yazımı yoktur — KARARLAR → "otomatik kontrol ile
// öz-değerlendirmenin ayrımı") → örnek özeti karşılaştır → kaydet.
// Yapay zekâ geri bildirimi isteğe bağlı; anahtar yokken alıştırma eksiksiz çalışır.

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function SummaryScreen({ route, navigation }: any) {
  const passageId: string | undefined = route?.params?.passageId;
  const passage = React.useMemo<SummaryPassage | undefined>(
    () => (passageId ? SUMMARY_PASSAGES.find((p) => p.id === passageId) : pickDailySummary()),
    [passageId],
  );

  if (!passage) {
    return (
      <AppScreen header={<AppHeader title="Özetleme" onBack={() => navigation.goBack()} />}>
        <EmptyState message="Bu alıştırma bulunamadı." />
        <ActionButton label="Geri dön" variant="outline" onPress={() => navigation.goBack()} />
      </AppScreen>
    );
  }

  return <SummaryExercise key={passage.id} passage={passage} navigation={navigation} />;
}

function SummaryExercise({ passage, navigation }: { passage: SummaryPassage; navigation: any }) {
  const t = useThemeTokens();
  const [text, setText] = React.useState('');
  const [phase, setPhase] = React.useState<'write' | 'check'>('write');
  const [checked, setChecked] = React.useState<boolean[]>(() => passage.keyConcepts.map(() => false));
  const [showSample, setShowSample] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const trimmed = text.trim();
  const words = countWords(text);
  const over = words > passage.targetWords;
  const checkedCount = checked.filter(Boolean).length;

  const toggleConcept = (i: number) => {
    if (saved) return;
    setChecked((prev) => prev.map((c, j) => (j === i ? !c : c)));
  };

  const save = () => {
    if (saved || trimmed.length === 0) return;
    setSaved(true);
    recordSummaryAttempt({
      passageId: passage.id,
      title: passage.title,
      text: trimmed,
      wordCount: words,
      targetWords: passage.targetWords,
      selfCheckedConcepts: checkedCount,
      totalConcepts: passage.keyConcepts.length,
    });
    // Ölçüm `comprehensionProgress`'e, yazılan metnin kendisi Yanıt
    // Defteri'ne gidiyor — belagat üretiminde olduğu gibi. `correct`
    // yazılmıyor: özetin tek doğrusu yok (KARARLAR → "otomatik kontrol ile
    // öz-değerlendirmenin ayrımı").
    addResponse({
      module: 'summary',
      refId: passage.id,
      title: passage.title,
      prompt: `Metni yaklaşık ${passage.targetWords} kelimeye indir.`,
      answer: trimmed,
      kind: 'text',
      expected: passage.sampleSummary,
    });
  };

  return (
    <AppScreen
      header={
        <AppHeader
          title="Özetleme"
          subtitle={passage.title}
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        phase === 'write' ? (
          <ActionButton
            label="Tamamladım"
            tone="emerald"
            disabled={trimmed.length === 0}
            onPress={() => setPhase('check')}
          />
        ) : saved ? (
          <ActionButton label="Bitir" tone="emerald" onPress={() => navigation.goBack()} />
        ) : (
          <ActionButton label="Kaydet ve bitir" tone="emerald" onPress={save} />
        )
      }
    >
      <SectionLabel>METİN</SectionLabel>
      <Surface>
        <Text className={`text-[14px] leading-6 ${t.body}`}>{passage.passage}</Text>
      </Surface>

      <SectionLabel>{`ÖZETİN · HEDEF YAKLAŞIK ${passage.targetWords} KELİME`}</SectionLabel>
      <Surface>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          editable={phase === 'write'}
          placeholder="Metni kendi cümlelerinle, kısaca özetle…"
          placeholderTextColor={t.isLight ? '#94a3b8' : '#64748b'}
          accessibilityLabel="Özet metni"
          className={`text-[14px] leading-6 min-h-[110px] ${t.title}`}
          style={{ textAlignVertical: 'top' }}
        />
        <View className={`flex-row justify-between mt-2 pt-2 border-t ${t.dividerColor}`}>
          <Text className={`text-[11px] ${t.muted}`}>
            {words} / {passage.targetWords} kelime
          </Text>
          {over ? (
            <Text className={`text-[11px] ${toneText('blue', t.isLight)}`}>
              Hedefin {words - passage.targetWords} kelime üstünde; kısaltmak özeti keskinleştirir.
            </Text>
          ) : null}
        </View>
      </Surface>

      {phase === 'check' ? (
        <>
          <SectionLabel>ANAHTAR KAVRAMLAR · KENDİN İŞARETLE</SectionLabel>
          <Text className={`text-[12px] leading-5 mb-2 ${t.muted}`}>
            Özetinde hangi kavramlara yer verdin? Otomatik kontrol yok; dürüst bir değerlendirme
            en çok işine yarar.
          </Text>
          <Surface>
            {passage.keyConcepts.map((concept, i) => (
              <Pressable
                key={concept}
                onPress={() => toggleConcept(i)}
                disabled={saved}
                accessibilityRole="checkbox"
                accessibilityLabel={`Anahtar kavram: ${concept}`}
                accessibilityState={{ checked: checked[i], disabled: saved }}
                className={`flex-row items-center py-2.5 ${i > 0 ? `border-t ${t.dividerColor}` : ''}`}
              >
                <View
                  className={`w-6 h-6 rounded-md items-center justify-center mr-3 ${
                    checked[i] ? toneSoft('emerald', t.isLight) : toneSoft('slate', t.isLight)
                  }`}
                >
                  {checked[i] ? (
                    <Check size={16} color={toneColor('emerald', t.isLight)} />
                  ) : (
                    <Square size={14} color={toneColor('slate', t.isLight)} />
                  )}
                </View>
                <Text className={`text-[14px] flex-1 ${t.title}`}>{concept}</Text>
              </Pressable>
            ))}
            <Text className={`text-[11px] mt-2 ${t.muted}`}>
              {checkedCount}/{passage.keyConcepts.length} kavram özetinde var
            </Text>
          </Surface>

          <View className="mt-4">
            <ActionButton
              label={showSample ? 'Örnek özeti gizle' : 'Örnek özeti göster'}
              variant="outline"
              icon={<Lightbulb size={16} color={t.iconColor} />}
              onPress={() => setShowSample((s) => !s)}
            />
          </View>
          {showSample ? (
            <Surface className="mt-3">
              <Text className={`text-[11px] font-bold mb-1 ${t.muted}`}>ÖRNEK ÖZET</Text>
              <Text className={`text-[13px] leading-6 ${t.body}`}>{passage.sampleSummary}</Text>
              <Text className={`text-[11px] mt-2 ${t.muted}`}>
                Tek doğru özet yoktur; bu yalnızca bir karşılaştırma noktası.
              </Text>
            </Surface>
          ) : null}

          {saved ? (
            <Surface className={`mt-4 flex-row items-center ${toneSoft('emerald', t.isLight)}`}>
              <CheckCircle2 size={18} color={toneColor('emerald', t.isLight)} />
              <Text className={`text-[13px] font-bold ml-2 ${toneText('emerald', t.isLight)}`}>
                Özetin kaydedildi.
              </Text>
            </Surface>
          ) : null}

          <View className="mt-6">
            <AiFeedbackCard
              title="Özetini değerlendirt"
              description="Özetin kapsama, sadakat ve gereksiz ayrıntı açısından yorumlanır. Metni ve özetini yapay zekâ servisine gönderir."
              buttonLabel="Özeti değerlendir"
              disabled={trimmed.length === 0}
              disabledHint="Önce özetini yaz."
              rewriteLabel="Daha kısa bir hâli"
              buildPrompt={() =>
                [
                  'Bir özetleme alıştırmasında kullanıcının yazdığı özeti değerlendir.',
                  '',
                  `ÖZGÜN METİN:\n${passage.passage}`,
                  '',
                  `HEDEF KELİME SAYISI: yaklaşık ${passage.targetWords}`,
                  `KULLANICININ ÖZETİ (${words} kelime):\n${trimmed}`,
                  '',
                  'Şu üç ölçüte göre yorum yap:',
                  '1) Kapsama: metnin ana fikirleri özette yer alıyor mu, hangisi eksik?',
                  '2) Sadakat: özet metinde olmayan bir şey söylüyor ya da anlamı çarpıtıyor mu?',
                  '3) Gereksiz ayrıntı: özete girmemesi gereken ayrıntı ya da tekrar var mı? Kelime sayısı hedefe yakın mı?',
                  '"rewrite" alanına, hedef kelime sayısına yakın, sadık ve sade bir örnek özet yaz.',
                ].join('\n')
              }
            />
          </View>
        </>
      ) : null}
    </AppScreen>
  );
}
