import { createPersistentStore } from './store';
import { isProfileIconId, type ProfileIconId } from '../data/profileIcons';
import { DEPARTMENTS, type DepartmentId } from '../data/questions';
import type { Tone } from '../components/AppUI';

export type { ProfileIconId };
export { PROFILE_ICON_GROUPS, PROFILE_ICON_IDS, profileIconComponent } from '../data/profileIcons';

// Profil ekranındaki kullanıcı kartı. Sunucuya gitmez, yalnızca cihazda saklanır.
export type Profile = {
  name: string;
  role: string;
  linkedin: string;
  website: string;
  icon: ProfileIconId;
  avatarTone: Tone;
  avatarUri: string;
  /**
   * Mülakatta ve günün teknik sorusunda kullanılan hedef alan.
   * `''` = seçilmedi; o hâlde teknik soru gösterilmez, seçime yönlendirilir.
   */
  targetDepartment: DepartmentId | '';
};

const DEFAULTS: Profile = {
  name: '',
  role: '',
  linkedin: '',
  website: '',
  icon: 'userCheck',
  avatarTone: 'blue',
  avatarUri: '',
  targetDepartment: '',
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
    // Katalog değişirse (YAPILACAKLAR Bölüm 00) kaybolmuş bir departman kimliği
    // kalabilir; "seçilmedi"ye düşürülüyor, yoksa boş havuzla soru seçilmeye
    // çalışılır.
    targetDepartment: DEPARTMENTS.some((d) => d.id === value.targetDepartment)
      ? (value.targetDepartment as DepartmentId)
      : '',
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

/** Seçilmiş hedef alanın etiketi; seçilmemişse boş döner. */
export function targetDepartmentLabel(profile: Profile): string {
  return DEPARTMENTS.find((d) => d.id === profile.targetDepartment)?.label ?? '';
}

/**
 * Yapay zekâ istemlerine eklenecek bağlam cümlesi.
 * İkisi de boşsa boş döner — "hedefi: ." gibi sakat bir cümle kurulmasın.
 */
export function careerContext(profile: Profile): string {
  const role = profile.role.trim();
  const department = targetDepartmentLabel(profile);
  return [
    role ? `Kullanıcının kariyer hedefi: ${role}.` : '',
    department ? `Hedeflediği alan: ${department}.` : '',
  ]
    .filter(Boolean)
    .join(' ');
}
