import { pickForDay } from '../utils/dateUtils';
import type { DailyPracticeSettings, DailyTextSource } from '../utils/dailyPracticeSettings';

// Günün okuma metni.
// Metinler sesli okunmak üzere seçildi: her biri diyafram desteği isteyen uzunlukta,
// ve içinde tanınabilir belâgat sanatları barındırıyor. Böylece okuma hem diksiyon
// hem belâgat çalışması oluyor.
//
// Telif: yalnızca kamu malı (public domain) metinler ve kısa meal/hadis aktarımları kullanıldı.

export type DailyTextCategory = 'dini' | 'edebi' | 'hitabet';

export const CATEGORY_LABELS: Record<DailyTextCategory, string> = {
  dini: 'Dinî Metin',
  edebi: 'Edebî Metin',
  hitabet: 'Hitabet',
};

export type DailyText = {
  id: string;
  category: DailyTextCategory;
  title: string;
  source: string;
  /** Sesli okunacak metin. | işareti duraklama önerisidir. */
  text: string;
  /** Arapça/Osmanlıca metinlerde anlam; gerekmiyorsa boş bırakılır. */
  meaning?: string;
  /** Metinde geçen belâgat sanatlarının id'leri — src/data/belagat.ts ile eşleşir. */
  belagatArtIds: string[];
  /** Okurken neye dikkat edilecek: nefes, vurgu, tempo. */
  readingFocus: string;
  /** Yaklaşık sesli okuma süresi (saniye). */
  approxSeconds: number;
};

/* ------------------------------------------------------------------ */
/* Günün duası — mevcut "günlük dini söz" kartının mobil karşılığı      */
/* ------------------------------------------------------------------ */

export type DailyPrayer = { text: string; meaning: string };

export const DAILY_PRAYERS: DailyPrayer[] = [
  {
    text: 'Rabbi yessir velâ tuassir, Rabbi temmim bi\'l-hayr.',
    meaning: 'Rabbim kolaylaştır, zorlaştırma; Rabbim hayırla sonuçlandır.',
  },
  {
    text: 'Rabbişrah lî sadrî ve yessir lî emrî, vahlül ukdeten min lisânî.',
    meaning:
      'Rabbim göğsüme genişlik ver, işimi kolaylaştır ve dilimdeki bağı çöz. (Tâhâ, 25-27)',
  },
  {
    text: 'Allahümme lâ sehle illâ mâ cealtehû sehlen.',
    meaning: "Allah'ım! Senin kolay kıldığından başka kolay yoktur.",
  },
  {
    text: 'Rabbi zidnî ilmen ve fehmen ve elhıknî bi\'s-sâlihîn.',
    meaning: 'Rabbim! İlmimi ve anlayışımı artır, beni salihlere kat.',
  },
  {
    text: 'Hasbünallâhu ve ni\'mel vekîl.',
    meaning: 'Allah bize yeter, O ne güzel vekildir. (Âl-i İmrân, 173)',
  },
  {
    text: 'Rabbenâ âtinâ min ledünke rahmeten ve heyyi\' lenâ min emrinâ raşedâ.',
    meaning: 'Rabbimiz! Bize katından rahmet ver ve işimizde bize doğruyu göster. (Kehf, 10)',
  },
];

export function pickDailyPrayer(date: Date = new Date()): DailyPrayer {
  return pickForDay(DAILY_PRAYERS, date, 4);
}

/* ------------------------------------------------------------------ */
/* Okuma metinleri                                                     */
/* ------------------------------------------------------------------ */

const DINI: DailyText[] = [
  {
    id: 'dini-taha',
    category: 'dini',
    title: 'Dilin Bağını Çözmek',
    source: 'Tâhâ sûresi, 25-28 (meal)',
    text:
      'Rabbim, göğsümü genişlet. | İşimi bana kolaylaştır. | Dilimdeki bağı çöz | ki sözümü anlasınlar.',
    meaning:
      'Hz. Mûsâ, kendisine verilen ağır bir görevden önce üç şey ister: iç genişliği, işin kolaylaşması ve dilin çözülmesi. Sıra anlamlıdır — söz, iç genişliğinden sonra gelir.',
    belagatArtIds: ['icaz', 'seci'],
    readingFocus:
      'Dört bölüm, dört nefes. Her "|" işaretinde bir saniye durun. Son bölümü diğerlerinden bir ton alçak okuyun.',
    approxSeconds: 25,
  },
  {
    id: 'dini-nahl',
    category: 'dini',
    title: 'En Güzel Yolla Anlatmak',
    source: 'Nahl sûresi, 125 (meal)',
    text:
      'İnsanları hikmetle ve güzel öğütle çağır; | onlarla en güzel biçimde tartış. | Rabbin, yolundan sapanları da doğru yolda olanları da en iyi bilendir.',
    meaning:
      'Klasik belâgat kitapları bu âyeti, hitabın muhataba göre ayarlanması ilkesinin (muktezâ-yı hâl) dayanağı sayar: hikmet, öğüt ve tartışma farklı muhatap tiplerine karşılık gelir.',
    belagatArtIds: ['muktaza', 'mukabele'],
    readingFocus:
      'Üç yöntemi sayarken her birinin arasına eşit boşluk koyun; sayma ritmi duyulsun.',
    approxSeconds: 30,
  },
  {
    id: 'dini-sukut',
    category: 'dini',
    title: 'Ya Hayır Söylesin Ya Sussun',
    source: 'Hadîs-i şerîf (Buhârî, Müslim)',
    text:
      'Allah\'a ve âhiret gününe inanan, | ya hayır söylesin | ya sussun.',
    meaning:
      'Konuşmanın karşısına susmak konulur ve ikisi eşit derecede seçenek sayılır. Mülakat bağlamında bu, boşluğu doldurma dürtüsüne karşı doğrudan bir eğitimdir.',
    belagatArtIds: ['icaz', 'tibak'],
    readingFocus:
      'Kısa metin, uzun duraklamalar. Son kelimeden sonra üç saniye susun ve o sessizliği ölçün.',
    approxSeconds: 20,
  },
  {
    id: 'dini-hikmet',
    category: 'dini',
    title: 'Az Sözle Çok Mana',
    source: 'Hz. Ali\'ye atfedilen söz',
    text:
      'İnsanlara, akıllarının alacağı kadar söyleyin. | Anlamadıkları söz, | onları size değil sizden uzağa götürür.',
    meaning:
      'Belâgatin ölçütünün konuşan değil dinleyen olduğunu söyleyen klasik ilke. Garâbet (anlaşılmaz kelime) kusuru buradan doğar.',
    belagatArtIds: ['muktaza', 'garabet'],
    readingFocus: 'İkinci cümleyi birinciden yavaş okuyun; sonuç cümlesi ağırlık taşısın.',
    approxSeconds: 22,
  },
];

const EDEBI: DailyText[] = [
  {
    id: 'edebi-yunus',
    category: 'edebi',
    title: 'Sözün Gücü',
    source: 'Yunus Emre',
    text:
      'Söz ola kese savaşı, | söz ola kestirse başı, | söz ola ağulu aşı | bal ile yağ ide bir söz.',
    meaning:
      'Sözün hem savaşı bitirebileceğini hem baş kestirebileceğini söyleyen dörtlük, belâgatin ahlâkî yüzünü kurar: aynı araç iki yönde de çalışır.',
    belagatArtIds: ['tibak', 'tekrir', 'seci'],
    readingFocus:
      'Dört dizede dört kez "söz" geçiyor. Her birini biraz farklı tonda söyleyin — aynı tonda tekrar, tekrîr sanatını öldürür.',
    approxSeconds: 25,
  },
  {
    id: 'edebi-ziya-pasa',
    category: 'edebi',
    title: 'Aynası İştir Kişinin',
    source: 'Ziya Paşa, Terkîb-i Bend',
    text:
      'Âyinesi iştir kişinin lafa bakılmaz, | Şahsın görünür rütbe-i aklı eserinde.',
    meaning:
      'Kişinin aynası yaptığı iştir, sözüne bakılmaz; aklının derecesi ortaya koyduğu eserde görünür. Mülakatta anlatılan her şeyin bir çıktıya bağlanması gerektiğinin en kısa ifadesi.',
    belagatArtIds: ['tesbih-belig', 'mecaz-i-mursel', 'irsal-i-mesel'],
    readingFocus:
      'İki dize, iki nefes. İlk dizenin sonunda ses düşsün, ikinci dizeye kararlı bir tonla girin.',
    approxSeconds: 20,
  },
  {
    id: 'edebi-fuzuli',
    category: 'edebi',
    title: 'İlim ve Söz',
    source: 'Fuzûlî',
    text: 'Aşk imiş her ne var âlemde, | ilm bir kîl ü kâl imiş ancak.',
    meaning:
      'Âlemde her ne varsa aşkmış; ilim ise yalnızca bir dedikodudan ibaretmiş. Kasr (sınırlama) sanatının en bilinen örneklerinden: "ancak" tek bir hükme kilitleniyor.',
    belagatArtIds: ['kasr', 'icaz'],
    readingFocus:
      '"Ancak" kelimesini vurgulayın; vurguyu kaldırdığınızda beytin iddiası kaybolur.',
    approxSeconds: 15,
  },
  {
    id: 'edebi-seyh-galib',
    category: 'edebi',
    title: 'Hoşça Bak Zâtına',
    source: 'Şeyh Gâlib',
    text:
      'Hoşça bak zâtına kim zübde-i âlemsin sen, | Merdüm-i dîde-i ekvân olan âdemsin sen.',
    meaning:
      'Kendine iyi bak, çünkü âlemin özüsün; var olan her şeyin gözbebeği olan insansın. Kendine güvenin edebî ifadesi — mülakat öncesi okunacak metin.',
    belagatArtIds: ['istiare', 'tesbih-belig', 'tekrir'],
    readingFocus:
      'Ağır ve geniş okuyun. Osmanlı Türkçesi kelimelerde hece atlamamak için önce yavaş bir tur yapın.',
    approxSeconds: 25,
  },
];

const HITABET: DailyText[] = [
  {
    id: 'hitabet-genclige-hitabe',
    category: 'hitabet',
    title: 'Gençliğe Hitabe',
    source: 'Mustafa Kemal Atatürk, 1927',
    text:
      'Ey Türk gençliği! | Birinci vazifen, Türk istiklâlini, Türk Cumhuriyeti\'ni, ilelebet muhafaza ve müdafaa etmektir. | Mevcudiyetinin ve istikbalinin yegâne temeli budur. | Bu temel, senin en kıymetli hazinendir.',
    belagatArtIds: ['insai-uslup', 'tekrir', 'tesbih-belig', 'kasr'],
    readingFocus:
      'Hitap ("Ey Türk gençliği!") ayrı bir nefes ister. Uzun ikinci cümleyi tek nefeste bitirmeyi deneyin — 3. seviye diyafram testi.',
    approxSeconds: 40,
  },
  {
    id: 'hitabet-nutuk',
    category: 'hitabet',
    title: 'Nutuk\'un Girişi',
    source: 'Mustafa Kemal Atatürk, Nutuk, 1927',
    text:
      '1919 senesi Mayısının 19\'uncu günü Samsun\'a çıktım. | Vaziyet ve manzara-i umumiye: | Osmanlı Devleti\'nin dâhil bulunduğu grup, Harb-i Umumîde mağlûp olmuş, | Osmanlı ordusu her tarafta zedelenmiş, | şartları ağır bir mütarekename imzalanmış.',
    meaning:
      'Tek bir tarih cümlesiyle başlayan giriş, îcâzın (öz söz) ders niteliğinde örneğidir: yorum yok, durum tespiti var.',
    belagatArtIds: ['icaz', 'fasl-vasl', 'hazif'],
    readingFocus:
      'İlk cümleyi düz ve sakin okuyun. Sonraki sıralamada her "|" bir nefes; sıralamanın ritmini bozmayın.',
    approxSeconds: 45,
  },
  {
    id: 'hitabet-canakkale',
    category: 'hitabet',
    title: 'Çanakkale Şehitlerine',
    source: 'Mehmet Âkif Ersoy',
    text:
      'Şu Boğaz harbi nedir? Var mı ki dünyâda eşi? | En kesîf orduların yükleniyor dördü beşi, | Tepeden yol bularak geçmek için Marmara\'ya | Kaç donanmayla sarılmış ufacık bir karaya.',
    belagatArtIds: ['insai-uslup', 'mubalaga', 'tibak'],
    readingFocus:
      'Aruz vezni okuyuşu taşır. İlk iki soruyu yükselen tonla, sonraki iki dizeyi düşen tonla okuyun.',
    approxSeconds: 35,
  },
  {
    id: 'hitabet-istiklal',
    category: 'hitabet',
    title: 'İstiklâl Marşı\'nın İlk Dörtlüğü',
    source: 'Mehmet Âkif Ersoy, 1921',
    text:
      'Korkma, sönmez bu şafaklarda yüzen al sancak; | Sönmeden yurdumun üstünde tüten en son ocak. | O benim milletimin yıldızıdır, parlayacak; | O benimdir, o benim milletimindir ancak.',
    belagatArtIds: ['istiare', 'tekrir', 'kasr', 'aliterasyon'],
    readingFocus:
      'Dört dize, dört nefes. Son dizedeki "ancak" kasr işaretidir; vurguyu oraya koyun.',
    approxSeconds: 35,
  },
];

export const ALL_DAILY_TEXTS: DailyText[] = [...DINI, ...EDEBI, ...HITABET];

/**
 * Ayarlara göre uygun metin havuzunu döner.
 * religiousMode kapalıysa dinî metinler havuza hiç girmez — kaynak "dini" seçilmiş olsa bile.
 */
export function availableTexts(settings: DailyPracticeSettings): DailyText[] {
  const source: DailyTextSource = settings.dailyText.source;
  const allowReligious = settings.religiousMode;

  const byCategory = (category: DailyTextCategory) =>
    ALL_DAILY_TEXTS.filter((t) => t.category === category);

  let pool: DailyText[];
  switch (source) {
    case 'dini':
      pool = allowReligious ? byCategory('dini') : [...byCategory('edebi'), ...byCategory('hitabet')];
      break;
    case 'edebi':
      pool = byCategory('edebi');
      break;
    case 'hitabet':
      pool = byCategory('hitabet');
      break;
    case 'karisik':
    default:
      pool = allowReligious
        ? ALL_DAILY_TEXTS
        : ALL_DAILY_TEXTS.filter((t) => t.category !== 'dini');
      break;
  }

  return pool.length > 0 ? pool : ALL_DAILY_TEXTS.filter((t) => t.category !== 'dini');
}

/** Günün metni. Aynı gün içinde her açılışta aynı sonucu verir. */
export function pickDailyText(settings: DailyPracticeSettings, date: Date = new Date()): DailyText {
  return pickForDay(availableTexts(settings), date, 5);
}

export function findDailyText(id: string): DailyText | undefined {
  return ALL_DAILY_TEXTS.find((t) => t.id === id);
}

/** "|" duraklama işaretlerini temizleyip okunabilir düz metin verir. */
export function plainText(text: string): string {
  return text.replace(/\s*\|\s*/g, ' ').trim();
}

/** Metni duraklama işaretlerine göre parçalara böler — ekran her parçayı ayrı satır gösterir. */
export function textSegments(text: string): string[] {
  return text
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Sesli okuma hızı (kelime/dakika) hesabı için metnin kelime sayısı.
 * Duraklama işareti "|" kelime sayılmaz; noktalama tek başına kaldığında da
 * sayılmaz (harf ya da rakam içermeyen parça atılır).
 */
export function countWords(text: string): number {
  return text
    .replace(/\|/g, ' ')
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}
