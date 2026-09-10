import React from 'react';
import { View, Text, Pressable, ScrollView, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../utils/ThemeContext';
import { useThemeTokens } from '../themeTokens';
import { AppHeader, SCREEN_TOP_GAP } from '../AppUI';

// Günlük pratik ekranlarının paylaştığı görsel parçalar.
// Uygulamanın mevcut düzeni gibi tema ayrımı NativeWind sınıflarıyla isLight üzerinden yapılıyor.

// Kanca artık ortak modülde; buradan da erişilebilsin diye yeniden dışa aktarılıyor.
export { useThemeTokens };

type ScreenShellProps = {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  closeIcon?: 'x' | 'back';
  children: React.ReactNode;
  /** Alt kısımda sabit kalan aksiyon alanı. */
  footer?: React.ReactNode;
  scroll?: boolean;
};

export function ScreenShell({
  title,
  subtitle,
  onClose,
  closeIcon = 'x',
  children,
  footer,
  scroll = true,
}: ScreenShellProps) {
  const t = useThemeTokens();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ paddingTop: insets.top + SCREEN_TOP_GAP }}>
      {/* Başlık, uygulamanın diğer alt ekranlarıyla aynı bileşen. */}
      <AppHeader
        title={title}
        subtitle={subtitle}
        onBack={onClose}
        backIcon={closeIcon === 'x' ? 'close' : 'back'}
      />

      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 px-5">{children}</View>
      )}

      {footer ? (
        <View
          className={`px-5 pt-3 border-t ${t.dividerColor}`}
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}

export function Card({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}) {
  const t = useThemeTokens();
  return (
    <View
      className={`rounded-2xl border p-4 ${t.cardBg} ${t.cardBorder} ${className}`}
      style={style}
    >
      {children}
    </View>
  );
}

export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  const t = useThemeTokens();
  return (
    <View className="mt-7 mb-2.5">
      <Text
        className={`text-[10px] font-semibold uppercase ${t.muted}`}
        style={{ letterSpacing: 1.4 }}
      >
        {children}
      </Text>
      {hint ? <Text className={`text-[11px] leading-4 mt-1.5 ${t.muted}`}>{hint}</Text> : null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = 'blue',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'blue' | 'violet' | 'emerald' | 'slate';
}) {
  const { isLight } = useAppTheme();
  const bg = {
    blue: isLight ? 'bg-blue-600' : 'bg-blue-500',
    violet: isLight ? 'bg-violet-600' : 'bg-violet-500',
    emerald: isLight ? 'bg-emerald-600' : 'bg-emerald-500',
    slate: isLight ? 'bg-slate-800' : 'bg-slate-700',
  }[tone];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      className={`rounded-2xl py-4 items-center justify-center ${bg} ${disabled ? 'opacity-40' : ''}`}
    >
      <Text className="text-white font-bold text-[14px]">{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const t = useThemeTokens();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      className={`rounded-2xl py-4 items-center justify-center border ${t.cardBorder} ${disabled ? 'opacity-40' : ''}`}
    >
      <Text className={`font-bold text-[14px] ${t.body}`}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  tone = 'blue',
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: 'blue' | 'violet' | 'emerald';
}) {
  const { isLight } = useAppTheme();
  const selectedClasses = {
    blue: isLight ? 'bg-blue-600 border-blue-600' : 'bg-blue-500 border-blue-500',
    violet: isLight ? 'bg-violet-600 border-violet-600' : 'bg-violet-500 border-violet-500',
    emerald: isLight ? 'bg-emerald-600 border-emerald-600' : 'bg-emerald-500 border-emerald-500',
  }[tone];
  const idleClasses = isLight
    ? 'bg-white border-slate-200'
    : 'bg-slate-900 border-slate-800';

  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      className={`px-3 py-2 rounded-full border mr-2 mb-2 ${selected ? selectedClasses : idleClasses}`}
    >
      <Text
        className={`text-[11px] font-bold ${
          selected ? 'text-white' : isLight ? 'text-slate-600' : 'text-slate-300'
        }`}
      >
        {label}
      </Text>
    </Wrapper>
  );
}

export function ProgressBar({ value, tone = 'blue' }: { value: number; tone?: 'blue' | 'violet' | 'emerald' }) {
  const { isLight } = useAppTheme();
  const fill = {
    blue: isLight ? 'bg-blue-600' : 'bg-blue-500',
    violet: isLight ? 'bg-violet-600' : 'bg-violet-500',
    emerald: isLight ? 'bg-emerald-600' : 'bg-emerald-500',
  }[tone];
  const clamped = Math.max(0, Math.min(1, value));

  return (
    <View className={`h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
      <View className={`h-full rounded-full ${fill}`} style={{ width: `${clamped * 100}%` }} />
    </View>
  );
}

/** Ayar satırı: sol tarafta başlık/açıklama, sağ tarafta kontrol. */
export function SettingRow({
  title,
  description,
  right,
  disabled,
  style,
}: {
  title: string;
  description?: string;
  right: React.ReactNode;
  disabled?: boolean;
  /** Satırın çevresindeki boşluğu çağrı yerinden ayarlamak için. */
  style?: ViewStyle;
}) {
  const t = useThemeTokens();
  return (
    <View
      className={`flex-row items-center justify-between py-3 ${disabled ? 'opacity-40' : ''}`}
      style={style}
    >
      <View className="flex-1 pr-4">
        <Text className={`text-[13px] font-bold ${t.title}`}>{title}</Text>
        {description ? (
          <Text className={`text-[11px] mt-0.5 leading-4 ${t.muted}`}>{description}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/**
 * Saat seçici. Yeni bir native bağımlılık (datetimepicker) eklememek için
 * artır/azalt düğmeleriyle çalışan basit bir kontrol.
 */
export function TimeStepper({
  hour,
  minute,
  onChange,
  disabled,
}: {
  hour: number;
  minute: number;
  onChange: (next: { hour: number; minute: number }) => void;
  disabled?: boolean;
}) {
  const t = useThemeTokens();
  const step = (deltaHour: number, deltaMinute: number) => {
    if (disabled) return;
    const total = (hour * 60 + minute + deltaHour * 60 + deltaMinute + 1440) % 1440;
    onChange({ hour: Math.floor(total / 60), minute: total % 60 });
  };

  const Btn = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      className={`w-7 h-7 rounded-lg items-center justify-center border ${t.cardBorder}`}
    >
      <Text className={`text-[12px] font-bold ${t.body}`}>{label}</Text>
    </Pressable>
  );

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <View className={`flex-row items-center ${disabled ? 'opacity-40' : ''}`}>
      <View className="items-center mr-1.5">
        <Btn label="+" onPress={() => step(1, 0)} />
        <Text className={`text-[15px] font-bold my-1 ${t.title}`}>{pad(hour)}</Text>
        <Btn label="−" onPress={() => step(-1, 0)} />
      </View>
      <Text className={`text-[15px] font-bold ${t.muted}`}>:</Text>
      <View className="items-center ml-1.5">
        <Btn label="+" onPress={() => step(0, 5)} />
        <Text className={`text-[15px] font-bold my-1 ${t.title}`}>{pad(minute)}</Text>
        <Btn label="−" onPress={() => step(0, -5)} />
      </View>
    </View>
  );
}
