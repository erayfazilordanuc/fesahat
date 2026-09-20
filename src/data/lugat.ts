import { dayIndex, pickForDay } from '../utils/dateUtils';

/**
 * Dil & İfade müfredatı — lugat (söz varlığı).
 *
 * Amaç belagat sanatları değil kelime öğrenmek: genel okuma-anlama ve kendini
 * doğru ifade etme düzeyini yükselten, günlük ve yazılı dilde gerçekten
 * karşılaşılan kelimeler. Belagat (söz sanatları) ayrı ve ileri düzey bir
 * bölüm olarak kalır; bu modül ona bağımlı değildir.
 *
 * İçerik doğrulaması: her kelimenin anlamı ve kökeni TDK Güncel Türkçe
 * Sözlük (GTS) üzerinden (https://sozluk.gov.tr/gts?ara=...) tek tek
 * kontrol edilmiştir. Buradaki `short`/`meanings` alanları TDK'nın verdiği
 * tanımların sade bir özetidir, birebir kopya değildir. `origin` alanı
 * TDK'nın `lisan` alanından alınmıştır; TDK kökeni boş döndüren kelimelerde
 * (ör. "esaslı") bu alan de boş bırakılmıştır — köken uydurulmamıştır.
 * Örnek cümleler ve deyim/atasözü açıklamaları telif kaygısıyla bu dosya
 * için özgün olarak yazılmıştır.
 *
 * ⚠️ Deyim ve atasözleri (IDIOMS) henüz TDK Atasözleri ve Deyimler Sözlüğü
 * ile tek tek doğrulanmadı — GTS uç noktası bunlar için JSON döndürmedi.
 * Doğrulama YAPILACAKLAR Bölüm 7'de.
 */

export type LugatLevel = 'temel' | 'orta' | 'ileri';

export type LugatWord = {
  id: string;
  word: string;
  /** Tek satırlık kısa anlam — kart başlığında ve testte kullanılır. */
  short: string;
  /** Ayrıntılı anlam(lar); TDK'daki birden çok anlamı sadeleştirilmiş biçimde taşır. */
  meanings: string[];
  /** Arapça, Farsça, Fransızca, Türkçe... TDK'nın verdiği köken; emin olunmayan yerde boş. */
  origin?: string;
  /** Kendi yazdığımız doğal örnek cümle. */
  example: string;
  synonyms: string[];
  antonyms: string[];
  level: LugatLevel;
  /** Sık yapılan anlam ya da yazım hatası varsa. */
  note?: string;
};

export type UsageItem = {
  id: string;
  kind: 'yazim' | 'anlam' | 'kullanim';
  wrong: string;
  right: string;
  explanation: string;
  example: string;
};

export type Idiom = {
  id: string;
  kind: 'deyim' | 'atasozu';
  text: string;
  meaning: string;
  example: string;
};

/* ------------------------------------------------------------------ */
/* Kelimeler                                                           */
/* ------------------------------------------------------------------ */

const TEMEL: LugatWord[] = [
  {
    id: 'cesaret',
    word: 'cesaret',
    short: 'Zor veya tehlikeli bir işe girişirken duyulan kendine güven, yüreklilik.',
    meanings: ['Zor veya tehlikeli bir işe girişirken kişinin kendinde bulduğu güven.'],
    origin: 'Arapça',
    example: 'Herkesin çekindiği soruyu sormak için biraz cesaret gerekiyordu.',
    synonyms: ['yüreklilik', 'cüret'],
    antonyms: ['korkaklık', 'çekingenlik'],
    level: 'temel',
  },
  {
    id: 'durust',
    word: 'dürüst',
    short: 'Sözünde ve davranışlarında doğruluktan ayrılmayan.',
    meanings: [
      'Sözünde ve davranışlarında doğruluktan ayrılmayan kimse.',
      'Kurallara uygun, hileye başvurmayan.',
    ],
    origin: 'Farsça',
    example: 'Yaptığı hatayı saklamadan söylemesi, ne kadar dürüst biri olduğunu gösterdi.',
    synonyms: ['doğru', 'namuslu'],
    antonyms: ['sahtekâr', 'ikiyüzlü'],
    level: 'temel',
  },
  {
    id: 'merhamet',
    word: 'merhamet',
    short: 'Başkasının kötü durumuna üzülüp acıma duygusu.',
    meanings: ['Bir canlının içine düştüğü kötü durumdan dolayı duyulan üzüntü, acıma.'],
    origin: 'Arapça',
    example: 'Sokak hayvanlarına gösterdiği merhamet, mahallede herkesin dikkatini çekiyordu.',
    synonyms: ['acıma', 'şefkat'],
    antonyms: ['acımasızlık', 'zalimlik'],
    level: 'temel',
  },
  {
    id: 'gayret',
    word: 'gayret',
    short: 'Bir işi başarmak için gösterilen çaba, isteklilik.',
    meanings: ['Bir şeyi elde etmek veya başarmak için gösterilen çalışma isteği, çaba.'],
    origin: 'Arapça',
    example: 'Sınava az kala gösterdiği gayret, notuna açıkça yansıdı.',
    synonyms: ['çaba', 'emek'],
    antonyms: ['tembellik', 'ilgisizlik'],
    level: 'temel',
  },
  {
    id: 'tercih',
    word: 'tercih',
    short: 'Birden çok seçenek arasından birini seçme, yeğleme.',
    meanings: ['Birkaç şey arasından birini ötekilere üstün tutarak seçme.'],
    origin: 'Arapça',
    example: 'İki teklif arasında maaştan çok esnek çalışma saatlerini tercih etti.',
    synonyms: ['yeğleme', 'seçim'],
    antonyms: [],
    level: 'temel',
    note: '"Tercih etmek" zaten "seçmek" demektir; "... tercih edilmesi daha uygun olur" gibi cümlelerde gereksiz uzatmaya dikkat edin.',
  },
  {
    id: 'tereddut',
    word: 'tereddüt',
    short: 'Bir karara varamama, kararsızlık, duraksama.',
    meanings: ['Bir konuda karar verememe durumu, kararsızlık, duraksama.'],
    origin: 'Arapça',
    example: 'Teklifi kabul etmeden önce birkaç gün tereddüt yaşadı.',
    synonyms: ['kararsızlık', 'duraksama'],
    antonyms: ['kararlılık', 'kesinlik'],
    level: 'temel',
  },
  {
    id: 'izah',
    word: 'izah',
    short: 'Bir konuyu açık biçimde anlatma, açıklama.',
    meanings: ['Bir şeyi açık ve anlaşılır biçimde anlatma, açıklama.'],
    origin: 'Arapça',
    example: 'Öğretmen konuyu bir kez daha izah edince herkes rahatladı.',
    synonyms: ['açıklama', 'anlatma'],
    antonyms: [],
    level: 'temel',
  },
  {
    id: 'takdir',
    word: 'takdir',
    short: 'Bir şeyin değerini anlayıp bunu belirtme, beğeni.',
    meanings: [
      'Bir şeyin değerini, önemini anlayıp bunu belirtme; beğenme.',
      'Değer biçme, karar verme.',
    ],
    origin: 'Arapça',
    example: 'Emeğinin karşılığını görünce yöneticisinin takdirini kazandı.',
    synonyms: ['beğeni', 'değer verme'],
    antonyms: ['küçümseme'],
    level: 'temel',
  },
  {
    id: 'tedbir',
    word: 'tedbir',
    short: 'Kötü bir sonucu önlemek için önceden yapılan hazırlık, önlem.',
    meanings: ['Bir işin sonucunu düşünerek önceden alınan önlem, hazırlık.'],
    origin: 'Arapça',
    example: 'Sel baskınına karşı mahalle sakinleri birlikte tedbir aldı.',
    synonyms: ['önlem', 'ihtiyat'],
    antonyms: ['tedbirsizlik'],
    level: 'temel',
  },
  {
    id: 'ihtiyat',
    word: 'ihtiyat',
    short: 'İleriyi düşünüp ölçülü davranma, sakınma; yedek.',
    meanings: [
      'İleriyi düşünerek ölçülü ve dikkatli davranma, sakınma.',
      'Gerektiğinde kullanılmak üzere saklanan yedek.',
    ],
    origin: 'Arapça',
    example: 'Bütçesinin bir kısmını ihtiyat olarak ayırıp acil durumlara sakladı.',
    synonyms: ['tedbir', 'sakınma'],
    antonyms: ['pervasızlık'],
    level: 'temel',
  },
  {
    id: 'samimi',
    word: 'samimi',
    short: 'İçten, yapmacıksız, gösterişten uzak.',
    meanings: ['İçten davranan, yapmacığa başvurmayan.', 'Yakın, senli benli.'],
    origin: 'Arapça',
    example: 'Konuşması o kadar samimiydi ki ilk kez tanıştıkları belli olmuyordu.',
    synonyms: ['içten', 'yapmacıksız'],
    antonyms: ['yapmacık', 'sahte'],
    level: 'temel',
  },
  {
    id: 'vicdan',
    word: 'vicdan',
    short: 'Kişiyi kendi davranışları üzerine yargılamaya iten iç ses.',
    meanings: ['Kişiyi kendi davranışları hakkında yargıda bulunmaya iten iç duygu.'],
    origin: 'Arapça',
    example: 'Yalan söylediği için vicdanı onu rahat bırakmadı.',
    synonyms: [],
    antonyms: [],
    level: 'temel',
  },
  {
    id: 'sefkat',
    word: 'şefkat',
    short: 'Sevgiyle karışık koruyucu ilgi, sevecenlik.',
    meanings: ['Sevgiyle karışık koruyup kollama duygusu, sevecenlik.'],
    origin: 'Arapça',
    example: 'Öğretmeninin şefkatli tavrı, en çekingen öğrenciyi bile konuşturdu.',
    synonyms: ['sevecenlik'],
    antonyms: ['sertlik', 'acımasızlık'],
    level: 'temel',
  },
  {
    id: 'azim',
    word: 'azim',
    short: 'Bir işteki engelleri yenme kararlılığı.',
    meanings: ['Bir amaca ulaşmak için engelleri aşma konusunda gösterilen güçlü kararlılık.'],
    origin: 'Arapça',
    example: 'Defalarca başarısız olmasına rağmen azmini hiç kaybetmedi.',
    synonyms: ['kararlılık', 'sebat'],
    antonyms: ['kararsızlık'],
    level: 'temel',
  },
  {
    id: 'sebat',
    word: 'sebat',
    short: 'Bir işi sonuna kadar bırakmadan sürdürme, direşme.',
    meanings: ['Sözünden veya kararından dönmeme.', 'Bir işi sonuna kadar sürdürme.'],
    origin: 'Arapça',
    example: 'Dil öğrenirken gösterdiği sebat sayesinde bir yılda akıcı konuşur oldu.',
    synonyms: ['azim', 'kararlılık'],
    antonyms: ['vazgeçme'],
    level: 'temel',
  },
  {
    id: 'hasim',
    word: 'hasım',
    short: 'Karşıt taraf, düşman.',
    meanings: ['Düşman, karşıt taraf.', 'Bir yarışta veya davada karşı taraf.'],
    origin: 'Arapça',
    example: 'Yıllarca mahkemede karşı karşıya gelen iki hasım sonunda uzlaştı.',
    synonyms: ['düşman', 'rakip'],
    antonyms: ['dost', 'müttefik'],
    level: 'temel',
  },
  {
    id: 'taviz',
    word: 'taviz',
    short: 'Bir haktan vazgeçerek karşılığında elde edilen kolaylık, ödün.',
    meanings: ['Bir isteğin gerçekleşmesi için bir haktan kısmen veya tamamen vazgeçme, ödün.'],
    origin: 'Arapça',
    example: 'Anlaşmayı kurtarmak için her iki taraf da birer taviz verdi.',
    synonyms: ['ödün'],
    antonyms: ['direnme'],
    level: 'temel',
  },
  {
    id: 'tesvik',
    word: 'teşvik',
    short: 'Bir şeyi yapmaya istek uyandırma, özendirme.',
    meanings: ['Bir kimseyi bir şeyi yapmaya istekli kılma, özendirme, isteklendirme.'],
    origin: 'Arapça',
    example: 'Ailesinin teşvikiyle resim kurslarına yazıldı.',
    synonyms: ['özendirme', 'isteklendirme'],
    antonyms: ['caydırma'],
    level: 'temel',
  },
];

const ORTA: LugatWord[] = [
  {
    id: 'itina',
    word: 'itina',
    short: 'Bir işi büyük özenle yapma.',
    meanings: ['Bir işi yaparken gösterilen büyük özen, dikkat.'],
    origin: 'Arapça',
    example: 'Mektubu öyle bir itinayla katladı ki sanki hediye paketiymiş gibi durdu.',
    synonyms: ['özen', 'dikkat'],
    antonyms: ['savsaklama', 'özensizlik'],
    level: 'orta',
  },
  {
    id: 'muphem',
    word: 'müphem',
    short: 'Açık ve net olmayan, belirsiz.',
    meanings: ['Açık ve belirgin olmayan, belirsiz.', 'Üstü kapalı, örtülü.'],
    origin: 'Arapça',
    example: 'Sorusuna verdiği müphem cevap kimseyi tatmin etmedi.',
    synonyms: ['belirsiz', 'muğlak'],
    antonyms: ['açık', 'net', 'sarih'],
    level: 'orta',
  },
  {
    id: 'nuans',
    word: 'nüans',
    short: 'İki şey arasındaki ince, küçük fark.',
    meanings: ['Birbirine yakın iki şey ya da anlam arasındaki ince ayrım.'],
    origin: 'Fransızca',
    example: '"İstemek" ile "arzu etmek" arasında ince bir nüans var.',
    synonyms: ['ince ayrım', 'ayırtı'],
    antonyms: [],
    level: 'orta',
  },
  {
    id: 'istisna',
    word: 'istisna',
    short: 'Genel kuralın dışında kalan durum.',
    meanings: [
      'Bir şeyi benzerlerinden ayrı tutma.',
      'Genel kuralın dışında kalan, kurala uymayan durum.',
    ],
    origin: 'Arapça',
    example: 'Şirket kuralları katıydı ama onun durumu bir istisna sayıldı.',
    synonyms: ['ayrık durum'],
    antonyms: ['kural', 'genel'],
    level: 'orta',
  },
  {
    id: 'tezat',
    word: 'tezat',
    short: 'Birbirine tamamen zıt olma durumu, karşıtlık.',
    meanings: ['İki şey arasındaki tam karşıtlık, zıtlık.'],
    origin: 'Arapça',
    example: 'Söyledikleriyle yaptıkları arasındaki tezat herkesin gözünden kaçmadı.',
    synonyms: ['karşıtlık', 'zıtlık', 'çelişki'],
    antonyms: ['uyum', 'benzerlik'],
    level: 'orta',
  },
  {
    id: 'muhakeme',
    word: 'muhakeme',
    short: 'Bir konuyu akıl yürüterek değerlendirme.',
    meanings: ['Bir sorunu çözmek için akıl yürütme, usa vurma.', 'Bir davayı yargılama.'],
    origin: 'Arapça',
    example: 'Paniklemeden önce olayı sağlıklı bir muhakemeyle değerlendirmeye çalıştı.',
    synonyms: ['akıl yürütme', 'değerlendirme'],
    antonyms: [],
    level: 'orta',
  },
  {
    id: 'ihtimam',
    word: 'ihtimam',
    short: 'Bir işe veya kişiye gösterilen özenli ilgi.',
    meanings: ['Bir işe veya kişiye gösterilen özenli bakım, ilgi.'],
    origin: 'Arapça',
    example: 'Yaşlı annesine gösterdiği ihtimam, tüm komşuların takdirini topladı.',
    synonyms: ['özen', 'itina'],
    antonyms: ['ihmal'],
    level: 'orta',
  },
  {
    id: 'feragat',
    word: 'feragat',
    short: 'Bir haktan kendi isteğiyle vazgeçme.',
    meanings: ['Bir haktan kendi isteğiyle, gönüllü olarak vazgeçme.'],
    origin: 'Arapça',
    example: 'Kardeşinin okuyabilmesi için kendi payından feragat etti.',
    synonyms: ['vazgeçme', 'fedakârlık'],
    antonyms: ['ısrar', 'sahiplenme'],
    level: 'orta',
  },
  {
    id: 'ragbet',
    word: 'rağbet',
    short: 'Bir şeye duyulan yoğun istek ve ilgi.',
    meanings: ['Bir şeye duyulan istek, arzu, ilgi.', 'Beğenilme, itibar görme.'],
    origin: 'Arapça',
    example: 'Kışın bu kumaşa olan rağbet iki katına çıkıyor.',
    synonyms: ['ilgi', 'talep'],
    antonyms: ['ilgisizlik', 'soğukluk'],
    level: 'orta',
  },
  {
    id: 'kanaat',
    word: 'kanaat',
    short: 'Bir konuda varılan kişisel görüş; elindekiyle yetinme.',
    meanings: [
      'Elindekinden hoşnut olma, yeter bulma, fazlasını istememe.',
      'Bir konuda varılan kişisel görüş, düşünce.',
    ],
    origin: 'Arapça',
    example: 'Uzun tartışmanın sonunda herkes aynı kanaate vardı.',
    synonyms: ['görüş', 'kanı'],
    antonyms: [],
    level: 'orta',
    note: '"Kanaat" hem "kanı, görüş" hem de "yetinme" anlamında kullanılır; hangisi kastedildiği cümlenin bağlamından anlaşılır.',
  },
  {
    id: 'istikrar',
    word: 'istikrar',
    short: 'Bir durumun sürekli aynı düzende kalması, kararlılık.',
    meanings: ['Aynı kararda, aynı düzende sürme; kararlılık, denge.'],
    origin: 'Arapça',
    example: 'Şirketin son beş yıldaki istikrarı yatırımcıları rahatlattı.',
    synonyms: ['kararlılık', 'denge'],
    antonyms: ['istikrarsızlık', 'dalgalanma'],
    level: 'orta',
  },
  {
    id: 'bertaraf',
    word: 'bertaraf',
    short: 'Ortadan kaldırma, giderme.',
    meanings: ['Bir engeli veya tehlikeyi ortadan kaldırma.'],
    origin: 'Farsça-Arapça',
    example: 'Ekip, olası bir arızayı daha ortaya çıkmadan bertaraf etti.',
    synonyms: ['ortadan kaldırma', 'giderme'],
    antonyms: [],
    level: 'orta',
  },
  {
    id: 'akibet',
    word: 'akıbet',
    short: 'Bir işin veya durumun sonu, sonucu.',
    meanings: ['Bir iş veya durumun sonu veya sonucu.'],
    origin: 'Arapça',
    example: 'Planlarını kimseyle paylaşmadı ama akıbeti hepimizi şaşırttı.',
    synonyms: ['son', 'sonuç'],
    antonyms: ['başlangıç'],
    level: 'orta',
  },
  {
    id: 'ahenk',
    word: 'ahenk',
    short: 'Parçaların birbiriyle uyum içinde olması.',
    meanings: ['Bir bütünü oluşturan parçalar arasındaki uyum.', 'Kulağa hoş gelen ses düzeni.'],
    origin: 'Farsça',
    example: 'Ekip üyeleri arasındaki ahenk, işin bu kadar hızlı bitmesini sağladı.',
    synonyms: ['uyum', 'düzen'],
    antonyms: ['uyumsuzluk', 'kargaşa'],
    level: 'orta',
  },
  {
    id: 'temkin',
    word: 'temkin',
    short: 'Sonucu düşünerek ölçülü ve dikkatli davranma.',
    meanings: ['Bir işin sonucunu düşünerek ölçülü, tedbirli davranma.'],
    origin: 'Arapça',
    example: 'Sonuçları belli olana kadar temkinli konuşmayı tercih etti.',
    synonyms: ['ihtiyat', 'ölçülülük'],
    antonyms: ['acelecilik', 'tedbirsizlik'],
    level: 'orta',
  },
  {
    id: 'tenkit',
    word: 'tenkit',
    short: 'Bir eseri veya davranışı değerlendirip eksiklerini gösterme, eleştiri.',
    meanings: [
      'Bir eseri, davranışı veya fikri değerlendirip olumlu ve olumsuz yanlarını ortaya koyma; eleştiri.',
    ],
    origin: 'Arapça',
    example: 'Yazdığı denemeyi hocasının tenkidine sunmaktan çekinmedi.',
    synonyms: ['eleştiri'],
    antonyms: ['övgü'],
    note: 'Günümüzde yazı dilinde daha çok Türkçe karşılığı olan "eleştiri" tercih edilir; "tenkit" özellikle edebiyat metinlerinde hâlâ kullanılır.',
    level: 'orta',
  },
  {
    id: 'tasarruf',
    word: 'tasarruf',
    short: 'Harcamayı kısıp biriktirme; bir şeyi kullanma yetkisi.',
    meanings: [
      'Para veya malı biriktirme, gereksiz harcamadan kaçınma.',
      'Bir şeye sahip olup istediği gibi kullanma yetkisi.',
    ],
    origin: 'Arapça',
    example: 'Her ay maaşının bir kısmını tasarruf etmeyi alışkanlık hâline getirdi.',
    synonyms: ['biriktirme', 'tutumluluk'],
    antonyms: ['israf'],
    level: 'orta',
  },
  {
    id: 'mutabakat',
    word: 'mutabakat',
    short: 'Karşılıklı olarak aynı görüşte olma, uzlaşma.',
    meanings: ['İki veya daha fazla tarafın aynı görüşte birleşmesi, uzlaşma.'],
    origin: 'Arapça',
    example: 'Uzun görüşmelerin ardından iki taraf da fiyat üzerinde mutabakata vardı.',
    synonyms: ['uzlaşma', 'anlaşma'],
    antonyms: ['ihtilaf', 'anlaşmazlık'],
    level: 'orta',
  },
  {
    id: 'ihtilaf',
    word: 'ihtilaf',
    short: 'Görüş ayrılığından doğan anlaşmazlık.',
    meanings: ['İki taraf arasındaki görüş ayrılığı, anlaşmazlık.'],
    origin: 'Arapça',
    example: 'Ortaklar arasındaki ihtilaf, şirketin geleceğini tehlikeye soktu.',
    synonyms: ['anlaşmazlık', 'uyuşmazlık'],
    antonyms: ['mutabakat', 'uzlaşma'],
    level: 'orta',
  },
  {
    id: 'husumet',
    word: 'husumet',
    short: 'Karşılıklı düşmanlık besleme durumu.',
    meanings: ['İki taraf arasındaki düşmanlık, hasım olma durumu.'],
    origin: 'Arapça',
    example: 'Eski husumeti bir kenara bırakıp ortak projede buluştular.',
    synonyms: ['düşmanlık'],
    antonyms: ['dostluk'],
    level: 'orta',
  },
  {
    id: 'basiret',
    word: 'basiret',
    short: 'İleriyi görebilme, olayları doğru değerlendirme yeteneği.',
    meanings: ['Olayları ve gerçekleri yanılmadan görebilme, ileri görüşlülük.'],
    origin: 'Arapça',
    example: 'Kriz gelmeden önlem alması, sahip olduğu basiretin bir göstergesiydi.',
    synonyms: ['sağgörü', 'ileri görüşlülük'],
    antonyms: ['basiretsizlik'],
    level: 'orta',
  },
  {
    id: 'idrak',
    word: 'idrak',
    short: 'Bir şeyi kavrayıp anlama yetisi.',
    meanings: ['Bir şeyi anlama, kavrama yetisi.', 'Bir zamana veya olaya erişme, ulaşma.'],
    origin: 'Arapça',
    example: 'Olayın ciddiyetini idrak etmesi biraz zaman aldı.',
    synonyms: ['kavrayış', 'anlayış'],
    antonyms: [],
    level: 'orta',
  },
  {
    id: 'hassasiyet',
    word: 'hassasiyet',
    short: 'Bir konuya karşı duyarlı davranma, duyarlılık.',
    meanings: ['Bir konuya, duruma veya kişiye karşı gösterilen duyarlılık, özen.'],
    origin: 'Arapça',
    example: 'Konu çocuklarla ilgili olunca herkes fazladan bir hassasiyet gösterdi.',
    synonyms: ['duyarlılık'],
    antonyms: ['duyarsızlık', 'kayıtsızlık'],
    level: 'orta',
  },
  {
    id: 'maharet',
    word: 'maharet',
    short: 'Bir işi ustalıkla yapabilme becerisi.',
    meanings: ['Bir işi ustalıkla, kolaylıkla yapabilme becerisi.'],
    origin: 'Arapça',
    example: 'Bıçağı öyle bir maharetle kullanıyordu ki izleyenler şaşırdı.',
    synonyms: ['beceri', 'ustalık'],
    antonyms: ['beceriksizlik'],
    level: 'orta',
  },
  {
    id: 'ehliyet',
    word: 'ehliyet',
    short: 'Bir işi yapmaya yeterli olma durumu.',
    meanings: ['Bir işi yapabilme yeterliliği, yetkinlik.', 'Sürücü belgesi.'],
    origin: 'Arapça',
    example: 'İşe alım sürecinde önce adayların bu alandaki ehliyeti değerlendirildi.',
    synonyms: ['yeterlilik', 'yetkinlik'],
    antonyms: ['yetersizlik'],
    level: 'orta',
  },
  {
    id: 'liyakat',
    word: 'liyakat',
    short: 'Bir göreve layık olma, o göreve uygunluk.',
    meanings: ['Bir kimsenin bir işe veya göreve uygunluğu, hak edişi.'],
    origin: 'Arapça',
    example: 'Terfi ederken tek kıstas liyakat olmalı, tanıdıklık değil.',
    synonyms: ['hak ediş', 'yeterlilik'],
    antonyms: ['liyakatsizlik'],
    level: 'orta',
  },
  {
    id: 'elzem',
    word: 'elzem',
    short: 'Kesinlikle gerekli, vazgeçilmez.',
    meanings: ['Çok gerekli, vazgeçilmez.'],
    origin: 'Arapça',
    example: 'Uzun yolculuk öncesi lastiklerin kontrolü elzem bir adımdır.',
    synonyms: ['gerekli', 'vazgeçilmez'],
    antonyms: ['gereksiz'],
    note: '"Elzem" zaten en üst derecede gerekliliği anlatır; "çok elzem" demek gereksiz bir pekiştirmedir.',
    level: 'orta',
  },
  {
    id: 'zaruri',
    word: 'zaruri',
    short: 'Yapılması kaçınılmaz, zorunlu.',
    meanings: ['Yapılması kaçınılmaz olan, zorunlu.'],
    origin: 'Arapça',
    example: 'Raporun bugün teslim edilmesi zaruriydi, ertelenemezdi.',
    synonyms: ['zorunlu', 'gerekli'],
    antonyms: ['isteğe bağlı'],
    level: 'orta',
  },
];

const ILERI: LugatWord[] = [
  {
    id: 'mulahaza',
    word: 'mülahaza',
    short: 'Bir konu üzerine yapılan düşünce, değerlendirme.',
    meanings: ['Bir konu üzerinde yapılan düşünce, değerlendirme, görüş.'],
    origin: 'Arapça',
    example: 'Raporun sonuna kendi mülahazalarını da ekledi.',
    synonyms: ['düşünce', 'değerlendirme'],
    antonyms: [],
    level: 'ileri',
  },
  {
    id: 'tahayyul',
    word: 'tahayyül',
    short: 'Var olmayan bir şeyi zihinde canlandırma.',
    meanings: [
      'Var olmayan veya o an önünde olmayan bir şeyi zihinde canlandırma, imgeleme.',
    ],
    origin: 'Arapça',
    example: 'Gözlerini kapatıp yıllar sonraki hâlini tahayyül etti.',
    synonyms: ['hayal etme', 'imgeleme'],
    antonyms: [],
    level: 'ileri',
  },
  {
    id: 'telakki',
    word: 'telakki',
    short: 'Bir şeyi belirli bir biçimde algılayıp değerlendirme, anlayış.',
    meanings: ['Bir şeyi belli bir biçimde anlama, değerlendirme; anlayış.'],
    origin: 'Arapça',
    example: 'Başarıyı yalnızca parayla ölçen bir telakkisi vardı.',
    synonyms: ['anlayış', 'görüş'],
    antonyms: [],
    level: 'ileri',
  },
  {
    id: 'munferit',
    word: 'münferit',
    short: 'Tek başına, ayrı, kendine özgü.',
    meanings: ['Başkalarından ayrı, tek başına olan.'],
    origin: 'Arapça',
    example: 'Kurum, yaşananın münferit bir olay olduğunu açıkladı.',
    synonyms: ['tek başına', 'ayrı'],
    antonyms: ['yaygın', 'genel'],
    level: 'ileri',
  },
  {
    id: 'mutemadiyen',
    word: 'mütemadiyen',
    short: 'Sürekli olarak, aralıksız biçimde.',
    meanings: ['Aralıksız, sürekli olarak.'],
    origin: 'Arapça',
    example: 'Komşunun köpeği gece boyunca mütemadiyen havladı.',
    synonyms: ['sürekli', 'aralıksız'],
    antonyms: ['ara sıra', 'zaman zaman'],
    level: 'ileri',
  },
  {
    id: 'vukuf',
    word: 'vukuf',
    short: 'Bir konuda derin bilgi ve deneyim sahibi olma.',
    meanings: ['Bir konuda derinlemesine bilgi ve deneyim sahibi olma.'],
    origin: 'Arapça',
    example: 'Konuyu öyle bir vukufla anlattı ki yıllardır bu işle uğraştığı belliydi.',
    synonyms: ['derin bilgi', 'uzmanlık'],
    antonyms: [],
    level: 'ileri',
  },
  {
    id: 'teemmul',
    word: 'teemmül',
    short: 'Bir konuyu ayrıntılarıyla düşünüp taşınma.',
    meanings: ['Bir işi ayrıntılarıyla düşünme, düşünüp taşınma.'],
    origin: 'Arapça',
    example: 'Cevap vermeden önce biraz teemmül etmek istedi.',
    synonyms: ['düşünüp taşınma'],
    antonyms: [],
    level: 'ileri',
  },
  {
    id: 'iltimas',
    word: 'iltimas',
    short: 'Birine haksız ayrıcalık tanıma, kayırma.',
    meanings: [
      'Birine herhangi bir konuda haksız öncelik ve ayrıcalık tanıma, kayırma.',
    ],
    origin: 'Arapça',
    example: 'Sınav sonuçlarına kimsenin iltimas geçtiğine dair bir şüphe yoktu.',
    synonyms: ['kayırma', 'torpil'],
    antonyms: ['tarafsızlık'],
    level: 'ileri',
  },
  {
    id: 'ruchan',
    word: 'rüçhan',
    short: 'Bir şeyin diğerine göre öncelikli, üstün sayılması.',
    meanings: ['Bir şeyin ötekine göre öncelikli veya üstün sayılması.'],
    origin: 'Arapça',
    example: 'Eski ortaklara yeni hisse alımında rüçhan hakkı tanındı.',
    synonyms: ['öncelik', 'üstünlük'],
    antonyms: [],
    level: 'ileri',
  },
  {
    id: 'tevazu',
    word: 'tevazu',
    short: 'Kendini olduğundan büyük göstermeme, alçakgönüllülük.',
    meanings: ['Kendini olduğundan üstün göstermeme, alçakgönüllülük.'],
    origin: 'Arapça',
    example: 'Bunca başarıya rağmen tevazusunu hiç kaybetmedi.',
    synonyms: ['alçakgönüllülük'],
    antonyms: ['kibir', 'gurur'],
    note: 'Sözcük "tevazu" biçiminde yazılır; yaygın olan "tevazü" yazımı yanlıştır.',
    level: 'ileri',
  },
  {
    id: 'sathi',
    word: 'sathi',
    short: 'Derinlemesine değil, üstünkörü; yüzeysel.',
    meanings: ['Konunun derinine inmeden yapılan, yüzeysel.'],
    origin: 'Arapça',
    example: 'Konuyu sathi bir şekilde geçiştirmek yerine kök nedeni araştırdı.',
    synonyms: ['yüzeysel', 'üstünkörü'],
    antonyms: ['derin', 'köklü'],
    level: 'ileri',
  },
  {
    id: 'esasli',
    word: 'esaslı',
    short: 'Sağlam temele dayanan, köklü ve etkili.',
    meanings: ['Köklü, sağlam temele dayanan, etkili.'],
    example: 'Sorunu geçiştirmek yerine esaslı bir çözüm bulmayı tercih ettiler.',
    synonyms: ['köklü', 'sağlam'],
    antonyms: ['yüzeysel', 'geçici'],
    level: 'ileri',
  },
  {
    id: 'mahiyet',
    word: 'mahiyet',
    short: 'Bir şeyin asıl niteliği, esası.',
    meanings: ['Bir şeyin asıl niteliği, özü, esası.'],
    origin: 'Arapça',
    example: 'Teklifin gerçek mahiyetini anlamak için sözleşmeyi baştan sona okudu.',
    synonyms: ['nitelik', 'öz', 'esas'],
    antonyms: [],
    level: 'ileri',
  },
  {
    id: 'muglak',
    word: 'muğlak',
    short: 'Anlaşılması güç, kapalı, belirsiz.',
    meanings: ['Anlaşılması güç, kapalı, karışık.'],
    origin: 'Arapça',
    example: 'Sözleşmedeki muğlak madde, ileride anlaşmazlığa yol açtı.',
    synonyms: ['kapalı', 'anlaşılmaz', 'müphem'],
    antonyms: ['açık', 'net', 'sarih'],
    level: 'ileri',
  },
  {
    id: 'tafsilat',
    word: 'tafsilat',
    short: 'Bir konunun ayrıntılı biçimde anlatılması.',
    meanings: ['Bir konunun ayrıntıları, ayrıntılı açıklaması.'],
    origin: 'Arapça',
    example: 'Olayın tafsilatını merak edenler haberin devamını okudu.',
    synonyms: ['ayrıntı', 'detay'],
    antonyms: ['özet'],
    level: 'ileri',
  },
  {
    id: 'icmal',
    word: 'icmal',
    short: 'Bir konunun kısaca, ana hatlarıyla özetlenmesi.',
    meanings: ['Bir konunun ana hatlarıyla kısaca özetlenmesi.'],
    origin: 'Arapça',
    example: 'Toplantının icmalini tek sayfada herkese gönderdi.',
    synonyms: ['özet'],
    antonyms: ['tafsilat', 'ayrıntı'],
    level: 'ileri',
  },
  {
    id: 'tefekkur',
    word: 'tefekkür',
    short: 'Bir konu üzerine derin ve sakin biçimde düşünme.',
    meanings: ['Bir konu üzerinde derinlemesine ve sakin biçimde düşünme.'],
    origin: 'Arapça',
    example: 'Sahilde tek başına oturup uzun uzun tefekküre daldı.',
    synonyms: ['düşünme', 'derin düşünce'],
    antonyms: [],
    level: 'ileri',
  },
  {
    id: 'temayul',
    word: 'temayül',
    short: 'Bir yöne veya şeye doğru eğilim gösterme.',
    meanings: ['Bir şeye veya kişiye karşı duyulan eğilim, ilgi.'],
    origin: 'Arapça',
    example: 'Ekip son zamanlarda daha esnek çalışma modeline temayül gösteriyor.',
    synonyms: ['eğilim', 'meyil'],
    antonyms: [],
    level: 'ileri',
  },
  {
    id: 'meyil',
    word: 'meyil',
    short: 'Bir şeye karşı duyulan ilgi, eğilim; eğim.',
    meanings: [
      'Bir şeye veya kimseye duyulan ilgi, eğilim, gönül verme.',
      'Bir yüzeyin dikliği, eğim.',
    ],
    origin: 'Arapça',
    example: 'Küçük yaşlardan beri müzikle uğraşmaya bir meyil duyuyordu.',
    synonyms: ['eğilim', 'temayül'],
    antonyms: [],
    level: 'ileri',
  },
  {
    id: 'dirayet',
    word: 'dirayet',
    short: 'Bir işi kavrayıp doğru şekilde yönetebilme becerisi, zekâ.',
    meanings: ['İnce şeyleri kavrayış, zekâ ve beceriklilik.'],
    origin: 'Arapça',
    example: 'Krizi yönetirken gösterdiği dirayet, ekibin moralini yüksek tuttu.',
    synonyms: ['beceriklilik', 'zekâ'],
    antonyms: ['acizlik'],
    level: 'ileri',
  },
  {
    id: 'keyfiyet',
    word: 'keyfiyet',
    short: 'Bir şeyin niteliği, ne türden olduğu.',
    meanings: ['Bir şeyin niteliği, ne türden ve nasıl olduğu; durum.'],
    origin: 'Arapça',
    example: 'Toplantıda işin keyfiyetinden çok süresi konuşuldu.',
    synonyms: ['nitelik', 'durum'],
    antonyms: [],
    note: '"Keyfiyet" nitelik, "kemiyet" nicelik demektir; ikisi zıt değil, birbirini tamamlayan kavramlardır. "Keyif" (neşe, hoşnutluk) ile de karıştırılmamalı.',
    level: 'ileri',
  },
  {
    id: 'sarih',
    word: 'sarih',
    short: 'Açık, anlaşılır, belirgin.',
    meanings: ['Açık, anlaşılır, hiçbir kapalı yanı olmayan; belirgin.'],
    origin: 'Arapça',
    example: 'Sözleşmedeki madde o kadar sarihti ki yoruma yer bırakmıyordu.',
    synonyms: ['açık', 'belirgin', 'net'],
    antonyms: ['müphem', 'muğlak', 'belirsiz'],
    level: 'ileri',
  },
];

export const LUGAT_WORDS: LugatWord[] = [...TEMEL, ...ORTA, ...ILERI];

export function findWord(id: string): LugatWord | undefined {
  return LUGAT_WORDS.find((w) => w.id === id);
}

export function wordsForLevel(level?: LugatLevel): LugatWord[] {
  if (!level) return LUGAT_WORDS;
  return LUGAT_WORDS.filter((w) => w.level === level);
}

/* ------------------------------------------------------------------ */
/* Doğru Türkçe — sık yazım/anlam/kullanım hataları                    */
/* ------------------------------------------------------------------ */

export const USAGE_ITEMS: UsageItem[] = [
  {
    id: 'herkes',
    kind: 'yazim',
    wrong: 'herkez',
    right: 'herkes',
    explanation: '"Herkes" her zaman "s" ile biter; "z" ile yazımı yaygın ama yanlıştır.',
    example: 'Toplantıya herkes zamanında geldi.',
  },
  {
    id: 'yalniz',
    kind: 'yazim',
    wrong: 'yanlız',
    right: 'yalnız',
    explanation: '"Yalnız" kelimesinde "l" ve "n" harflerinin sırası karıştırılmamalı.',
    example: 'Bu akşam evde yalnız kalacaktı.',
  },
  {
    id: 'yanlis',
    kind: 'yazim',
    wrong: 'yalnış',
    right: 'yanlış',
    explanation: '"Yanlış" kelimesi "yalnız" ile karıştırılıp "yalnış" biçiminde yazılmamalı.',
    example: 'Hesapta küçük bir yanlış olduğunu fark etti.',
  },
  {
    id: 'sofor',
    kind: 'yazim',
    wrong: 'şöför',
    right: 'şoför',
    explanation: 'Fransızca kökenli bu kelime Türkçede "şoför" biçiminde yazılır: ilk hece "şo", ikinci hece "för".',
    example: 'Taksi şoförü en kısa yolu biliyordu.',
  },
  {
    id: 'orijinal',
    kind: 'yazim',
    wrong: 'orjinal',
    right: 'orijinal',
    explanation: '"Orijinal" kelimesinde "i" harfi düşürülmeden yazılır.',
    example: 'Tablonun orijinal hâlini müzede gördük.',
  },
  {
    id: 'affetmek',
    kind: 'yazim',
    wrong: 'afetmek',
    right: 'affetmek',
    explanation: '"Affetmek" iki "f" ile yazılır; tek "f" ile yazımı yanlıştır.',
    example: 'Geç kaldığı için arkadaşından özür diledi, o da onu hemen affetti.',
  },
  {
    id: 'yalnizca',
    kind: 'yazim',
    wrong: 'yanlızca',
    right: 'yalnızca',
    explanation: '"Yalnız" kelimesindeki aynı hata "yalnızca" için de geçerlidir; "l" ve "n" yer değiştirmez.',
    example: 'Bu bilgiyi yalnızca ekip lideriyle paylaştı.',
  },
  {
    id: 'her-sey',
    kind: 'yazim',
    wrong: 'herşey',
    right: 'her şey',
    explanation:
      '"Her şey" iki ayrı kelimedir ve ayrı yazılır. "Herkes", "herhangi" gibi kalıplaşmış birkaç sözcük ise bitişik yazılır.',
    example: 'Taşınmadan önce her şeyi tek tek kutulara yerleştirdi.',
  },
  {
    id: 'bir-sey',
    kind: 'yazim',
    wrong: 'birşey',
    right: 'bir şey',
    explanation:
      '"Bir şey" iki ayrı kelimedir ve ayrı yazılır. "Biraz", "birkaç", "birçok", "birtakım" gibi kalıplaşmış sözcükler ise bitişik yazılır.',
    example: 'Sana söylemem gereken bir şey var.',
  },
  {
    id: 'hicbir',
    kind: 'yazim',
    wrong: 'hiç bir',
    right: 'hiçbir',
    explanation: '"Hiçbir" burada kalıplaşmış tek bir sözcük olduğu için bitişik yazılır; "her şey"in aksine ayrı yazılmaz.',
    example: 'Bu konuda hiçbir şüphesi kalmamıştı.',
  },
  {
    id: 'biraz',
    kind: 'yazim',
    wrong: 'bir az',
    right: 'biraz',
    explanation: '"Biraz" kalıplaşmış bir sözcüktür ve bitişik yazılır.',
    example: 'Toplantıya başlamadan önce biraz beklediler.',
  },
  {
    id: 'buyukanne',
    kind: 'yazim',
    wrong: 'büyük anne',
    right: 'büyükanne',
    explanation: 'Akrabalık bildiren "büyükanne" ve "büyükbaba" bitişik yazılan kalıplaşmış birleşik kelimelerdir.',
    example: 'Yaz tatilinde büyükannesinin yanında kaldı.',
  },
  {
    id: 'hala-hala',
    kind: 'anlam',
    wrong: 'Kardeşim hala kitap okuyor.',
    right: 'Kardeşim hâlâ kitap okuyor.',
    explanation: '"Hâlâ" (şapkalı, uzun a) "henüz, şu an bile" anlamındadır; şapkasız "hala" ise babanın kız kardeşi demektir. İki ayrı kelimedir.',
    example: 'Saatler geçmesine rağmen otobüs hâlâ gelmemişti.',
  },
  {
    id: 'empati-sempati',
    kind: 'anlam',
    wrong: 'Ona çok sempati kurdum, ne hissettiğini tam anlıyorum.',
    right: 'Ona çok empati kurdum, ne hissettiğini tam anlıyorum.',
    explanation: '"Empati" kendini karşıdakinin yerine koyup onun duygularını anlamaktır; "sempati" ise birine karşı duyulan sevgi ve yakınlık hissidir. Birbirinin yerine kullanılmaz.',
    example: 'Aynı durumu kendisi de yaşadığı için arkadaşına kolayca empati kurabildi.',
  },
  {
    id: 'mutevazi-mutevazi',
    kind: 'anlam',
    wrong: 'Çok mütevazi bir evde oturuyorlar.',
    right: 'Çok mütevazı bir evde oturuyorlar.',
    explanation: '"Mütevazı" alçakgönüllü veya gösterişsiz demektir; "mütevazi" ise geometri terimi olan "paralel" anlamına gelir. İki ayrı kelimedir.',
    example: 'Başarılarına rağmen hep mütevazı bir tavır sergiledi.',
  },
  {
    id: 'muhakkak-muhtemelen',
    kind: 'anlam',
    wrong: 'Yarın muhakkak yağmur yağabilir.',
    right: 'Yarın muhtemelen yağmur yağar.',
    explanation: '"Muhakkak" kesinlik bildirir ve olasılık ifadeleriyle bir arada kullanılmaz; olasılık anlatmak için "muhtemelen" kullanılır.',
    example: 'Bu tempoyla giderlerse muhakkak zamanında bitirirler.',
  },
  {
    id: 'curumek-curutmek',
    kind: 'anlam',
    wrong: 'Bilim insanları teoriyi çürüdü.',
    right: 'Bilim insanları teoriyi çürüttü.',
    explanation: '"Çürümek" nesnenin kendiliğinden bozulmasıdır ve nesne almaz; bir iddiayı geçersiz kılmak için geçişli olan "çürütmek" kullanılır.',
    example: 'Yeni deneyler, eski varsayımı kısa sürede çürüttü.',
  },
  {
    id: 'istifa-istifade',
    kind: 'anlam',
    wrong: 'Bu fırsattan istifa etmeliyiz.',
    right: 'Bu fırsattan istifade etmeliyiz.',
    explanation: '"İstifa" görevden ayrılmak, "istifade" ise bir şeyden yararlanmak demektir; yazılışları benzese de anlamları tamamen farklıdır.',
    example: 'İndirim döneminden istifade ederek yıllık alışverişini tamamladı.',
  },
  {
    id: 'mutehassis-mutehassis',
    kind: 'anlam',
    wrong: 'Konusunda mütehassis biriydi.',
    right: 'Konusunda mütehassıs biriydi.',
    explanation: '"Mütehassıs" uzman demektir; "mütehassis" ise duygulanmış olan kişidir. Yazılışları çok yakın olsa da anlamları apayrıdır.',
    example: 'Kalp hastalıkları konusunda mütehassıs bir doktora göründü.',
  },
  {
    id: 'muhatap',
    kind: 'yazim',
    wrong: 'Şikâyetini muhattap kişiye iletmedi.',
    right: 'Şikâyetini muhatap kişiye iletmedi.',
    explanation: '"Muhatap" tek "t" ile yazılır ve "kendisiyle konuşulan, sözün yöneltildiği kişi" demektir; "muhattap" yazımı yanlıştır.',
    example: 'Sorununu doğru muhataba anlatmadığı için çözüm bulamadı.',
  },
  {
    id: 'asgari-en-az',
    kind: 'kullanim',
    wrong: 'Bu iş için en az asgari üç kişi gerekiyor.',
    right: 'Bu iş için asgari üç kişi gerekiyor.',
    explanation: '"Asgari" zaten "en az" demektir; ikisini bir arada kullanmak anlam tekrarına (gereksiz pekiştirme) yol açar.',
    example: 'Katılım için asgari on kişi gerekiyordu.',
  },
  {
    id: 'azami-en-fazla',
    kind: 'kullanim',
    wrong: 'Azami en fazla beş dakika bekleyebiliriz.',
    right: 'Azami beş dakika bekleyebiliriz.',
    explanation: '"Azami" "en fazla" demektir; ikisini birlikte kullanmak gereksizdir.',
    example: 'Teslimat azami üç iş günü içinde tamamlanır.',
  },
  {
    id: 'geri-iade',
    kind: 'kullanim',
    wrong: 'Ürünü mağazaya geri iade etti.',
    right: 'Ürünü mağazaya iade etti.',
    explanation: '"İade" zaten "geri verme" anlamı taşır; başına ayrıca "geri" eklemek gereksiz tekrardır.',
    example: 'Beğenmediği kitabı iki gün içinde iade etti.',
  },
  {
    id: 'ilk-once',
    kind: 'kullanim',
    wrong: 'İlk önce eve gidip üzerimi değiştirdim.',
    right: 'Önce eve gidip üzerimi değiştirdim.',
    explanation: '"Önce" zaten sıralamada ilk olanı anlatır; "ilk önce" anlam tekrarıdır. Yazı dilinde tek başına "önce" yeterlidir.',
    example: 'Önce planı gözden geçirdi, sonra uygulamaya başladı.',
  },
  {
    id: 'birlikte-beraber',
    kind: 'kullanim',
    wrong: 'Hep birlikte beraber yemek yedik.',
    right: 'Hep birlikte yemek yedik.',
    explanation: '"Birlikte" ve "beraber" eş anlamlıdır; ikisini yan yana kullanmak gereksiz tekrardır.',
    example: 'Bayramda tüm aile birlikte vakit geçirdi.',
  },
  {
    id: 'asil-esas',
    kind: 'kullanim',
    wrong: 'Asıl esas mesele bu değil.',
    right: 'Asıl mesele bu değil.',
    explanation: '"Asıl" ve "esas" burada aynı işlevi görür; bir cümlede ikisini birlikte kullanmak gereksizdir.',
    example: 'Asıl mesele, kararın kime danışılmadan alınmış olmasıydı.',
  },
  {
    id: 'eger-sayet',
    kind: 'kullanim',
    wrong: 'Eğer şayet gelirsen haber ver.',
    right: 'Eğer gelirsen haber ver.',
    explanation: '"Eğer" ve "şayet" aynı anlamda kullanılan koşul bağlaçlarıdır; ikisi bir cümlede birlikte kullanılmaz.',
    example: 'Eğer vaktin olursa bize de uğra.',
  },
];

/* ------------------------------------------------------------------ */
/* Deyimler ve atasözleri                                              */
/* ------------------------------------------------------------------ */

export const IDIOMS: Idiom[] = [
  {
    id: 'eli-kulaginda',
    kind: 'deyim',
    text: 'eli kulağında',
    meaning: 'Neredeyse tamamlanmak veya gerçekleşmek üzere olan bir şey için kullanılır.',
    example: 'Raporun son hâli eli kulağında, yarın gönderebiliriz.',
  },
  {
    id: 'dereyi-gormeden',
    kind: 'deyim',
    text: 'dereyi görmeden paçaları sıvamak',
    meaning: 'Bir işe, sonucu belli olmadan önceden hazırlanmak.',
    example: 'Sonuç belli olmadan kutlama planlıyorsun, dereyi görmeden paçaları sıvama.',
  },
  {
    id: 'ates-pahasina',
    kind: 'deyim',
    text: 'ateş pahasına',
    meaning: 'Çok yüksek bir fiyata satılan veya alınan.',
    example: 'Kışın domates ateş pahasına satılıyordu.',
  },
  {
    id: 'icine-sinmemek',
    kind: 'deyim',
    text: 'içine sinmemek',
    meaning: 'Bir davranış ya da sonuçtan tam olarak memnun olmamak, vicdanen rahatsız olmak.',
    example: 'Ona öyle sert cevap vermek içine sinmedi.',
  },
  {
    id: 'goz-ardi-etmek',
    kind: 'deyim',
    text: 'göz ardı etmek',
    meaning: 'Bir şeyi önemsememek, dikkate almamak.',
    example: 'Uzmanların uyarılarını göz ardı etmemek gerekir.',
  },
  {
    id: 'kulak-asmamak',
    kind: 'deyim',
    text: 'kulak asmamak',
    meaning: 'Söylenene önem vermemek, dinlememek.',
    example: 'Dedikodulara kulak asmadan işine devam etti.',
  },
  {
    id: 'ipin-ucunu-kacirmak',
    kind: 'deyim',
    text: 'ipin ucunu kaçırmak',
    meaning: 'Bir işin veya durumun kontrolünü kaybetmek.',
    example: 'Proje büyüyünce ekip ipin ucunu kaçırdı.',
  },
  {
    id: 'bel-baglamak',
    kind: 'deyim',
    text: 'bel bağlamak',
    meaning: 'Bir kimseye veya şeye güvenip ona dayanmak, umut bağlamak.',
    example: 'Tek gelir kaynağı olarak bu işe bel bağlamıştı.',
  },
  {
    id: 'kas-yaparken-goz-cikarmak',
    kind: 'deyim',
    text: 'kaş yaparken göz çıkarmak',
    meaning: 'Bir şeyi düzeltmeye çalışırken durumu daha da kötüleştirmek.',
    example: 'Hatayı örtmeye çalışırken kaş yapayım derken göz çıkardı.',
  },
  {
    id: 'el-uzatmak',
    kind: 'deyim',
    text: 'el uzatmak',
    meaning: 'Yardım etmek, destek olmak.',
    example: 'Zor günlerinde ona kimse el uzatmadı.',
  },
  {
    id: 'goze-almak',
    kind: 'deyim',
    text: 'göze almak',
    meaning: 'Bir işin olası kötü sonuçlarını kabullenerek o işe girişmek.',
    example: 'Her şeyi göze alarak işini bırakıp kendi şirketini kurdu.',
  },
  {
    id: 'kili-kirk-yarmak',
    kind: 'deyim',
    text: 'kılı kırk yarmak',
    meaning: 'Bir konuyu ayrıntısına kadar didik didik incelemek, çok titiz davranmak.',
    example: 'Sözleşmeyi imzalamadan önce her maddesini kılı kırk yararak inceledi.',
  },
  {
    id: 'burnu-buyumek',
    kind: 'deyim',
    text: 'burnu büyümek',
    meaning: 'Başarısından dolayı kibirlenmek, gururlanmak.',
    example: 'Bir ödül aldı diye burnu büyüdü.',
  },
  {
    id: 'agzindan-kacirmak',
    kind: 'deyim',
    text: 'ağzından kaçırmak',
    meaning: 'İstemeden, farkında olmadan bir sırrı söylemek.',
    example: 'Sürpriz partiyi ağzından kaçırıp her şeyi mahvetti.',
  },
  {
    id: 'ates-olmayan-yer',
    kind: 'atasozu',
    text: 'Ateş olmayan yerden duman çıkmaz.',
    meaning: 'Bir söylenti ya da olayın arkasında genellikle gerçek bir sebep vardır.',
    example: 'Bunca kişi aynı şeyi söylüyorsa, ateş olmayan yerden duman çıkmaz.',
  },
  {
    id: 'damlaya-damlaya',
    kind: 'atasozu',
    text: 'Damlaya damlaya göl olur.',
    meaning: 'Küçük birikimler zamanla büyük bir bütün oluşturur.',
    example: 'Her ay az da olsa biriktirdi; damlaya damlaya göl olur demişti.',
  },
  {
    id: 'sakla-samani',
    kind: 'atasozu',
    text: 'Sakla samanı, gelir zamanı.',
    meaning: 'Şimdi işe yaramayan bir şey ileride gerekebilir, bu yüzden atılmamalıdır.',
    example: 'Eski kabloları hâlâ saklıyor; sakla samanı, gelir zamanı diyor.',
  },
  {
    id: 'acele-ise-seytan',
    kind: 'atasozu',
    text: 'Acele işe şeytan karışır.',
    meaning: 'Aceleyle yapılan işler genellikle hatalı sonuçlanır.',
    example: 'Raporu son dakikada aceleyle gönderdi ve hata çıktı; acele işe şeytan karışır.',
  },
  {
    id: 'bir-elin-nesi-var',
    kind: 'atasozu',
    text: 'Bir elin nesi var, iki elin sesi var.',
    meaning: 'İşler birlikte, yardımlaşarak yapılırsa daha kolay ve başarılı olur.',
    example: 'Taşınmayı tek başına değil arkadaşlarıyla birlikte yaptı; bir elin nesi var, iki elin sesi var.',
  },
  {
    id: 'korle-yatan',
    kind: 'atasozu',
    text: 'Körle yatan şaşı kalkar.',
    meaning: 'Kötü örneklerle birlikte olan kişi onların huylarından etkilenir.',
    example: 'Kötü arkadaşlarla vakit geçirmeye başlayınca o da aynı hatalara düşer oldu; körle yatan şaşı kalkar.',
  },
  {
    id: 'uzum-uzume-baka-baka',
    kind: 'atasozu',
    text: 'Üzüm üzüme baka baka kararır.',
    meaning: 'İnsan, çevresindekilerin davranışlarından ve alışkanlıklarından etkilenir.',
    example: 'Çalışkan bir sınıfa geçince onun da notları düzeldi; üzüm üzüme baka baka kararırmış.',
  },
  {
    id: 'ruzgar-eken',
    kind: 'atasozu',
    text: 'Rüzgâr eken fırtına biçer.',
    meaning: 'Kötülük yapan kişi, yaptığının bedelini daha büyük bir kötülükle öder.',
    example: 'Herkesi kırıp geçen yönetici, sonunda rüzgâr eken fırtına biçer misali yalnız kaldı.',
  },
];

/* ------------------------------------------------------------------ */
/* Deterministik seçim ve alıştırma üretimi                            */
/* ------------------------------------------------------------------ */

/** Deterministik sözde-rastgele üreteç (mulberry32) — aynı gün aynı seçenek sırası. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const rand = seededRandom(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Günün kelimeleri. Aynı gün her açılışta aynı sonucu verir; seviye ya da sayı değişince yeni seçim yapılır.
 *
 * `excludeIds` verilirse (ör. daha önce öğrenilmiş kelimeler) önce havuzun geri
 * kalanından seçim yapılır — yani gündelik liste öncelikle yeni kelimelerden
 * kurulur. Havuzun tazesi `count`'tan azsa eksik kalan yer, aynı tohumla
 * karıştırılmış havuzun geri kalanından (tekrar dahil) tamamlanır; havuzun
 * tamamı hariç tutulmuşsa liste baştan sona tekrardır.
 */
export function pickDailyWords(
  count: number,
  level?: LugatLevel,
  date: Date = new Date(),
  excludeIds?: ReadonlySet<string>,
): LugatWord[] {
  const pool = wordsForLevel(level);
  const source = pool.length > 0 ? pool : LUGAT_WORDS;
  const seed = dayIndex(date) + (level ? level.length * 101 : 0);
  const want = Math.min(Math.max(count, 0), source.length);
  const shuffled = seededShuffle(source, seed);

  if (!excludeIds || excludeIds.size === 0) {
    return shuffled.slice(0, want);
  }

  const fresh = shuffled.filter((w) => !excludeIds.has(w.id));
  if (fresh.length >= want) return fresh.slice(0, want);

  // Taze kelime havuzu isteneni karşılamıyor: kalan yer, aynı karıştırılmış
  // sıradan henüz seçilmemiş kelimelerle (tekrar dahil) dolduruluyor.
  const result = [...fresh];
  const chosenIds = new Set(fresh.map((w) => w.id));
  for (const w of shuffled) {
    if (result.length >= want) break;
    if (chosenIds.has(w.id)) continue;
    result.push(w);
    chosenIds.add(w.id);
  }
  return result;
}

/** Günün deyimi ya da atasözü. */
export function pickDailyIdiom(date: Date = new Date()): Idiom {
  return pickForDay(IDIOMS, date, 5);
}

export type MeaningQuestion = {
  word: LugatWord;
  options: { id: string; text: string }[];
  correctId: string;
};

/**
 * Hedef kelimelerden anlam sorusu üretir: her hedef için dört şık (kendisi +
 * üç çeldirici, öncelikle aynı seviyeden) ve tek doğru cevap.
 *
 * `buildMeaningQuiz` ve `buildLevelQuiz` aynı soru biçimini paylaşır; kopyala-
 * yapıştır olmasın diye üretim burada tek yerde.
 */
function buildMeaningQuestions(targets: LugatWord[], seed: number): MeaningQuestion[] {
  return targets.map((target, index) => {
    const sameLevel = LUGAT_WORDS.filter((w) => w.level === target.level && w.id !== target.id);
    const otherLevel = LUGAT_WORDS.filter((w) => w.level !== target.level);
    const distractors = [
      ...seededShuffle(sameLevel, seed + index * 31),
      ...seededShuffle(otherLevel, seed + index * 57),
    ].slice(0, 3);

    const options = seededShuffle([target, ...distractors], seed + index * 13).map((w) => ({
      id: w.id,
      text: w.short,
    }));

    return { word: target, options, correctId: target.id };
  });
}

/**
 * Anlam testi üretir: kelime gösterilir, dört anlam seçeneği sunulur.
 * Çeldiriciler öncelikle aynı seviyeden seçilir.
 */
export function buildMeaningQuiz(
  count: number,
  date: Date = new Date(),
  /**
   * Önce sorulacak kelimeler (aralıklı tekrarda sırası gelenler). Geçersiz ya da
   * bilinmeyen kimlikler sessizce atlanır; kalan yer günün karıştırmasından
   * tamamlanır, yani liste her zaman `count` uzunluğunda kalır.
   */
  preferIds: readonly string[] = [],
): MeaningQuestion[] {
  const seed = dayIndex(date);
  const total = Math.min(count, LUGAT_WORDS.length);
  const preferred = preferIds
    .map((id) => findWord(id))
    .filter((w): w is LugatWord => !!w)
    .slice(0, total);
  const chosen = new Set(preferred.map((w) => w.id));
  const rest = seededShuffle(LUGAT_WORDS, seed + 11).filter((w) => !chosen.has(w.id));
  const targets = [...preferred, ...rest].slice(0, total);
  return buildMeaningQuestions(targets, seed);
}

/**
 * Seviye tespit sınavı: temel/orta/ileri arasında dengeli dağılmış (round-
 * robin) hedef kelimelerle kurulan bir anlam testi (bkz. `buildMeaningQuestions`).
 *
 * `attempt` tohuma karışır: aynı gün "yeniden dene"nince (attempt artınca)
 * farklı sorular gelir, ama aynı (date, attempt) çifti her zaman aynı sonucu
 * verir — deterministik, kopyası yok.
 */
export function buildLevelQuiz(
  count: number,
  date: Date = new Date(),
  attempt = 0,
): MeaningQuestion[] {
  const seed = dayIndex(date) + attempt * 1009 + 211;
  const levels: LugatLevel[] = ['temel', 'orta', 'ileri'];
  const total = Math.min(count, LUGAT_WORDS.length);

  const perLevel: Record<LugatLevel, number> = { temel: 0, orta: 0, ileri: 0 };
  for (let i = 0; i < total; i += 1) perLevel[levels[i % levels.length]] += 1;

  let targets: LugatWord[] = [];
  const chosenIds = new Set<string>();
  levels.forEach((level, levelIndex) => {
    const pool = wordsForLevel(level);
    const want = Math.min(perLevel[level], pool.length);
    const picked = seededShuffle(pool, seed + levelIndex * 43 + 7).slice(0, want);
    picked.forEach((w) => chosenIds.add(w.id));
    targets = [...targets, ...picked];
  });

  // Bir seviyenin havuzu istenen sayıyı karşılamazsa (küçük `count` dışı uç
  // durum), eksik kalan yer henüz seçilmemiş kelimelerden tamamlanır — toplam
  // soru sayısı sabit kalır.
  if (targets.length < total) {
    const remaining = seededShuffle(
      LUGAT_WORDS.filter((w) => !chosenIds.has(w.id)),
      seed + 97,
    );
    for (const w of remaining) {
      if (targets.length >= total) break;
      targets.push(w);
    }
  }

  const ordered = seededShuffle(targets, seed + 3);
  return buildMeaningQuestions(ordered, seed + 500);
}

export type FillBlankQuestion = {
  word: LugatWord;
  /** Kelimenin geçtiği yer "_____" ile değiştirilmiş örnek cümle. */
  sentence: string;
  options: { id: string; text: string }[];
  correctId: string;
};

const TR_LETTER = /[a-zçğıiöşü]/i;

/** Örnek cümlede kelimenin (çekimli hâliyle de olsa) kelime sınırında geçtiği ilk yeri bulur. */
function findWordSpan(example: string, word: string): { start: number; end: number } | null {
  const lower = example.toLocaleLowerCase('tr');
  const needle = word.toLocaleLowerCase('tr');
  let from = 0;
  while (from <= lower.length - needle.length) {
    const idx = lower.indexOf(needle, from);
    if (idx === -1) return null;
    const before = idx === 0 ? ' ' : lower[idx - 1];
    if (!TR_LETTER.test(before)) {
      let end = idx + needle.length;
      while (end < lower.length && TR_LETTER.test(lower[end])) end += 1;
      return { start: idx, end };
    }
    from = idx + 1;
  }
  return null;
}

/**
 * Boşluk doldurma testi üretir: örnek cümlede kelime boş bırakılır, dört şık sunulur.
 * Örnek cümlede kelimenin kendisi (çekimli hâliyle de olsa) birebir geçmiyorsa
 * o kelime bu testte kullanılmaz.
 */
export function buildFillBlankQuiz(
  count: number,
  date: Date = new Date(),
  /** Önce sorulacak kelimeler; yalnızca bu teste uygun olanlar (örnek cümlesinde
   *  kelimesi geçenler) dikkate alınır. */
  preferIds: readonly string[] = [],
): FillBlankQuestion[] {
  const seed = dayIndex(date);
  const eligible = LUGAT_WORDS.filter((w) => findWordSpan(w.example, w.word) !== null);
  const source = eligible.length > 0 ? eligible : LUGAT_WORDS;
  const total = Math.min(count, source.length);
  const eligibleIds = new Set(source.map((w) => w.id));
  const preferred = preferIds
    .map((id) => findWord(id))
    .filter((w): w is LugatWord => !!w && eligibleIds.has(w.id))
    .slice(0, total);
  const chosen = new Set(preferred.map((w) => w.id));
  const rest = seededShuffle(source, seed + 19).filter((w) => !chosen.has(w.id));
  const targets = [...preferred, ...rest].slice(0, total);

  return targets.map((target, index) => {
    const span = findWordSpan(target.example, target.word);
    const sentence = span
      ? `${target.example.slice(0, span.start)}_____${target.example.slice(span.end)}`
      : target.example;

    const sameLevel = LUGAT_WORDS.filter((w) => w.level === target.level && w.id !== target.id);
    const otherLevel = LUGAT_WORDS.filter((w) => w.level !== target.level);
    const distractors = [
      ...seededShuffle(sameLevel, seed + index * 41),
      ...seededShuffle(otherLevel, seed + index * 53),
    ].slice(0, 3);

    const options = seededShuffle([target, ...distractors], seed + index * 17).map((w) => ({
      id: w.id,
      text: w.word,
    }));

    return { word: target, sentence, options, correctId: target.id };
  });
}
