import React from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import { Bell, BellOff, Wind, Mic, Feather, BookOpen, Moon } from 'lucide-react-native';

import { Toggle } from '../AppUI';
import { Card, Chip, GhostButton, SectionTitle, SettingRow, TimeStepper, useThemeTokens } from './PracticeUI';
import {
  useDailyPracticeSettings,
  type BelagatBranchFilter,
  type BreathingLevel,
  type DailyTextSource,
} from '../../utils/dailyPracticeSettings';
import {
  hasNotificationPermission,
  requestNotificationPermission,
  sendTestReminder,
} from '../../utils/dailyNotifications';
import {
  BREATHING_LEVELS,
  BREATHING_MODES,
  getBreathingProgram,
} from '../../data/breathingPrograms';

// Ayarlar ekranına yerleştirilecek "Günlük Pratik" bölümü.
// Tek kural: bir modül kapalıysa ne kartı görünür ne bildirimi kurulur;
// ana bildirim şalteri kapalıysa hiçbir modül bildirim kurmaz.

export function DailyPracticeSettingsSection() {
  const t = useThemeTokens();
  const { settings, setSetting, updateModule } = useDailyPracticeSettings();
  const [permission, setPermission] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    hasNotificationPermission()
      .then(setPermission)
      .catch(() => setPermission(false));
  }, []);

  const toggleNotifications = async (next: boolean) => {
    if (!next) {
      setSetting('notificationsEnabled', false);
      return;
    }

    const result = await requestNotificationPermission();
    if (result === 'granted') {
      setPermission(true);
      setSetting('notificationsEnabled', true);
      return;
    }

    setPermission(false);
    Alert.alert(
      result === 'unsupported' ? 'Bu cihazda desteklenmiyor' : 'Bildirim izni verilmedi',
      result === 'unsupported'
        ? 'Bildirimler simülatör/emülatörde çalışmaz. Gerçek bir cihazda deneyin.'
        : Platform.OS === 'ios'
          ? 'Ayarlar → Bildirimler üzerinden Terakki için bildirimlere izin verin.'
          : 'Uygulama bilgileri → Bildirimler üzerinden izin verin.',
    );
  };

  const notificationsOff = !settings.notificationsEnabled;

  return (
    <View>
      {/* Ana şalterler */}
      <SectionTitle hint="Günlük diyafram, konuşma, belagat ve okuma metni modüllerini buradan yönetin.">
        Günlük Pratik
      </SectionTitle>

      <Card>
        <SettingRow
          title="Bildirimler"
          description={
            permission === false && settings.notificationsEnabled
              ? 'İzin verilmedi — hatırlatmalar kurulmayacak.'
              : 'Kapatıldığında hiçbir modül hatırlatma göndermez.'
          }
          right={
            <View className="flex-row items-center">
              {settings.notificationsEnabled ? (
                <Bell size={16} color={t.isLight ? '#2563eb' : '#60a5fa'} />
              ) : (
                <BellOff size={16} color={t.iconColor} />
              )}
              <Toggle
                value={settings.notificationsEnabled}
                onValueChange={toggleNotifications}
                style={{ marginLeft: 8 }}
              />
            </View>
          }
        />

        <View className={`border-t ${t.dividerColor}`}>
          <SettingRow
            title="Dinî içerik"
            description="Günün duası kartı ve dinî okuma metinleri. Kapalıyken dinî metinler havuza hiç girmez."
            right={
              <View className="flex-row items-center">
                <Moon size={16} color={settings.religiousMode ? (t.isLight ? '#059669' : '#34d399') : t.iconColor} />
                <Toggle
                  value={settings.religiousMode}
                  onValueChange={(v) => setSetting('religiousMode', v)}
                  style={{ marginLeft: 8 }}
                />
              </View>
            }
          />
        </View>
      </Card>

      {/* Diyafram */}
      <ModuleBlock
        icon={<Wind size={16} color={t.isLight ? '#2563eb' : '#60a5fa'} />}
        title="Diyafram Egzersizi"
        description={`${
          getBreathingProgram(settings.diaphragm.mode, settings.diaphragm.level).title
        } · ${getBreathingProgram(settings.diaphragm.mode, settings.diaphragm.level).durationLabel}`}
        module="diaphragm"
        notificationsOff={notificationsOff}
      >
        <SettingRow
          style={{marginTop: 4}}
          title="Çalışma Biçimi"
          description="Günlük: kısa bakım programı · Gelişim: seviyeli uzun program"
          right={<View />}
        />
        <View className="flex-row flex-wrap">
          {BREATHING_MODES.map((m) => (
            <Chip
              key={m.value}
              label={m.label}
              selected={settings.diaphragm.mode === m.value}
              onPress={() => updateModule('diaphragm', { mode: m.value })}
            />
          ))}
        </View>

        {/* Seviye yalnızca gelişim modunda anlamlı. */}
        {settings.diaphragm.mode === 'progressive' ? (
          <>
            <SettingRow
              title="Seviye"
              description="1: farkındalık · 2: kontrollü nefes · 3: mülakat baskısı"
              right={<View />}
            />
            <View className="flex-row flex-wrap">
              {BREATHING_LEVELS.map((level: BreathingLevel) => (
                <Chip
                  key={level}
                  label={`Seviye ${level}`}
                  selected={settings.diaphragm.level === level}
                  onPress={() => updateModule('diaphragm', { level })}
                />
              ))}
            </View>
          </>
        ) : null}
      </ModuleBlock>

      {/* Konuşma */}
      <ModuleBlock
        icon={<Mic size={16} color={t.isLight ? '#7c3aed' : '#a78bfa'} />}
        title="Konuşma Egzersizi"
        description="Artikülasyon, tekerleme, vurgu, tempo ve dolgu kelime avı"
        module="speech"
        notificationsOff={notificationsOff}
      >
        <View className={`border-t ${t.dividerColor}`}>
          <SettingRow
            title="Tekerlemeler"
            description="Kapalıyken tekerleme egzersizleri havuza girmez."
            right={
              <Toggle
                value={settings.speech.includeTongueTwisters}
                onValueChange={(v) => updateModule('speech', { includeTongueTwisters: v })}
              />
            }
          />
        </View>
        <View className={`border-t ${t.dividerColor}`}>
          <SettingRow
            title="Dolgu kelime avı"
            description='"yani, şey, eee" temizliği alıştırması.'
            right={
              <Toggle
                value={settings.speech.includeFillerHunt}
                onValueChange={(v) => updateModule('speech', { includeFillerHunt: v })}
              />
            }
          />
        </View>
      </ModuleBlock>

      {/* Belagat */}
      <ModuleBlock
        icon={<Feather size={16} color={t.isLight ? '#059669' : '#34d399'} />}
        title="Belagat"
        description="Meânî, beyân ve bedî' sanatları + fesahat kusurları"
        module="belagat"
        notificationsOff={notificationsOff}
      >
        <SettingRow title="Çalışılacak kol" description="Günün sanatı bu havuzdan seçilir." right={<View />} />
        <View className="flex-row flex-wrap">
          {(
            [
              { value: 'karisik', label: 'Tümü' },
              { value: 'meani', label: 'Meânî' },
              { value: 'beyan', label: 'Beyân' },
              { value: 'bedi', label: "Bedî'" },
            ] as { value: BelagatBranchFilter; label: string }[]
          ).map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              tone="emerald"
              selected={settings.belagat.branch === option.value}
              onPress={() => updateModule('belagat', { branch: option.value })}
            />
          ))}
        </View>
      </ModuleBlock>

      {/* Günün metni */}
      <ModuleBlock
        icon={<BookOpen size={16} color={t.isLight ? '#059669' : '#34d399'} />}
        title="Günün Metni"
        description="Sesli okunacak, belagat sanatları işaretlenmiş metin"
        module="dailyText"
        notificationsOff={notificationsOff}
      >
        <SettingRow
          title="Metin kaynağı"
          description={
            settings.religiousMode
              ? 'Dinî, edebî ve hitabet metinleri.'
              : 'Dinî içerik kapalı olduğu için dinî metinler listelenmez.'
          }
          right={<View />}
        />
        <View className="flex-row flex-wrap">
          {(
            [
              { value: 'karisik', label: 'Karışık' },
              { value: 'dini', label: 'Dinî' },
              { value: 'edebi', label: 'Edebî' },
              { value: 'hitabet', label: 'Hitabet' },
            ] as { value: DailyTextSource; label: string }[]
          ).map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              tone="emerald"
              selected={settings.dailyText.source === option.value}
              onPress={() => updateModule('dailyText', { source: option.value })}
            />
          ))}
        </View>
        <View className={`border-t ${t.dividerColor}`}>
          <SettingRow
            title="Ana ekranda göster"
            description="Mülakat sekmesinde günün metni kartı görünsün."
            right={
              <Toggle
                value={settings.dailyText.showOnHome}
                onValueChange={(v) => updateModule('dailyText', { showOnHome: v })}
              />
            }
          />
        </View>
      </ModuleBlock>

      {/* Test */}
      <View className="mt-4 mb-2">
        <GhostButton
          label="Test bildirimi gönder (3 sn)"
          disabled={notificationsOff || permission === false}
          onPress={() => {
            sendTestReminder(settings).catch(() =>
              Alert.alert('Bildirim gönderilemedi', 'İzinleri ve cihaz ayarlarını kontrol edin.'),
            );
          }}
        />
      </View>
    </View>
  );
}

/** Bir modülün açma/kapama, hatırlatma ve saat kontrollerini içeren blok. */
function ModuleBlock({
  icon,
  title,
  description,
  module,
  notificationsOff,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  module: 'diaphragm' | 'speech' | 'belagat' | 'dailyText';
  notificationsOff: boolean;
  children?: React.ReactNode;
}) {
  const t = useThemeTokens();
  const { settings, updateModule } = useDailyPracticeSettings();
  const config = settings[module];

  return (
    <Card className="mt-3">
      <View className="flex-row items-center mb-1">
        {icon}
        <Text className={`text-[11px] font-bold uppercase tracking-widest ml-2 ${t.muted}`}>
          {title}
        </Text>
      </View>

      <SettingRow
        title="Açık"
        description={description}
        right={
          <Toggle
            value={config.enabled}
            onValueChange={(v) => updateModule(module, { enabled: v } as any)}
          />
        }
      />

      <View className={`border-t ${t.dividerColor}`}>
        <SettingRow
          title="Günlük hatırlatma"
          description={
            notificationsOff
              ? 'Ana bildirim şalteri kapalı.'
              : config.enabled
                ? 'Seçilen saatte bir bildirim gönderilir.'
                : 'Modül kapalı.'
          }
          disabled={notificationsOff || !config.enabled}
          right={
            <Toggle
              value={config.reminder && config.enabled && !notificationsOff}
              disabled={notificationsOff || !config.enabled}
              onValueChange={(v) => updateModule(module, { reminder: v } as any)}
            />
          }
        />
      </View>

      <View className={`border-t ${t.dividerColor}`}>
        <SettingRow
          title="Saat"
          description="Bildirimin gönderileceği saat."
          disabled={notificationsOff || !config.enabled || !config.reminder}
          right={
            <TimeStepper
              hour={config.time.hour}
              minute={config.time.minute}
              disabled={notificationsOff || !config.enabled || !config.reminder}
              onChange={(time) => updateModule(module, { time } as any)}
            />
          }
        />
      </View>

      {children && config.enabled ? (
        <View className={`border-t ${t.dividerColor} pt-2`}>{children}</View>
      ) : null}
    </Card>
  );
}
