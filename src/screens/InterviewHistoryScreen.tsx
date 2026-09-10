import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight, Clock } from 'lucide-react-native';

import { AppScreen, AppHeader, Surface, EmptyState, Badge, type Tone } from '../components/AppUI';
import { AiInsightCard } from '../components/AiInsightCard';
import { useThemeTokens } from '../components/practice/PracticeUI';
import { useInterviewSessions, type RecordedSession } from '../utils/interviewHistory';
import { findCompany, companyColor } from '../data/companies';
import { careerContext, profileStore } from '../utils/profile';
import { formatDuration, formatShortDate } from '../utils/dateUtils';

// Tamamlanan mülakatların listesi ve tüm kayıtlar üzerinden toplu yapay zeka değerlendirmesi.

export default function InterviewHistoryScreen({ navigation }: any) {
  const t = useThemeTokens();
  const sessions = useInterviewSessions();

  const analyzed = sessions.filter((session) => session.analysis);

  /** Toplu analiz istemi — tek tek geri bildirimler yerine gidişatı değerlendirir. */
  const buildPrompt = () => {
    const profile = profileStore.get();
    const lines = analyzed.slice(0, 20).map((session, index) => {
      const analysis = session.analysis!;
      return [
        `${index + 1}. ${formatShortDate(new Date(session.timestamp))} · ${session.companyName}`,
        `   Soru: ${session.questionText}`,
        `   Puan: ${analysis.rating}/100 · Dayanıklılık: ${analysis.defenseResilience} · Akıcılık etiketi: ${analysis.fillerRating}`,
        `   Geliştirilecekler: ${analysis.improvementPoints.join('; ')}`,
      ].join('\n');
    });

    return [
      'Sen Türk savunma sanayii mülakatlarında görev almış kıdemli bir değerlendirme uzmanısın.',
      careerContext(profile),
      'Aşağıda adayın geçmiş mülakat simülasyonları ve puanları var. Tek tek oturumları değil,',
      'genel gidişatı, tekrar eden zayıflıkları ve gelişim eğrisini değerlendir. Türkçe yaz.',
      '',
      ...lines,
    ].join('\n');
  };

  return (
    <AppScreen
      header={
        <AppHeader title="Mülakat Geçmişi" onBack={() => navigation.goBack()} align="center" />
      }
    >
      <View className="mt-1">
        <AiInsightCard
          title="Yapay Zeka Mülakat Analizi"
          description="Gerçekleştirdiğiniz tüm mülakatların puanlarını, hitabetinizi ve teknik derinliğinizi analiz ederek kariyer hedefinize özel gelişim yol haritası çıkartın."
          buttonLabel="Mülakatlarımı Analiz Et"
          buildPrompt={buildPrompt}
          disabled={analyzed.length === 0}
          disabledHint="Toplu analiz için en az bir değerlendirilmiş mülakat gerekiyor."
        />
      </View>

      <Text className={`text-[16px] font-bold mt-6 mb-3 ${t.title}`}>Geçmiş Simülasyonlar</Text>

      {sessions.length === 0 ? (
        <EmptyState message="Henüz tamamlanmış mülakatınız bulunmuyor." />
      ) : (
        <Surface>
          {sessions.map((session, index) => (
            <SessionRow
              key={session.id}
              session={session}
              divider={index > 0}
              onPress={() => navigation.navigate('Analysis', { sessionId: session.id })}
            />
          ))}
        </Surface>
      )}
    </AppScreen>
  );
}

function SessionRow({
  session,
  divider,
  onPress,
}: {
  session: RecordedSession;
  divider: boolean;
  onPress: () => void;
}) {
  const t = useThemeTokens();
  // Kayıt diskten geliyor; kurum listeden kalkmış olabilir. Fırlatmak yerine
  // satırı nötr bir etiketle çiziyoruz — geçmiş kaybolmasın.
  const company = findCompany(session.companyId);
  const rating = session.analysis?.rating;
  const tone: Tone =
    rating === undefined ? 'slate' : rating >= 75 ? 'emerald' : rating >= 50 ? 'amber' : 'rose';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`flex-row items-center py-3.5 ${divider ? `border-t ${t.dividerColor}` : ''}`}
    >
      <View className="flex-1 pr-3">
        <View className="flex-row items-center mb-1">
          <Text
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: company ? companyColor(company, t.isLight) : t.iconColor }}
          >
            {company?.name ?? 'BİLİNMEYEN KURUM'}
          </Text>
          <Text className={`text-[10px] ml-2 ${t.muted}`}>
            {formatShortDate(new Date(session.timestamp))}
          </Text>
        </View>
        <Text className={`text-[13px] font-bold leading-5 ${t.title}`} numberOfLines={2}>
          {session.questionText}
        </Text>
        <View className="flex-row items-center mt-1.5">
          <Clock size={11} color={t.iconColor} />
          <Text className={`text-[11px] ml-1 ${t.muted}`}>
            {formatDuration(session.durationSeconds)} ·{' '}
            {session.mode === 'camera' ? 'Kamera' : 'Yazılı'}
          </Text>
        </View>
      </View>

      <Badge label={rating === undefined ? 'Analiz yok' : `${rating}`} tone={tone} />
      <View className="ml-1">
        <ChevronRight size={16} color={t.iconColor} />
      </View>
    </Pressable>
  );
}
