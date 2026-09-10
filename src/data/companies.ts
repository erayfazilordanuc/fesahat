// Mülakat simülasyonunun hedef kurumları.
// Renkler hem çip seçimlerinde hem haber etiketlerinde kullanılır; koyu temada `colorDark` geçerli.

export type CompanyId = 'aselsan' | 'roketsan' | 'baykar' | 'tusas' | 'havelsan';

export type Company = {
  id: CompanyId;
  /** Çiplerde görünen büyük harfli ad. */
  name: string;
  /** Haber filtrelerinde görünen okunabilir ad. */
  shortName: string;
  tagline: string;
  focus: string;
  color: string;
  colorDark: string;
  /** Haber akışında bu kuruma ait içeriği yakalamak için aranan sözcükler. */
  keywords: string[];
};

export const COMPANIES: Company[] = [
  {
    id: 'roketsan',
    name: 'ROKETSAN',
    shortName: 'Roketsan',
    tagline: 'Roket ve füze sistemleri',
    focus: 'Balistik füzeler, güdüm kiti, hipersonik sistemler',
    color: '#16a34a',
    colorDark: '#22c55e',
    keywords: ['roketsan', 'tayfun', 'cakir', 'çakır', 'sungur', 'karaok'],
  },
  {
    id: 'aselsan',
    name: 'ASELSAN',
    shortName: 'ASELSAN',
    tagline: 'Haberleşme ve elektronik harp',
    focus: 'Radar, elektro-optik, elektronik harp, komuta kontrol',
    color: '#2563eb',
    colorDark: '#3b82f6',
    keywords: ['aselsan', 'korkut', 'gokdeniz', 'gökdeniz', 'siper', 'redet'],
  },
  {
    id: 'baykar',
    name: 'BAYKAR',
    shortName: 'Baykar',
    tagline: 'İnsansız hava sistemleri',
    focus: 'SİHA, otonom uçuş kontrol, görev yükü entegrasyonu',
    color: '#0d9488',
    colorDark: '#14b8a6',
    keywords: ['baykar', 'bayraktar', 'akinci', 'akıncı', 'kizilelma', 'kızılelma', 'tb2', 'tb3'],
  },
  {
    id: 'tusas',
    name: 'TUSAŞ',
    shortName: 'TUSAŞ',
    tagline: 'Hava platformları',
    focus: 'Muharip uçak, helikopter, uydu ve aviyonik',
    color: '#1e3a8a',
    colorDark: '#1d4ed8',
    keywords: ['tusas', 'tusaş', 'tai', 'kaan', 'hurjet', 'hürjet', 'gokbey', 'gökbey', 'anka'],
  },
  {
    id: 'havelsan',
    name: 'HAVELSAN',
    shortName: 'HAVELSAN',
    tagline: 'Yazılım ve simülasyon',
    focus: 'Savaş yönetim sistemleri, simülatör, siber güvenlik',
    color: '#e11d48',
    colorDark: '#f43f5e',
    keywords: ['havelsan', 'advent', 'barkan', 'baha'],
  },
];

export function getCompany(id: CompanyId): Company {
  const company = COMPANIES.find((c) => c.id === id);
  if (!company) throw new Error(`Bilinmeyen kurum: ${id}`);
  return company;
}

/**
 * Diskten gelen kimlikler için gevşek arama.
 *
 * `getCompany` bilinmeyen kimlikte fırlatıyor; kod içinden gelen kimlikler için
 * doğru davranış bu. Ama mülakat geçmişi diskte duruyor ve kurum listesi
 * değişebilir (katalog hâline getirilecek — YAPILACAKLAR Bölüm 00). O zaman
 * eski kayıtlardaki kimlik listede bulunamaz; fırlatma tüm uygulamayı
 * düşürürdü, çünkü ErrorBoundary kökte duruyor. Kayıtlı değerlerle bu kullanılır.
 */
export function findCompany(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}

/** Kurum rengini aktif temaya göre verir. */
export function companyColor(company: Company, isLight: boolean): string {
  return isLight ? company.color : company.colorDark;
}

/**
 * Serbest metinde (haber başlığı/özeti) hangi kurumun geçtiğini bulur.
 * Hiçbiri geçmiyorsa null döner — haber "Genel" olarak etiketlenir.
 */
export function detectCompany(text: string): CompanyId | null {
  const haystack = text.toLocaleLowerCase('tr-TR');
  for (const company of COMPANIES) {
    if (company.keywords.some((keyword) => haystack.includes(keyword))) {
      return company.id;
    }
  }
  return null;
}
