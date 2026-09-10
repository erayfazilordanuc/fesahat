import { createPersistentStore } from './store';
import { isProfileIconId, type ProfileIconId } from '../data/profileIcons';

export type { ProfileIconId };
export { PROFILE_ICON_GROUPS, PROFILE_ICON_IDS, profileIconComponent } from '../data/profileIcons';

// Profil ekranındaki kullanıcı kartı. Sunucuya gitmez, yalnızca cihazda saklanır.
//
// Profil bilerek alan bağımsız: uygulama savunma sanayii mülakatı için doğdu ama
// artık kariyerden diksiyona, nefesten zihne uzanan bir kişisel gelişim
// uygulaması. Bu yüzden varsayılanlarda sektör adı geçmiyor; kariyer hedefini
// kullanıcı kendi yazıyor.

export type Profile = {
  name: string;
  /**
   * Kariyer hedefi — "Makine Mühendisi", "Ürün Yöneticisi", "Öğretmen"…
   * Mülakat sorularının ve analizlerin bağlamında da kullanılıyor; boş
   * bırakılabilir, o zaman bağlam cümlesi hiç eklenmiyor.
   */
  role: string;
  linkedin: string;
  /** Kişisel site, portfolyo ya da herhangi bir profil bağlantısı. */
  website: string;
  icon: ProfileIconId;
};

const DEFAULTS: Profile = {
  name: '',
  role: '',
  linkedin: '',
  website: '',
  icon: 'userCheck',
};

export const profileStore = createPersistentStore<Profile>('user-profile', DEFAULTS, (stored) => {
  const value = (stored ?? {}) as Partial<Profile> & { github?: string };
  return {
    ...DEFAULTS,
    ...value,
    // Alan eskiden "github" idi; eski kayıtlar kaybolmasın diye taşınıyor.
    website: value.website ?? value.github ?? '',
    // Kütüphaneden kalkmış ya da bozulmuş bir kimlik ekranı çökertmesin.
    icon: isProfileIconId(value.icon) ? value.icon : DEFAULTS.icon,
  };
});

export function useProfile(): Profile {
  return profileStore.use();
}

export function saveProfile(patch: Partial<Profile>): void {
  profileStore.set((prev) => ({ ...prev, ...patch }));
}

/** Ana ekrandaki karşılamada kullanılan ilk isim; ad girilmemişse boş döner. */
export function firstName(profile: Profile): string {
  return profile.name.trim().split(/\s+/)[0] ?? '';
}

/**
 * Yapay zekâ istemlerine eklenecek bağlam cümlesi.
 * Kariyer hedefi girilmemişse boş döner — "hedefi: ." gibi sakat bir cümle kurulmasın.
 */
export function careerContext(profile: Profile): string {
  const role = profile.role.trim();
  return role ? `Kullanıcının kariyer hedefi: ${role}.` : '';
}
