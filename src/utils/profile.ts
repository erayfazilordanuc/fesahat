import { createPersistentStore } from './store';
import { isProfileIconId, type ProfileIconId } from '../data/profileIcons';
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
};

const DEFAULTS: Profile = {
  name: '',
  role: '',
  linkedin: '',
  website: '',
  icon: 'userCheck',
  avatarTone: 'blue',
  avatarUri: '',
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
