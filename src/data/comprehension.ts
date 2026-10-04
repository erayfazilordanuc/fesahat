import { pickForDay } from '../utils/dateUtils';
import { findDailyText, plainText } from './dailyTexts';
import type { QuizQuestion, QuizSet, QuizSkill } from './quiz';

// Anlayış ayağının içerik verisi: okuma, dinleme ve özetleme.
//
// - Okuma setleri günün metinlerine bağlıdır (`dailyTextId`); dinî olmayan her
//   günün metninin bir seti vardır. Dinî metinler için set yazılmaz.
// - Dinleme setleri cihaz sesiyle okunur (expo-speech): kısaltma, rakam, parantez
//   ve tırnak bilerek az tutuldu; sayılar yazıyla yazıldı.
// - Özetleme alıştırmasında tek doğru yoktur: kullanıcı özetini yazar, ardından
//   anahtar kavram listesiyle kendini değerlendirir (KARARLAR → otomatik kontrol
//   ile öz-değerlendirme ayrımı). Yapay zekâ açıkken geri bildirim ayrıca gelir.
//
// Soru yazım kuralı: tek savunulabilir doğru cevap; çeldiriciler makul ama açıkça
// yanlış; `explanation` cevabın metindeki dayanağını söyler.

/**
 * Doğru seçeneği ve çeldiricileri alıp `QuizQuestion` üretir. Doğru seçeneğin
 * yeri, soru kimliğinden türetilen sabit bir sayıyla belirlenir: böylece cevap
 * hep ilk seçenekte durmaz, ama her açılışta aynı yerde olur.
 */
function q(
  id: string,
  skill: QuizSkill,
  prompt: string,
  correct: string,
  wrong: [string, string, string] | [string, string],
  explanation: string,
): QuizQuestion {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 9973;
  }
  const answerIndex = hash % (wrong.length + 1);
  const options = [...wrong];
  options.splice(answerIndex, 0, correct);
  return { id, prompt, options, answerIndex, explanation, skill };
}

/* ------------------------------------------------------------------ */
/* Okuduğunu anlama — günün metinleri                                  */
/* ------------------------------------------------------------------ */

type ReadingDraft = {
  /** `dailyTexts.ts` içindeki metin kimliği. */
  textId: string;
  questions: QuizQuestion[];
};

const READING_DRAFTS: ReadingDraft[] = [
  // ---- Edebî ----
  {
    textId: 'edebi-yunus',
    questions: [
      q('q1', 'ana-fikir', 'Dörtlüğün ana düşüncesi hangisidir?',
        'Söz, hem yıkıcı hem yapıcı olabilen büyük bir güçtür.',
        ['Savaş her sorunun en iyi çözümüdür.', 'Sözün insanlar üzerinde hiçbir etkisi yoktur.', 'Bal ile yağ sofranın en değerli yiyecekleridir.'],
        'Şair sözün savaşı bitirebileceğini, baş kestirebileceğini, zehri bile baldan tatlıya çevirebileceğini söyler; yani söz iki yönde de güçlüdür.'),
      q('q2', 'kelime-baglam', 'Dörtlükteki "ağulu aş" ifadesi ne anlama gelir?',
        'Zehirli yemek',
        ['Tatlı yemek', 'Bayat ekmek', 'Misafir sofrası'],
        '"Ağu" zehir, "aş" yemek demektir. Üçüncü dizede söz, zehirli yemeği bal ile yağa çevirebilen bir güç olarak anılır.'),
      q('q3', 'cikarim', 'Dörtlüğe göre aynı araç nasıl hem savaşı bitirebilir hem baş kestirebilir?',
        'Söz doğru kullanılırsa barıştırır, yanlış kullanılırsa felakete yol açar.',
        ['Söz yalnızca güçlü kişiler tarafından kullanılırsa etkili olur.', 'Söz her zaman bir savaşın sonucunu değiştirir.', 'Söz ancak yazıya dökülürse etkili olur.'],
        'İlk iki dizede sözün sonucu iki zıt yönde verilir (savaşı kesmek, baş kestirmek); bu, aynı aracın nasıl kullanıldığına göre sonuç değiştirdiğini gösterir.'),
    ],
  },
  {
    textId: 'edebi-ziya-pasa',
    questions: [
      q('q1', 'ana-fikir', 'Dizelerin ana düşüncesi hangisidir?',
        'Kişinin değeri sözüyle değil, yaptığı işle anlaşılır.',
        ['Söz söylemek her zaman tehlikelidir.', 'Rütbe ne kadar yüksekse akıl da o kadar yüksektir.', 'Eser vermek için önce çok konuşmak gerekir.'],
        'İlk dize kişinin aynasının iş olduğunu, ikinci dize aklının derecesinin eserinde göründüğünü söyler.'),
      q('q2', 'kelime-baglam', '"Rütbe-i akıl" ifadesi ne demektir?',
        'Aklın derecesi',
        ['Askerî rütbe', 'Aklın yaşı', 'Akıl hastalığı'],
        '"Rütbe" derece, "akıl" zekâ ve muhakeme anlamındadır; ikinci dizede aklın derecesinin eserde göründüğü söylenir.'),
      q('q3', 'cikarim', 'Bu dizelere göre bir insanı değerlendirirken en güvenilir ölçü hangisidir?',
        'Ortaya koyduğu iş ve eser',
        ['Güzel konuşması', 'Unvanı', 'Çok söz söylemesi'],
        '"Lafa bakılmaz" denildiği için konuşma ölçü değildir; ölçü, kişinin eseridir.'),
    ],
  },
  {
    textId: 'edebi-fuzuli',
    questions: [
      q('q1', 'ana-fikir', 'Beytin ana düşüncesi hangisidir?',
        'Âlemde asıl olan aşktır; ilim ise yalnızca söz kalabalığı gibi görülür.',
        ['İlim, aşktan daha üstün bir değerdir.', 'Dünyadaki her şey geçici ve değersizdir.', 'Aşk kısa süren bir heves olduğundan değersizdir.'],
        'İlk dize her şeyin aşk olduğunu söyler; ikinci dize ilmi "kîl ü kâl" yani boş laf kalabalığı olarak niteler.'),
      q('q2', 'kelime-baglam', '"Kîl ü kâl" ifadesi bu beyitte ne anlama gelir?',
        'Boş söz, laf kalabalığı',
        ['Büyük başarı', 'Derin sessizlik', 'Güzel şiir'],
        '"Kîl ü kâl" dedikodu, boş söz demektir. Şair, ilmi aşkın yanında bu kadar küçük görür.'),
      q('q3', 'cikarim', '"Ancak" sözü ikinci dizede ne işe yarar?',
        'İlmi yalnızca "boş söz" olarak sınırlar.',
        ['Zaman bildirir.', 'Soru sorar.', 'Şüphe ekler.'],
        '"Ancak", hükmü tek bir şeye bağlar: ilim yalnızca kîl ü kâldır. Bu sınırlama beytin iddiasını kuvvetlendirir.'),
    ],
  },
  {
    textId: 'edebi-seyh-galib',
    questions: [
      q('q1', 'ana-fikir', 'Beytin ana düşüncesi hangisidir?',
        'İnsan evrenin özüdür; bu yüzden kendine değer vermelidir.',
        ['İnsan evrenin en küçük parçasıdır ve kibirlenmemelidir.', 'Evren insana ihtiyaç duymadan da yaşar.', 'İnsan ancak başkalarına bakarak değer kazanır.'],
        'Şair, "zübde-i âlem" (âlemin özü) ve "merdüm-i dîde-i ekvân" (varlığın gözbebeği) diyerek insanı çok değerli bir yere koyar.'),
      q('q2', 'kelime-baglam', '"Zübde" sözü bu beyitte ne anlama gelir?',
        'Öz, seçkin kısım',
        ['Kabuk', 'Ağırlık', 'Gürültü'],
        '"Zübde-i âlem", âlemin özü, en seçkin parçası demektir.'),
      q('q3', 'yazar-tutumu', 'Şairin okuyucuya yaklaşımı nasıldır?',
        'Değer veren ve özgüven aşılayan',
        ['Küçümseyen', 'Korkutan', 'Alaycı'],
        '"Hoşça bak zâtına" diye başlayan beyit, okuyucuyu kendine değer vermeye çağırır; ton cesaret verici ve över niteliktedir.'),
    ],
  },
  {
    textId: 'edebi-yunus-tanis',
    questions: [
      q('q1', 'ana-fikir', 'Dörtlüğün ana düşüncesi hangisidir?',
        'Dünya geçici olduğuna göre insanlar tanışmalı, birbirini sevmeli ve işleri kolaylaştırmalıdır.',
        ['Dünya nimetlerinden tamamen uzak durmak gerekir.', 'Kimseye güvenilmemelidir.', 'Tanışmak için önce zengin olmak gerekir.'],
        'Son dizedeki "dünya kimseye kalmaz" sözü, önceki üç dizedeki davetin (tanışmak, kolaylaştırmak, sevmek) gerekçesidir.'),
      q('q2', 'kelime-baglam', '"İşi kolay kılalım" ifadesi neyi anlatır?',
        'Birbirimizin işini zorlaştırmak yerine kolaylaştıralım.',
        ['Hiç çalışmayalım.', 'İşleri başkasına bırakalım.', 'İşleri aceleyle bitirelim.'],
        '"Kolay kılmak", işi kolaylaştırmak demektir. İfade, ortak yaşamda birbirine yük olmamayı anlatır.'),
      q('q3', 'cikarim', 'Son dize ("dünya kimseye kalmaz") öncekilere nasıl bağlanır?',
        'Tanışmayı ve sevmeyi ertelememek için gerekçe oluşturur.',
        ['Önceki dizelerle çelişir.', 'Dünyayı kazanmanın yolunu gösterir.', 'Sevginin işe yaramadığını söyler.'],
        'Dünya kimseye kalmayacağına göre geç kalmadan tanışmak ve sevmek gerekir; son dize davetin nedenidir.'),
    ],
  },
  {
    textId: 'edebi-yunus-gonul',
    questions: [
      q('q1', 'ana-fikir', 'Şair kendi gelişini nasıl açıklıyor?',
        'Tartışmak için değil, sevgi için ve gönüller kazanmak için geldiğini söyler.',
        ['Bir davayı kazanmak için geldiğini söyler.', 'Dostların evlerini yapmak için geldiğini söyler.', 'İnsanları yönetmek için geldiğini söyler.'],
        'Şair, "dava için gelmedim, işim sevi için" der ve son dizede "gönüller yapmaya geldim" diyerek amacını belirtir.'),
      q('q2', 'kelime-baglam', '"Dostun evi gönüllerdir" dizesinde "ev" sözü hangi anlamda kullanılmıştır?',
        'Gönül, dostun asıl yaşadığı yer olarak anılır (mecaz).',
        ['Gerçek bir konut', 'Bir ticaret yeri', 'Bir mezarlık'],
        'Dostun evinin "gönüller" olduğu söylendiği için "ev" sözü gerçek anlamında değil, mecaz olarak kullanılmıştır.'),
      q('q3', 'cikarim', 'Şairin "dava" yerine "sevi" kelimesini öne çıkarmasından ne anlaşılır?',
        'Üstünlük kurmaktan çok yakınlık kurmayı önemsediği',
        ['Hukuk davalarıyla ilgilendiği', 'Sevgiyi işe yaramaz bulduğu', 'Kimseyle konuşmak istemediği'],
        '"Dava" tartışma ve çekişme çağrışımı taşır; şair onun karşısına "sevi"yi koyarak sevgiyi ve yakınlığı seçtiğini gösterir.'),
    ],
  },
  {
    textId: 'edebi-nedim-istanbul',
    questions: [
      q('q1', 'ana-fikir', 'Beytin ana düşüncesi hangisidir?',
        'İstanbul eşsizdir; en küçük parçası bile çok değerlidir.',
        ['İran, İstanbul\'dan daha güzeldir.', 'İstanbul\'un savunması çok güçlüdür.', 'İstanbul\'da taş ocakları çok verimlidir.'],
        'İlk dize şehri "bî-misl ü behâ" (eşsiz, paha biçilmez) diye över; ikinci dize bir taşına bütün bir ülkenin feda edileceğini söyler.'),
      q('q2', 'kelime-baglam', '"Bî-misl" sözü ne demektir?',
        'Benzeri olmayan',
        ['Çok eski', 'Çok kalabalık', 'Yeni kurulmuş'],
        '"Bî" "-sız" anlamındadır, "misl" benzer demektir. "Bî-misl", benzeri bulunmayan demektir.'),
      q('q3', 'cikarim', '"Bir sengine yekpâre Acem mülkü fedâdır" sözüyle şair ne anlatmak ister?',
        'İstanbul\'un en küçük parçasının bile çok büyük bir değer taşıdığını',
        ['İran ile İstanbul arasında gerçek bir takas önerildiğini', 'İstanbul\'un taşlarının satıldığını', 'İran\'ın savaşta yenildiğini'],
        'Bir taşa koca bir ülkeyi feda etmek gerçek bir teklif değil, abartıdır; şair bu abartıyla şehre hayranlığını gösterir.'),
    ],
  },
  {
    textId: 'edebi-sabah',
    questions: [
      q('q1', 'ana-fikir', 'Metnin anlattığı ana şey hangisidir?',
        'Şehrin sabahları sakin ve yavaş bir biçimde uyanması',
        ['Fırınlardaki uzun kuyruklar', 'Simitçinin geçim sıkıntısı', 'Kaldırımların yıkanma yöntemi'],
        'Anlatıcı sonda şehrin "bağırarak değil, usul usul" uyandığını söyler; bütün betimlemeler bu sakin uyanışı gösterir.'),
      q('q2', 'ayrinti', 'Metne göre simitçi tezgâhını kurarken ne yapıyordu?',
        'Kendi kendine mırıldanıyordu.',
        ['Müşterilerle sohbet ediyordu.', 'Fırının önünde kuyruğa girmişti.', 'Kaldırımı yıkıyordu.'],
        'Metinde "tezgâhını kurarken kendi kendine mırıldanıyordu" denir.'),
      q('q3', 'yazar-tutumu', 'Anlatıcının sabah sessizliğine bakışı nasıldır?',
        'Sessizliği fark eden ve beğenen bir bakış',
        ['Gürültüden şikâyet eden bir bakış', 'Kayıtsız bir bakış', 'Öfkeli bir bakış'],
        '"O an anladım ki şehir… usul usul uyanır" cümlesi, anlatıcının sakin uyanışı fark ettiğini ve değer verdiğini gösterir.'),
    ],
  },
  {
    textId: 'edebi-defter',
    questions: [
      q('q1', 'ayrinti', 'Metne göre defterin hangi yönü eskimemişti?',
        'İçindeki yazı',
        ['Kapağının köşeleri', 'Kâğıtlarının rengi', 'Sayfa sayısı'],
        'Metinde kapağın köşelerinin yıpranmış, içindeki yazının ise "dün yazılmış gibi taptaze" olduğu söylenir.'),
      q('q2', 'yazar-tutumu', 'Anlatıcı gerçekleştiremediği hayallerine karşı nasıl bir tutum taşıyor?',
        'Pişmanlık duymadan, onlara değer vererek bakıyor.',
        ['Kendini sürekli suçluyor.', 'Defteri atmaya karar veriyor.', 'Hepsini hemen yeniden denemek istiyor.'],
        '"Hiçbirine acımadım" der; çünkü bir şeyi istemiş olmayı onu yarım da olsa yola çıkarmak sayar.'),
      q('q3', 'kelime-baglam', '"Taptaze" sözü metinde hangi anlamda kullanılmıştır?',
        'Yeni yazılmış gibi canlı',
        ['Çok eski ve silik', 'Hiç okunamayacak durumda', 'Yırtılmış'],
        'Yazının "dün yazılmış gibi" olduğu belirtildiği için "taptaze", yazının eskimemiş, canlı görünmesini anlatır.'),
    ],
  },
  {
    textId: 'edebi-kelime',
    questions: [
      q('q1', 'ana-fikir', 'Metne göre özür dilemek nasıl bir davranıştır?',
        'Söylemesi zor görünse de insanı hafifleten bir davranıştır.',
        ['Kişinin saygınlığını azaltan bir davranıştır.', 'Yalnızca resmî durumlarda gereklidir.', 'Zaman kaybettiren bir davranıştır.'],
        'Metin, özür dileyenin bir şey kaybetmediğini, yalnızca omzundaki fazla yükü bıraktığını söyler.'),
      q('q2', 'ayrinti', 'Metne göre "özür dilerim" sözünü söylemek ne kadar sürer?',
        'İki saniye',
        ['Bir dakika', 'Birkaç saat', 'Yıllar'],
        'Metinde "söylemesi iki saniye sürer" denir; yıllar süren şey, söylemeyi göze almaktır.'),
      q('q3', 'kelime-baglam', '"Omzundaki fazla yükü yere bırakır" ifadesi neyi anlatır?',
        'Duygusal ya da vicdani bir yükten kurtulmayı',
        ['Fiziksel bir eşyayı bırakmayı', 'Sorumluluktan kaçmayı', 'Başkasına yük olmayı'],
        'Özür dileyen kişinin "kendinden bir şey kaybetmediği" söylendiği için ifade mecazdır; içindeki yükün hafiflemesini anlatır.'),
    ],
  },

  // ---- Hitabet ----
  {
    textId: 'hitabet-genclige-hitabe',
    questions: [
      q('q1', 'ayrinti', 'Metne göre Türk gençliğinin birinci vazifesi nedir?',
        'Türk istiklâlini ve Cumhuriyet\'i ilelebet korumak ve savunmak',
        ['Okuyup yurt dışına gitmek', 'Ticaret yapmak', 'Gelenekleri değiştirmek'],
        'Metin, birinci vazifenin istiklâli ve Cumhuriyet\'i "ilelebet muhafaza ve müdafaa etmek" olduğunu söyler.'),
      q('q2', 'kelime-baglam', '"Yegâne" sözü metinde ne anlama gelir?',
        'Tek, biricik',
        ['En eski', 'En büyük', 'Her türlü'],
        '"Mevcudiyetinin ve istikbalinin yegâne temeli" ifadesi, başka temel olmadığını, bunun tek temel olduğunu anlatır.'),
      q('q3', 'yazar-tutumu', 'Konuşmacının gençliğe karşı tavrı nasıldır?',
        'Görev yükleyen, güvenen ve doğrudan hitap eden',
        ['Uzak ve ilgisiz', 'Alaycı', 'Çekingen ve belirsiz'],
        '"Ey Türk gençliği!" diye doğrudan seslenir ve ona en kıymetli hazinenin korunmasını emanet eder.'),
    ],
  },
  {
    textId: 'hitabet-nutuk',
    questions: [
      q('q1', 'ayrinti', 'Konuşmacı Samsun\'a hangi tarihte çıktığını söyler?',
        '19 Mayıs 1919',
        ['23 Nisan 1920', '30 Ağustos 1922', '29 Ekim 1923'],
        'İlk cümle "1919 senesi Mayısının 19\'uncu günü Samsun\'a çıktım" der.'),
      q('q2', 'yazar-tutumu', 'Konuşmacı girişte nasıl bir anlatım benimser?',
        'Yorumdan çok durum tespitine dayanan, sakin ve nesnel bir anlatım',
        ['Duygusal ve coşkun bir anlatım', 'Alaycı bir anlatım', 'Belirsiz ve kararsız bir anlatım'],
        'Metin yorum katmadan tarihi ve durumu sıralar: Osmanlı mağlûp olmuş, ordu zedelenmiş, ağır bir ateşkes imzalanmış.'),
      q('q3', 'kelime-baglam', '"Mütarekename" sözü metinde ne anlama gelir?',
        'Savaşı durduran ateşkes antlaşması belgesi',
        ['Barış kutlaması', 'Yeni bir anayasa', 'Ordu düzenleme emri'],
        'Mütareke, savaşa ara verilmesi demektir; "mütarekename" bu anlaşmanın yazılı belgesidir. Metin, onun ağır şartlı olduğunu söyler.'),
    ],
  },
  {
    textId: 'hitabet-canakkale',
    questions: [
      q('q1', 'ana-fikir', 'Dizelerin ana düşüncesi hangisidir?',
        'Çanakkale\'deki savaşın eşsiz büyüklüğü ve ufak bir kara parçasına yönelen büyük güç',
        ['Boğaz\'ın ticaret yolu olarak önemi', 'Donanmaların barış görüşmeleri', 'Marmara\'nın iklim özellikleri'],
        'Şair savaşın dünyada eşi olmadığını söyler ve çok sayıda donanmanın ufacık bir karaya saldırdığını anlatır.'),
      q('q2', 'kelime-baglam', '"Kesîf" sözü bu dizelerde ne anlama gelir?',
        'Yoğun, kalabalık',
        ['Zayıf', 'Gizli', 'Eski'],
        '"En kesîf orduların yükleniyor dördü beşi" dizesi, çok kalabalık orduların saldırdığını anlatır.'),
      q('q3', 'cikarim', '"Kaç donanmayla sarılmış ufacık bir karaya" dizesi neyi vurgular?',
        'Güçler arasındaki büyük orantısızlığı',
        ['Karanın savunmasının çok kolay olduğunu', 'Donanmaların sayıca az olduğunu', 'Karada hiç asker bulunmadığını'],
        'Çok sayıda donanma ile "ufacık" bir kara karşı karşıya konduğu için dizenin vurgusu aradaki orantısızlıktır.'),
    ],
  },
  {
    textId: 'hitabet-istiklal',
    questions: [
      q('q1', 'ana-fikir', 'Dörtlüğün ana düşüncesi hangisidir?',
        'Bayrağın ve yurdun sönmeyeceğine duyulan güven ve onun millete ait olduğu',
        ['Şafağın güzelliğinin anlatılması', 'Yaklaşan bir tehlike karşısındaki korku', 'Ocak yakmanın yöntemleri'],
        'Şair "Korkma" diyerek başlar ve bayrağın sönmeyeceğini, milletin yıldızı olarak parlayacağını söyler.'),
      q('q2', 'kelime-baglam', 'Son dizedeki "ancak" sözü hangi anlamda kullanılmıştır?',
        'Yalnızca',
        ['Güçlükle', 'Daha sonra', 'Belki'],
        '"O benimdir, o benim milletimindir ancak" dizesinde bayrağın yalnızca millete ait olduğu vurgulanır.'),
      q('q3', 'yazar-tutumu', 'Şair ilk dizede "Korkma" diyerek okuyucuya nasıl yaklaşır?',
        'Cesaret verir; korkunun yersiz olduğunu söyler.',
        ['Tehdit eder.', 'Alay eder.', 'Kayıtsız kalır.'],
        '"Korkma, sönmez" ifadesi bir uyarı değil, güven verme çağrısıdır.'),
    ],
  },
  {
    textId: 'hitabet-sath-i-mudafaa',
    questions: [
      q('q1', 'ana-fikir', 'Metnin ana düşüncesi hangisidir?',
        'Savunma tek bir çizgide değil, bütün vatan yüzeyinde yapılır.',
        ['Savunma hatları güçlendirilmelidir.', 'Toprak pazarlıkla elde edilebilir.', 'Savaş kısa sürede bitecektir.'],
        'Konuşmacı, hat savunmasının bulunmadığını, savunma yüzeyinin bütün vatan olduğunu söyler.'),
      q('q2', 'kelime-baglam', '"Satıh" sözü bu bağlamda ne anlama gelir?',
        'Yüzey, yani geniş alan',
        ['Yüksek tepe', 'Sınır çizgisi', 'Cephane deposu'],
        '"Hat" çizgiyi, "satıh" ise yüzeyi karşılar; konuşmacı çizgi yerine bütün alanı savunmaktan söz eder.'),
      q('q3', 'cikarim', '"Vatanın her karış toprağı vatandaşın kanıyla sulanmadıkça terk olunamaz" sözü neyi vurgular?',
        'Vatanın her parçası için sonuna kadar mücadele edilmesi gerektiğini',
        ['Toprakların kolayca bırakılabileceğini', 'Tarımda sulamanın önemini', 'Savaşın çok kısa süreceğini'],
        'Toprağın ancak büyük bir bedelle terk edilebileceği söylenerek ona verilen değer ve direnme kararlılığı anlatılır.'),
    ],
  },
  {
    textId: 'hitabet-mursit',
    questions: [
      q('q1', 'ana-fikir', 'Metnin ana düşüncesi hangisidir?',
        'Hayatta doğru yolu gösteren en güvenilir rehber bilimdir.',
        ['Yaşlıların sözü her zaman doğrudur.', 'Bilim yetersiz kaldığında başka yollara başvurulmalıdır.', 'Fen yalnızca sanayiyi ilgilendirir.'],
        'Konuşmacı ilim ve fenni "en hakiki mürşit" ilan eder ve onun dışında rehber aramayı doğrudan reddeder.'),
      q('q2', 'kelime-baglam', '"Mürşit" sözü bu cümlede ne anlama gelir?',
        'Yol gösterici, rehber',
        ['Öğrenci', 'Hükümdar', 'Tüccar'],
        '"Mürşit", doğru yolu gösteren kişi demektir; cümlede ilim ve fen bu rolde anılır.'),
      q('q3', 'yazar-tutumu', 'Konuşmacı, ilim ve fennin dışında rehber aramaya karşı nasıl bir tavır alır?',
        'Sert biçimde eleştirir; bunu gaflet ve cahillik sayar.',
        ['Hoşgörüyle karşılar.', 'Tavsiye eder.', 'Tarafsız kalır.'],
        '"Gaflettir, cahilliktir, dalâlettir" diye üç kelimeyle ve artan bir sertlikle bu tutumu reddeder.'),
    ],
  },
  {
    textId: 'hitabet-acilis',
    questions: [
      q('q1', 'ayrinti', 'Konuşmacı konuşmasını kaç bölüme ayırmıştır?',
        'Üç',
        ['İki', 'Dört', 'Beş'],
        'Metinde "Konuşmamı üç bölüme ayırdım" denir; sorun, çözüm ve istek sıralanır.'),
      q('q2', 'ana-fikir', 'Bu açılış bölümünün asıl işlevi nedir?',
        'Dinleyicileri selamlamak ve konuşmanın planını önceden bildirmek',
        ['Sorunu ayrıntılı biçimde çözmek', 'Dinleyicilerden bağış istemek', 'Konuşmayı sonlandırmak'],
        'Metin selamlama ile başlar, konuşmanın amacını söyler ve izlenecek üç bölümü duyurur.'),
      q('q3', 'cikarim', 'Konuşmanın üçüncü bölümünde ne olacağı anlaşılıyor?',
        'Konuşmacı dinleyicilerden bir şey isteyecek.',
        ['Sorun anlatılacak.', 'Çözüm önerisi paylaşılacak.', 'Soru-cevap bölümü yapılacak.'],
        'Plana göre önce sorun, sonra çözüm anlatılır; "en sonunda da sizden bir isteğim olacak" cümlesi üçüncü bölümü belirtir.'),
    ],
  },
  {
    textId: 'hitabet-tesekkur',
    questions: [
      q('q1', 'ana-fikir', 'Konuşmanın ana düşüncesi hangisidir?',
        'Başarının birçok kişinin ortak emeği olduğu',
        ['Ödülün tek başına kazanıldığı', 'Ödül töreninin gereksiz olduğu', 'Hocaların hatalı davrandığı'],
        'Konuşmacı "Başarı tek bir elin değil, birçok elin ortak işidir" der ve ödülü başkalarıyla paylaşır.'),
      q('q2', 'ayrinti', 'Konuşmacı hocalarına neden teşekkür ediyor?',
        'Hatasını sabırla gösterdikleri için',
        ['Ödülü kendisi seçtikleri için', 'Onu işe aldıkları için', 'Sınavı kolaylaştırdıkları için'],
        'Metinde "hatamı sabırla gösteren hocalarıma" denir.'),
      q('q3', 'yazar-tutumu', 'Konuşmacının ödüle ve kendi başarısına bakışı nasıldır?',
        'Alçakgönüllü; başarıyı başkalarıyla paylaşıyor.',
        ['Kendini öven', 'Umursamayan', 'Hakkını arayan'],
        '"Yalnız olmadığımı anlıyorum" ve "ödülü onlarla paylaşıyorum" ifadeleri alçakgönüllü bir tutumu gösterir.'),
    ],
  },
  {
    textId: 'hitabet-toplanti',
    questions: [
      q('q1', 'ana-fikir', 'Konuşmacının önerisi nedir?',
        'Önce küçük bir deneme yapıp sonuçlara göre karar vermek',
        ['İşi iki haftada bitirmek', 'Önceki fikri tümüyle reddetmek', 'Toplantıyı ertelemek'],
        'Konuşmacı "Önce küçük bir deneme yapalım, sonuçları görelim, sonra karar verelim" der.'),
      q('q2', 'ayrinti', 'Konuşmacının endişesi neyle ilgilidir?',
        'Süre',
        ['Bütçe', 'Ekip sayısı', 'Çalışma yeri'],
        'Metinde "bir endişem var: süre" denir ve işin iki haftada bitmesinin zor olduğu eklenir.'),
      q('q3', 'yazar-tutumu', 'Konuşmacı söz alırken önceki fikre nasıl yaklaşır?',
        'Önce katıldığını söyler, sonra endişesini nazikçe dile getirir.',
        ['Sert biçimde karşı çıkar.', 'Hiç değinmez.', 'Alay eder.'],
        '"Fikre katılıyorum, fakat bir endişem var" sıralaması, karşı çıkmadan önce ortak noktayı kabul eden bir üslubu gösterir.'),
    ],
  },
  {
    textId: 'hitabet-kapanis',
    questions: [
      q('q1', 'ana-fikir', 'Konuşmanın ana düşüncesi hangisidir?',
        'Konuşmak ve dinlemek birbirini tamamlayan becerilerdir; susmayı bilmek de bunlardandır.',
        ['Uzun konuşmak her zaman daha etkilidir.', 'Susmak her durumda doğrudur.', 'Dinlemek konuşmak için gereksizdir.'],
        'Konuşmacı kısa konuşmayı, iyi dinlemeyi ve yerinde susmayı birer beceri olarak sıralar.'),
      q('q2', 'ayrinti', 'İkinci hatırlatmaya göre iyi dinleyen kişi ne öğrenir?',
        'İyi konuşmayı',
        ['Hızlı okumayı', 'Müzik yapmayı', 'Yabancı dil konuşmayı'],
        'Metinde "iyi dinleyen kişi iyi konuşmayı da öğrenir" denir.'),
      q('q3', 'cikarim', '"Söylenecek yerde susmak da bir beceridir" sözünden hangisi çıkarılır?',
        'Ne zaman susulacağını bilmek, konuşma becerisinin bir parçasıdır.',
        ['Susmak her zaman iyidir.', 'Susanlar bilgisizdir.', 'Konuşmak gereksizdir.'],
        'Susmak "bir beceri" olarak anıldığı için, ne zaman susulacağını bilmek konuşma ustalığına dahil edilir.'),
    ],
  },

  // ---- Felsefî / Düşünce ----
  {
    textId: 'felsefi-soru',
    questions: [
      q('q1', 'ana-fikir', 'Metnin ana düşüncesi hangisidir?',
        'Soru sormak, bilmediğini kabul etme cesaretiyle öğrenmenin yoludur.',
        ['Soru sormak utanç vericidir ve kaçınılmalıdır.', 'Bilgi yalnızca kitaplardan edinilir.', 'Huzur için hiçbir şey öğrenmemek gerekir.'],
        'Metin, bilginin "bilmediğini söyleyenin kapısını çaldığını" ve cesur olanın "bilmiyorum" diyebilen olduğunu söyler.'),
      q('q2', 'kelime-baglam', '"Huzuru, öğrenmediği şeylerin üzerine örtülmüş bir battaniyedir" ifadesi neyi anlatır?',
        'Sorusuz insanın huzuru, eksiklerini görmezden gelmesine dayanır.',
        ['Soru sormayan insanın üşüdüğünü', 'Battaniyenin faydalarını', 'Huzurun kolay elde edildiğini'],
        'Battaniye, altındaki şeyi örtür; benzetme, öğrenilmemiş şeylerin görmezden gelinerek sağlanan huzura işaret eder.'),
      q('q3', 'yazar-tutumu', 'Yazara göre bilge kişi kimdir?',
        'Bilmediğini kabul edip arkasından öğrenmek isteyen kişi',
        ['Hiç soru sormayan kişi', 'Her şeyi bildiğini söyleyen kişi', 'Sorulara hep sessiz kalan kişi'],
        'Son cümle bilgeyi, "bilmiyorum" sözünün ardından "öğrenmek isterim" diyebilen kişi olarak tanımlar.'),
    ],
  },
  {
    textId: 'felsefi-aliskanlik',
    questions: [
      q('q1', 'ana-fikir', 'Metnin ana düşüncesi hangisidir?',
        'Kalıcı değişimi büyük kararlar değil, küçük ve düzenli adımlar getirir.',
        ['Alışkanlıklar kısa sürede kazanılır.', 'Büyük kararlar her zaman başarısız olur.', 'Erken kalkmak her kişi için en iyisidir.'],
        'Son cümle büyük kararlardan çok "küçük ve tekrar edilebilir adımlara" güvenmeyi önerir.'),
      q('q2', 'ayrinti', 'Yazara göre alışkanlıklar bir gün içinde ne yapar?',
        'Belirgin bir şeyi değiştirmez.',
        ['Kişiyi tamamen değiştirir.', 'Ortadan kalkar.', 'Gürültü çıkarır.'],
        'Metinde alışkanlıkların "bir gün içinde bir şeyi değiştirmediği", ama yüzlerce günün sonunda kişiyi biz yaptığı söylenir.'),
      q('q3', 'kelime-baglam', '"Gürültü çıkarmayan ustalar" benzetmesi alışkanlıkların hangi yönünü anlatır?',
        'Fark edilmeden, yavaş ve etkili biçimde insanı şekillendirmelerini',
        ['Sesli çalışmalarını', 'Kısa sürede etki etmelerini', 'Usta işi olmalarını'],
        'Usta sessizce çalışır; alışkanlıklar da kimse fark etmeden günler içinde kişiyi biçimlendirir.'),
    ],
  },
  {
    textId: 'felsefi-zaman',
    questions: [
      q('q1', 'ayrinti', 'Metne göre asıl önemli soru hangisidir?',
        'Elimizdeki zamanı neye verdiğimiz',
        ['Ne kadar zamanımız olduğu', 'Zamanı nasıl biriktireceğimiz', 'Zamanın nasıl geri alınacağı'],
        'Metinde "asıl soru, ne kadar zamanımız olduğu değil, elimizdekini neye verdiğimizdir" denir.'),
      q('q2', 'cikarim', 'Metne göre kaygıya harcanan bir saat için hangisi söylenebilir?',
        'Zaman tüketilmiş, ama karşılığında bir şey kazanılmamıştır.',
        ['Zaman biriktirilmiştir.', 'Zaman geri alınabilir.', 'Kaygı zamanı uzatır.'],
        'Metinde kişinin "bedelini ödediği" ama "karşılığında hiçbir şey almadığı" söylenir.'),
      q('q3', 'ana-fikir', 'Metnin sonuç cümlesi neyi söyler?',
        'Zamanı değerli kılan, onunla yapılan tercihtir.',
        ['Zaman her zaman yetersizdir.', 'Tercih yapmak zaman kaybıdır.', 'Zamanı değerli kılan şey, uzunluğudur.'],
        'Son cümle zamanın değerini miktarına değil, onunla ne yaptığımıza bağlar.'),
    ],
  },
  {
    textId: 'felsefi-dinlemek',
    questions: [
      q('q1', 'ana-fikir', 'Metnin ana düşüncesi hangisidir?',
        'Gerçek dinleme yalnızca susmak değil, karşıdakini anlamaya çalışmaktır.',
        ['Dinlemek konuşmaktan daha kolaydır.', 'Konuşmak dinlemekten üstündür.', 'Sessiz kalan herkes iyi bir dinleyicidir.'],
        'Metin, susan kişinin sırasını beklediğini, dinleyen kişinin ise karşısındakinin dünyasına girmeye çalıştığını söyler.'),
      q('q2', 'ayrinti', 'Metne göre susan kişi ne yapar?',
        'Sırasını bekler.',
        ['Karşısındakinin dünyasına girer.', 'Anlamı bulur.', 'Armağan verir.'],
        'Metinde "Susan kişi sırasını bekler" denir.'),
      q('q3', 'cikarim', 'Yazara göre dikkat neden değerlidir?',
        'Her yere dağıtılamayacak kadar kıymetli olduğu için',
        ['Kolay bulunduğu için', 'Pahalı olduğu için', 'Her zaman ücretsiz verildiği için'],
        'Son cümle dikkatin "her yere dağıtılamayacak kadar değerli" olduğunu söyler.'),
    ],
  },
  {
    textId: 'felsefi-yanilgi',
    questions: [
      q('q1', 'ana-fikir', 'Metnin ana düşüncesi hangisidir?',
        'Yanılmak utanç değildir; asıl yanlış, yanlışı gördükten sonra ısrar etmektir.',
        ['Yanılmamak için hiçbir şeyi denememek gerekir.', 'Yanılan kişi bir daha denememelidir.', 'Fikirlerimizden asla şüphe etmemeliyiz.'],
        'İlk cümle yanılmanın utanç olmadığını, utancın ısrar etmek olduğunu söyler.'),
      q('q2', 'kelime-baglam', '"Her yanlış bir tabela gibidir" benzetmesi ne anlatır?',
        'Yanlış, doğru yolu bulmaya yardım eden bir işarettir.',
        ['Yanlışlar yolu kapatır.', 'Tabelalar her zaman yanlıştır.', 'Yanlış yapmak yasaktır.'],
        'Tabela "burası değil" diye bildirir; yanlış da hangi yolun doğru olmadığını gösterir.'),
      q('q3', 'cikarim', 'Metne göre hiç yanılmayan kişi hakkında hangisi söylenebilir?',
        'Ya hiç denememiş ya da yanılgısını görecek cesareti bulamamıştır.',
        ['Her zaman haklıdır.', 'Çok bilgilidir.', 'Zamanını iyi kullanmıştır.'],
        'Metinde bu iki olasılık açıkça sıralanır.'),
    ],
  },
  {
    textId: 'felsefi-sadelik',
    questions: [
      q('q1', 'ana-fikir', 'Metnin ana düşüncesi hangisidir?',
        'Sadelik bilgisizlik değil, düşüncenin olgunlaşmış hâlidir.',
        ['Sade anlatım yalnızca az bilen kişilere özgüdür.', 'Karmaşık cümle her zaman iyidir.', 'Fikirler hiç açıklanmamalıdır.'],
        'Son cümle "Sadelik düşüncenin kolay değil, olgun hâlidir" der.'),
      q('q2', 'cikarim', 'Bir fikri tek cümleyle söyleyemeyen kişi için yazar ne ima eder?',
        'Fikri henüz tam anlamamış olabilir.',
        ['Fikri çok iyi biliyordur.', 'Cümle kurmayı bilmiyordur.', 'Konuşmayı sevmiyordur.'],
        'Metinde "belki de onu daha tam anlamamışızdır" denir.'),
      q('q3', 'kelime-baglam', '"Olgunlaşmamış" sözü bu bağlamda ne anlama gelir?',
        'Henüz netleşmemiş, yerine oturmamış',
        ['Yaşı küçük', 'Tamamen yanlış', 'Çok eski'],
        'Karmaşık cümle, henüz netleşmemiş düşüncenin belirtisi sayıldığı için sözcük bu anlamdadır.'),
    ],
  },
  {
    textId: 'felsefi-elde',
    questions: [
      q('q1', 'ana-fikir', 'Metnin ana düşüncesi hangisidir?',
        'Elimizde olmayanlara öfkelenmek yerine, elimizde olana odaklanmak daha etkilidir.',
        ['Hiçbir olay bizi etkilemez.', 'Her şeyi kontrol edebiliriz.', 'Öfke her zaman faydalıdır.'],
        'Metin, elde olmayan şeyler için öfkelenenin gücünü boşa harcadığını, elde olana odaklananın daha sakin ve etkili olduğunu söyler.'),
      q('q2', 'ayrinti', 'Metne göre hangisi bizim elimizde değildir?',
        'Başkalarının ne düşündüğü',
        ['Olaylara verdiğimiz karşılık', 'Gösterdiğimiz çaba', 'Davranışlarımız'],
        'Metin havayı, başkalarının ne düşündüğünü ve geçmişi elimizde olmayanlar arasında sayar.'),
      q('q3', 'cikarim', 'Elinde olmayan şey için öfkelenen kişi için ne söylenebilir?',
        'Gücünü sonuç vermeyecek bir yere harcamıştır.',
        ['Sorunu çözmüştür.', 'Daha sakin olur.', 'Geçmişi değiştirebilir.'],
        'Metinde bu kişinin "gücünü sonuç vermeyecek bir yere harcadığı" söylenir.'),
    ],
  },
  {
    textId: 'felsefi-merak',
    questions: [
      q('q1', 'ana-fikir', 'Metnin ana düşüncesi hangisidir?',
        'Merak, aramanın heyecanıdır ve hayat boyu korunmalıdır.',
        ['Cevapları bilmek merak etmekten önemlidir.', 'Merak yalnızca çocuklara özgüdür.', 'Soru sormak gereksizdir.'],
        'Metin merakı "aramanın heyecanı" diye tanımlar ve meraklı kalmayı içimizdeki çocuğu korumanın yolu sayar.'),
      q('q2', 'ayrinti', 'Metne göre çocuklar için bir sorunun cevabı neyin kapısıdır?',
        'Yeni üç sorunun',
        ['Yeni bir oyunun', 'Hiçbir şeyin', 'Büyümenin sonunun'],
        'Metinde "bir soruya verilen cevap, onlar için yeni üç sorunun kapısıdır" denir.'),
      q('q3', 'yazar-tutumu', 'Yazar meraklı kalmaya nasıl bakar?',
        'Önemli ve korunması gereken bir değer olarak',
        ['Gereksiz bir alışkanlık olarak', 'Yalnızca çocukluğa özgü bir kusur olarak', 'Vakit kaybı olarak'],
        'Yazar, meraklı kalmayı içimizdeki çocuğu "ihtiyarlamaktan korumanın yolu" sayar; bu, olumlu ve değer veren bir bakıştır.'),
    ],
  },
];

/** Düz metin yolculuğunda "|" işaretleri olmadan, künyesiyle birlikte okuma seti. */
export const READING_SETS: QuizSet[] = READING_DRAFTS.map((draft) => {
  const text = findDailyText(draft.textId);
  return {
    id: `okuma-${draft.textId}`,
    kind: 'okuma',
    title: text?.title ?? draft.textId,
    passage: text ? plainText(text.text) : undefined,
    passageSource: text?.source,
    dailyTextId: draft.textId,
    questions: draft.questions,
  };
});

/** Günün metnine bağlı okuma seti; dinî metinler ve setsiz metinler için `undefined`. */
export function readingSetForText(textId: string): QuizSet | undefined {
  return READING_SETS.find((set) => set.dailyTextId === textId);
}

/* ------------------------------------------------------------------ */
/* Dinlediğini anlama                                                  */
/* ------------------------------------------------------------------ */

export const LISTENING_SETS: QuizSet[] = [
  {
    id: 'dinleme-kutuphane',
    kind: 'dinleme',
    title: 'Kütüphane duyurusu',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Değerli kullanıcılarımız, kütüphanemiz bu cumartesi günü bakım çalışması nedeniyle kapalı olacaktır. Pazar günü ise her zamanki gibi sabah dokuzdan akşam altıya kadar açığız. Ödünç aldığınız kitapları iade etmek isteyenler, kapının yanındaki iade kutusunu kullanabilir. Bu kutu, kütüphane kapalıyken de hizmet verir. Süresi cumartesi günü dolacak kitaplar için herhangi bir gecikme cezası uygulanmayacaktır. Bilgi için danışma masasına başvurabilirsiniz. Anlayışınız için teşekkür ederiz.',
    questions: [
      q('q1', 'ayrinti', 'Kütüphane ne zaman kapalı olacak?',
        'Cumartesi günü', ['Pazar günü', 'Cuma günü', 'Bütün hafta'],
        'Duyuru, kütüphanenin bu cumartesi günü bakım nedeniyle kapalı olacağını söyler.'),
      q('q2', 'ayrinti', 'Kütüphane kapalıyken kitap iade etmek isteyenler ne yapabilir?',
        'Kapının yanındaki iade kutusunu kullanabilir.',
        ['Kitabı danışma masasına bırakabilir.', 'Pazartesiye kadar bekleyebilir.', 'Kitabı posta ile gönderebilir.'],
        'Duyuruda iade kutusunun kütüphane kapalıyken de hizmet verdiği söylenir.'),
      q('q3', 'cikarim', 'Süresi cumartesi günü dolan bir kitabı getiremeyen kullanıcı için hangisi doğrudur?',
        'Gecikme cezası ödemez.',
        ['Kitabın bedelini öder.', 'Üyeliği iptal edilir.', 'Kitabı kütüphaneden alınır.'],
        'Duyuru, bu kitaplar için gecikme cezası uygulanmayacağını belirtir.'),
    ],
  },
  {
    id: 'dinleme-pazar',
    kind: 'dinleme',
    title: 'Pazar alışverişi',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Ayşe, pazar sabahı kalabalık olmadan alışveriş yapmak için evden erken çıktı. Önce domates ve biber aldı, sonra yumurtacıya uğradı. Yumurtacı, bu hafta tavukların az yumurtladığını, bu yüzden fiyatın biraz arttığını söyledi. Ayşe önce itiraz etmek istedi, sonra köyden gelen yumurtanın taze olduğunu görünce vazgeçti. Dönüşte komşusuna rastladı ve ona da pazarın en taze yeşilliklerinin sondaki tezgâhta olduğunu söyledi.',
    questions: [
      q('q1', 'ayrinti', 'Ayşe neden evden erken çıktı?',
        'Pazar kalabalık olmadan alışveriş yapmak için', ['Komşusuyla buluşmak için', 'İşe yetişmek için', 'Yumurtacıyı bulmak için'],
        'Metin, Ayşe\'nin kalabalık olmadan alışveriş yapmak için erken çıktığını söyler.'),
      q('q2', 'ayrinti', 'Yumurta fiyatı neden artmıştı?',
        'Tavuklar bu hafta az yumurtladığı için', ['Yumurtalar ithal edildiği için', 'Pazar çok kalabalık olduğu için', 'Yumurtalar boyut olarak büyük olduğu için'],
        'Yumurtacı fiyat artışının nedenini tavukların az yumurtlaması olarak açıklar.'),
      q('q3', 'cikarim', 'Ayşe\'nin itiraz etmekten vazgeçmesi neyi gösterir?',
        'Fiyatı, yumurtanın tazeliğine göre makul bulduğunu',
        ['Yumurtacıdan korktuğunu', 'Parasının çok olduğunu', 'Yumurtayı hiç almayacağını'],
        'Ayşe, yumurtanın köyden geldiğini ve taze olduğunu görünce vazgeçer; yani fiyatı kaliteyle birlikte değerlendirmiştir.'),
    ],
  },
  {
    id: 'dinleme-bisiklet-yolu',
    kind: 'dinleme',
    title: 'Yeni bisiklet yolu',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Belediye, şehir merkezini üniversiteye bağlayan yeni bir bisiklet yolunun yapımına başladı. Yol, yaklaşık beş kilometre uzunluğunda olacak ve araç trafiğinden ayrılmış bir şerit üzerinden geçecek. Yetkililer, çalışmaların dört ay sürmesini beklediklerini söyledi. Yapım süresince bazı caddelerde tek şeritli trafik uygulanacak. Belediye başkanı, amaçlarının hem trafiği hafifletmek hem de insanları bisiklete teşvik etmek olduğunu belirtti.',
    questions: [
      q('q1', 'ayrinti', 'Yeni bisiklet yolu hangi iki yeri birbirine bağlıyor?',
        'Şehir merkezi ile üniversiteyi', ['Üniversite ile hastaneyi', 'İki mahalleyi', 'Şehir merkezi ile havalimanını'],
        'Metin, yolun şehir merkezini üniversiteye bağladığını söyler.'),
      q('q2', 'ayrinti', 'Çalışmaların kaç ay sürmesi bekleniyor?',
        'Dört ay', ['İki ay', 'Altı ay', 'Bir yıl'],
        'Yetkililer çalışmaların dört ay sürmesini beklediklerini söyledi.'),
      q('q3', 'ana-fikir', 'Belediye başkanına göre projenin amacı nedir?',
        'Trafiği hafifletmek ve bisiklet kullanımını teşvik etmek',
        ['Otomobil sayısını artırmak', 'Üniversiteyi büyütmek', 'Yeni bir cadde açmak'],
        'Başkan, amaçlarının trafiği hafifletmek ve insanları bisiklete teşvik etmek olduğunu belirtti.'),
    ],
  },
  {
    id: 'dinleme-bulusma',
    kind: 'dinleme',
    title: 'Buluşma saati',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'İki arkadaş telefonla buluşma saatini konuşuyordu. Mehmet, perşembe akşamı müsait olduğunu söyledi. Elif ise o gün geç saate kadar çalışacağını, bu yüzden cuma akşamını tercih ettiğini belirtti. Mehmet cuma günü bir doğum gününe gideceğini hatırlayınca bir çözüm önerdi: görüşmeyi cumartesi öğle yemeğine almak. Elif bu öneriyi kabul etti ve yer olarak okulun yakınındaki küçük lokantayı seçti.',
    questions: [
      q('q1', 'ayrinti', 'Buluşma sonunda hangi gün ve öğün için kararlaştırıldı?',
        'Cumartesi öğle yemeği', ['Perşembe akşamı', 'Cuma akşamı', 'Pazar kahvaltısı'],
        'Mehmet cumartesi öğle yemeğini önerdi ve Elif kabul etti.'),
      q('q2', 'ayrinti', 'Elif neden perşembe akşamını uygun bulmadı?',
        'O gün geç saate kadar çalışacaktı.', ['Doğum gününe gidecekti.', 'Şehir dışında olacaktı.', 'Lokanta o gün kapalıydı.'],
        'Elif, perşembe günü geç saate kadar çalışacağını söyledi.'),
      q('q3', 'cikarim', 'Konuşmadan hangisi çıkarılabilir?',
        'İki arkadaş da takvimlerine uyan bir gün bulana kadar seçenekleri konuştu.',
        ['İki arkadaş küstü.', 'Mehmet buluşmayı iptal etti.', 'Elif okulda çalışıyor.'],
        'Önce perşembe, sonra cuma elendi; cumartesi, ikisinin de uygun olduğu zaman olarak seçildi.'),
    ],
  },
  {
    id: 'dinleme-arilar',
    kind: 'dinleme',
    title: 'Kovandaki düzen',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Bal arıları bir kovanda binlerce üyesiyle birlikte yaşar. Kovanda üç tür arı bulunur: kraliçe, işçi ve erkek arılar. Kraliçe yalnızca yumurta bırakır. İşçi arılar ise çiçek tozu ve nektar toplar, kovanı temizler ve yavruları besler. Bir işçi arı yaşamı boyunca ancak çok küçük bir miktarda bal üretebilir; bu yüzden bir kavanoz bal, binlerce arının ortak emeğidir.',
    questions: [
      q('q1', 'ayrinti', 'Kovanda kaç tür arı bulunur?',
        'Üç', ['İki', 'Dört', 'Beş'],
        'Metinde kraliçe, işçi ve erkek arılar olmak üzere üç tür sayılır.'),
      q('q2', 'ayrinti', 'Kraliçe arının görevi nedir?',
        'Yumurta bırakmak', ['Nektar toplamak', 'Yavruları beslemek', 'Kovanı temizlemek'],
        'Metin, kraliçenin yalnızca yumurta bıraktığını, diğer işlerin işçi arılara ait olduğunu söyler.'),
      q('q3', 'cikarim', 'Metne göre bir kavanoz bal neden değerlidir?',
        'Çok sayıda arının ortak emeği olduğu için',
        ['Kraliçe tarafından üretildiği için', 'Yalnızca erkek arılar yaptığı için', 'Çok az arı çalıştığı için'],
        'Her işçi arı çok az bal üretebildiğinden, bir kavanoz bal binlerce arının emeğiyle oluşur.'),
    ],
  },
  {
    id: 'dinleme-durak',
    kind: 'dinleme',
    title: 'Otobüs durağında',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Sabah işe giderken otobüs durağında yaşlı bir amca bana yaklaştı. Hangi otobüsün hastaneye gittiğini sordu. Ben de kırk iki numaralı otobüsün gittiğini, ama bu otobüsün ancak yarım saat sonra geleceğini söyledim. Amca endişelendi, çünkü randevusuna çok az zaman vardı. O sırada hastanenin yalnızca iki durak ilerde, yürünebilecek bir mesafede olduğunu hatırladım. Amca teşekkür edip yürümeye başladı.',
    questions: [
      q('q1', 'ayrinti', 'Yaşlı amca anlatıcıya ne sordu?',
        'Hangi otobüsün hastaneye gittiğini', ['Saatin kaç olduğunu', 'Otobüs ücretini', 'Taksi durağının yerini'],
        'Metin, amcanın hangi otobüsün hastaneye gittiğini sorduğunu söyler.'),
      q('q2', 'ayrinti', 'Amca neden endişelendi?',
        'Otobüs yarım saat sonra gelecekti ve randevusuna az zaman vardı.',
        ['Otobüs ücretini unutmuştu.', 'Hastaneyi bulamamıştı.', 'Anlatıcıya güvenmiyordu.'],
        'Otobüsün yarım saat sonra geleceğini öğrenmiş, randevusuna ise çok az zaman kalmıştı.'),
      q('q3', 'cikarim', 'Amca sonunda neden yürümeye başladı?',
        'Hastane yürünebilecek mesafedeydi.',
        ['Otobüs hemen geldi.', 'Randevusu iptal edildi.', 'Yürümeyi her zaman tercih ederdi.'],
        'Anlatıcı, hastanenin iki durak ileride ve yürünebilecek mesafede olduğunu hatırlattı; amca bunun üzerine yürüdü.'),
    ],
  },
  {
    id: 'dinleme-hava',
    kind: 'dinleme',
    title: 'Hafta sonu hava durumu',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Meteoroloji, hafta sonu için sağanak yağış uyarısı yaptı. Yağışların cumartesi öğleden sonra başlayıp pazar sabahına kadar sürmesi bekleniyor. Sıcaklıklar iki gün boyunca on beş derece civarında seyredecek. Yetkililer, özellikle dere yataklarının yakınında bulunanların dikkatli olmasını istedi. Pazartesi günü ise havanın açılması ve sıcaklığın yeniden yükselmesi öngörülüyor.',
    questions: [
      q('q1', 'ayrinti', 'Yağışlar ne zaman başlayacak?',
        'Cumartesi öğleden sonra', ['Cuma akşamı', 'Pazar sabahı', 'Pazartesi günü'],
        'Metinde yağışların cumartesi öğleden sonra başlayacağı söylenir.'),
      q('q2', 'ayrinti', 'Kimlerin özellikle dikkatli olması istendi?',
        'Dere yataklarının yakınında bulunanların', ['Yüksek binalarda oturanların', 'Deniz kıyısındakilerin', 'Yolculuk yapanların'],
        'Yetkililer dere yataklarının yakınında bulunanları uyardı.'),
      q('q3', 'cikarim', 'Pazar günü piknik yapmayı planlayan biri ne yapmalıdır?',
        'Planını hava koşullarına göre gözden geçirmelidir.',
        ['Dere kenarına gitmelidir.', 'Yağmurluk almadan çıkmalıdır.', 'Sıcaktan korunmak için gölge aramalıdır.'],
        'Yağışın pazar sabahına kadar süreceği ve sıcaklığın düşük kalacağı söylendiğinden plan buna göre gözden geçirilmelidir.'),
    ],
  },
  {
    id: 'dinleme-servis',
    kind: 'dinleme',
    title: 'Okul servisi duyurusu',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Velilerimizin dikkatine. Önümüzdeki pazartesi günü okul servis saatleri değişecektir. Sabah servisleri her zamankinden on beş dakika erken hareket edecek. Akşam servislerinde ise bir değişiklik yoktur. Bu düzenleme, okulun önündeki yol çalışması nedeniyle yapılmıştır. Çalışmanın bir hafta sürmesi beklenmektedir. Çocuklarınızın zamanında durakta hazır bulunması için göstereceğiniz hassasiyete şimdiden teşekkür ederiz.',
    questions: [
      q('q1', 'ayrinti', 'Hangi servisler erken hareket edecek?',
        'Sabah servisleri', ['Akşam servisleri', 'Bütün servisler', 'Öğle servisleri'],
        'Metinde yalnızca sabah servislerinin on beş dakika erken hareket edeceği söylenir.'),
      q('q2', 'ayrinti', 'Servis saatleri neden değişiyor?',
        'Okulun önünde yol çalışması olduğu için', ['Servis araçları bozulduğu için', 'Okul saatleri değiştiği için', 'Öğrenci sayısı arttığı için'],
        'Duyuru, düzenlemenin okulun önündeki yol çalışması nedeniyle yapıldığını belirtir.'),
      q('q3', 'cikarim', 'Yol çalışması bittikten sonra ne olması beklenir?',
        'Servis saatlerinin eski düzenine dönmesi',
        ['Akşam servislerinin kalkması', 'Servis ücretinin artması', 'Okulun taşınması'],
        'Düzenleme çalışma nedeniyle geçici olarak yapıldığından, çalışma bitince eski düzene dönülmesi beklenir.'),
    ],
  },
  {
    id: 'dinleme-uyku',
    kind: 'dinleme',
    title: 'Uyku üzerine',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Uzmanlar, yetişkinlerin çoğunun gecede yedi ila dokuz saat uykuya ihtiyaç duyduğunu söylüyor. Uyku sırasında beden dinlenirken beyin gün içinde öğrendiklerini düzenler. Bu yüzden sınavdan önceki gece sabaha kadar ders çalışmak, çoğu zaman beklenen yararı sağlamaz. Uykudan önce telefon ekranına bakmak da uykuya dalmayı geciktirebilir. Düzenli saatlerde yatıp kalkmak ise uyku kalitesini artıran en basit alışkanlıklardandır.',
    questions: [
      q('q1', 'ayrinti', 'Yetişkinlerin çoğu için önerilen uyku süresi nedir?',
        'Yedi ila dokuz saat', ['Beş ila altı saat', 'Dokuz ila on bir saat', 'Dört saat'],
        'Metinde uzmanların yedi ila dokuz saat dediği belirtilir.'),
      q('q2', 'ayrinti', 'Uyku sırasında beyin ne yapar?',
        'Gün içinde öğrendiklerini düzenler.', ['Tamamen durur.', 'Yeni dil öğrenir.', 'Bedenden daha çok yorulur.'],
        'Metin, uyku sırasında beynin gün içinde öğrendiklerini düzenlediğini söyler.'),
      q('q3', 'cikarim', 'Metne göre sınavdan önceki gece sabaha kadar çalışmak hakkında ne söylenebilir?',
        'Çoğu zaman beklenen yararı sağlamaz.',
        ['Her zaman başarıyı artırır.', 'Uyku ihtiyacını ortadan kaldırır.', 'Beyni dinlendirir.'],
        'Uykunun öğrenileni düzenlemedeki rolü nedeniyle metin bunun çoğu zaman beklenen yararı sağlamadığını söyler.'),
    ],
  },
  {
    id: 'dinleme-cuzdan',
    kind: 'dinleme',
    title: 'Bulunan cüzdan',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Bir akşam sokakta yürürken kaldırımda siyah bir cüzdan buldum. İçinde birkaç kart ve bir kimlik vardı, ama telefon numarası yoktu. Cüzdanı sahibine ulaştırmak için önce yakındaki dükkânlara sordum, kimse tanımadı. Sonra kimlikteki adresin mahallemde olduğunu fark ettim ve oraya yürüdüm. Kapıyı genç bir kadın açtı. Cüzdanı görünce çok rahatladı; bir saattir her yeri aradığını söyledi.',
    questions: [
      q('q1', 'ayrinti', 'Anlatıcı cüzdanın sahibini bulmak için önce ne yaptı?',
        'Yakındaki dükkânlara sordu.', ['Polise haber verdi.', 'Kartlardaki bankayı aradı.', 'Cüzdanı olduğu yere bıraktı.'],
        'Metinde "önce yakındaki dükkânlara sordum, kimse tanımadı" denir.'),
      q('q2', 'ayrinti', 'Anlatıcı sahibinin adresini nasıl öğrendi?',
        'Kimlikteki adresten', ['Telefon numarasından', 'Dükkân sahibinden', 'Mahalle muhtarından'],
        'Kimlikteki adresin kendi mahallesinde olduğunu fark etti.'),
      q('q3', 'cikarim', 'Kadının cüzdanı görünce rahatlamasından ne anlaşılır?',
        'Cüzdanı kaybettiğini fark etmiş ve arıyordu.',
        ['Cüzdanı hiç fark etmemişti.', 'Anlatıcıyı önceden tanıyordu.', 'İçinde para olduğunu bilmiyordu.'],
        'Kadın bir saattir her yeri aradığını söylediği için kaybı fark etmişti.'),
    ],
  },
  {
    id: 'dinleme-lokanta',
    kind: 'dinleme',
    title: 'Lokantada bekleyiş',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Lokantada bir müşteri, siparişinin yirmi dakikadır gelmediğini söyleyerek garsona seslendi. Garson önce özür diledi, sonra mutfağa gidip siparişin durumunu öğrendi. Yemeğin tam hazırlanmak üzere olduğunu görünce müşteriden beş dakika daha beklemesini rica etti ve bu süre için ücretsiz bir çay getirdi. Müşteri başta sinirliydi, ama garsonun sakin ve içten tavrı karşısında yumuşadı.',
    questions: [
      q('q1', 'ayrinti', 'Garson müşteriye ne ikram etti?',
        'Ücretsiz bir çay', ['Tatlı', 'Su', 'Ücretsiz yemek'],
        'Garson bekleme süresi için ücretsiz bir çay getirdi.'),
      q('q2', 'ayrinti', 'Müşteri siparişini ne kadar süredir beklediğini söyledi?',
        'Yirmi dakika', ['Beş dakika', 'On dakika', 'Bir saat'],
        'Müşteri, siparişinin yirmi dakikadır gelmediğini söyledi.'),
      q('q3', 'cikarim', 'Bu anlatıdan hangi sonuç çıkarılır?',
        'Sakin ve ilgili bir tavır gerginliği azaltabilir.',
        ['Müşteriler her zaman haklıdır.', 'Bekletmek müşteriyi sakinleştirir.', 'Ücretsiz ikram her sorunu çözer.'],
        'Müşteri, garsonun sakin ve içten tavrı karşısında yumuşadı; yani tavır gerginliği azalttı.'),
    ],
  },
  {
    id: 'dinleme-orman',
    kind: 'dinleme',
    title: 'Yağmur ormanları',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Yağmur ormanları yeryüzünün küçük bir bölümünü kaplar, ama bilinen canlı türlerinin büyük bir kısmına ev sahipliği yapar. Yılın büyük bölümünde yağış aldıkları için ağaçlar çok hızlı büyür. Ormanın tabanına ise çok az ışık ulaşır, çünkü üstte geniş yapraklı ağaçlar birbirine yakın durur. Bu yüzden orman tabanında yaşayan bitkiler, az ışıkla yetinmeyi öğrenmiştir.',
    questions: [
      q('q1', 'ayrinti', 'Orman tabanına neden az ışık ulaşır?',
        'Üstteki geniş yapraklı ağaçlar birbirine yakın durduğu için',
        ['Ormanda hep bulutlu olduğu için', 'Ağaçlar çok kısa olduğu için', 'Bitkiler ışığı yok ettiği için'],
        'Metin, nedeni ağaçların geniş yapraklı olması ve birbirine yakın durması olarak açıklar.'),
      q('q2', 'ayrinti', 'Ağaçlar neden hızlı büyür?',
        'Yılın büyük bölümünde yağış aldıkları için', ['Toprak hep kuru kaldığı için', 'Hayvanlar ağaçları budadığı için', 'İnsanlar sulayıp baktığı için'],
        'Metinde ağaçların çok hızlı büyümesinin nedeni olarak yıl boyunca yağış alınması gösterilir.'),
      q('q3', 'cikarim', 'Orman tabanındaki bitkiler için ne söylenebilir?',
        'Az ışıkta yaşamaya uyum sağlamışlardır.',
        ['Güneşten çok ışık alırlar.', 'Yalnızca ağaçların üstünde yaşarlar.', 'Işığa ihtiyaç duymazlar.'],
        'Metin, bu bitkilerin az ışıkla yetinmeyi öğrendiğini söyler.'),
    ],
  },
  {
    id: 'dinleme-fuar',
    kind: 'dinleme',
    title: 'Kitap fuarı',
    passageSource: 'Fesahat için yazıldı',
    passage:
      'Şehrin yıllık kitap fuarı bu yıl on gün sürecek. Fuarda yüz elliden fazla yayınevi bulunacak ve her gün farklı bir yazar okurlarla buluşacak. Çocuklar için ayrı bir etkinlik alanı kurulmuş, masal saatleri her gün öğleden sonra yapılacak. Giriş, öğrenciler için ücretsiz; diğer ziyaretçiler ise küçük bir giriş ücreti ödeyecek.',
    questions: [
      q('q1', 'ayrinti', 'Fuar kaç gün sürecek?',
        'On gün', ['Üç gün', 'Yedi gün', 'On beş gün'],
        'Haberde fuarın on gün süreceği söylenir.'),
      q('q2', 'ayrinti', 'Girişin ücretsiz olduğu kişiler kimlerdir?',
        'Öğrenciler', ['Bütün ziyaretçiler', 'Yazarlar', 'Yayıncılar'],
        'Metinde girişin öğrenciler için ücretsiz, diğer ziyaretçiler için ücretli olduğu söylenir.'),
      q('q3', 'ana-fikir', 'Haberin ana konusu nedir?',
        'Şehirdeki kitap fuarının programı ve olanakları',
        ['Yayınevlerinin kapanması', 'Çocuklar için yeni bir okul', 'Yazarlar için açılan bir yarışma'],
        'Haber fuarın süresini, yayınevi sayısını, etkinliklerini ve giriş koşullarını anlatır.'),
    ],
  },
];

/** Günün dinleme seti. Salt 13: mevcut modüllerin salt'larıyla (0-5, 9, 11) çakışmaz. */
export function pickDailyListeningSet(date: Date = new Date()): QuizSet {
  return pickForDay(LISTENING_SETS, date, 13);
}

/* ------------------------------------------------------------------ */
/* Özetleme alıştırması                                                */
/* ------------------------------------------------------------------ */

export type SummaryPassage = {
  id: string;
  title: string;
  /** 120-220 kelimelik özgün metin. */
  passage: string;
  /** Özetin inmesi gereken kelime sayısı (ör. 25 ya da 40). */
  targetWords: number;
  /** 3-5 anahtar kavram — kullanıcının özetini kendi kendine denetleyeceği liste. */
  keyConcepts: string[];
  /** Örnek özet; kullanıcıya özetini yazdıktan sonra gösterilir. */
  sampleSummary: string;
};

export const SUMMARY_PASSAGES: SummaryPassage[] = [
  {
    id: 'ozet-su-dongusu',
    title: 'Suyun yolculuğu',
    passage:
      'Yeryüzündeki su hiç durmadan yer değiştirir. Güneşin ısıttığı deniz, göl ve nehirlerden su buharlaşarak yükselir. Bitkiler de yapraklarından su buharı salar. Havanın yukarı katmanları soğuk olduğundan buhar burada küçük damlacıklara dönüşür ve bulutları oluşturur. Bulutlardaki damlacıklar birleşip ağırlaştığında yağmur, kar ya da dolu olarak yeryüzüne geri düşer. Yağışın bir kısmı toprağa sızarak yer altı sularını besler, bir kısmı akarak dere ve nehirlere karışır, bir kısmı da doğrudan denize ulaşır. Böylece su yeniden başladığı yere döner ve yolculuk baştan başlar. Bu döngü sayesinde yeryüzündeki su miktarı yüz milyonlarca yıldır hemen hemen aynı kalmıştır. Yalnızca suyun bulunduğu yer ve hâli değişir: bazen buhar, bazen bulut, bazen buz, bazen akarsu. İnsanların içtiği, tarlaları sulayan ve nehirlerde akan su, bu büyük döngünün küçük bir halkasıdır.',
    targetWords: 25,
    keyConcepts: ['buharlaşma', 'bulut oluşumu', 'yağış', 'su miktarının değişmemesi', 'döngü'],
    sampleSummary:
      'Güneşin etkisiyle buharlaşan su bulut oluşturur, yağış olarak yeryüzüne döner ve yeniden denize ulaşır. Bu döngü sayesinde su miktarı hemen hemen sabit kalır.',
  },
  {
    id: 'ozet-uyku-ogrenme',
    title: 'Uyku ve öğrenme',
    passage:
      'Gün boyunca öğrendiğimiz şeyler, yatağa girdiğimizde henüz kalıcı değildir. Beyin uyku sırasında gün içinde edindiği bilgileri yeniden düzenler, önemli olanları güçlendirir ve önemsiz gördüklerini silikleştirir. Bu işlem, özellikle derin uyku evrelerinde yoğunlaşır. Bu nedenle uyku düzeni bozulan kişilerin yeni bilgileri hatırlamakta zorlandığı görülür. Sınavdan önce sabaha kadar ders çalışan bir öğrenci, ezberlediği bilgileri sınav anında beklediği kadar kolay hatırlayamayabilir; çünkü beyin bilgiyi yerleştirmek için yeterli zaman bulamamıştır. Buna karşılık öğrendikten sonra iyi uyuyan kişiler, aynı bilgiyi daha uzun süre akılda tutabilir. Uykunun bir başka yararı da dikkati toparlamasıdır: iyi uyumuş bir zihin, yeni bir konuya daha rahat odaklanır. Kısacası uyku, öğrenmenin sona erdiği yer değil, öğrenilenin kalıcılaştığı aşamadır. Bu yüzden çalışma planına uyku saatlerini de eklemek gerekir.',
    targetWords: 25,
    keyConcepts: ['uykuda bilgi düzenlenir', 'derin uyku', 'sabaha kadar çalışmanın sınırı', 'kalıcı öğrenme', 'uyku saatini plana katmak'],
    sampleSummary:
      'Beyin uykuda öğrenilenleri düzenleyip kalıcı hâle getirir. Bu yüzden uykusuz çalışmak yararsız kalabilir; çalışma planına uyku da dahil edilmelidir.',
  },
  {
    id: 'ozet-dinlemek',
    title: 'Dinlemenin üç düzeyi',
    passage:
      'Dinlemek üç düzeyde yapılabilir. Birincisi, kulağın duyduğu ama zihnin başka yerde olduğu yüzeysel dinlemedir. Bu düzeyde kişi sözleri alır, fakat anlam ona ulaşmaz; çoğu zaman cevap vermeyi beklemekten ibarettir. İkincisi, söylenenin gerçekten anlaşılmaya çalışıldığı dikkatli dinlemedir. Burada dinleyen kişi hem sözcükleri hem de cümlelerin arasındaki bağlantıyı yakalar, gerektiğinde soru sorar. Üçüncüsü ise konuşanın duygusuna ve ihtiyacına da kulak veren derin dinlemedir. Bu düzeyde dinleyen, konuşan kişinin ne söylediğini olduğu kadar neden söylediğini de anlamaya çalışır. İyi bir sohbette en çok ikinci ve üçüncü düzeylere ihtiyaç vardır. Dinleme becerisi, konuşma becerisi gibi çalışılarak gelişir: sözü kesmeden dinlemek, söylenenleri kendi cümleleriyle özetlemek ve karşıdakinin duygusunu adlandırmak bu gelişimin basit alıştırmalarıdır. Dinleyen kişi sadece bilgi toplamaz, karşısındakine de önem verdiğini gösterir.',
    targetWords: 40,
    keyConcepts: ['yüzeysel dinleme', 'dikkatli dinleme', 'derin dinleme', 'duygu ve ihtiyaç', 'çalışılarak gelişir'],
    sampleSummary:
      'Dinleme yüzeysel, dikkatli ve derin olmak üzere üç düzeydedir. Dikkatli dinleme anlamaya, derin dinleme ise konuşanın duygusuna ve ihtiyacına odaklanır. Sözü kesmemek ve söyleneni özetlemek bu beceriyi geliştirir.',
  },
  {
    id: 'ozet-yesil-alan',
    title: 'Şehirde yeşil alanlar',
    passage:
      'Parklar, bahçeler ve ağaçlı caddeler şehirlerin yalnızca süsü değildir. Ağaçlar yazın gölge vererek çevrelerini birkaç derece serin tutar; bu, sıcak günlerde enerji tüketimini azaltır. Yapraklar havadaki tozu tutar, toprak ise yağmur suyunu emerek sel riskini düşürür. Yeşil alanlar ayrıca insanların bir araya geldiği ortak mekânlar sunar: çocuklar oynar, yaşlılar oturur, komşular tanışır. Araştırmalar, ağaçlı bir ortamda kısa süre yürümenin kişiyi sakinleştirdiğini gösteriyor. Yine de beton alanların hızla arttığı şehirlerde yeşil alan genellikle son sıraya itilir. Oysa yeşil alanın faydası, yapılışından yıllar sonra ortaya çıkar; bir ağaç dikmek, ancak yıllar sonra gölgesinden yararlanılacak bir yatırımdır. Bu yüzden şehir planlaması yapılırken yeşil alanlar sonradan eklenen bir ayrıntı değil, başından düşünülen bir ihtiyaç olarak ele alınmalıdır.',
    targetWords: 40,
    keyConcepts: ['serinletme', 'sel riskinin azalması', 'ortak mekân', 'ruhsal rahatlama', 'planlamada öncelik'],
    sampleSummary:
      'Yeşil alanlar serinlik sağlar, havayı temizler, sel riskini azaltır ve insanlara ortak bir mekân sunar. Faydaları yıllar sonra görüldüğü için şehir planlamasında başından düşünülmelidir.',
  },
  {
    id: 'ozet-aliskanlik',
    title: 'Alışkanlıkların oluşumu',
    passage:
      'Bir davranış yeterince tekrarlandığında, beyin onu düşünmeden yapılan bir işe dönüştürür. Buna alışkanlık diyoruz. Alışkanlıkların üç parçası vardır: bir işaret, bir davranış ve bir ödül. İşaret davranışı başlatır; örneğin sabah uyanmak kahve yapma isteğini tetikler. Davranış, kahveyi hazırlamaktır. Ödül ise ortaya çıkan hoş duygudur. Beyin ödülü hatırladıkça işaretle davranışı birbirine daha sıkı bağlar. Yeni bir alışkanlık edinmek için çoğu zaman büyük bir irade yerine küçük bir başlangıç yeterlidir: her gün iki dakika okumak, bir bardak su içmek ya da bir sayfa yazmak gibi. Küçük adım kolay olduğundan terk edilmez, tekrarlandıkça da alışkanlığa dönüşür. Eski bir alışkanlığı bırakmak ise onu yok etmekten çok yerine başka bir davranış koymaktır; çünkü işaret ortadan kalkmaz, ancak vereceği cevap değiştirilebilir. Kısacası alışkanlıklar, sabır ve düzenle yeniden şekillendirilebilir.',
    targetWords: 40,
    keyConcepts: ['işaret-davranış-ödül', 'tekrarla pekişme', 'küçük başlangıç', 'eskinin yerine yenisini koymak', 'sabır'],
    sampleSummary:
      'Alışkanlık, işaret, davranış ve ödülden oluşur ve tekrarla pekişir. Yeni alışkanlık küçük adımlarla kazanılır; eskisi ise yok edilmez, yerine başka bir davranış konularak değiştirilir.',
  },
  {
    id: 'ozet-kutuphane',
    title: 'Kütüphanenin toplumdaki yeri',
    passage:
      'Bir kütüphane yalnızca kitapların durduğu bir bina değildir. İnsanların bilgiye ücretsiz ve eşit biçimde ulaştığı, sessiz bir çalışma ortamı bulduğu ortak bir alandır. Kütüphane sayesinde her çocuk, ailesinin gelirinden bağımsız olarak yüzlerce kitaba ulaşabilir. Öğrenciler ders çalışır, yetişkinler iş arar, yaşlılar gazete okur. Birçok kütüphane bunun yanında yazarlarla söyleşiler, çocuklar için masal saatleri ve yabancı dil kursları gibi etkinlikler de düzenler. Dijital çağda kitapların çoğuna ekrandan ulaşılabilse de kütüphanenin yeri tamamen dolmuş değildir; çünkü insanlar hâlâ bir arada çalışabilecekleri ve odaklanabilecekleri sakin bir yere ihtiyaç duyar. Bir kütüphaneyi değerli kılan şey, raflardaki kitapların sayısından çok, ona gelen herkese kapısını açık tutmasıdır. Bu yüzden kütüphaneler, toplumun ortak hafızasını ve bilgiye eşit erişim ilkesini koruyan kurumlardır.',
    targetWords: 40,
    keyConcepts: ['bilgiye eşit erişim', 'ortak çalışma alanı', 'etkinlikler', 'dijital çağda da ihtiyaç', 'ortak hafıza'],
    sampleSummary:
      'Kütüphane, herkesin bilgiye ücretsiz ulaştığı ve sakin çalıştığı ortak bir alandır. Etkinlikler de sunar; dijital çağda bile ihtiyaç duyulur ve toplumun ortak hafızasını korur.',
  },
  {
    id: 'ozet-sadelik',
    title: 'Açık yazmak',
    passage:
      'İyi yazı, okuyucuyu yormayan yazıdır. Bunun için önce yazarın ne söylemek istediğini kendisinin bilmesi gerekir. Düşüncesi bulanık olan kişi, bulanıklığı uzun cümlelerle ve süslü sözlerle örtmeye çalışır; okuyucu da bunu hemen fark eder. Açık yazmanın birkaç basit kuralı vardır. Cümleler mümkün olduğunca kısa tutulmalı, bir cümlede tek düşünce verilmelidir. Gereksiz sıfatlar ve tekrarlar atılmalı, günlük hayatta kullanılan kelimeler yabancı ya da ağır kelimelerin yerine seçilmelidir. Örneklerle anlatmak, soyut bir düşünceyi somutlaştırır ve akılda kalmasını sağlar. Yazı bittikten sonra sesli okumak da çok işe yarar: dilde takılan yerler, kulağın daha çabuk yakaladığı kusurlardır. Sade yazmak, okuyucuya saygı göstermektir; çünkü okuyucunun zamanı ve dikkati sınırlıdır ve yazar onu boşa harcamamalıdır.',
    targetWords: 25,
    keyConcepts: ['önce düşünceyi netleştirmek', 'kısa cümle', 'günlük kelimeler', 'örnek kullanmak', 'sesli okuyarak denetlemek'],
    sampleSummary:
      'Açık yazmak için önce düşünce netleştirilir, sonra kısa cümleler ve sade sözlerle anlatılır. Örnek vermek ve sesli okumak yazıyı iyileştirir.',
  },
  {
    id: 'ozet-hafiza',
    title: 'Tekrar ve unutma',
    passage:
      'Yeni öğrendiğimiz bilginin büyük bölümünü ilk günlerde unuturuz. Araştırmacılar, tekrar yapılmazsa unutmanın başlangıçta hızlı, sonra yavaş ilerlediğini gösteriyor. Ancak bu kaçınılmaz bir son değildir. Bilgi uygun aralıklarla yeniden gözden geçirildiğinde her tekrar unutma hızını biraz daha yavaşlatır. Bu yüzden bir konuyu tek oturumda saatlerce çalışmak yerine, birkaç güne yayılmış kısa tekrarlar yapmak daha etkilidir. İlk tekrarı öğrendikten kısa süre sonra, ikincisini birkaç gün sonra, üçüncüsünü bir hafta sonra yapmak iyi bir düzen olabilir. Tekrarın niteliği de önemlidir: metni yalnızca yeniden okumak yerine, kitabı kapatıp hatırladıklarını yazmak ya da başkasına anlatmak çok daha güçlü bir yöntemdir. Çünkü bilgiyi hatırlamaya çalışmak, onu beyinde yeniden kurmak demektir. Hatırlamakta zorlandığımız anlar, öğrenmenin en çok gerçekleştiği anlardır.',
    targetWords: 40,
    keyConcepts: ['ilk günlerde hızlı unutma', 'aralıklı tekrar', 'yayılmış çalışma', 'hatırlamaya çalışmak', 'anlatmak ve yazmak'],
    sampleSummary:
      'Bilgi ilk günlerde hızla unutulur, ancak aralıklı tekrarlar bunu yavaşlatır. Metni yeniden okumak yerine hatırladıklarını yazmak ya da anlatmak çok daha etkili bir tekrar yöntemidir.',
  },
  {
    id: 'ozet-guvenli-konusma',
    title: 'Toplulukta konuşmak',
    passage:
      'Birçok insan topluluk önünde konuşmaktan çekinir; bunun nedeni çoğunlukla yetersizlik değil, hazırlıksızlık korkusudur. Hazırlıklı konuşmacı üç soruyu önceden cevaplar: Kime konuşuyorum, ne söylemek istiyorum ve dinleyici bunun sonunda ne bilsin ya da ne yapsın? Konuşmanın ana düşüncesi tek bir cümleyle söylenebilmelidir. Bunu yapamayan kişi genellikle çok fazla şey anlatmaya çalışmaktadır. Giriş, gelişme ve sonuç şeklinde basit bir düzen dinleyicinin takip etmesini kolaylaştırır. Konuşmadan önce sesli prova yapmak, hem süreyi ölçmeye hem de takıldığınız yerleri görmeye yardım eder. Konuşma sırasında yavaş konuşmak, nefes almak için durmak ve dinleyicilere bakmak heyecanı azaltan kolay alışkanlıklardır. Heyecan tamamen yok olmaz, ama hazırlık arttıkça yönetilebilir hâle gelir. Önemli olan hiç heyecanlanmamak değil, heyecanla birlikte konuşabilmektir.',
    targetWords: 25,
    keyConcepts: ['hazırlık', 'tek cümlelik ana düşünce', 'giriş-gelişme-sonuç', 'sesli prova', 'heyecanı yönetmek'],
    sampleSummary:
      'Topluluk önünde konuşma korkusu hazırlıkla azalır: ana düşünce netleştirilir, konuşma planlanır ve sesli prova yapılır. Heyecan yok olmaz, ama yönetilebilir.',
  },
  {
    id: 'ozet-su-tasarrufu',
    title: 'Evde su tasarrufu',
    passage:
      'Temiz su sanıldığından kıt bir kaynaktır; yeryüzündeki suyun çok küçük bir bölümü içilebilir durumdadır. Bu yüzden evlerde su tasarrufu yapmak hem çevre hem de bütçe için yararlıdır. En basit adım, musluğu gerekmediği sürece kapalı tutmaktır: diş fırçalarken ya da bulaşık yıkarken akan su boşa gider. Damlayan bir musluk ya da sızdıran bir sifon, fark edilmese de bir ayda yüzlerce litre suyu israf edebilir; bu nedenle küçük arızalar vakit kaybetmeden onarılmalıdır. Banyo süresini kısaltmak da önemli bir tasarruf sağlar. Çamaşır ve bulaşık makinelerini dolu çalıştırmak, aynı suyla daha çok iş yapmak demektir. Bahçe sulaması içinse akşam saatleri seçilmeli, böylece suyun buharlaşarak kaybolması azaltılmalıdır. Bütün bu alışkanlıklar tek başına küçük görünür, ancak milyonlarca evde birlikte uygulandığında büyük bir fark yaratır.',
    targetWords: 25,
    keyConcepts: ['suyun kıtlığı', 'musluğu kapalı tutmak', 'arızaları onarmak', 'dolu makine', 'akşam sulaması'],
    sampleSummary:
      'Temiz su kıt olduğundan evde tasarruf gerekir: musluk kapatılmalı, arızalar onarılmalı, makineler dolu çalıştırılmalı ve bahçe akşam sulanmalıdır.',
  },
  {
    id: 'ozet-okuma-aliskanligi',
    title: 'Okuma alışkanlığı kazanmak',
    passage:
      'Okuma alışkanlığı bir gecede kazanılmaz, ama kolay yollarla başlatılabilir. İlk adım, ilgi duyulan bir kitap seçmektir; çünkü sevilmeyen bir kitabı bitirmeye çalışmak insanı okumaktan soğutur. İkinci adım, okumak için sabit bir zaman ayırmaktır. Yatmadan önce on beş dakika ya da sabah kahvaltısından sonra yirmi dakika gibi küçük bir süre, haftalar içinde alışkanlığa dönüşür. Okurken telefonu başka odada bırakmak dikkatin dağılmasını önler. Kitabı yanında taşımak, bekleme anlarını okumaya çevirmek için fırsat verir. Okuduklarını bir deftere kısa notlarla yazmak ise hem anlamayı hem de hatırlamayı artırır. Her gün az da olsa okuyan kişi, ayda birkaç kitabı bitirebilir. Önemli olan hızlı okumak ya da çok kitap bitirmek değil, düzenli okumak ve okuduğunu düşünmektir. Okuma, ne kadar çok yapılırsa o kadar kolaylaşan bir beceridir.',
    targetWords: 40,
    keyConcepts: ['ilgi çeken kitap', 'sabit okuma saati', 'dikkat dağıtıcıları uzaklaştırmak', 'not almak', 'düzenlilik'],
    sampleSummary:
      'Okuma alışkanlığı için ilgi çeken kitap seçilmeli, her gün sabit ve kısa bir süre okunmalı, dikkat dağıtıcılar uzaklaştırılmalıdır. Not almak anlamayı artırır; önemli olan düzenli okumaktır.',
  },
  {
    id: 'ozet-goc',
    title: 'Göçmen kuşlar',
    passage:
      'Her sonbaharda milyonlarca kuş, binlerce kilometre uzaktaki sıcak bölgelere doğru yola çıkar. Bu yolculuğa göç denir. Kuşlar soğuğun ve yiyecek kıtlığının başladığı mevsimde daha elverişli yerlere gider, bahar gelince de üreme için doğdukları yere geri döner. Göç sırasında kuşların yön bulmasına güneşin ve yıldızların konumu, dünyanın manyetik alanı ve gördükleri dağ, nehir gibi doğal işaretler yardım eder. Uzun yolculuk büyük enerji gerektirdiğinden kuşlar yola çıkmadan önce bol yiyerek vücutlarında yağ biriktirir. Birçok tür, rüzgârdan yararlanmak ve yorulmamak için V biçiminde sürüler hâlinde uçar. Ancak göç yolları üzerindeki yapılaşma, ışık kirliliği ve sulak alanların kuruması bu yolculuğu zorlaştırıyor. Bu nedenle göçmen kuşları korumak, yalnızca bulundukları yeri değil, yolculukları boyunca uğradıkları bütün durak noktalarını korumayı gerektirir.',
    targetWords: 40,
    keyConcepts: ['mevsimsel göç', 'yön bulma', 'enerji biriktirme', 'V biçiminde uçuş', 'göç yollarının korunması'],
    sampleSummary:
      'Kuşlar yiyecek ve sıcaklık için mevsimle birlikte göç eder; yönlerini güneş, yıldızlar ve manyetik alanla bulurlar. Yapılaşma gibi tehditler yüzünden yalnızca yaşam alanları değil, göç yolları da korunmalıdır.',
  },
];

/** Günün özetleme alıştırması. Salt 17: dinleme salt'ından (13) ve diğer modüllerden farklı. */
export function pickDailySummary(date: Date = new Date()): SummaryPassage {
  return pickForDay(SUMMARY_PASSAGES, date, 17);
}
