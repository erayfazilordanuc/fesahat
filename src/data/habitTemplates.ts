// Aralıklı hatırlatıcıların hazır şablonları — YAPILACAKLAR Bölüm 4a.
//
// Kullanıcı sıfırdan hatırlatıcı kurmuyor, listeden seçip açıyor (KARARLAR
// "Kullanıcıdan içerik yazması istenmez"). Metin isteğe bağlı olarak
// değiştirilebilir; şablon yalnızca makul bir başlangıç veriyor.
//
// ⚠️ Abartılı vaat yok (KARARLAR "Modüller abartılı vaat vermez"): metinler
// hatırlatma cümlesidir, sağlık iddiası değildir.

export type HabitTemplateId =
  | 'su'
  | 'ayaga-kalk'
  | 'goz-molasi'
  | 'durus'
  | 'cene'
  | 'nefes-molasi'
  | 'niyet';

export type HabitTemplate = {
  id: HabitTemplateId;
  label: string;
  /** Bildirim gövdesi — kullanıcı değiştirebilir. */
  message: string;
  /** Varsayılan aralık (dakika). */
  intervalMinutes: number;
  /** Günlük sayaç tutulacak mı ve hedefi ne (ör. 10 bardak). Yoksa sayaç yok. */
  dailyTarget?: number;
  /** Sayacın birimi ("bardak", "mola"). */
  unit?: string;
  /**
   * Bildirime dokununca açılacak ekran. Yoksa uygulama Bugün'de kalır —
   * sayaç zaten Bugün'deki kartta artıyor.
   */
  screen?: string;
  params?: Record<string, unknown>;
};

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    id: 'su',
    label: 'Su içme',
    message: 'Bir bardak su iç.',
    intervalMinutes: 60,
    dailyTarget: 10,
    unit: 'bardak',
  },
  {
    id: 'ayaga-kalk',
    label: 'Ayağa kalk & esne',
    message: 'Kalk, birkaç adım at ve omuzlarını aç.',
    intervalMinutes: 90,
    dailyTarget: 6,
    unit: 'mola',
  },
  {
    id: 'goz-molasi',
    label: 'Göz molası (20-20-20)',
    message: '20 saniye boyunca uzağa bak — yaklaşık 6 metre.',
    intervalMinutes: 30,
    dailyTarget: 8,
    unit: 'mola',
  },
  {
    id: 'durus',
    label: 'Duruş kontrolü',
    message: 'Sırtını dikleştir, omuzlarını geri al, çeneni içeri çek.',
    intervalMinutes: 60,
    dailyTarget: 8,
    unit: 'kontrol',
    // Bildirimden doğrudan duruş egzersizlerine geçilebilsin: kısa hatırlatma
    // yetmediğinde "Duruş & Sırt" kategorisi (src/data/exercises.ts) açılır.
    screen: 'BrainExercises',
    params: {
      track: 'physiological',
      hideTrackToggle: true,
      title: 'Dinlenme & Denge',
      subtitle: 'Duruş, nefes ve göz dinlendirme egzersizleri',
    },
  },
  {
    id: 'cene',
    label: 'Çene gevşetme',
    message:
      'Dişlerin birbirine değmesin, dilin damağında, çenen gevşek olsun. Gece dişlerini gıcırdatıyorsan ya da çenende ağrı varsa bir diş hekimine görün.',
    intervalMinutes: 90,
    dailyTarget: 6,
    unit: 'kontrol',
    // Çene için ayrı bir egzersiz/ekran yok; kısa farkındalık cümlesi yetiyor.
    // Uygun bir egzersiz eklenirse "durus" şablonundaki screen deseni izlenir.
  },
  {
    id: 'nefes-molasi',
    label: 'Nefes molası',
    message: 'Üç tur 4-6 nefesi: 4 saniye al, 6 saniye ver.',
    intervalMinutes: 120,
    dailyTarget: 4,
    unit: 'mola',
    // Nefes modülüne bağlanıyor: bildirimden doğrudan pratiğe geçilebilsin.
    screen: 'DiaphragmExercise',
    params: { tab: 'pratik' },
  },
  {
    id: 'niyet',
    label: 'Şükür / niyet notu',
    message: 'Bir cümleyle niyetini tazele ya da iyi giden bir şeyi yaz.',
    intervalMinutes: 120,
    dailyTarget: 3,
    unit: 'not',
  },
];

export function findHabitTemplate(id: string): HabitTemplate | undefined {
  return HABIT_TEMPLATES.find((template) => template.id === id);
}
