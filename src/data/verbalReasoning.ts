import { pickForDay } from '../utils/dateUtils';
import type { QuizQuestion, QuizSet, QuizSkill } from './quiz';

// Sözel kavrayış soru setleri — Kavrayış ayağı (YAPILACAKLAR_FESAHAT → Bölüm 3).
//
// Altı beceri × üç set × beş soru; her becerinin 1. seti kolay, 3. seti zor.
// Hepsi `QuizSet` (kind: 'sozel') — okuma/dinleme setleriyle aynı oynatıcı
// ekranda çalışır. Metin gerektiren sorularda (ana fikir, tutarsızlık) paragraf
// sorunun `prompt`'unun içindedir; set düzeyinde `passage` kullanılmaz.
//
// Metin kuralı: bu sorular alıştırmadır, ölçüm iddiası değildir. Açıklamalar
// cevabın *neden* doğru olduğunu anlatır; "zekâ" / "IQ" vaadi verilmez.
// Sayısal ve mekânsal soru yoktur; tartışmalı siyasi / dinî içerik yoktur.

/** [soru metni, seçenekler, doğru seçeneğin sırası, gerekçe] */
type Row = [prompt: string, options: string[], answerIndex: number, explanation: string];

function buildSet(
  skill: QuizSkill,
  slug: string,
  titleBase: string,
  level: number,
  rows: Row[],
): QuizSet {
  return {
    id: `sozel-${slug}-${level}`,
    kind: 'sozel',
    title: `${titleBase} · ${level}`,
    questions: rows.map(
      ([prompt, options, answerIndex, explanation], i): QuizQuestion => ({
        id: `q${i + 1}`,
        prompt,
        options,
        answerIndex,
        explanation,
        skill,
      }),
    ),
  };
}

const ANALOJI_GIRIS = 'Aşağıdaki sözcük çiftindeki ilişkiyi bulup boşluğa uygun sözcüğü seç.\n\n';

// ─────────────────────────── Sözel analoji ───────────────────────────

const ANALOJI_1: Row[] = [
  [
    `${ANALOJI_GIRIS}Kalem : Yazmak :: Makas : ?`,
    ['Dikmek', 'Kesmek', 'Çizmek', 'Boyamak'],
    1,
    'Kalem yazmaya yarar; makas da kesmeye yarar. İlişki: araç ve işlevi.',
  ],
  [
    `${ANALOJI_GIRIS}Kuş : Kanat :: Balık : ?`,
    ['Göl', 'Olta', 'Yüzgeç', 'Akvaryum'],
    2,
    'Kuş kanatlarıyla uçar, balık yüzgeçleriyle yüzer. İlişki: canlı ve hareket organı.',
  ],
  [
    `${ANALOJI_GIRIS}Sıcak : Soğuk :: Uzun : ?`,
    ['Geniş', 'Yüksek', 'Derin', 'Kısa'],
    3,
    'Sıcak ile soğuk zıt anlamlıdır; uzunun zıttı kısadır.',
  ],
  [
    `${ANALOJI_GIRIS}Sayfa : Kitap :: Oda : ?`,
    ['Ev', 'Kapı', 'Halı', 'Mobilya'],
    0,
    'Sayfa kitabın bir parçasıdır; oda da evin bir parçasıdır. İlişki: parça ve bütün.',
  ],
  [
    `${ANALOJI_GIRIS}Tohum : Fidan :: Yumurta : ?`,
    ['Kabuk', 'Yuva', 'Tüy', 'Civciv'],
    3,
    'Tohumdan fidan, yumurtadan civciv çıkar. İlişki: gelişimin ilk hâli ve ondan çıkan yavru.',
  ],
];

const ANALOJI_2: Row[] = [
  [
    `${ANALOJI_GIRIS}Doktor : Hastane :: Öğretmen : ?`,
    ['Kitap', 'Öğrenci', 'Okul', 'Tebeşir'],
    2,
    'Doktor hastanede, öğretmen okulda çalışır. İlişki: meslek ve çalışma yeri.',
  ],
  [
    `${ANALOJI_GIRIS}Cesur : Korkak :: Cömert : ?`,
    ['Cimri', 'Zengin', 'Yardımsever', 'Nazik'],
    0,
    'Cesurun zıttı korkak, cömertin zıttı cimridir. İlişki: zıt anlam.',
  ],
  [
    `${ANALOJI_GIRIS}Tuğla : Duvar :: Harf : ?`,
    ['Mürekkep', 'Kâğıt', 'Okumak', 'Sözcük'],
    3,
    'Tuğlalar duvarı, harfler sözcüğü oluşturur. İlişki: yapı taşı ve oluşan bütün.',
  ],
  [
    `${ANALOJI_GIRIS}Ilık : Sıcak :: Serin : ?`,
    ['Buz', 'Kış', 'Soğuk', 'Rüzgâr'],
    2,
    'Ilıktan sıcağa, serinden soğuğa gidildikçe nitelik artar. İlişki: derece.',
  ],
  [
    `${ANALOJI_GIRIS}Çiçek : Buket :: Kelime : ?`,
    ['Cümle', 'Harf', 'Sözlük', 'Ses'],
    0,
    'Çiçekler bir araya gelip buketi, kelimeler bir araya gelip cümleyi kurar. İlişki: öğe ve onlardan oluşan bütün.',
  ],
];

const ANALOJI_3: Row[] = [
  [
    `${ANALOJI_GIRIS}Şair : Şiir :: Besteci : ?`,
    ['Orkestra', 'Enstrüman', 'Konser', 'Beste'],
    3,
    'Şairin ortaya koyduğu ürün şiir, bestecinin ortaya koyduğu ürün bestedir. İlişki: üretici ve ürünü.',
  ],
  [
    `${ANALOJI_GIRIS}Bolluk : Kıtlık :: Özgürlük : ?`,
    ['Tutsaklık', 'Eşitlik', 'Güvenlik', 'Yasa'],
    0,
    'Bolluğun zıttı kıtlık, özgürlüğün zıttı tutsaklıktır. İlişki: zıt anlam (soyut kavramlarda).',
  ],
  [
    `${ANALOJI_GIRIS}Pusula : Yön :: Terazi : ?`,
    ['Kefe', 'Ağırlık', 'Satıcı', 'Pazar'],
    1,
    'Pusula yönü, terazi ağırlığı belirlemeye yarar. İlişki: araç ve ölçtüğü şey. "Kefe" terazinin parçasıdır, ölçülen şey değil.',
  ],
  [
    `${ANALOJI_GIRIS}Savurgan : Tutumlu :: Tembel : ?`,
    ['Çalışkan', 'Uyuşuk', 'Yorgun', 'Cimri'],
    0,
    'Savurganın zıttı tutumlu, tembelin zıttı çalışkandır. İlişki: zıt anlam.',
  ],
  [
    `${ANALOJI_GIRIS}Roman : Yazar :: Heykel : ?`,
    ['Müze', 'Mermer', 'Heykeltıraş', 'Sergi'],
    2,
    'Romanı yazar, heykeli heykeltıraş yapar. İlişki: eser ve yaratıcısı. "Mermer" malzemedir, yaratıcı değil.',
  ],
];

// ─────────────────────────── Cümle tamamlama ───────────────────────────

const CT = 'Boşluğa, cümlenin anlamına ve dil bilgisine en uygun düşen sözcüğü ya da ifadeyi seç.\n\n';

const CUMLE_1: Row[] = [
  [
    `${CT}Hava çok soğuktu; ______ kalın bir mont giydim.`,
    ['ama', 'oysa', 'bu yüzden', 'çünkü'],
    2,
    'İlk cümle sebep, ikincisi sonuçtur; sonucu bağlayan ifade "bu yüzden"dir. "Çünkü" ise sebebi sonradan söyler.',
  ],
  [
    `${CT}Yağmur yağmasına ______ maça devam ettik.`,
    ['göre', 'rağmen', 'kadar', 'ötürü'],
    1,
    '"-a rağmen" karşıtlık bildirir: yağmur engel olabilirdi ama maça devam edildi. "Ötürü" bu eki almaz.',
  ],
  [
    `${CT}Ders çalışmadığı ______ sınavdan kötü not aldı.`,
    ['için', 'ile', 'gibi', 'kadar'],
    0,
    '"Çalışmadığı için" sebep bildirir; kötü notun nedenini anlatır.',
  ],
  [
    `${CT}Ya sabah erkenden yola çıkacağız ______ akşama kadar bekleyeceğiz.`,
    ['hem de', 'ne de', 'ya da', 'ama'],
    2,
    '"Ya … ya da" iki seçenekten birini bildiren bağlaç çiftidir.',
  ],
  [
    `${CT}Ne yağmur yağdı ______ kar.`,
    ['ne de', 'ya da', 'hem de', 'ama'],
    0,
    '"Ne … ne de" iki olumsuzluğu birlikte bildirir.',
  ],
];

const CUMLE_2: Row[] = [
  [
    `${CT}Bir kez dolandırıldığı için artık herkese şüpheyle bakıyordu; sütten ağzı yanan ______ üfleyerek yer.`,
    ['çorbayı', 'ayranı', 'yoğurdu', 'balı'],
    2,
    'Atasözü: "Sütten ağzı yanan yoğurdu üfleyerek yer." Bir kez zarar gören, benzer durumlarda aşırı temkinli davranır.',
  ],
  [
    `${CT}Komşumuzun yardımı olmasaydı iş bu kadar kolay ______.`,
    ['bitmezdi', 'biterdi', 'bitmişti', 'bitiyordu'],
    0,
    '"-saydı" ile kurulan olmamış koşul cümlesi, "-mezdi" ile tamamlanır: yardım olmasaydı iş kolay bitmezdi.',
  ],
  [
    `${CT}Yorgundu, ______ mutluydu.`,
    ['çünkü', 'bu yüzden', 'yani', 'ama'],
    3,
    'Yorgunluk ile mutluluk birbirine karşıt iki durumdur; bunları "ama" bağlar.',
  ],
  [
    `${CT}Bilgi paylaştıkça ______, saklandıkça azalır.`,
    ['solar', 'çoğalır', 'değişir', 'kurur'],
    1,
    'Cümle bir karşıtlık kurar: "azalır"ın karşıtı "çoğalır"dır.',
  ],
  [
    `${CT}Haberi duyunca şaşkınlıktan ağzı ______ kaldı.`,
    ['kapalı', 'dolu', 'boş', 'açık'],
    3,
    '"Ağzı açık kalmak" şaşkınlıktan ne diyeceğini bilemeyen kişiyi anlatan bir deyimdir.',
  ],
];

const CUMLE_3: Row[] = [
  [
    `${CT}Kaynaklar sınırlı olduğu ______ projeyi hiç aksatmadan tamamladılar.`,
    ['için', 'sürece', 'halde', 'zaman'],
    2,
    '"Sınırlı olduğu hâlde" karşıtlık kurar: kaynak azdı, yine de proje aksamadı. "Için" burada anlam çelişkisi yaratır.',
  ],
  [
    `${CT}Dil, yalnızca bir iletişim aracı ______ aynı zamanda bir düşünme biçimidir.`,
    ['değil,', 'dır,', 'ise,', 'yüzünden'],
    0,
    '"Yalnızca … değil, aynı zamanda …" kalıbı iki özelliği birlikte vurgular.',
  ],
  [
    `${CT}Ona güvenmiştik ama sonunda bizi yarı yolda ______.`,
    ['kesti', 'bıraktı', 'attı', 'yıktı'],
    1,
    '"Yarı yolda bırakmak" güvenilen kişinin işi tamamlanmadan desteği çekmesi anlamında deyimdir.',
  ],
  [
    `${CT}Ne kadar çok okursam ______ çok şey öğrendiğimi fark ediyorum.`,
    ['hiç', 'her', 'ne kadar', 'o kadar'],
    3,
    '"Ne kadar … o kadar …" iki durumun birlikte artmasını anlatan orantı kalıbıdır.',
  ],
  [
    `${CT}Köprünün yapımı ______ kentin iki yakası arasındaki ulaşım ciddi biçimde kolaylaşmıştır.`,
    ['rağmen', 'karşın', 'sayesinde', 'göre'],
    2,
    '"Yapımı sayesinde" olumlu bir sonucun nedenini bildirir. "Rağmen", "karşın" ve "göre" bu yapıya ve anlama uymaz.',
  ],
];

// ─────────────────────────── Bağlamdan kelime anlamı ───────────────────────────

const KB = 'Cümlede geçen tırnak içindeki sözcüğün (ya da ifadenin) o cümledeki anlamını seç.\n\n';

const KELIME_1: Row[] = [
  [
    `${KB}Bu yıl kış çok “sert” geçti.`,
    ['Katı', 'Kaba', 'Şiddetli', 'Parlak'],
    2,
    'Kış için "sert", soğuğun ve koşulların şiddetli olduğunu anlatır. "Katı" ve "kaba" başka bağlamların anlamlarıdır.',
  ],
  [
    `${KB}Bu masraf bana “ağır geliyor”, ödemeyi biraz erteleyebilir miyiz?`,
    ['Çok kilolu', 'Yavaş ilerliyor', 'Güçlü görünüyor', 'Taşınması zor bir yük oluyor'],
    3,
    '"Ağır gelmek" burada kişiye yük olmak, maddi ya da manevi olarak zorlamak anlamındadır; kilo ile ilgili değildir.',
  ],
  [
    `${KB}Ödevini zamanında teslim edemeyince öğretmenin karşısında “mahcup” oldu.`,
    ['Öfkeli', 'Utanmış', 'Korkmuş', 'Şaşkın'],
    1,
    '"Mahcup", yaptığı ya da yapamadığı bir şeyden dolayı utanan kişiyi anlatır.',
  ],
  [
    `${KB}Usta, kapının “eşiğini” yeniden yaptı.`,
    [
      'Kapının üst çerçevesini',
      'Kapının alt kısmında, geçişte basılan çıtayı ya da basamağı',
      'Kapının kolunu',
      'Pencerenin pervazını',
    ],
    1,
    'Eşik, kapının alt kısmında bulunan ve geçişte basılan bölümdür.',
  ],
  [
    `${KB}Kardeşim yeni aldığı kitabı “özenle” sardı.`,
    ['Hızlıca', 'Gizlice', 'İsteksizce', 'Dikkatle'],
    3,
    '"Özenle", bir işi dikkat ve itina göstererek yapmak demektir.',
  ],
];

const KELIME_2: Row[] = [
  [
    `${KB}Toplantıda söylediklerinde sana “hak verdim”.`,
    ['Sana borcumu ödedim', 'Seni haklı buldum', 'Sana izin verdim', 'Seni ödüllendirdim'],
    1,
    '"Hak vermek", bir kişinin söylediğini ya da yaptığını doğru bulmak, haklı görmek anlamındadır.',
  ],
  [
    `${KB}Yazarın dili o kadar “akıcı” ki roman insanı kendine çekiyor.`,
    [
      'Hızlı konuşan',
      'Sıvı gibi dökülen',
      'Takılmadan, rahat okunan',
      'Çok süslü',
    ],
    2,
    'Anlatım için "akıcı", okurun ya da dinleyenin takılmadan, kolayca ilerleyebildiği anlamına gelir.',
  ],
  [
    `${KB}Eski dostlar yıllar sonra bir araya gelince sohbetleri “koyulaştı”.`,
    [
      'Rengi kararmaya başladı',
      'Sona ermek üzereydi',
      'Derinleşip kızıştı',
      'Sessizliğe gömüldü',
    ],
    2,
    '"Sohbet koyulaşmak", konuşmanın içtenleşip uzaması, ısınması anlamında kullanılır.',
  ],
  [
    `${KB}Mimar, binanın “cephesi” için sade bir tasarım önerdi.`,
    ['Binanın dışa bakan yüzü', 'Savaşın yapıldığı alan', 'Çatı katı', 'Temel kısmı'],
    0,
    'Mimaride cephe, yapının dışa, sokağa ya da meydana bakan yüzüdür; savaş alanı anlamı bu bağlama uymaz.',
  ],
  [
    `${KB}Kış “bastırmadan” odunları depoya yığdık.`,
    [
      'Üstüne basmadan',
      'Baskı yaparak yazdırmadan',
      'Gizlemeden',
      'Şiddetle, tüm gücüyle gelmeden',
    ],
    3,
    'Mevsim için "bastırmak", kendini iyice hissettirerek, şiddetle gelmek anlamındadır.',
  ],
];

const KELIME_3: Row[] = [
  [
    `${KB}Yazarın üslubu, “ağdalı” cümleleriyle okuru zaman zaman yoruyor.`,
    ['Tatlı ve şekerli', 'Gereksiz yere ağır ve karmaşık', 'Kısa ve öz', 'Duygusal'],
    1,
    'Anlatım için "ağdalı", gereksiz yere süslü, ağır ve anlaşılması zor olan demektir.',
  ],
  [
    `${KB}Bakanın açıklaması “muğlaktı”; ne olumlu ne olumsuz bir şey söylemişti.`,
    ['Kararlı', 'Sert', 'Kısa', 'Belirsiz'],
    3,
    '"Muğlak", anlamı açık olmayan, birden çok biçimde anlaşılabilen demektir; cümlenin ikinci yarısı bunu açıklıyor.',
  ],
  [
    `${KB}Kasabanın “hatırı sayılır” bir ailesinin evinde misafir olduk.`,
    ['Saygı gören, sözü geçen', 'Çok eski', 'Zengin ama cimri', 'Çok kalabalık'],
    0,
    'Bir aile ya da kişi için "hatırı sayılır", çevresinde saygı gören, sözüne değer verilen demektir.',
  ],
  [
    `${KB}Şair, “yalın” bir dille derin duyguları anlatmayı başardı.`,
    ['Çıplak', 'Kısa', 'Süssüz, sade', 'Eski'],
    2,
    'Dil için "yalın", süs ve gösterişten arınmış, sade demektir. "Çıplak" ayrı bir bağlamın anlamıdır (yalın ayak gibi).',
  ],
  [
    `${KB}Bu işin “altından kalkamayacaksan” baştan söyle.`,
    [
      'Altında kalıp ezilmeyeceksen',
      'İşi bırakmak istemiyorsan',
      'Aşağı inemeyeceksen',
      'Başarıyla üstesinden gelemeyeceksen',
    ],
    3,
    '"Altından kalkmak", zor bir işin ya da sorumluluğun üstesinden gelmek anlamında deyimdir.',
  ],
];

// ─────────────────────────── Ana fikir ───────────────────────────

const AF = 'Paragrafı oku; ana fikri seç.\n\n';

const ANA_1: Row[] = [
  [
    `${AF}Tohum, toprağın altında karanlıkta uzun süre bekler. Yeterli nem ve sıcaklık bulduğunda filizlenir. Hiçbir şey yapmıyormuş gibi görünen bu bekleyiş aslında bir hazırlıktır.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Tohumlar yalnızca karanlıkta büyür.',
      'Dışarıdan boş görünen bekleyiş, aslında bir hazırlık sürecidir.',
      'Toprak, her tohumu filizlendirir.',
      'Nem, sıcaklıktan daha önemlidir.',
    ],
    1,
    'Paragraf, tohum örneğiyle bekleyişin boşuna olmadığını, hazırlık olduğunu söylüyor. Diğer seçenekler ya paragrafta yok ya da ayrıntıdır.',
  ],
  [
    `${AF}Kütüphaneler yalnızca kitap saklanan yerler değildir. İnsanlar orada sessizce çalışır, yeni insanlarla tanışır, merak ettikleri konuları araştırır. Bu yüzden bir kütüphane, bir kentin ortak zihni gibidir.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Kütüphanelerde sessizlik şarttır.',
      'Kütüphane, kitap deposundan öte; insanların bir araya geldiği ve öğrendiği ortak bir alandır.',
      'Kentlerde kütüphane sayısı artırılmalıdır.',
      'İnsanlar yeni kişilerle ancak kütüphanede tanışır.',
    ],
    1,
    'Paragraf "yalnızca kitap saklanan yer değildir" diyerek kütüphanenin toplumsal ve düşünsel işlevini öne çıkarıyor.',
  ],
  [
    `${AF}Sabah erken kalkmak herkese iyi gelmez. Kimi insanlar akşam saatlerinde daha verimli çalışır. Önemli olan, kendi düzenini tanıyıp günü ona göre planlamaktır.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Akşam çalışmak sabah çalışmaktan üstündür.',
      'Erken kalkanlar her zaman daha başarılıdır.',
      'Günü planlamak zaman kaybıdır.',
      'Verimli çalışmak için kişinin kendi ritmini tanıması gerekir.',
    ],
    3,
    'Paragraf, tek bir doğru düzen olmadığını; önemli olanın kişinin kendi ritmini bilmesi olduğunu söylüyor.',
  ],
  [
    `${AF}Yaz sıcağında şehirdeki ağaçlar bize yalnızca gölge sunmaz; havayı serinletir, tozu tutar ve kuşlara yuva olur. Bu yüzden ağaç dikmek, geleceğe yapılmış küçük bir yatırımdır.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Ağaçlar çok yönlü fayda sağladığı için ağaç dikmek değerlidir.',
      'Gölge, ağaçların tek faydasıdır.',
      'Şehirlerde yaz çok sıcak geçer.',
      'Kuşlar yalnızca ağaçlarda yaşar.',
    ],
    0,
    'Paragraf ağacın birden çok faydasını sıralayıp bundan "ağaç dikmek değerlidir" sonucunu çıkarıyor.',
  ],
  [
    `${AF}Bir dili öğrenirken yanlış yapmaktan korkanlar çoğu zaman hiç konuşmaz. Oysa hata, öğrenmenin doğal bir parçasıdır. Konuşmaya cesaret edenler, hatalarından ders alarak hızla ilerler.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Yabancı dil öğrenmek zor bir iştir.',
      'Dil bilgisi kurallarını bilmek konuşmaktan önemlidir.',
      'Hatadan korkmadan konuşmak, dil öğrenmeyi hızlandırır.',
      'Yanlış yapanlar dil öğrenemez.',
    ],
    2,
    'Paragrafın vurgusu, hatayı doğal sayıp konuşmaya cesaret etmenin ilerlemeyi getirdiğidir.',
  ],
];

const ANA_2: Row[] = [
  [
    `${AF}Eski çarşılarda her esnaf, yanındaki dükkânla rekabet etse de müşteri bir şey sorduğunda onu çoğu zaman komşusuna yönlendirirdi. Bu davranış, kazancı azaltmıyor, aksine çarşının itibarını artırıyordu.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Eski çarşılarda esnaf arasında hiç rekabet yoktu.',
      'Çarşılar, modern alışveriş merkezlerinden üstündür.',
      'Dayanışma ve dürüstlük, ortak itibarı yükselterek herkese yarar sağlar.',
      'Esnaf, müşteri kaybetmekten korkmazdı.',
    ],
    2,
    'Paragraf rekabetin sürdüğünü de söylüyor, o yüzden birinci seçenek yanlış. Asıl vurgu, dayanışmanın kazancı düşürmeyip itibarı artırmasıdır.',
  ],
  [
    `${AF}Fotoğraf makineleri çoğaldıkça insanlar gördükleri her şeyi kaydetmeye başladı. Ancak anı çekmek, anı yaşamakla aynı şey değildir. Ekrana bakarak geçen bir konser, çoğu zaman hatırlamaya değer bir şey bırakmaz.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Konserlerde fotoğraf çekmek yasaklanmalıdır.',
      'Fotoğraf makineleri eskisinden daha ucuzdur.',
      'İnsanlar yalnızca konserleri kaydeder.',
      'Anı kaydetme çabası, anı gerçekten yaşamanın önüne geçebilir.',
    ],
    3,
    'Paragraf, kaydetmekle yaşamak arasındaki farka dikkat çekiyor; konser yalnızca örnektir.',
  ],
  [
    `${AF}Bir halkın şarkıları, atasözleri ve masalları yalnızca eğlence değildir. Bu ürünler, yüzyıllar boyunca biriken deneyimi ve değerleri kuşaktan kuşağa taşır.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Halk ürünleri, kültürel birikimi kuşaklara aktaran taşıyıcılardır.',
      'Masallar çocukları eğlendirmek için yazılır.',
      'Şarkılar atasözlerinden daha eskidir.',
      'Eğlence, kültürün en önemli parçasıdır.',
    ],
    0,
    '"Yalnızca eğlence değildir" ifadesinden sonra paragraf, bu ürünlerin birikimi taşıma işlevini öne çıkarıyor.',
  ],
  [
    `${AF}Deniz seviyesinden yükseldikçe hava incelir, oksijen azalır. Bu nedenle dağcılar yüksek zirvelere çıkmadan önce haftalarca alışma çalışması yapar. Aceleci bir tırmanış, en deneyimli sporcu için bile tehlikelidir.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Dağcılar yalnızca deneyimli sporculardan seçilir.',
      'Yüksek yerlerde hava her zaman soğuktur.',
      'Zirveye çıkmak yalnızca fiziksel güç gerektirir.',
      'Yüksek rakımda başarı, sabırlı ve kademeli bir hazırlık ister.',
    ],
    3,
    'Oksijen azlığı, alışma çalışması ve aceleci tırmanışın tehlikesi, hep aynı sonuca bağlanıyor: kademeli hazırlık gerekir.',
  ],
  [
    `${AF}Sözcükler tek başına bir anlam taşır ama asıl gücünü cümle içinde kazanır. Aynı kelime, farklı bağlamlarda bambaşka duyguları çağırabilir. Bu yüzden iyi bir okur, kelimeye değil cümleye bakar.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Sözcüklerin anlamı yoktur.',
      'Sözcüğün anlamı, içinde geçtiği bağlamla belirginleşir.',
      'Cümleler sözcüklerden daha kısadır.',
      'İyi okurlar sözlük kullanmaz.',
    ],
    1,
    'Paragraf, aynı sözcüğün bağlama göre farklı anlam ve duygular taşıdığını vurguluyor.',
  ],
];

const ANA_3: Row[] = [
  [
    `${AF}Teknolojinin hayatı kolaylaştırdığı su götürmez bir gerçek. Ne var ki her kolaylık, bir becerinin elden gitmesi pahasına gelebilir. Yön bulmayı navigasyona bırakan kişi, zamanla çevresini gözlemeyi de unutur.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Teknoloji hayatı zorlaştırmaktadır.',
      'Navigasyon cihazları sıkça yanlış yön verir.',
      'Kolaylık sağlayan teknoloji, kullanılmayan becerileri zayıflatabilir.',
      'Yön bulma yeteneği doğuştan gelir.',
    ],
    2,
    'Yazar teknolojinin yararını kabul ediyor ("su götürmez bir gerçek") ama asıl vurguyu beceri kaybı riskine veriyor. İlk seçenek aşırıdır.',
  ],
  [
    `${AF}Çocuklara her sorunun cevabını hazır vermek, onların düşünme isteğini köreltir. Oysa "Sence neden?" diye sormak, kısa vadede yavaşlatsa da kalıcı öğrenmeyi besler. Eğitimde hız değil, kavrayış belirleyicidir.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Çocuklara soru sormak, onları yavaşlattığı için sakıncalıdır.',
      'Kalıcı öğrenme, hazır cevap vermekten çok düşündürmekle sağlanır.',
      'Eğitimde hız her zaman önemlidir.',
      'Çocukların merakı yaşla birlikte azalır.',
    ],
    1,
    'Paragraf, hazır cevabı geri plana alıp düşündüren soruyu öne çıkarıyor; "yavaşlatma" yalnızca kısa vadeli bir bedel olarak anılıyor.',
  ],
  [
    `${AF}Bazı şairler, anlatmak istediklerini açıkça söylemez; imgelerle, ima ederek sezdirir. Bu, okuru edilgen bir alıcı olmaktan çıkarır ve şiire ortak eder. Anlam, böylece yalnızca şairde değil, okurda da tamamlanır.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Şairler her zaman kapalı yazmalıdır.',
      'Şiiri anlamak için şairin hayatını bilmek gerekir.',
      'İmgeler, şiirin en kısa yoludur.',
      'Şiirde anlam, okurun katılımıyla tamamlanır.',
    ],
    3,
    'Paragrafın son cümlesi özeti verir: anlam şairde başlar, okurda tamamlanır. "Her zaman" gibi kesin ifadeler paragrafta yoktur.',
  ],
  [
    `${AF}Bir ormanın gürültüsü uzaktan sessizlik gibi gelir. Yaklaştıkça yaprak hışırtısı, böcek vızıltısı, kuş sesleri ayrışır. Dikkatle dinlemek, görünürde tek bir sessizliğin içinde nice sesin saklı olduğunu gösterir.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Ormanlar, kentlerden daha sessizdir.',
      'Kuşlar ormanda en çok sabahları öter.',
      'Dikkat, ilk bakışta tekdüze görünenin içindeki çeşitliliği açığa çıkarır.',
      'Uzaktan duyulan sesler yakındakilerden daha güçlüdür.',
    ],
    2,
    'Orman örneği, genel bir fikre varmak için kullanılıyor: dikkatli bakıldığında tek gibi görünen şeyin çok katmanlı olduğu anlaşılır.',
  ],
  [
    `${AF}Tarihçi, belgelerin yalnızca ne söylediğine değil, kim tarafından, hangi amaçla yazıldığına da bakar. Çünkü her belge, yazanın bakış açısını taşır. Bu nedenle tek bir kaynağa dayanan sonuç, ne kadar kesin görünse de temkinle karşılanmalıdır.\n\nBu paragrafın ana fikri hangisidir?`,
    [
      'Tarihî belgelerin hiçbirine güvenilmez.',
      'Tarihçiler yalnızca yazılı belgeleri kullanır.',
      'Belgeyi kimin yazdığı, içeriğinden daha önemlidir.',
      'Kaynaklar bakış açısı taşıdığı için tek kaynağa dayanan sonuçlara temkinli yaklaşmak gerekir.',
    ],
    3,
    'Paragraf, "bakış açısı taşır" gerekçesinden "temkinle karşılanmalı" sonucuna ulaşıyor. "Hiçbirine güvenilmez" ise abartıdır.',
  ],
];

// ─────────────────────────── Çıkarım ───────────────────────────

const CK = 'Verilenlerden kesin olarak çıkan sonucu seç. Yalnızca verilen bilgiye dayan.\n\n';

const CIKARIM_1: Row[] = [
  [
    `${CK}Bütün kediler hayvandır. Pamuk bir kedidir.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Pamuk bir köpektir.',
      'Bütün hayvanlar kedidir.',
      'Pamuk bir hayvandır.',
      'Pamuk evcil bir hayvandır.',
    ],
    2,
    'Kediler hayvan kümesinin içindedir; Pamuk kediyse hayvandır. "Evcil" olduğu verilmemiştir.',
  ],
  [
    `${CK}Yağmur yağarsa maç ertelenecek. Maç ertelenmedi.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Yağmur yağmadı.',
      'Yağmur yağdı.',
      'Maç oynanırken hava güneşliydi.',
      'Maç hiç yapılmadı.',
    ],
    0,
    'Yağmur yağsaydı maç ertelenirdi; ertelenmediğine göre yağmur yağmamıştır.',
  ],
  [
    `${CK}Tüm öğretmenler kitap okur. Selin kitap okumuyor.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Selin öğrencidir.',
      'Selin öğretmen değildir.',
      'Kitap okuyanların hepsi öğretmendir.',
      'Selin hiçbir zaman kitap okumayacaktır.',
    ],
    1,
    'Öğretmen olsaydı kitap okurdu; okumadığına göre öğretmen değildir.',
  ],
  [
    `${CK}Ayşe, Burak'tan daha çok okur. Burak, Cem'den daha çok okur.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Cem hiç okumaz.',
      'Burak, Ayşe\'den çok okur.',
      'Cem, Ayşe\'den çok okur.',
      'Ayşe, Cem\'den daha çok okur.',
    ],
    3,
    'Sıralama: Ayşe > Burak > Cem. Bu yüzden Ayşe, Cem\'den daha çok okur.',
  ],
  [
    `${CK}Bu sokaktaki bütün evlerin bahçesi vardır. Kırmızı ev bu sokaktadır.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Kırmızı evin bahçesi büyüktür.',
      'Kırmızı evin bahçesinde çiçek vardır.',
      'Bu sokaktaki evler kırmızıdır.',
      'Kırmızı evin bahçesi vardır.',
    ],
    3,
    '"Bütün evlerin bahçesi var" ve kırmızı ev bu sokaktaysa onun da bahçesi vardır. Bahçenin büyüklüğü ya da içeriği verilmemiştir.',
  ],
];

const CIKARIM_2: Row[] = [
  [
    `${CK}Bazı yazarlar şairdir. Bütün şairler duyarlıdır.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Bütün yazarlar duyarlıdır.',
      'Bütün duyarlı kişiler şairdir.',
      'Bazı yazarlar duyarlıdır.',
      'Hiçbir yazar şair değildir.',
    ],
    2,
    'Şair olan yazarlar duyarlı olan şairlerin içindedir; yani duyarlı olan bazı yazarlar vardır. Diğerleri ya aşırı genellemedir ya da verilene aykırıdır.',
  ],
  [
    `${CK}Kütüphane ya pazartesi ya da salı günü kapalıdır. Kütüphane pazartesi günü açıktı.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Kütüphane salı günü kapalıdır.',
      'Kütüphane salı günü açıktır.',
      'Kütüphane hafta sonu kapalıdır.',
      'Kütüphane her gün açıktır.',
    ],
    0,
    'İki gün arasında kapalı olan biri varsa ve pazartesi açıksa kapalı olan gün salıdır.',
  ],
  [
    `${CK}Ders çalışan her öğrenci sınavı geçer. Deniz sınavı geçemedi.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Deniz zeki değildir.',
      'Deniz ders çalışmadı.',
      'Sınavı geçenlerin hepsi ders çalışmıştır.',
      'Deniz sınava girmedi.',
    ],
    1,
    'Ders çalışsaydı sınavı geçerdi; geçemediğine göre ders çalışmamıştır. Üçüncü seçenek, verilen koşulu tersine çevirir ve doğru değildir.',
  ],
  [
    `${CK}Toplantıya katılanların hepsi raporu okumuştur. Raporu okuyan kimsenin sorusu kalmamıştır.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Toplantıya katılanlardan hiçbirinin sorusu kalmamıştır.',
      'Toplantıya katılmayanların sorusu vardır.',
      'Toplantıda soru sorulmamıştır.',
      'Raporu okumayanların hepsi toplantıya katılmamıştır.',
    ],
    0,
    'Katılanlar → raporu okumuş → sorusu kalmamış. Zincir birleştirilince birinci seçenek çıkar.',
  ],
  [
    `${CK}Kitap, defterden pahalıdır. Kalem, defterden ucuzdur.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Kalem, kitaptan pahalıdır.',
      'Defter en pahalı olandır.',
      'Kalem ve kitap aynı fiyattadır.',
      'Kitap, kalemden pahalıdır.',
    ],
    3,
    'Sıralama: kitap > defter > kalem. Dolayısıyla kitap, kalemden pahalıdır.',
  ],
];

const CIKARIM_3: Row[] = [
  [
    `${CK}Sınavda başarılı olan herkes ödül alacak. Ödül alan hiç kimse ikinci kez başvuramaz. Zeynep sınavda başarılı oldu.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Zeynep ikinci kez başvuramaz.',
      'Zeynep daha önce ödül almıştır.',
      'Zeynep ödülü beğenmeyecektir.',
      'Sınavda başarılı olmayanlar başvurabilir.',
    ],
    0,
    'Zincir: başarılı → ödül alır → ikinci kez başvuramaz. Zeynep ilk halkadadır, sonuç son halkadır. Diğer seçenekler verilenlerden çıkmaz.',
  ],
  [
    `${CK}Bazı şiirler uzundur. Uzun olan hiçbir metin tek solukta okunmaz.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Bütün şiirler tek solukta okunur.',
      'Tek solukta okunmayan bazı şiirler vardır.',
      'Kısa olan her şiir tek solukta okunur.',
      'Hiçbir şiir uzun değildir.',
    ],
    1,
    'Uzun olan şiirler uzun metinlerdir; uzun metinler tek solukta okunmaz. O hâlde tek solukta okunmayan şiirler vardır.',
  ],
  [
    `${CK}Bir kişi hem sabırlı hem çalışkansa projeyi bitirir. Murat çalışkandır ama projeyi bitirmedi.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Murat tembeldir.',
      'Murat sabırlı değildir.',
      'Projeyi bitirenlerin hepsi sabırlıdır ve çalışkandır.',
      'Murat projeyi daha sonra bitirecektir.',
    ],
    1,
    'İki koşul birlikte sağlansa proje biterdi. Proje bitmedi ve çalışkanlık sağlanıyor; demek ki eksik olan sabırdır.',
  ],
  [
    `${CK}Ayşe ve Ceren aynı sınıftadır. Ceren ile Deniz aynı sınıfta değildir.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Ayşe ile Deniz aynı sınıftadır.',
      'Ayşe, Ceren\'den farklı sınıftadır.',
      'Ayşe ile Deniz aynı sınıfta değildir.',
      'Deniz hiçbir sınıfta değildir.',
    ],
    2,
    'Ayşe ile Deniz aynı sınıfta olsaydı, Ceren de Ayşe\'yle aynı sınıfta olduğu için Deniz\'le de aynı sınıfta olurdu; bu verilene aykırı.',
  ],
  [
    `${CK}Bu kulübün üyelerinin hepsi ya yazardır ya ressam. Hiçbir ressam müzik dinlemez. Nil bu kulübün üyesidir ve müzik dinliyor.\n\nBuna göre hangisi kesinlikle doğrudur?`,
    [
      'Nil ressamdır.',
      'Nil yazardır.',
      'Yazarlar müzik dinler.',
      'Nil hem yazar hem ressamdır.',
    ],
    1,
    'Nil müzik dinlediğine göre ressam olamaz; üyeler yazar ya da ressam olduğundan Nil yazardır.',
  ],
];

// ─────────────────────────── Tutarsızlık yakalama ───────────────────────────

const TS = 'Paragrafta anlatım akışını bozan ya da diğer cümlelerle çelişen cümleyi bul.\n\n';
const TS_OPT = ['I. cümle', 'II. cümle', 'III. cümle', 'IV. cümle'];

const TUTARSIZLIK_1: Row[] = [
  [
    `${TS}(I) Arılar çiçeklerden nektar toplar. (II) Topladıkları nektarı peteğe taşıyarak bala dönüştürür. (III) Penguenler soğuk bölgelerde yaşar. (IV) Bal, arıların kış boyunca beslenmesini sağlar.`,
    TS_OPT,
    2,
    'Diğer cümleler arıların nektarı baldan beslenmeye uzanan çalışmasını anlatıyor; penguenlerle ilgili cümle konudan kopuk.',
  ],
  [
    `${TS}(I) Yeni açılan kitap kafe, mahallenin en çok sevilen mekânı oldu. (II) Satranç tahtasında her taşın kendine özgü bir hareketi vardır. (III) İnsanlar orada hem kahve içiyor hem kitap okuyor. (IV) Kafenin rafları sürekli yeni kitaplarla yenileniyor.`,
    TS_OPT,
    1,
    'Paragraf bir kitap kafeyi anlatıyor; satranç taşlarından söz eden cümle bu akışa uymuyor.',
  ],
  [
    `${TS}(I) Sabah sis çökünce köy yolu görünmez oldu. (II) Şoförler hızlarını düşürüp farları yaktı. (III) Bu tür zamanlarda dikkatli olmak hayat kurtarır. (IV) Çocuklar için masal kitapları her yaşta ilgi görür.`,
    TS_OPT,
    3,
    'İlk üç cümle sisli havada güvenli sürüşten söz ediyor; masal kitaplarıyla ilgili cümle akışı bozuyor.',
  ],
  [
    `${TS}(I) Satranç tahtasında her taşın kendine özgü bir hareketi vardır. (II) Zeytin ağacı kurak iklimlere dayanıklıdır. (III) Kökleri toprağın derinlerine inerek suyu arar. (IV) Bu yüzden Ege kıyılarında yüzlerce yıl yaşayan zeytin ağaçlarına rastlanır.`,
    TS_OPT,
    0,
    'II, III ve IV zeytin ağacının dayanıklılığını bir sebep-sonuç zinciriyle anlatıyor; ilk cümle bu konuyla ilgisiz.',
  ],
  [
    `${TS}(I) Çocuk, bisikletine ilk bindiğinde sürekli düşüyordu. (II) Müzedeki vazolar özel bir ışık altında sergileniyor. (III) Babası arkasından tutarak dengesini bulmasına yardım etti. (IV) Birkaç denemeden sonra tek başına pedal çevirebildi.`,
    TS_OPT,
    1,
    'Paragraf bir çocuğun bisiklet öğrenişini anlatıyor; müzedeki vazolara dair cümle bu öykünün dışında kalıyor.',
  ],
];

const TUTARSIZLIK_2: Row[] = [
  [
    `${TS}(I) Ahmet, sınava hazırlanmak için haftalarca düzenli çalıştı. (II) Her gün aynı saatte masasına oturup konuları tekrar etti. (III) Sınav günü hiç hazırlık yapmadığı için çok heyecanlıydı. (IV) Sonuçlar açıklandığında emeğinin karşılığını aldı.`,
    TS_OPT,
    2,
    'III. cümle, Ahmet\'in hiç hazırlık yapmadığını söylüyor; oysa diğer cümleler düzenli çalıştığını anlatıyor.',
  ],
  [
    `${TS}(I) Müzenin yeni salonu, sessizliği seven ziyaretçiler için açıldı. (II) Girişte ziyaretçilerden gürültülü bir müzik eşliğinde dolaşmaları istendi. (III) Salonda ses geçirmez duvarlar ve yumuşak halılar kullanıldı. (IV) Böylece ziyaretçiler eserlere rahatça odaklanabilir.`,
    TS_OPT,
    1,
    'Salon sessizlik için tasarlanmışken gürültülü müzikle dolaşmayı isteyen II. cümle diğerleriyle çelişiyor.',
  ],
  [
    `${TS}(I) Bu bölgede kışlar oldukça soğuk geçer. (II) Yaz aylarında ise günler uzar ve hava ısınır. (III) Köylüler uzun kış boyunca evlerinde kalın battaniyeler kullanır. (IV) Bölgenin kışları sıcak olduğu için kimse ısınmaya ihtiyaç duymaz.`,
    TS_OPT,
    3,
    'IV. cümle kışların sıcak olduğunu söyleyerek I. ve III. cümleyle çelişiyor.',
  ],
  [
    `${TS}(I) Ressam, tabloyu bitirdikten sonra uzun süre ona baktı. (II) Her fırça darbesinin bilinçli bir seçim olduğunu söylüyordu. (III) Oysa tablodaki hiçbir ayrıntıyı düşünerek yapmadığını da eklemişti. (IV) Bu titizliği, eserlerinin değerini artırıyordu.`,
    TS_OPT,
    2,
    'II ve IV titiz, bilinçli bir çalışmayı anlatıyor; III ise bununla çelişerek hiçbir şeyi düşünmeden yaptığını söylüyor.',
  ],
  [
    `${TS}(I) Dil, toplumla birlikte sürekli değişir. (II) Yeni teknolojiler yeni sözcükler doğurur. (III) Kullanılmayan bazı eski sözcükler zamanla unutulur. (IV) Bu yüzden bir dilin hiçbir zaman değişmediği söylenebilir.`,
    TS_OPT,
    3,
    'IV. cümle, değişmediğini söyleyerek önceki üç cümlede anlatılan değişimle çelişiyor.',
  ],
];

const TUTARSIZLIK_3: Row[] = [
  [
    `${TS}(I) Araştırmacılar, uyku süresi kısalan öğrencilerin dikkat testlerinde daha düşük puan aldığını gözlemledi. (II) Bu bulgu, uykunun öğrenmeyi desteklediğini gösteriyor. (III) Bu nedenle okul saatlerinin gençlerin uyku düzenine göre ayarlanması öneriliyor. (IV) Uykusuzluğun öğrenmeyi kolaylaştırdığı da bu çalışmayla ortaya konmuştur.`,
    TS_OPT,
    3,
    'IV. cümle, çalışmanın bulgusuna ve II-III. cümlelerin sonucuna ters düşüyor.',
  ],
  [
    `${TS}(I) Atasözleri, bir toplumun uzun yılların deneyimini kısa ve akılda kalıcı biçimde aktarır. (II) Bu yüzden çoğunlukla ölçülü ve uyaklı kurulurlar. (III) Bir kelimeyi sözlükte ararken harf sırasından yararlanılır. (IV) Böylece söz kolay ezberlenir ve kuşaktan kuşağa yaşar.`,
    TS_OPT,
    2,
    'I, II ve IV atasözlerinin akılda kalıcı yapısını anlatıyor; sözlükte aramaya dair III. cümle konudan çıkıyor.',
  ],
  [
    `${TS}(I) Çalışmaya göre günde yarım saat yürüyenlerin ruh hâli daha iyi. (II) Hiç hareket etmeyenlerin stres düzeyi ise en düşük gruptur. (III) Çünkü düzenli yürüyüş stres düzeyini düşürüyor. (IV) Uzmanlar kısa yürüyüşlerin bile fayda sağlayabileceğini belirtiyor.`,
    TS_OPT,
    1,
    'III. cümle yürüyüşün stresi düşürdüğünü söylüyor; hiç hareket etmeyenlerin stresinin en düşük olduğunu söyleyen II. cümle buna aykırı.',
  ],
  [
    `${TS}(I) Göçmen kuşlar, bulundukları yerden hiç ayrılmayan türlerdir. (II) Göç, hem yiyecek bulmak hem de yavru yetiştirmek için yapılır. (III) Yolculuk sırasında kuşlar güneşin ve yıldızların konumundan yararlanır. (IV) Bu sayede bir yolu yıllarca şaşmadan izleyebilirler.`,
    TS_OPT,
    0,
    'II, III ve IV kuşların yolculuk yaptığını anlatıyor; I. cümle ise göç edenlere "hiç ayrılmayan" diyerek kendisiyle ve diğerleriyle çelişiyor.',
  ],
  [
    `${TS}(I) Dilbilimciler, çocukların anadilini kuralları ezberleyerek değil, duyduklarını işleyerek edindiğini söyler. (II) Çocuklar, yetişkinler düzeltmediği hâlde zamanla doğru cümleler kurar. (III) Bazı yabancı dillerde sesler ve harfler arasındaki ilişki çok karmaşıktır. (IV) Bu durum, dilin büyük ölçüde maruz kalarak edinildiğini düşündürüyor.`,
    TS_OPT,
    2,
    'IV. cümledeki "bu durum", I ve II\'deki gözleme gönderme yapıyor; yabancı dillerin yazımını anlatan III. cümle akışı kesiyor.',
  ],
];

// ─────────────────────────── Dışa açılan liste ───────────────────────────

export const VERBAL_SETS: QuizSet[] = [
  buildSet('analoji', 'analoji', 'Sözel Analoji', 1, ANALOJI_1),
  buildSet('analoji', 'analoji', 'Sözel Analoji', 2, ANALOJI_2),
  buildSet('analoji', 'analoji', 'Sözel Analoji', 3, ANALOJI_3),
  buildSet('cumle-tamamlama', 'cumle', 'Cümle Tamamlama', 1, CUMLE_1),
  buildSet('cumle-tamamlama', 'cumle', 'Cümle Tamamlama', 2, CUMLE_2),
  buildSet('cumle-tamamlama', 'cumle', 'Cümle Tamamlama', 3, CUMLE_3),
  buildSet('kelime-baglam', 'kelime', 'Bağlamdan Anlam', 1, KELIME_1),
  buildSet('kelime-baglam', 'kelime', 'Bağlamdan Anlam', 2, KELIME_2),
  buildSet('kelime-baglam', 'kelime', 'Bağlamdan Anlam', 3, KELIME_3),
  buildSet('ana-fikir', 'anafikir', 'Ana Fikir', 1, ANA_1),
  buildSet('ana-fikir', 'anafikir', 'Ana Fikir', 2, ANA_2),
  buildSet('ana-fikir', 'anafikir', 'Ana Fikir', 3, ANA_3),
  buildSet('cikarim', 'cikarim', 'Çıkarım', 1, CIKARIM_1),
  buildSet('cikarim', 'cikarim', 'Çıkarım', 2, CIKARIM_2),
  buildSet('cikarim', 'cikarim', 'Çıkarım', 3, CIKARIM_3),
  buildSet('tutarsizlik', 'tutarsizlik', 'Tutarsızlık Yakalama', 1, TUTARSIZLIK_1),
  buildSet('tutarsizlik', 'tutarsizlik', 'Tutarsızlık Yakalama', 2, TUTARSIZLIK_2),
  buildSet('tutarsizlik', 'tutarsizlik', 'Tutarsızlık Yakalama', 3, TUTARSIZLIK_3),
];

/** Bir becerinin setleri, kolaydan zora (dosyadaki sıra). */
export function verbalSetsBySkill(skill: QuizSkill): QuizSet[] {
  return VERBAL_SETS.filter((s) => s.questions.some((q) => q.skill === skill));
}

const DAILY_POOL: { set: QuizSet; question: QuizQuestion }[] = VERBAL_SETS.flatMap((set) =>
  set.questions.map((question) => ({ set, question })),
);

/**
 * Günün kavrayış sorusu — tüm sözel sorular arasından `pickForDay` ile
 * deterministik. Salt 19: projede kullanılan diğer saltlarla (0-5, günün sözü
 * 6, dinleme 13, özetleme 17) çakışmasın — aynı gün iki kart aynı sıradaki
 * öğeye düşmesin diye her günlük seçimin kendi salt'ı var.
 */
export function pickDailyVerbalQuestion(date: Date = new Date()): {
  set: QuizSet;
  question: QuizQuestion;
} {
  return pickForDay(DAILY_POOL, date, 19);
}
