import { pickForDay } from '../utils/dateUtils';
import type { DailyPracticeSettings, DailyTextSource } from '../utils/dailyPracticeSettings';

// Günün okuma metni.
// Metinler sesli okunmak üzere seçildi: her biri diyafram desteği isteyen uzunlukta,
// ve içinde tanınabilir belâgat sanatları barındırıyor. Böylece okuma hem diksiyon
// hem belâgat çalışması oluyor.
//
// Telif: yalnızca kamu malı (public domain) metinler, kısa meal/hadis aktarımları ve
// künyesinde "Fesahat için yazıldı" yazan özgün denemeler kullanıldı.
//
// Dinî metinler yalnızca `religiousMode` açıkken havuza girer (bkz. `availableTexts`).
// Dinî olmayan her metnin `comprehension.ts` içinde bir okuma seti bulunur.

export type DailyTextCategory = 'dini' | 'edebi' | 'hitabet' | 'felsefi';

export const CATEGORY_LABELS: Record<DailyTextCategory, string> = {
  dini: 'Dinî Metin',
  edebi: 'Edebî Metin',
  hitabet: 'Hitabet',
  felsefi: 'Felsefî / Düşünce',
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
      'Konuşmanın karşısına susmak konulur ve ikisi eşit derecede seçenek sayılır. Konuşmada bu, boşluğu doldurma dürtüsüne karşı doğrudan bir eğitimdir.',
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
  {
    id: 'dini-asr',
    category: 'dini',
    title: 'Zamana Yemin',
    source: 'Asr sûresi (meal)',
    text:
      'Zamana yemin olsun ki | insan gerçekten ziyandadır. | Ancak iman edip salih ameller işleyenler, | birbirlerine hakkı tavsiye edenler | ve birbirlerine sabrı tavsiye edenler hariç.',
    meaning:
      'Kısa bir sûrede dört şart sayılır: inanmak, iyi iş yapmak, hakkı birbirine hatırlatmak, sabrı birbirine hatırlatmak. Son ikisi topluluk içinde, yani sözle yapılan işlerdir.',
    belagatArtIds: ['icaz', 'kasr', 'tekrir'],
    readingFocus:
      'Yemin cümlesini tok ve yavaş, istisna sayımını ise tek bir sayma ritmiyle okuyun. Üç "tavsiye" arasında aynı süre durun.',
    approxSeconds: 30,
  },
  {
    id: 'dini-hucurat',
    category: 'dini',
    title: 'Tanışmak İçin Yaratıldık',
    source: 'Hucurât sûresi, 13 (meal)',
    text:
      'Ey insanlar! | Biz sizi bir erkekle bir dişiden yarattık | ve birbirinizle tanışasınız diye | sizi milletlere ve kabilelere ayırdık. | Allah katında en değerli olanınız, | O\'na karşı gelmekten en çok sakınanızdır.',
    meaning:
      'Farklılığın amacı üstünlük yarışı değil, tanışmadır. Ayet hitabını bütün insanlığa yöneltir ve değer ölçüsünü soy-sop değil, sorumluluk bilinci yapar.',
    belagatArtIds: ['insai-uslup', 'kasr', 'muktaza'],
    readingFocus:
      '"Ey insanlar!" hitabını geniş bir nefesle açın. "Tanışasınız diye" bölümünü vurgulayın; ayetin amaç cümlesi orasıdır.',
    approxSeconds: 35,
  },
  {
    id: 'dini-kolaylastirin',
    category: 'dini',
    title: 'Kolaylaştırın, Zorlaştırmayın',
    source: 'Hadîs-i şerîf (Buhârî, Müslim)',
    text:
      'Kolaylaştırın, zorlaştırmayın; | müjdeleyin, nefret ettirmeyin. | Güzel söz de sadakadır.',
    meaning:
      'İlk cümle iki zıt çifti art arda dizer: kolaylaştırmak-zorlaştırmak, müjdelemek-nefret ettirmek. Tebliğ ve öğretme işinde üslubun sonuçtan ayrılamayacağını anlatır.',
    belagatArtIds: ['tibak', 'icaz', 'mukabele'],
    readingFocus:
      'İki zıt çifti, zıtlık duyulsun diye farklı tonla okuyun: "kolaylaştırın" açık, "zorlaştırmayın" kapalı. Son cümleyi sıcak bir tonla bitirin.',
    approxSeconds: 20,
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
      'Kişinin aynası yaptığı iştir, sözüne bakılmaz; aklının derecesi ortaya koyduğu eserde görünür. Anlatılan her şeyin bir çıktıya bağlanması gerektiğinin en kısa ifadesi.',
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
      'Kendine iyi bak, çünkü âlemin özüsün; var olan her şeyin gözbebeği olan insansın. Kendine güvenin edebî ifadesi — söz almadan önce okunacak metin.',
    belagatArtIds: ['istiare', 'tesbih-belig', 'tekrir'],
    readingFocus:
      'Ağır ve geniş okuyun. Osmanlı Türkçesi kelimelerde hece atlamamak için önce yavaş bir tur yapın.',
    approxSeconds: 25,
  },
  {
    id: 'edebi-yunus-tanis',
    category: 'edebi',
    title: 'Tanış Olalım',
    source: 'Yunus Emre',
    text:
      'Gelin tanış olalım, | işi kolay kılalım, | sevelim sevilelim, | dünya kimseye kalmaz.',
    meaning:
      'Dünyanın geçiciliği karşısında önerilen şey kavga değil, tanışmak ve sevmektir. Dörtlük bunu davet kipiyle söyler: olalım, kılalım, sevelim.',
    belagatArtIds: ['seci', 'irsal-i-mesel'],
    readingFocus:
      'İlk üç dize çağıran, yumuşak bir tonla; son dize düşen ve sakin bir tonla. Dizelerin hece sayısı eşit, bu yüzden ritim kendiliğinden gelir.',
    approxSeconds: 15,
  },
  {
    id: 'edebi-yunus-gonul',
    category: 'edebi',
    title: 'Gönüller Yapmaya Geldim',
    source: 'Yunus Emre',
    text:
      'Ben gelmedim dava için, | benim işim sevi için. | Dostun evi gönüllerdir, | gönüller yapmaya geldim.',
    meaning:
      'Şair, kendi gelişini bir davayı kazanmak için değil, sevgi için anlatır. "Gönül yapmak" hem gönlü kazanmak hem de gönlü bir ev gibi onarmak demektir.',
    belagatArtIds: ['istiare', 'seci', 'tekrir'],
    readingFocus:
      '"Dava" ile "sevi" kelimelerini karşıt çift olarak vurgulayın. Son dizede "gönüller" kelimesi ilk dizedeki kadar yumuşak çıkmalı.',
    approxSeconds: 15,
  },
  {
    id: 'edebi-nedim-istanbul',
    category: 'edebi',
    title: 'Eşsiz Şehir',
    source: 'Nedim (18. yüzyıl)',
    text:
      'Bu şehr-i Sitanbul ki bî-misl ü behâdır, | bir sengine yekpâre Acem mülkü fedâdır.',
    meaning:
      'Bu İstanbul şehri eşsiz ve paha biçilmezdir; bir taşına bütün Acem ülkesi feda edilir. Şair, şehre duyduğu hayranlığı abartıyla anlatır.',
    belagatArtIds: ['mubalaga', 'seci'],
    readingFocus:
      'İki dize, iki geniş nefes. Dize sonlarındaki "behâdır / fedâdır" uyağını belirginleştirin ama şarkı söyler gibi sürüklemeyin.',
    approxSeconds: 15,
  },
  {
    id: 'edebi-sabah',
    category: 'edebi',
    title: 'Sabah Yürüyüşü',
    source: 'Fesahat için yazıldı',
    text:
      'Sabahın ilk saatinde sokak henüz uyanmamıştı. | Fırının önünde küçük bir kuyruk, | kaldırımda yıkanmış taşların serinliği vardı. | Köşedeki simitçi tezgâhını kurarken kendi kendine mırıldanıyordu; | sesi buharla birlikte yükseliyor ve havada eriyordu. | O an anladım ki şehir, bağırarak değil, | böyle usul usul uyanır.',
    belagatArtIds: ['teshis-intak', 'tesbih-belig', 'takdim-tehir'],
    readingFocus:
      'Sakin ve alçak bir tonda okuyun; betimleme cümlelerinde tempo yavaş, "O an anladım ki" kısmında bir an durun.',
    approxSeconds: 30,
  },
  {
    id: 'edebi-defter',
    category: 'edebi',
    title: 'Eski Bir Defter',
    source: 'Fesahat için yazıldı',
    text:
      'Dolabı toplarken eski bir defter buldum. | Kapağının köşeleri yıpranmıştı, | içindeki yazı ise dün yazılmış gibi taptazeydi. | Sayfaları çevirdikçe büyüyünce diye başlayan cümleler gördüm: | büyüyünce şunu yapacağım, büyüyünce bunu. | Çoğunu gerçekleştirmemiştim; | yine de hiçbirine acımadım. | Çünkü bir şeyi istemiş olmak, | onu yarım da olsa yola çıkarmış olmaktı.',
    belagatArtIds: ['tekrir', 'tesbih-belig', 'husn-i-talil'],
    readingFocus:
      '"Büyüyünce" tekrarlarını her seferinde biraz daha yumuşak söyleyin. Son cümlede ağırlığı "yola çıkarmış" üzerine verin.',
    approxSeconds: 35,
  },
  {
    id: 'edebi-kelime',
    category: 'edebi',
    title: 'Bir Kelimenin Ağırlığı',
    source: 'Fesahat için yazıldı',
    text:
      'Bazı kelimeler hafiftir, uçar gider. | Bazıları ise bir taş gibi, söylendiği yerde kalır. | Özür dilerim ikincilerdendir: | söylemesi iki saniye sürer, | söylemeyi göze almak ise bazen yıllar. | Bu yüzden onu söyleyen kişi | kendinden bir şey kaybetmez; | yalnızca omzundaki fazla yükü yere bırakır.',
    belagatArtIds: ['tesbih-belig', 'istiare', 'tibak'],
    readingFocus:
      '"Hafiftir" kelimesini hafif, "taş gibi" ifadesini ağır bir sesle okuyun; ses, anlamı taklit etsin.',
    approxSeconds: 30,
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
  {
    id: 'hitabet-sath-i-mudafaa',
    category: 'hitabet',
    title: 'Satıh Müdafaası',
    source: 'Mustafa Kemal Atatürk, 1921 (Sakarya Meydan Muharebesi öncesi)',
    text:
      'Hattı müdafaa yoktur, | sath-ı müdafaa vardır. | O satıh bütün vatandır. | Vatanın her karış toprağı, | vatandaşın kanıyla sulanmadıkça | terk olunamaz.',
    meaning:
      'Savunma tek bir çizgiye bağlı değildir; bütün ülke yüzeyi savunma alanıdır. Cümleler kısa ve hükümlüdür: yoktur-vardır karşıtlığı iddiayı tek hamlede kurar.',
    belagatArtIds: ['tibak', 'tekrir', 'icaz'],
    readingFocus:
      'İlk iki cümle kısa ve kesin; son cümle uzun. Uzun cümleyi tek nefeste "terk olunamaz" kelimesine kadar taşıyıp orada durun.',
    approxSeconds: 25,
  },
  {
    id: 'hitabet-mursit',
    category: 'hitabet',
    title: 'En Hakiki Mürşit',
    source: 'Mustafa Kemal Atatürk, 1924',
    text:
      'Hayatta en hakiki mürşit ilimdir, fendir. | İlim ve fennin dışında mürşit aramak | gaflettir, cahilliktir, dalâlettir.',
    meaning:
      'Önce olumlu hüküm verilir, sonra karşıtı üç kelimelik bir sıralamayla reddedilir. Üç kelimenin her biri bir öncekinden ağırdır.',
    belagatArtIds: ['kasr', 'tekrir', 'mubalaga'],
    readingFocus:
      '"Gaflettir, cahilliktir, dalâlettir" sıralamasını yükselen ağırlıkla okuyun; her kelime bir öncekinden biraz daha güçlü çıksın.',
    approxSeconds: 20,
  },
  {
    id: 'hitabet-acilis',
    category: 'hitabet',
    title: 'Bir Açılış Konuşması',
    source: 'Fesahat için yazıldı',
    text:
      'Değerli konuklar, sayın hocalarım, sevgili arkadaşlarım; | hepinizi saygıyla selamlıyorum. | Bugün burada toplanmamızın nedeni basit: | bir fikri birlikte düşünmek. | Konuşmamı üç bölüme ayırdım. | Önce sorunu anlatacağım, | sonra çözüm önerimi paylaşacağım, | en sonunda da sizden bir isteğim olacak. | Hazırsanız başlayalım.',
    belagatArtIds: ['icaz', 'fasl-vasl', 'muktaza'],
    readingFocus:
      'Hitap bölümünü dinleyicilere bakarak ve yavaş okuyun. Üç bölümü sayarken her biri için aynı süre bekleyin; plan, ritimle akılda kalır.',
    approxSeconds: 35,
  },
  {
    id: 'hitabet-tesekkur',
    category: 'hitabet',
    title: 'Teşekkür Konuşması',
    source: 'Fesahat için yazıldı',
    text:
      'Bu ödülü alırken | aslında yalnız olmadığımı bir kez daha anlıyorum. | Sabahın erken saatlerinde yanımda olan ekibime, | hatamı sabırla gösteren hocalarıma | ve yorulduğum her an bana devam et diyen ailemin her ferdine | teşekkür ederim. | Başarı tek bir elin değil, | birçok elin ortak işidir. | Bu yüzden bu ödülü onlarla paylaşıyorum.',
    belagatArtIds: ['tekrir', 'takid-manevi', 'mukabele'],
    readingFocus:
      'Teşekkür edilen üç grubu sayarken her birinde kısa bir duraklama yapın. "Teşekkür ederim" cümlesini ayrı bir nefesle, sıcak bir tonla söyleyin.',
    approxSeconds: 40,
  },
  {
    id: 'hitabet-toplanti',
    category: 'hitabet',
    title: 'Toplantıda Söz Almak',
    source: 'Fesahat için yazıldı',
    text:
      'Müsaadenizle bir noktayı eklemek istiyorum. | Az önce söylenen fikre katılıyorum, | fakat bir endişem var: | süre. | Bu işi iki haftada bitirmek mümkün görünmüyor. | Önerim şu: | önce küçük bir deneme yapalım, | sonuçları görelim, | sonra karar verelim. | Böylece hem zamanı hem emeği korumuş oluruz.',
    belagatArtIds: ['muktaza', 'icaz', 'fasl-vasl'],
    readingFocus:
      '"Süre." kelimesinden sonra bir saniye bekleyin; endişe tek kelimeye indirilmiş. "Önerim şu:" kısmını bir ton alçaltarak başlatın.',
    approxSeconds: 35,
  },
  {
    id: 'hitabet-kapanis',
    category: 'hitabet',
    title: 'Bir Kapanış Konuşması',
    source: 'Fesahat için yazıldı',
    text:
      'Sözlerimi bitirirken üç şeyi hatırlatmak istiyorum. | Birincisi, kısa konuşmak bazen en büyük saygıdır. | İkincisi, iyi dinleyen kişi iyi konuşmayı da öğrenir. | Üçüncüsü ise şu: | söz söylemek kadar, | söylenecek yerde susmak da bir beceridir. | Beni sabırla dinlediğiniz için teşekkür ederim.',
    belagatArtIds: ['icaz', 'tekrir', 'tibak'],
    readingFocus:
      'Üç maddeyi sayarken parmakla sayar gibi eşit aralık bırakın. Son maddeden önce biraz durun; ağırlık orada.',
    approxSeconds: 35,
  },
];

const FELSEFI: DailyText[] = [
  {
    id: 'felsefi-soru',
    category: 'felsefi',
    title: 'Soru Sormanın Cesareti',
    source: 'Fesahat için yazıldı',
    text:
      'Soru sormak, bilmediğini kabul etmektir; | bu yüzden çoğumuz sormaktan çekiniriz. | Oysa bilgi, çoğu zaman bilmediğini söyleyenin kapısını çalar. | Sorusuz bir insan huzurlu görünebilir, | ama huzuru, öğrenmediği şeylerin üzerine örtülmüş bir battaniyedir. | Cesur olan, bilmiyorum diyebilen; | bilge olan ise bu sözün ardından | öğrenmek isterim diyebilendir.',
    belagatArtIds: ['tesbih-belig', 'istiare', 'tibak'],
    readingFocus:
      'Düşünce yürüten bir metin: virgülden sonra ses alçalmasın, noktalı virgülde ise ses bir basamak düşsün. Son cümlede iki "diyebilen"i aynı tonda söyleyin.',
    approxSeconds: 40,
  },
  {
    id: 'felsefi-aliskanlik',
    category: 'felsefi',
    title: 'Alışkanlığın Sessiz Gücü',
    source: 'Fesahat için yazıldı',
    text:
      'Alışkanlıklar, gürültü çıkarmayan ustalardır. | Bir gün içinde bir şeyi değiştirmezler; | ama yüzlerce günün sonunda bizi biz yaparlar. | Her sabah erken kalkan kişi, | bir sabah erken kalktığı için değil, | binlerce sabahı erkenden başlattığı için farklıdır. | Bu yüzden büyük kararlardan çok, | küçük ve tekrar edilebilir adımlara güvenmek gerekir.',
    belagatArtIds: ['istiare', 'tekrir', 'takdim-tehir'],
    readingFocus:
      '"Bir sabah" ile "binlerce sabah" arasındaki karşıtlığı sesle gösterin: ilkini hızlı ve küçük, ikincisini geniş ve yavaş söyleyin.',
    approxSeconds: 40,
  },
  {
    id: 'felsefi-zaman',
    category: 'felsefi',
    title: 'Zamanı Harcamak',
    source: 'Fesahat için yazıldı',
    text:
      'Zaman, harcanmadan saklanamayan tek servettir. | Ne biriktirebiliriz ne de geri alabiliriz. | Dolayısıyla asıl soru, ne kadar zamanımız olduğu değil, | elimizdekini neye verdiğimizdir. | Bir saati kaygıya harcayan kişi, | o saatin bedelini ödemiş olur; | ama karşılığında hiçbir şey almış olmaz. | Zamanı değerli kılan şey, onunla yaptığımız tercihtir.',
    belagatArtIds: ['istiare', 'tibak', 'kasr'],
    readingFocus:
      'Paradoksla başlayan ilk cümleyi yavaş okuyun. "Değil," kelimesinden sonra kısa bir bekleme, sonra "elimizdekini" ile yeni bir yönelişe girin.',
    approxSeconds: 40,
  },
  {
    id: 'felsefi-dinlemek',
    category: 'felsefi',
    title: 'Dinlemek de Konuşmaktır',
    source: 'Fesahat için yazıldı',
    text:
      'Dinlemek, susmak değildir. | Susan kişi sırasını bekler; | dinleyen kişi ise karşısındakinin dünyasına girmeye çalışır. | Kulak sözü alır, | ama anlam ancak dikkatle yerini bulur. | Bir insana bütün dikkatini veren kişi | ona sunabileceği en nadir armağanı vermiş olur. | Çünkü dikkat, her yere dağıtılamayacak kadar değerli bir şeydir.',
    belagatArtIds: ['tibak', 'mukabele', 'istiare'],
    readingFocus:
      '"Susmak" ve "dinlemek" kelimelerini farklı tonlayın. "Armağan" kelimesinden önce bir an durun; metnin ağırlığı oraya biner.',
    approxSeconds: 40,
  },
  {
    id: 'felsefi-yanilgi',
    category: 'felsefi',
    title: 'Yanılmanın Payı',
    source: 'Fesahat için yazıldı',
    text:
      'Yanılmak utanılacak bir şey değildir; | utanç, yanıldığını gördükten sonra aynı yolda ısrar etmektir. | Her yanlış, doğruya giden yolda bir tabela gibidir: | burası değil, diye bildirir. | Hiç yanılmayan kişi ya hiç denememiştir | ya da yanılgısını görecek cesareti bulamamıştır. | Bu yüzden iyi düşünmenin ilk koşulu, | kendi fikrimize bile şüpheyle bakabilmektir.',
    belagatArtIds: ['tesbih-belig', 'tibak', 'tekrir'],
    readingFocus:
      'İki "yanıl-" kökünü farklı ağırlıkla söyleyin. İki seçenekli cümlede ("ya hiç … ya da …") iki yarı arasına eşit bir bekleme koyun.',
    approxSeconds: 40,
  },
  {
    id: 'felsefi-sadelik',
    category: 'felsefi',
    title: 'Sadelik',
    source: 'Fesahat için yazıldı',
    text:
      'Sade olmak, az bilmek demek değildir; | çok bilen, bildiğini en az sözle anlatabilen kişidir. | Karmaşık bir cümle çoğu zaman karmaşık bir düşüncenin değil, | henüz olgunlaşmamış bir düşüncenin belirtisidir. | Bir fikri tek cümleyle söyleyemiyorsak, | belki de onu daha tam anlamamışızdır. | Sadelik, düşüncenin kolay değil, olgun hâlidir.',
    belagatArtIds: ['icaz', 'kasr', 'tibak'],
    readingFocus:
      'Cümleler uzayıp kısalıyor; son cümle en kısa. Onu tek nefeste ve belirgin bir düşüşle bitirin. Sadelik metninde süsten kaçının.',
    approxSeconds: 35,
  },
  {
    id: 'felsefi-elde',
    category: 'felsefi',
    title: 'Elimizde Olan ve Olmayan',
    source: 'Fesahat için yazıldı',
    text:
      'Yaşadığımız olayların bir kısmı bizim elimizde, bir kısmı değildir. | Havayı, başkalarının ne düşündüğünü, | geçmişte olanı değiştiremeyiz. | Ama bunlara nasıl karşılık vereceğimiz bize aittir. | Elinde olmayan şeyler için öfkelenen kişi, | gücünü sonuç vermeyecek bir yere harcar. | Elinde olana odaklanan kişi ise | hem daha sakin hem daha etkili olur.',
    belagatArtIds: ['tibak', 'mukabele', 'takdim-tehir'],
    readingFocus:
      'Sayma cümlesinde ("havayı, başkalarının…, geçmişte olanı") üç öğeyi eşit ağırlıkla sayın. "Bize aittir" ifadesini sakin ama kesin okuyun.',
    approxSeconds: 40,
  },
  {
    id: 'felsefi-merak',
    category: 'felsefi',
    title: 'Merak',
    source: 'Fesahat için yazıldı',
    text:
      'Merak, cevabı bilmenin değil, aramanın heyecanıdır. | Çocuklar bunu iyi bilir: | bir soruya verilen cevap, onlar için yeni üç sorunun kapısıdır. | Büyüdükçe cevaplara alışır, | sorulardan uzaklaşırız. | Oysa dünya, bildiklerimizden çok | bilmediklerimizle genişler. | Meraklı kalmak, içimizdeki çocuğu | ihtiyarlamaktan korumanın yoludur.',
    belagatArtIds: ['istiare', 'tibak', 'takdim-tehir'],
    readingFocus:
      '"Bilmenin değil, aramanın" karşıtlığını ses yüksekliğiyle gösterin. İlk cümleyi hafif bir gülümsemeyle okumak tonu canlandırır.',
    approxSeconds: 40,
  },
];

export const ALL_DAILY_TEXTS: DailyText[] = [...DINI, ...EDEBI, ...HITABET, ...FELSEFI];

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
      pool = allowReligious
        ? byCategory('dini')
        : [...byCategory('edebi'), ...byCategory('hitabet'), ...byCategory('felsefi')];
      break;
    case 'edebi':
      pool = byCategory('edebi');
      break;
    case 'hitabet':
      pool = byCategory('hitabet');
      break;
    case 'felsefi':
      pool = byCategory('felsefi');
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
