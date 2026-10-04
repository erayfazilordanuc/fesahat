import { pickForDay } from '../utils/dateUtils';

// Günün sözü havuzu.
//
// Varsayılanda yalnızca GENEL havuz gösterilir (dil, söz, okuma, düşünce...).
// Dinî mod (`religiousMode`, `utils/dailyPracticeSettings.tsx`) açıksa genel
// havuza DİNÎ havuz (Risale-i Nur, imamlar, mutasavvıflar) eklenir.
//
// ⚠️ DOĞRULAMA: Hiçbir söz asıl eserden birebir doğrulanmadı (`verified: false`).
// Yalnızca yaygın biçimde bilinen ve ilgili kişiyle güçlü özdeşleşmiş sözler
// alındı; yabancı dillerden olanlar Türkçe aktarımdır. Atfı tartışmalı olanlar
// `author` alanında "…'e atfedilir" diye işaretli. Sayıyı artırmak yerine
// doğruluğu korumak tercih edildi — yeni söz eklerken bu kurala uy.
//
// ⚠️ `risale.ts`'ten taşınan dinî sözler Terakki'nin sahibine özel içerikten
// gelir; Fesahat'ta yalnızca dinî mod açıkken görünür.

export type Soz = {
  id: string;
  text: string;
  author: string;
  /** Eser / künye — asıl eserden doğrulanmadıkça `verified: false`. */
  work?: string;
  /** Lafız ve künye asıl eserden doğrulandı mı. */
  verified: boolean;
  religious: boolean;
  theme?: 'dil' | 'soz' | 'okuma' | 'dusunce' | 'ahlak' | 'iletisim';
};

/** Genel havuz — dinî mod kapalıyken de gösterilir. */
export const GENEL_SOZLER: Soz[] = [
  // — Yunus Emre —
  {
    id: 'yunus-soz-ola-kese',
    text: 'Söz ola kese savaşı, söz ola kestire başı; söz ola ağulu aşı bal ile yağ ede bir söz.',
    author: 'Yunus Emre',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'yunus-ilim-ilim',
    text: 'İlim ilim bilmektir, ilim kendin bilmektir; sen kendini bilmezsin, ya nice okumaktır.',
    author: 'Yunus Emre',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'yunus-yaratilani-hos-gor',
    text: 'Yaratılanı hoş gör, Yaratan’dan ötürü.',
    author: 'Yunus Emre',
    verified: false,
    religious: false,
    theme: 'ahlak',
  },
  {
    id: 'yunus-dava-icin',
    text: 'Ben gelmedim dava için, benim işim sevi için; gönüller yapmaya geldim, gönüller yıkmaya değil.',
    author: 'Yunus Emre',
    verified: false,
    religious: false,
    theme: 'ahlak',
  },
  {
    id: 'yunus-gelin-tanis',
    text: 'Gelin tanış olalım, işi kolay kılalım; sevelim sevilelim, dünya kimseye kalmaz.',
    author: 'Yunus Emre',
    verified: false,
    religious: false,
    theme: 'iletisim',
  },

  // — Mevlânâ (Türkçe aktarım) —
  {
    id: 'mevlana-olundugun-gibi',
    text: 'Ya göründüğün gibi ol, ya olduğun gibi görün.',
    author: 'Mevlânâ’ya atfedilir',
    verified: false,
    religious: false,
    theme: 'ahlak',
  },
  {
    id: 'mevlana-sesini-degil',
    text: 'Sesini değil, sözünü yükselt. Çiçekleri yetiştiren yağmurdur, gök gürültüsü değil.',
    author: 'Mevlânâ’ya atfedilir',
    verified: false,
    religious: false,
    theme: 'iletisim',
  },

  // — Eski Türk dili ve edebiyatı —
  {
    id: 'kasgarli-turk-dili',
    text: 'Türk dilini öğreniniz; çünkü onların hükümranlığı uzun sürecektir.',
    author: 'Kaşgarlı Mahmud',
    work: 'Dîvânü Lügâti’t-Türk (Önsöz)',
    verified: false,
    religious: false,
    theme: 'dil',
  },
  {
    id: 'kutadgu-dil-arslan',
    text: 'Dil, insanın başını yiyen bir aslandır; dilini tut, başını koru.',
    author: 'Yusuf Has Hâcib',
    work: 'Kutadgu Bilig (serbest aktarım)',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'galib-hosca-bak',
    text: 'Hoşça bak zâtına kim zübde-i âlemsin sen, merdüm-i dîde-i ekvân olan âdemsin sen.',
    author: 'Şeyh Gâlib',
    work: 'Dîvân',
    verified: false,
    religious: false,
    theme: 'dusunce',
  },
  {
    id: 'fuzuli-ask-imis',
    text: 'Aşk imiş her ne var âlemde; ilim bir kîl ü kâl imiş ancak.',
    author: 'Fuzûlî',
    work: 'Dîvân',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'ziya-pasa-ayinesi-istir',
    text: 'Âyinesi iştir kişinin, lafa bakılmaz; şahsın görünür rütbe-i aklı eserinde.',
    author: 'Ziya Paşa',
    work: 'Terkîb-i Bend',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'hasim-merdiven',
    text: 'Ağır ağır çıkacaksın bu merdivenlerden.',
    author: 'Ahmed Hâşim',
    work: 'Merdiven',
    verified: false,
    religious: false,
    theme: 'dusunce',
  },
  {
    id: 'hacibektas-eline-beline',
    text: 'Eline, beline, diline sahip ol.',
    author: 'Hacı Bektaş-ı Velî’ye atfedilir',
    verified: false,
    religious: false,
    theme: 'ahlak',
  },
  {
    id: 'sadi-iki-sey',
    text: 'İki şey akıl noksanlığındandır: söylenmesi gereken yerde susmak, susulması gereken yerde konuşmak.',
    author: 'Sâdî-i Şîrâzî’ye atfedilir',
    work: 'Gülistan',
    verified: false,
    religious: false,
    theme: 'soz',
  },

  // — Atasözleri —
  {
    id: 'ata-soz-gumus',
    text: 'Söz gümüşse sükût altındır.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'ata-soz-var-is-bitirir',
    text: 'Söz var iş bitirir, söz var baş yitirir.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'ata-bin-dusun',
    text: 'Bin düşün bir söyle.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'ata-yaydan-cikan-ok',
    text: 'Ağızdan çıkan söz, yaydan çıkan ok gibidir.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'ata-dil-yarasi',
    text: 'Kılıç yarası geçer, dil yarası geçmez.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'iletisim',
  },
  {
    id: 'ata-tatli-dil',
    text: 'Tatlı dil yılanı deliğinden çıkarır.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'iletisim',
  },
  {
    id: 'ata-bilmemek-ayip-degil',
    text: 'Bilmemek ayıp değil, öğrenmemek ayıptır.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'ata-damlaya-damlaya',
    text: 'Damlaya damlaya göl olur.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'ata-dost-aci-soyler',
    text: 'Dost acı söyler.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'iletisim',
  },
  {
    id: 'ata-cok-konusan',
    text: 'Çok konuşan çok yanılır.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'ata-agac-yasken',
    text: 'Ağaç yaşken eğilir.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'ata-agzindan-cikani',
    text: 'Ağzından çıkanı kulağın duysun.',
    author: 'Atasözü',
    verified: false,
    religious: false,
    theme: 'soz',
  },

  // — Dünya klasikleri (Türkçe aktarım) —
  {
    id: 'konfucyus-adlar-dogru',
    text: 'Adlar doğru değilse sözler gerçeğe uymaz; sözler gerçeğe uymazsa işler yoluna girmez.',
    author: 'Konfüçyüs',
    work: 'Analekt’ler 13.3 (serbest aktarım)',
    verified: false,
    religious: false,
    theme: 'dil',
  },
  {
    id: 'konfucyus-bildigini-bilmek',
    text: 'Bildiğini bildiğini, bilmediğini bilmediğini bilmek: işte bilgi budur.',
    author: 'Konfüçyüs',
    work: 'Analekt’ler 2.17',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'konfucyus-ogrenip-dusunmek',
    text: 'Öğrenip de düşünmezsen boşa gider; düşünüp de öğrenmezsen tehlikeye düşersin.',
    author: 'Konfüçyüs',
    work: 'Analekt’ler 2.15 (serbest aktarım)',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'seneca-ogreterek',
    text: 'Öğreterek öğreniriz.',
    author: 'Seneca',
    work: 'Lucilius’a Mektuplar 7',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'seneca-soz-yasam',
    text: 'İnsan nasıl yaşıyorsa öyle konuşur; söz, yaşayışın görünüşüdür.',
    author: 'Seneca',
    work: 'Lucilius’a Mektuplar 114 (serbest aktarım)',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'seneca-az-kitap',
    text: 'Çok kitap okumaya değil, iyi seçilmiş az kitabı derinlemesine okumaya bak.',
    author: 'Seneca',
    work: 'Lucilius’a Mektuplar 2 (serbest aktarım)',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'montaigne-konusma-yari',
    text: 'Konuşma yarı konuşana, yarı dinleyene aittir.',
    author: 'Montaigne',
    work: 'Denemeler III, 13',
    verified: false,
    religious: false,
    theme: 'iletisim',
  },
  {
    id: 'montaigne-ne-biliyorum',
    text: 'Ne biliyorum ki?',
    author: 'Montaigne',
    work: 'Denemeler II, 12 (“Que sais-je?”)',
    verified: false,
    religious: false,
    theme: 'dusunce',
  },
  {
    id: 'goethe-bilmek-yetmez',
    text: 'Bilmek yetmez, uygulamak da gerekir; istemek yetmez, yapmak da gerekir.',
    author: 'Goethe',
    work: 'Wilhelm Meister’in Çıraklık Yılları',
    verified: false,
    religious: false,
    theme: 'dusunce',
  },
  {
    id: 'goethe-yabanci-dil',
    text: 'Yabancı dil bilmeyen, kendi dilini de bilmez.',
    author: 'Goethe',
    work: 'Maximen und Reflexionen',
    verified: false,
    religious: false,
    theme: 'dil',
  },
  {
    id: 'wittgenstein-dilin-sinirlari',
    text: 'Dilimin sınırları, dünyamın sınırlarıdır.',
    author: 'Ludwig Wittgenstein',
    work: 'Tractatus Logico-Philosophicus 5.6',
    verified: false,
    religious: false,
    theme: 'dil',
  },
  {
    id: 'orwell-dil-dusunce',
    text: 'Düşünce dili bozabiliyorsa, dil de düşünceyi bozabilir.',
    author: 'George Orwell',
    work: 'Politics and the English Language (serbest aktarım)',
    verified: false,
    religious: false,
    theme: 'dil',
  },
  {
    id: 'twain-dogru-kelime',
    text: 'Doğru kelime ile neredeyse doğru kelime arasındaki fark, şimşekle ateşböceği arasındaki fark kadardır.',
    author: 'Mark Twain',
    verified: false,
    religious: false,
    theme: 'dil',
  },
  {
    id: 'pascal-uzun-mektup',
    text: 'Mektubu uzun yazdım, çünkü kısaltmaya vaktim olmadı.',
    author: 'Blaise Pascal',
    work: 'Taşra Mektupları (16. mektup)',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'bacon-okumak-konusmak-yazmak',
    text: 'Okumak insanı olgunlaştırır, konuşmak hazırcevap yapar, yazmak kesinleştirir.',
    author: 'Francis Bacon',
    work: 'Denemeler · Öğrenim Üzerine (serbest aktarım)',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'cicero-kitapsiz-oda',
    text: 'Kitapsız bir oda, ruhsuz bir beden gibidir.',
    author: 'Cicero’ya atfedilir',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'descartes-iyi-kitap',
    text: 'İyi kitap okumak, geçmiş yüzyılların en seçkin insanlarıyla sohbet etmek gibidir.',
    author: 'René Descartes',
    work: 'Yöntem Üzerine Konuşma (serbest aktarım)',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'laozi-bilen-konusmaz',
    text: 'Bilen konuşmaz, konuşan bilmez.',
    author: 'Lao Zi',
    work: 'Dao De Jing 56',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'sokrates-konus-ki',
    text: 'Konuş ki seni göreyim.',
    author: 'Sokrates’e atfedilir',
    verified: false,
    religious: false,
    theme: 'soz',
  },
  {
    id: 'plutarkhos-ates',
    text: 'Zihin, doldurulacak bir kap değil, tutuşturulacak bir ateştir.',
    author: 'Plutarkhos’a atfedilir',
    work: 'Dinlemek Üzerine (serbest aktarım)',
    verified: false,
    religious: false,
    theme: 'okuma',
  },
  {
    id: 'zenon-iki-kulak',
    text: 'Doğa bize iki kulak, bir ağız verdi; çünkü iki kat dinleyip bir kat konuşmalıyız.',
    author: 'Kitionlu Zenon’a atfedilir',
    verified: false,
    religious: false,
    theme: 'iletisim',
  },
  {
    id: 'shakespeare-kisalik',
    text: 'Kısalık, zekânın özüdür.',
    author: 'William Shakespeare',
    work: 'Hamlet (II. perde)',
    verified: false,
    religious: false,
    theme: 'soz',
  },
];

/** Dinî havuz — yalnızca dinî mod açıkken genel havuza eklenir. */
export const DINI_SOZLER: Soz[] = [
  // — Risale-i Nur (risale.ts'ten taşındı; künyeler doğrulanmadı) —
  {
    id: 'rn-bismillah',
    text: 'Bismillâh her hayrın başıdır.',
    author: 'Bediüzzaman Said Nursî',
    work: 'Sözler · Birinci Söz',
    verified: false,
    religious: true,
    theme: 'ahlak',
  },
  {
    id: 'rn-guzel-goren',
    text: 'Güzel gören güzel düşünür, güzel düşünen hayatından lezzet alır.',
    author: 'Bediüzzaman Said Nursî',
    work: 'Risale-i Nur (vecizeler)',
    verified: false,
    religious: true,
    theme: 'dusunce',
  },
  {
    id: 'rn-vicdan-ziyasi',
    text: 'Vicdanın ziyası ulûm-u dîniyedir. Aklın nuru fünûn-u medeniyedir. İkisinin imtizacıyla hakikat tecellî eder.',
    author: 'Bediüzzaman Said Nursî',
    work: 'Münazarat',
    verified: false,
    religious: true,
    theme: 'okuma',
  },
  {
    id: 'rn-iman-kuvvet',
    text: 'İman hem nurdur, hem kuvvettir. Hakikî imanı elde eden adam kâinata meydan okuyabilir.',
    author: 'Bediüzzaman Said Nursî',
    work: 'Sözler · Yirmi Üçüncü Söz',
    verified: false,
    religious: true,
  },
  {
    id: 'rn-sukur-kanaat',
    text: 'Şükrün mikyası kanaattir.',
    author: 'Bediüzzaman Said Nursî',
    work: 'Sözler · Yirmi Sekizinci Söz',
    verified: false,
    religious: true,
    theme: 'ahlak',
  },
  {
    id: 'rn-tevekkul',
    text: 'Tevekkül, esbabı bütün bütün reddetmek değildir.',
    author: 'Bediüzzaman Said Nursî',
    work: 'Sözler · Yirmi Üçüncü Söz',
    verified: false,
    religious: true,
    theme: 'ahlak',
  },
  {
    id: 'rn-umitvar',
    text: 'Ümitvar olunuz; şu istikbal inkılâbı içinde en yüksek gür sadâ İslâm’ın sadâsı olacaktır.',
    author: 'Bediüzzaman Said Nursî',
    work: 'Hutbe-i Şâmiye',
    verified: false,
    religious: true,
  },
  {
    id: 'rn-zaman-ihtiyarlandikca',
    text: 'Zaman ihtiyarlandıkça Kur’ân gençleşiyor.',
    author: 'Bediüzzaman Said Nursî',
    work: 'Risale-i Nur (vecizeler)',
    verified: false,
    religious: true,
  },
  {
    id: 'rn-musibet-tasaffi',
    text: 'Hayat, musibetlerle ve hastalıklarla tasaffi eder, kemâl bulur.',
    author: 'Bediüzzaman Said Nursî',
    work: 'Lem’alar · Hastalar Risalesi',
    verified: false,
    religious: true,
    theme: 'ahlak',
  },
  {
    id: 'rn-dunya-misafirhane',
    text: 'Bu dünya bir misafirhanedir. İnsan ise onda az duracaktır.',
    author: 'Bediüzzaman Said Nursî',
    work: 'Risale-i Nur (vecizeler)',
    verified: false,
    religious: true,
    theme: 'dusunce',
  },

  // — İmamlar ve âlimler —
  {
    id: 'gazali-amelsiz-ilim',
    text: 'Ey oğul! Amelsiz ilim delilik, ilimsiz amel ise olmaz.',
    author: 'İmam-ı Gazâlî',
    work: 'Eyyühe’l-Veled (serbest aktarım)',
    verified: false,
    religious: true,
    theme: 'okuma',
  },
  {
    id: 'safii-fikrim-dogru',
    text: 'Benim görüşüm doğrudur, ama yanlış olma ihtimali vardır; başkasının görüşü yanlıştır, ama doğru olma ihtimali vardır.',
    author: 'İmam Şâfiî’ye atfedilir',
    verified: false,
    religious: true,
    theme: 'iletisim',
  },
  {
    id: 'safii-ilim-fayda',
    text: 'İlim, ezberlenen değil, fayda verendir.',
    author: 'İmam Şâfiî’ye atfedilir',
    verified: false,
    religious: true,
    theme: 'okuma',
  },
  {
    id: 'malik-bilmiyorum',
    text: '“Bilmiyorum” demek ilmin yarısıdır.',
    author: 'İmam Mâlik’e atfedilir',
    verified: false,
    religious: true,
    theme: 'okuma',
  },
  {
    id: 'ebu-hanife-daha-iyisi',
    text: 'Bu bizim görüşümüzdür; daha iyisini getiren olursa biz ona teslim oluruz.',
    author: 'İmam-ı Âzam Ebû Hanîfe’ye atfedilir',
    verified: false,
    religious: true,
    theme: 'iletisim',
  },
  {
    id: 'ali-sozun-esiri',
    text: 'Söylemediğin sözün esiri değilsin; söylediğin sözün ise esirisin.',
    author: 'Hz. Ali’ye atfedilir',
    verified: false,
    religious: true,
    theme: 'soz',
  },
  {
    id: 'ali-ilim-maldan-hayirli',
    text: 'İlim maldan hayırlıdır: ilim seni korur, malı ise sen korursun.',
    author: 'Hz. Ali’ye atfedilir',
    verified: false,
    religious: true,
    theme: 'okuma',
  },

  // — Mutasavvıflar —
  {
    id: 'yunus-gonul-calabin-tahti',
    text: 'Gönül Çalab’ın tahtı, Çalab gönüle baktı; iki cihan bedbahtı kim gönül yıktı.',
    author: 'Yunus Emre',
    verified: false,
    religious: true,
    theme: 'ahlak',
  },
  {
    id: 'yunus-bir-kez-gonul',
    text: 'Bir kez gönül yıktın ise, bu kıldığın namaz değil; yetmiş iki millet dahi elin yüzün yumaz değil.',
    author: 'Yunus Emre',
    verified: false,
    religious: true,
    theme: 'ahlak',
  },
  {
    id: 'mevlana-gel-gel',
    text: 'Gel, gel, ne olursan ol yine gel; bu bizim dergâhımız ümitsizlik dergâhı değildir.',
    author: 'Mevlânâ’ya atfedilir',
    verified: false,
    religious: true,
    theme: 'ahlak',
  },
  {
    id: 'mevlana-akarsu-gibi',
    text: 'Cömertlik ve yardımlaşmada akarsu gibi ol; şefkat ve merhamette güneş gibi ol; başkalarının kusurunu örtmekte gece gibi ol.',
    author: 'Mevlânâ’ya atfedilir',
    verified: false,
    religious: true,
    theme: 'ahlak',
  },
];

/** Tüm sözler (genel + dinî). */
export const SOZLER: Soz[] = [...GENEL_SOZLER, ...DINI_SOZLER];

/**
 * Günün sözü — `pickForDay` ile deterministik. Dinî mod kapalıyken yalnızca
 * genel havuzdan seçer. Salt 6: projedeki diğer günlük seçimlerle
 * (0–5, 9, 11) çakışmaz.
 */
export function pickDailySoz(religiousMode: boolean, date: Date = new Date()): Soz {
  const pool = religiousMode ? SOZLER : GENEL_SOZLER;
  return pickForDay(pool, date, 6);
}
