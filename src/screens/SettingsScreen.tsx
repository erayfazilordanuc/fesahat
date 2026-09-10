import React from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
import { Globe, Bell, Send, HeartHandshake, Monitor, Sun, Moon, Save, Plug } from 'lucide-react-native';

import {
  AppScreen,
  AppHeader,
  Surface,
  SectionLabel,
  Segmented,
  TextField,
  ActionButton,
  Toggle,
  toneColor,
  toneSoft,
  useThemeTokens,
} from '../components/AppUI';
import { useDailyPracticeSettings } from '../utils/dailyPracticeSettings';
import { useAppTheme, type ThemeMode } from '../utils/ThemeContext';
import {
  API_BASE_URL_PLACEHOLDER,
  normalizeBaseUrl,
  updateAppSettings,
  useAppSettings,
  type ReminderFrequency,
} from '../utils/appSettings';
import { testConnection } from '../utils/geminiClient';
import { requestNotificationPermission, sendTestReminder } from '../utils/dailyNotifications';

// Ayarlar ekranı: sunucu adresi, hatırlatıcılar, dinî içerik, tema ve günlük pratik modülleri.

export default function SettingsScreen({ navigation }: any) {
  const t = useThemeTokens();
  const appSettings = useAppSettings();
  const { settings, setSetting } = useDailyPracticeSettings();
  const { mode, setMode } = useAppTheme();

  const [urlDraft, setUrlDraft] = React.useState(appSettings.apiBaseUrl);
  const [tokenDraft, setTokenDraft] = React.useState(appSettings.appToken);
  const [testing, setTesting] = React.useState(false);

  const saveUrl = () => {
    const normalized = normalizeBaseUrl(urlDraft);
    if (!normalized) {
      Alert.alert('Adres boş olamaz', 'Örnek: 192.168.1.53:3000');
      return;
    }
    updateAppSettings({ apiBaseUrl: normalized, appToken: tokenDraft.trim() });
    setUrlDraft(normalized);
    Alert.alert('Kaydedildi', `Sunucu adresi güncellendi:\n${normalized}`);
  };

  const runConnectionTest = async () => {
    // Test her zaman kayıtlı adrese gider; kutudaki düzenleme henüz kaydedilmemiş olabilir.
    const normalized = normalizeBaseUrl(urlDraft);
    if (normalized && normalized !== appSettings.apiBaseUrl) {
      updateAppSettings({ apiBaseUrl: normalized });
      setUrlDraft(normalized);
    }

    setTesting(true);
    const result = await testConnection();
    setTesting(false);
    Alert.alert(result.ok ? 'Bağlantı başarılı' : 'Bağlantı sorunu', result.message);
  };

  /** Sıklık değişimi hem uygulama ayarını hem ana bildirim şalterini günceller. */
  const changeFrequency = async (next: ReminderFrequency) => {
    if (next === 'off') {
      updateAppSettings({ reminderFrequency: next });
      setSetting('notificationsEnabled', false);
      return;
    }

    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      Alert.alert(
        permission === 'unsupported' ? 'Bu cihazda desteklenmiyor' : 'Bildirim izni verilmedi',
        permission === 'unsupported'
          ? 'Bildirimler simülatör/emülatörde çalışmaz. Gerçek bir cihazda deneyin.'
          : Platform.OS === 'ios'
            ? 'Ayarlar → Bildirimler üzerinden Terakki için bildirimlere izin verin.'
            : 'Uygulama bilgileri → Bildirimler üzerinden izin verin.',
      );
      return;
    }

    updateAppSettings({ reminderFrequency: next });
    setSetting('notificationsEnabled', true);
  };

  const frequency: ReminderFrequency = settings.notificationsEnabled
    ? appSettings.reminderFrequency === 'off'
      ? 'daily'
      : appSettings.reminderFrequency
    : 'off';

  return (
    <AppScreen header={<AppHeader title="Ayarlar" onBack={() => navigation.goBack()} />}>
      {/* ——— Geliştirici seçenekleri ——— */}
      <SectionLabel>Geliştirici Seçenekleri</SectionLabel>
      <Surface>
        <View className="flex-row items-center mb-2">
          <Globe size={16} color={toneColor('blue', t.isLight)} />
          <Text className={`text-[13px] font-bold ml-2 ${t.title}`}>Backend API Adresi</Text>
        </View>
        <Text className={`text-[11px] leading-5 mb-3 ${t.muted}`}>
          Mülakat analizlerinin yapılması için yerel bilgisayarınızda çalışan Express sunucusunun
          adresini girin. Telefon ve bilgisayar aynı ağda olmalı.
        </Text>

        <TextField
          value={urlDraft}
          onChangeText={setUrlDraft}
          placeholder={API_BASE_URL_PLACEHOLDER}
          autoCapitalize="none"
          keyboardType="url"
        />

        {/* Sunucuda APP_TOKEN tanımlıysa doldurulur; boşsa istek başlıksız gider. */}
        <Text className={`text-[11px] leading-5 mb-2 mt-1 ${t.muted}`}>
          Sunucunuz bir erişim jetonuyla korunuyorsa (.env → APP_TOKEN) aynı değeri buraya girin.
        </Text>
        <TextField
          value={tokenDraft}
          onChangeText={setTokenDraft}
          placeholder="Erişim jetonu (isteğe bağlı)"
          autoCapitalize="none"
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <ActionButton
              label="Kaydet"
              tone="emerald"
              labelSize={12}
              icon={<Save size={15} color="#ffffff" />}
              onPress={saveUrl}
            />
          </View>
          <View className="flex-1">
            <ActionButton
              label={testing ? 'Deneniyor…' : 'Bağlantıyı Test Et'}
              variant="outline"
              disabled={testing}
              labelSize={12}
              icon={<Plug size={15} color={t.iconColor} />}
              onPress={runConnectionTest}
            />
          </View>
        </View>
      </Surface>

      {/* ——— Uygulama tercihleri ——— */}
      <SectionLabel>Uygulama Tercihleri</SectionLabel>
      <Surface>
        <View className="flex-row items-center mb-3">
          <Bell size={16} color={toneColor('blue', t.isLight)} />
          <Text className={`text-[13px] font-bold ml-2 ${t.title}`}>Hatırlatıcı Bildirimleri</Text>
        </View>

        <Segmented<ReminderFrequency>
          value={frequency}
          onChange={changeFrequency}
          options={[
            { value: 'off', label: 'Kapalı' },
            { value: 'daily', label: 'Her Gün' },
            { value: 'everyOtherDay', label: '2 Günde 1' },
          ]}
        />

        <View className="mt-3">
          <ActionButton
            label="Bildirimi Test Et (3 Saniye)"
            variant="soft"
            disabled={frequency === 'off'}
            labelSize={12}
            icon={<Send size={15} color={toneColor('blue', t.isLight)} />}
            onPress={() => {
              sendTestReminder(settings).catch(() =>
                Alert.alert(
                  'Bildirim gönderilemedi',
                  'İzinleri ve cihaz ayarlarını kontrol edin.',
                ),
              );
            }}
          />
        </View>

        {/* Dinî içerik */}
        <View className={`flex-row items-center py-3 mt-3 border-t ${t.dividerColor}`}>
          <View
            className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${toneSoft('emerald', t.isLight)}`}
          >
            <HeartHandshake size={17} color={toneColor('emerald', t.isLight)} />
          </View>
          <View className="flex-1 pr-3">
            <Text className={`text-[13px] font-bold ${t.title}`}>Dini Mod</Text>
            <Text className={`text-[11px] mt-0.5 ${t.muted}`}>
              Ana ekranda günlük hadis ve ayet gösterir.
            </Text>
          </View>
          <Toggle
            value={settings.religiousMode}
            onValueChange={(value) => setSetting('religiousMode', value)}
          />
        </View>

        {/* Tema */}
        <View className={`pt-3 border-t ${t.dividerColor}`}>
          <View className="flex-row items-center mb-3">
            <Monitor size={16} color={t.iconColor} />
            <Text className={`text-[13px] font-bold ml-2 ${t.title}`}>Tema Tercihi</Text>
          </View>
          <Segmented<ThemeMode>
            value={mode}
            onChange={setMode}
            options={[
              {
                value: 'system',
                label: 'Sistem',
                icon: <Monitor size={14} color={mode === 'system' ? toneColor('blue', t.isLight) : t.iconColor} />,
              },
              {
                value: 'light',
                label: 'Açık',
                icon: <Sun size={14} color={mode === 'light' ? toneColor('blue', t.isLight) : t.iconColor} />,
              },
              {
                value: 'dark',
                label: 'Koyu',
                icon: <Moon size={14} color={mode === 'dark' ? toneColor('blue', t.isLight) : t.iconColor} />,
              },
            ]}
          />
        </View>
      </Surface>

      {/* ——— Sistem bilgileri ——— */}
      <SectionLabel>Sistem Bilgileri</SectionLabel>
      <Surface>
        <InfoRow label="Uygulama" value={Constants.expoConfig?.name ?? 'Terakki'} />
        <InfoRow label="Sürüm" value={Constants.expoConfig?.version ?? '1.0.0'} divider />
        <InfoRow label="Platform" value={`${Platform.OS} ${Platform.Version}`} divider />
        <InfoRow label="Sunucu" value={appSettings.apiBaseUrl || 'Tanımsız'} divider />
      </Surface>
    </AppScreen>
  );
}

function InfoRow({ label, value, divider }: { label: string; value: string; divider?: boolean }) {
  const t = useThemeTokens();
  return (
    <View className={`flex-row items-center py-3 ${divider ? `border-t ${t.dividerColor}` : ''}`}>
      <Text className={`text-[12px] ${t.muted}`}>{label}</Text>
      <Text className={`text-[12px] font-bold ml-auto ${t.title}`} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
