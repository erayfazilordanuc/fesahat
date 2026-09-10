import React from 'react';
import { View, Text, Pressable, Modal, FlatList, InteractionManager } from 'react-native';
import {
  Settings as SettingsIcon,
  Pencil,
  Activity,
  ChevronRight,
  X,
} from 'lucide-react-native';

import {
  AppScreen,
  TabHeader,
  Surface,
  ActionButton,
  TextField,
  RoundButton,
  toneColor,
  toneSoft,
  toneText,
} from '../components/AppUI';
import { useThemeTokens } from '../components/practice/PracticeUI';
import {
  PROFILE_ICON_GROUPS,
  profileIconComponent,
  saveProfile,
  useProfile,
  type Profile,
  type ProfileIconId,
} from '../utils/profile';
import { useDailyProgress } from '../utils/dailyPracticeProgress';

// Profil sekmesi — yalnızca kimlik ve ayarlar.
//
// Ölçüm tarafı (istatistik kutuları, gelişim eğrisi, geçmiş girişleri) İlerleme
// sekmesine taşındı; burası aşırı yüklüydü ve ölçüm dili yalnızca mülakat +
// egzersizden ibaretti (YAPILACAKLAR Bölüm 0).

export default function ProfileScreen({ navigation }: any) {
  const t = useThemeTokens();
  const profile = useProfile();
  const { progress } = useDailyProgress();

  const [editing, setEditing] = React.useState(false);

  // Günlük pratik modüllerindeki en uzun güncel seri — kimlik kartındaki rozet.
  const bestStreak = Math.max(0, ...Object.values(progress.modules).map((m) => m.streak));

  return (
    <AppScreen
      tabBar
      header={
        <TabHeader
          icon={<Activity size={24} color={t.isLight ? '#059669' : '#34d399'} />}
          title="Profil"
          subtitle="Kimlik bilgilerin ve uygulama ayarları."
          right={
            <RoundButton
              icon={<SettingsIcon size={20} color={t.iconColor} />}
              onPress={() => navigation.navigate('Settings')}
              label="Ayarlar"
            />
          }
        />
      }
    >
      {editing ? (
        <ProfileEditor
          profile={profile}
          onCancel={() => setEditing(false)}
          onSave={(next) => {
            saveProfile(next);
            setEditing(false);
          }}
        />
      ) : (
        <ProfileCard profile={profile} bestStreak={bestStreak} onEdit={() => setEditing(true)} />
      )}

      <Text className={`text-[11px] leading-5 mt-4 text-center ${t.muted}`}>
        Serilerini ve ölçümlerini{' '}
        <Text className={toneText('blue', t.isLight)}>İlerleme</Text> sekmesinde görebilirsin.
      </Text>
    </AppScreen>
  );
}

function ProfileCard({
  profile,
  bestStreak,
  onEdit,
}: {
  profile: Profile;
  /** Günlük pratik modülleri arasındaki en uzun güncel seri. */
  bestStreak: number;
  onEdit: () => void;
}) {
  const t = useThemeTokens();
  const Icon = profileIconComponent(profile.icon);

  return (
    <Surface className="mt-1">
      <View className="flex-row items-center">
        <View
          className={`w-16 h-16 rounded-full items-center justify-center ${toneSoft('blue', t.isLight)}`}
        >
          <Icon size={28} color={toneColor('blue', t.isLight)} />
        </View>

        <View className="flex-1 ml-3">
          <Text className={`text-[17px] font-bold ${t.title}`} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text className={`text-[11px] mt-0.5 ${t.muted}`} numberOfLines={1}>
            {profile.role}
          </Text>
          {/* Rozet gerçek bir şey söylesin: eskiden hep "Aktif Aday" yazıyordu,
              yani hiçbir bilgi taşımıyordu. Şimdi günlük pratikteki en uzun
              seriyi gösteriyor; seri yoksa rozet hiç çıkmıyor. */}
          {bestStreak > 0 ? (
            <View
              className={`flex-row items-center self-start mt-2 px-2.5 py-1 rounded-full ${toneSoft('emerald', t.isLight)}`}
            >
              <Activity size={12} color={toneColor('emerald', t.isLight)} />
              <Text className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${toneText('emerald', t.isLight)}`}>
                {bestStreak} günlük seri
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={onEdit}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Profili düzenle"
          className={`w-9 h-9 rounded-full items-center justify-center ${
            t.isLight ? 'bg-slate-100' : 'bg-slate-800'
          }`}
        >
          <Pencil size={16} color={t.iconColor} />
        </Pressable>
      </View>
    </Surface>
  );
}

function ProfileEditor({
  profile,
  onSave,
  onCancel,
}: {
  profile: Profile;
  onSave: (next: Partial<Profile>) => void;
  onCancel: () => void;
}) {
  const t = useThemeTokens();
  const [draft, setDraft] = React.useState<Profile>(profile);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const DraftIcon = profileIconComponent(draft.icon);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  // Sabit kimlikler: IconGroupRow React.memo ile sarılı, her render'da yeni
  // closure geçilseydi memo hiçbir işe yaramaz ve seçim yapılınca dokuz grubun
  // tamamı yeniden çizilirdi.
  const handleSelectIcon = React.useCallback((id: ProfileIconId) => {
    setDraft((prev) => ({ ...prev, icon: id }));
    setPickerOpen(false);
  }, []);
  const closePicker = React.useCallback(() => setPickerOpen(false), []);

  return (
    <Surface className="mt-1">
      <Text className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${t.muted}`}>
        Profili Düzenle
      </Text>

      <TextField
        label="İsim Soyisim"
        value={draft.name}
        onChangeText={(value) => set('name', value)}
        placeholder="Adınız ve soyadınız"
        autoCapitalize="words"
      />
      <TextField
        label="Kariyer Hedefi"
        value={draft.role}
        onChangeText={(value) => set('role', value)}
        placeholder="Örn. Ürün Yöneticisi"
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <TextField
            label="LinkedIn URL"
            value={draft.linkedin}
            onChangeText={(value) => set('linkedin', value)}
            placeholder="https://linkedin.com/..."
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>
        <View className="flex-1">
          <TextField
            label="Site / Portfolyo"
            value={draft.website}
            onChangeText={(value) => set('website', value)}
            placeholder="https://..."
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>
      </View>

      <Text className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${t.muted}`}>
        İkon
      </Text>
      <Pressable
        onPress={() => setPickerOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="İkon seç"
        className={`flex-row items-center rounded-2xl px-3 py-2.5 border ${
          t.isLight ? 'border-slate-200 bg-slate-50' : 'border-[#2e2e33] bg-[#141417]'
        }`}
      >
        <View
          className={`w-11 h-11 rounded-full items-center justify-center ${toneSoft('blue', t.isLight)}`}
        >
          <DraftIcon size={22} color={toneColor('blue', t.isLight)} />
        </View>
        <View className="flex-1 ml-3">
          <Text className={`text-[13px] font-semibold ${t.title}`}>İkon Seç</Text>
        </View>
        <ChevronRight size={18} color={t.iconColor} />
      </Pressable>

      <IconPickerModal
        visible={pickerOpen}
        selected={draft.icon}
        onSelect={handleSelectIcon}
        onClose={closePicker}
      />

      <View className="flex-row gap-3 mt-5">
        <View className="flex-1">
          <ActionButton label="İptal" variant="outline" onPress={onCancel} />
        </View>
        <View className="flex-1">
          <ActionButton label="Kaydet" onPress={() => onSave(draft)} />
        </View>
      </View>
    </Surface>
  );
}

/**
 * İkon seçici. Kütüphane bölüm bölüm geziliyor; seçilen ikon anında
 * uygulanıp sayfa kapanıyor — ayrıca "tamam" düğmesi yok, çünkü seçim
 * zaten taslağa yazılıyor ve asıl kayıt formun "Kaydet"inde oluyor.
 */
function IconPickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: ProfileIconId;
  onSelect: (id: ProfileIconId) => void;
  onClose: () => void;
}) {
  const t = useThemeTokens();

  // Modal kapanınca sıfırlanıyor ki bir sonraki açılış da hafif başlasın.
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (!visible) {
      setReady(false);
      return;
    }
    const task = InteractionManager.runAfterInteractions(() => setReady(true));
    return () => task.cancel();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
        <View
          className={`rounded-t-3xl overflow-hidden ${t.isLight ? 'bg-white' : 'bg-[#1c1c1f]'}`}
          style={{ height: '82%' }}
        >
          <View
            className={`flex-row items-center px-5 pt-5 pb-3 border-b ${
              t.isLight ? 'border-slate-200' : 'border-[#2e2e33]'
            }`}
          >
            <Text className={`flex-1 text-[17px] font-bold ${t.title}`}>İkon Seç</Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Kapat"
              className={`w-9 h-9 rounded-full items-center justify-center ${
                t.isLight ? 'bg-slate-100' : 'bg-slate-800'
              }`}
            >
              <X size={18} color={t.iconColor} />
            </Pressable>
          </View>

          {/* Ağır kısım modal kayarken monte edilmiyor.
              82 ikonun her biri birkaç <Path> içeren gerçek bir native view;
              hepsi tek commit'te kurulunca açılış animasyonu takılıyordu.
              Önce iskelet çiziliyor, geçiş bitince liste geliyor. */}
          {ready ? (
            <FlatList
              data={PROFILE_ICON_GROUPS}
              keyExtractor={(group) => group.id}
              renderItem={({ item }) => (
                <IconGroupRow group={item} selected={selected} onSelect={onSelect} />
              )}
              // Grup başına sanallaştırma: ilk açılışta 82 değil ~20 ikon monte oluyor.
              initialNumToRender={2}
              maxToRenderPerBatch={2}
              windowSize={3}
              removeClippedSubviews
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      </View>
    </Modal>
  );
}

/** Seçicideki tek bir grup: başlık + sarmalanan ikon ızgarası. */
const IconGroupRow = React.memo(function IconGroupRow({
  group,
  selected,
  onSelect,
}: {
  group: (typeof PROFILE_ICON_GROUPS)[number];
  selected: ProfileIconId;
  onSelect: (id: ProfileIconId) => void;
}) {
  const t = useThemeTokens();

  return (
    <View className="mb-5">
      <Text className={`text-[10px] font-bold uppercase tracking-widest mb-2.5 ${t.muted}`}>
        {group.title}
      </Text>
      <View className="flex-row flex-wrap">
        {group.icons.map((id) => {
          const Icon = profileIconComponent(id);
          const active = id === selected;
          return (
            <Pressable
              key={id}
              onPress={() => onSelect(id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className={`w-[52px] h-[52px] rounded-2xl items-center justify-center mr-2.5 mb-2.5 border ${
                active
                  ? t.isLight
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-blue-400 bg-blue-950'
                  : `border-transparent ${t.isLight ? 'bg-slate-100' : 'bg-slate-800'}`
              }`}
            >
              <Icon size={22} color={active ? toneColor('blue', t.isLight) : t.iconColor} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
