// İletişim Becerileri ayağı — senaryo kataloğu, etkin dinleme alıştırmaları,
// günün iletişim ipucu.
//
// Bu veri `quiz.ts`'teki çoktan seçmeli modeli KULLANMAZ: tek doğru cevap
// iddiası yok. Her seçenek "işler / kısmen / işlemez" diye etiketlenir ve
// karşı tarafta bırakacağı etki sade dille anlatılır. Karne'de doğruluk değil
// **tamamlanma** sayılır (YAPILACAKLAR_FESAHAT → Bölüm 3, İletişim).
//
// Metin kuralı: içerik öneri sunar; kişilik testi, psikolojik değerlendirme
// ya da terapi/danışmanlık değildir. `why` açıklamaları kişiyi yargılamaz,
// yalnızca seçeneğin karşı tarafta bırakacağı etkiyi anlatır.

import { pickForDay } from '../utils/dateUtils';

export type CommCategory =
  | 'zor-konusma'
  | 'geri-bildirim'
  | 'ikna'
  | 'catisma'
  | 'kucuk-konusma'
  | 'topluluk';

export const COMM_CATEGORY_META: Record<CommCategory, { title: string; subtitle: string }> = {
  'zor-konusma': {
    title: 'Zor konuşmalar',
    subtitle: 'İtiraz etme, hayır deme, hata kabul etme, kötü haber verme',
  },
  'geri-bildirim': {
    title: 'Geri bildirim',
    subtitle: 'Vermek, almak, takdir etmek',
  },
  ikna: {
    title: 'İkna ve müzakere',
    subtitle: 'Talebini açık ve karşılıklı kazanımla anlatmak',
  },
  catisma: {
    title: 'Çatışmayı yumuşatma',
    subtitle: 'Gerilimi düşürmek, yanlış anlaşılmayı toparlamak',
  },
  'kucuk-konusma': {
    title: 'Küçük konuşma',
    subtitle: 'Sohbeti açmak, sürdürmek, nazikçe kapatmak',
  },
  topluluk: {
    title: 'Toplulukta söz alma',
    subtitle: 'Toplantıda, sınıfta, kalabalıkta kendini duyurmak',
  },
};

/** Seçeneğin karşı tarafta bırakacağı etki. Doğru/yanlış değil; "işler" en olası iyi sonuç. */
export type ScenarioEffect = 'isler' | 'kismen' | 'islemez';

export const SCENARIO_EFFECT_LABELS: Record<ScenarioEffect, string> = {
  isler: 'İşler',
  kismen: 'Kısmen işler',
  islemez: 'Pek işlemez',
};

export type ScenarioOption = { text: string; effect: ScenarioEffect; why: string };

export type CommScenario = {
  /** Katalogda benzersiz; Karne tamamlanma kayıtları bu id ile tutulur. */
  id: string;
  category: CommCategory;
  title: string;
  /** 2-4 cümle durum. */
  situation: string;
  /** "Ne dersin?" türü soru. */
  prompt: string;
  /** 3-4 seçenek, en az biri 'isler'. */
  options: ScenarioOption[];
  /** Tek cümlelik ilke. */
  takeaway: string;
  /** Yapay zekâ açıkken serbest cevap değerlendirmesine verilecek bağlam (durumun amacı, karşı tarafın beklentisi). */
  aiContext: string;
};

export type ListeningExercise = {
  id: string;
  title: string;
  /** Konuşan kişinin söylediği 2-4 cümle. */
  utterance: string;
  /** Duyguyu adlandırma. */
  feelingOptions: string[];
  feelingIndex: number;
  /** İhtiyacı adlandırma. */
  needOptions: string[];
  needIndex: number;
  /** Yansıtıcı cevap seçimi. */
  reflectOptions: ScenarioOption[];
};

export type CommTip = { id: string; text: string; category: CommCategory };

// ───────────────────────────────────────────────────────────────────────────
// Senaryolar
// ───────────────────────────────────────────────────────────────────────────

export const COMM_SCENARIOS: CommScenario[] = [
  // ── Zor konuşmalar ───────────────────────────────────────────────────────
  {
    id: 'zk-01',
    category: 'zor-konusma',
    title: 'Toplantıda plana itiraz',
    situation:
      'Müdürün sunduğu takvim, ekibin elindeki iş yüküne göre gerçekçi görünmüyor. Toplantıda herkes sessiz. Sen sorunu net görüyorsun ama müdürün planı beğenerek anlattığını da fark ettin.',
    prompt: 'İtirazını nasıl dile getirirsin?',
    options: [
      {
        text: '"Planın amacını anladım. Mevcut iş yüküyle üç haftada yetişmemiz zor görünüyor; bir hafta eklenebilir mi, ya da hangi işi öne almamız gerekir?"',
        effect: 'isler',
        why: 'Önce hedefi onaylar, sonra somut gerekçeyi ve çözüm yolunu sunar. Karşı taraf eleştirilmiş değil, soruna ortak edilmiş hisseder.',
      },
      {
        text: '"Bu takvim olmaz, kimse yetişemez."',
        effect: 'islemez',
        why: 'Gerekçe ve alternatif yok; karşı taraf kendini savunmaya geçer, konu planın kendisinden çıkıp tona kayar.',
      },
      {
        text: 'Toplantıda bir şey demez, sonra koridorda birkaç kişiye şikâyet edersin.',
        effect: 'islemez',
        why: 'Sorun karar verene ulaşmaz; şikâyet dedikoduya dönüşür ve plan olduğu gibi ilerler.',
      },
      {
        text: '"Belki bir şey diyeceğim ama yanlış anlaşılabilir, boş verin." diye başlar, yarıda bırakırsın.',
        effect: 'kismen',
        why: 'Konuyu açmış olursun ama belirsiz kalır; dinleyenler ne kastettiğini tahmin etmek zorunda kalır.',
      },
    ],
    takeaway: 'İtirazı kişiye değil plana yönelt ve yanına bir çözüm önerisi koy.',
    aiContext:
      'Kullanıcı bir toplantıda yöneticisinin gerçekçi olmayan takvimine itiraz edecek. İyi bir cevap hedefi kabul eder, somut gerekçe ve alternatif önerir, suçlayıcı olmaz. Karşı taraf (müdür) planını beğenerek anlatmış, kendini eleştirilmiş hissetmek istemez.',
  },
  {
    id: 'zk-02',
    category: 'zor-konusma',
    title: 'Arkadaşa hayır demek',
    situation:
      'Yakın arkadaşın hafta sonu taşınıyor ve senden yardım istedi. Ama o gün sınavın var ve hazırlanman gerekiyor. Arkadaşın cevabını bekliyor.',
    prompt: 'Cevabın ne olur?',
    options: [
      {
        text: '"Cumartesi sınavım var, gün boyu gelemem. Ama cuma akşamı kolileri paketlemene yardım edebilirim."',
        effect: 'isler',
        why: 'Net bir hayır, kısa bir gerekçe ve yapabileceğin bir alternatif var. Arkadaşın reddedilmiş değil, bir seçenekle karşılanmış olur.',
      },
      {
        text: '"Bakarız, belki gelirim." deyip cevabı belirsiz bırakırsın.',
        effect: 'islemez',
        why: 'Karşı taraf sana göre plan yapar; son anda gelememek hem sınav hazırlığını hem arkadaşlığı zorlar.',
      },
      {
        text: 'Uzun uzun özür dileyip bin türlü gerekçe sıralarsın.',
        effect: 'kismen',
        why: 'Hayır net çıkar ama aşırı açıklama savunmaya geçmiş gibi durur ve karşı tarafı da rahatsız edebilir.',
      },
      {
        text: 'İstemediğin hâlde "tamam gelirim" dersin, sonra sınava gün boyu yetişemezsin.',
        effect: 'islemez',
        why: 'Kısa vadede sorun çözülmüş görünür ama biriken yük kırgınlığa ya da verilemeyen sözlere dönüşebilir.',
      },
    ],
    takeaway: 'Kısa gerekçe + net hayır + elinden gelen bir alternatif, çoğu zaman yeterlidir.',
    aiContext:
      'Kullanıcı yakın bir arkadaşının taşınma yardımı talebini sınavı yüzünden geri çevirecek. İyi bir cevap net bir hayır içerir, kısa gerekçe verir, aşırı özür dilemez ve mümkünse alternatif sunar. Arkadaş yardım bekliyor ama reddedilmiş hissetmek istemez.',
  },
  {
    id: 'zk-03',
    category: 'zor-konusma',
    title: 'Hatayı kabul etmek',
    situation:
      'Müşteriye giden raporda yanlış bir rakam kullandığını fark ettin. Rapor iki gün önce gönderildi ve henüz kimse fark etmedi. Ekip liderin bu rapora güveniyor.',
    prompt: 'Ekip liderine ne dersin?',
    options: [
      {
        text: '"Müşteriye giden raporda bir rakam hatası buldum; düzeltilmiş hâlini hazırladım. Müşteriye bugün bildirmeyi önerebilir miyim?"',
        effect: 'isler',
        why: 'Hata kısa ve açık söylenir, çözüm hazırdır. Karşı taraf sürprizle değil, yönetilebilir bir durumla karşılaşır.',
      },
      {
        text: 'Kimse fark etmediği için hiçbir şey demezsin; sonraki raporda sessizce düzeltirsin.',
        effect: 'islemez',
        why: 'Hata sonradan başkası tarafından bulunursa mesele rakamdan çıkıp güvene döner.',
      },
      {
        text: '"Tabii ki benim hatam değil, veriler yanlış gelmişti." dersin.',
        effect: 'islemez',
        why: 'Sorumluluğu başkasına atmak konuyu çözmez; liderin dikkati hatadan savunmaya kayar.',
      },
      {
        text: '"Çok özür dilerim, ben hep böyle hatalar yapıyorum, belki bu işe uygun değilim." dersin.',
        effect: 'kismen',
        why: 'Hata kabul edilmiş olur ama aşırı kendini suçlama konuşmayı çözümden uzaklaştırır; karşı taraf seni rahatlatmakla uğraşmak zorunda kalır.',
      },
    ],
    takeaway: 'Hatayı erken, kısa ve çözümle birlikte söylemek güveni korur.',
    aiContext:
      'Kullanıcı gönderilmiş bir raporda kendi hatasını ekip liderine bildirecek. İyi bir cevap hatayı açıkça kabul eder, gereksiz kendini suçlamaz, başkasını suçlamaz ve bir düzeltme planı sunar. Lider, bu rapora güveniyor ve sürprizden hoşlanmaz.',
  },
  {
    id: 'zk-04',
    category: 'zor-konusma',
    title: 'Tatile gelemeyeceğini söylemek',
    situation:
      'Annenle birlikte planladığınız bayram tatiline iş yoğunluğu yüzünden katılamayacaksın. Annen bu planı haftalardır dört gözle bekliyor.',
    prompt: 'Haberi nasıl verirsin?',
    options: [
      {
        text: '"Anne, sana üzücü bir haberim var: işte yoğunluk çıktı, tatile gelemeyeceğim. Sen ne kadar beklediğini biliyorum, bu yüzden bayramdan sonra bir hafta sonu sadece birlikte geçirelim istiyorum."',
        effect: 'isler',
        why: 'Haber en başta ve açık verilir, karşı tarafın beklentisi kabul edilir ve somut bir telafi önerilir.',
      },
      {
        text: 'Mesajla kısaca "gelemiyorum" yazıp telefonu kapatırsın.',
        effect: 'islemez',
        why: 'Haberin ağırlığı karşılanmamış kalır; karşı taraf soru soramaz ve soğuk bir ton hissedebilir.',
      },
      {
        text: 'Önce yarım saat başka konulardan konuşur, haberi sonunda hızlıca geçersin.',
        effect: 'kismen',
        why: 'Gerginliği azaltmaya çalışırsın ama karşı taraf konuşma boyunca bir şey olduğunu sezer ve haber daha sert gelir.',
      },
      {
        text: '"Boşuna bu kadar heyecanlanmışsın, zaten önemli bir şey yapacak değildik." dersin.',
        effect: 'islemez',
        why: 'Karşı tarafın beklentisini küçümsemek, haberden çok bu cümleyle kırılmasına yol açar.',
      },
    ],
    takeaway: 'Kötü haberi erkenden, açık söyle ve karşı tarafın beklentisini görmezden gelme.',
    aiContext:
      'Kullanıcı annesine birlikte planladıkları tatile gelemeyeceğini söyleyecek. İyi bir cevap haberi dolandırmadan verir, annenin beklentisini ve hayal kırıklığını kabul eder, mümkünse telafi önerir. Annesi sevgi ve beklenti içinde, duygusal olarak etkilenebilir.',
  },
  {
    id: 'zk-05',
    category: 'zor-konusma',
    title: 'Sınav notuna itiraz',
    situation:
      'Sınav kâğıdında bir sorunun yarım puanla değerlendirildiğini, oysa çözümünün doğru olduğunu düşünüyorsun. Öğretmen genel olarak seviliyor ve dersten sonra odasında oluyor.',
    prompt: 'Öğretmenle konuşmaya nasıl başlarsın?',
    options: [
      {
        text: '"Hocam, 4. sorunun değerlendirilmesini bir de birlikte inceleyebilir miyiz? Çözümümün şu adımda doğru olduğunu düşünüyorum, sizin gördüğünüz eksik neydi?"',
        effect: 'isler',
        why: 'Soru biçiminde, somut ve meraklı bir giriş; öğretmen kendini suçlanmış değil, ayrıntıya davet edilmiş hisseder.',
      },
      {
        text: '"Siz yanlış puan vermişsiniz, düzeltin."',
        effect: 'islemez',
        why: 'Hüküm veren bir ton karşı tarafı savunmaya iter; asıl mesele puanlamadan çıkıp saygıya kayar.',
      },
      {
        text: 'Sınıfta herkesin önünde sorunun puanlamasını sorgularsın.',
        effect: 'islemez',
        why: 'Seyirci önünde yapılan itiraz karşı tarafı köşeye sıkıştırır; geri adım atmak zorlaşır.',
      },
      {
        text: 'Hiçbir şey demez, "boş ver, zaten böyle olur" diye geçersin.',
        effect: 'kismen',
        why: 'Gerginlikten kaçınırsın ama haklı olabileceğin bir konuda kendini duyurmamış olursun.',
      },
    ],
    takeaway: 'Birine itiraz ederken "yanlışsınız" yerine "birlikte bakalım" demek kapıyı açık tutar.',
    aiContext:
      'Kullanıcı bir öğretmenine sınav puanıyla ilgili saygılı biçimde itiraz edecek. İyi bir cevap soru sorar, somut örnek gösterir, hüküm vermez ve öğretmenin değerlendirmesine saygı gösterir. Öğretmen seviliyor ama kendini savunmaya geçebilir.',
  },
  {
    id: 'zk-06',
    category: 'zor-konusma',
    title: 'Ek görevi geri çevirmek',
    situation:
      'Zaten iki projeyi yetiştirmeye çalışırken yöneticin sana üçüncü bir iş verdi ve "bunu da sen halledersin değil mi?" dedi. Hepsini kaliteli yapmak mümkün görünmüyor.',
    prompt: 'Yöneticine nasıl dönersin?',
    options: [
      {
        text: '"Bu işi önemsiyorum. Şu an A ve B projeleri bu hafta teslim; üçüncüyü alırsam birinin kalitesi düşer. Hangisini ertelememiz uygun olur?"',
        effect: 'isler',
        why: 'İşi reddetmek yerine gerçek durumu ve önceliği masaya koyar; karar yine yöneticidedir ama bilgiyle verir.',
      },
      {
        text: '"Tamam hallederim." deyip akşamlara kalmayı göze alırsın.',
        effect: 'islemez',
        why: 'Anlık rahatlık sağlar ama sonrasında kalite ya da teslim sorunu yaşanırsa durum yöneticiye sürpriz olur.',
      },
      {
        text: '"Hayır, bu benim işim değil."',
        effect: 'islemez',
        why: 'Gerekçe ve öncelik bilgisi verilmediğinden isteksizlik gibi algılanabilir; konuşma kapanır.',
      },
      {
        text: '"Çok yoğunum ama yine de bakarım." dersin.',
        effect: 'kismen',
        why: 'Yoğunluğun bir işaretidir ama net bir sınır çizmez; yönetici işi sana verilmiş sayar.',
      },
    ],
    takeaway: 'Sınır koyarken önceliği görünür kıl; karar için gereken bilgiyi karşı tarafa ver.',
    aiContext:
      'Kullanıcı iş yükü yüzünden yöneticisinin verdiği ek görevi kabul etmekte zorlanıyor. İyi bir cevap işi küçümsemeden mevcut öncelikleri açıklar, seçenek sunar ve yöneticiyi karara dahil eder. Yönetici kasıtlı olarak yük bindirmiyor olabilir, durumun farkında olmayabilir.',
  },

  // ── Geri bildirim ────────────────────────────────────────────────────────
  {
    id: 'gb-01',
    category: 'geri-bildirim',
    title: 'Meslektaşın sunumu',
    situation:
      'Bir meslektaşın sunumunu yaptı. İçerik güçlüydü ama slaytlar çok kalabalıktı ve sunum süreyi aştı. Sonra yanına geldi: "Nasıldı?" diye soruyor.',
    prompt: 'Ne dersin?',
    options: [
      {
        text: '"Verilerini çok iyi seçmişsin, özellikle ikinci grafik etkiliydi. Slaytları biraz sadeleştirsen ve süreye dikkat etsen, daha da güçlü olur."',
        effect: 'isler',
        why: 'Somut bir güçlü yön ve somut bir gelişim önerisi var. Karşı taraf neyi koruyacağını ve neyi değiştireceğini bilir.',
      },
      {
        text: '"Çok güzeldi, harikaydı!" deyip geçersin.',
        effect: 'kismen',
        why: 'Nezaket gösterir ama karşı taraf bir sonraki sunumda neyi geliştireceğini öğrenemez.',
      },
      {
        text: '"Slaytlar çok kalabalıktı, süreyi de aştın." deyip susarsın.',
        effect: 'islemez',
        why: 'Sadece eksik sıralandığında iyi yapılanlar görünmez kalır; karşı taraf ağırlıkla yargılandığını hissedebilir.',
      },
      {
        text: '"Ben olsam bunu hiç böyle yapmazdım." dersin.',
        effect: 'islemez',
        why: 'Kişisel tercihe dayanır, ne değiştirilmesi gerektiğini söylemez; karşı taraf yönlendirilmeden eleştirilmiş olur.',
      },
    ],
    takeaway: 'İyi geri bildirim somuttur: neyi gördüğünü ve neyin işe yarayacağını söyler.',
    aiContext:
      'Kullanıcı bir meslektaşının sunumuna geri bildirim verecek. İyi bir cevap hem güçlü bir yönü hem de gelişim alanını somut örnekle söyler, kişiye değil davranışa odaklanır. Meslektaş fikir istiyor ama emek verdiği bir işin eleştirilmesinden çekinebilir.',
  },
  {
    id: 'gb-02',
    category: 'geri-bildirim',
    title: 'Yöneticiden eleştiri almak',
    situation:
      'Yöneticin hazırladığın raporu okudu ve "Sonuç bölümü zayıf, ne dediğin anlaşılmıyor." dedi. İlk tepkin içinden bir sıkıntı hissetmek.',
    prompt: 'Ne dersin?',
    options: [
      {
        text: '"Teşekkürler. Hangi kısmın belirsiz kaldığını bir örnekle gösterir misiniz? Ben de ona göre toparlayayım."',
        effect: 'isler',
        why: 'Eleştiriyi alır ve somutlaştırmasını ister; karşı taraf kendini dinlenmiş hisseder, sen de ne yapacağını öğrenirsin.',
      },
      {
        text: '"Ben bu bölümü çok emek vererek yazdım, bence gayet açık."',
        effect: 'islemez',
        why: 'Savunmaya geçmek geri bildirimin devam etmesini zorlaştırır; karşı taraf bir daha açık söylemekten çekinebilir.',
      },
      {
        text: '"Haklısınız, ben zaten hep kötü yazıyorum." dersin.',
        effect: 'kismen',
        why: 'Eleştiriyi kabul eder ama aşırı genelleme konuşmayı çözümden uzaklaştırır.',
      },
      {
        text: 'Hiçbir şey demez, yüzünde kırgınlıkla çıkarsın.',
        effect: 'islemez',
        why: 'Karşı taraf eleştirinin işe yarayıp yaramadığını anlayamaz; sonraki raporda aynı konuşma tekrar edebilir.',
      },
    ],
    takeaway: 'Eleştiriyi "daha açık anlat" diye sormak savunmaya geçmekten daha hızlı sonuç verir.',
    aiContext:
      'Kullanıcı yöneticisinden aldığı bir eleştiriye cevap verecek. İyi bir cevap eleştiriyi duyduğunu belli eder, savunmaya geçmez, somut örnek ister ve bir sonraki adımı netleştirir. Yönetici yardım etmek istiyor ama sert bir cümle kurmuş olabilir.',
  },
  {
    id: 'gb-03',
    category: 'geri-bildirim',
    title: 'Hep geç kalan arkadaş',
    situation:
      'Arkadaşın buluşmalara sık sık yarım saat geç geliyor. Bu seferki sinema planında filmin ilk bölümünü kaçırdın. Ona bunu nazikçe ama açıkça söylemek istiyorsun.',
    prompt: 'Nasıl söylersin?',
    options: [
      {
        text: '"Son üç buluşmada yarım saat geç kaldın ve ben beklerken biraz gergin oluyorum. Gelecek sefer saati birlikte yeniden mi kuralım, yoksa geç kalacaksan haber mi versen?"',
        effect: 'isler',
        why: 'Davranış ve etki net anlatılır, suçlama yoktur ve çözüm için ortak bir yol sunulur.',
      },
      {
        text: '"Sen hep geç kalıyorsun, gerçekten saygısızsın."',
        effect: 'islemez',
        why: 'Kişiyi yargılayan genelleme karşı tarafı savunmaya iter; konu saatten çıkıp karakterine kayar.',
      },
      {
        text: 'Hiçbir şey söylemez, bir dahaki sefere bile bile geç gidersin.',
        effect: 'islemez',
        why: 'Karşı taraf sorunun farkına varmaz, sen de içinde biriktirirsin; ilişkide sessiz bir mesafe oluşabilir.',
      },
      {
        text: 'Şaka yollu "Bu sefer de mi?" dersin.',
        effect: 'kismen',
        why: 'Hafif bir ima olur; karşı taraf şaka olarak alırsa asıl mesaj ulaşmaz.',
      },
    ],
    takeaway: '"Sen hep…" yerine "şu olduğunda ben şunu hissediyorum" demek mesajı kabul edilebilir kılar.',
    aiContext:
      'Kullanıcı sürekli geç kalan bir arkadaşına bunu söyleyecek. İyi bir cevap belirli bir durumu anlatır, kendi etkisini paylaşır, suçlayıcı genelleme yapmaz ve ortak bir çözüm önerir. Arkadaşlık yakın, ilişkiyi zedelemeden konuşulması isteniyor.',
  },
  {
    id: 'gb-04',
    category: 'geri-bildirim',
    title: 'Takdir etmek',
    situation:
      'Ekipteki stajyer, geçen hafta zor bir müşteriyle çok sakin ve düzgün konuştu. Sen bunu fark ettin ama o muhtemelen kimsenin gördüğünü bilmiyor.',
    prompt: 'Ona ne dersin?',
    options: [
      {
        text: '"Geçen hafta müşteriyle konuşman çok iyiydi. Sesini yükseltmeden sorunu adım adım netleştirmen konuşmayı yoluna koydu."',
        effect: 'isler',
        why: 'Ne yaptığı ve neyi değiştirdiği somut söylenir; karşı taraf bu davranışı tekrar etmenin değerli olduğunu anlar.',
      },
      {
        text: '"Aferin sana, böyle devam."',
        effect: 'kismen',
        why: 'Sıcak bir ifade ama neyin iyi olduğu belirsiz; karşı taraf neyi sürdüreceğini bilemez.',
      },
      {
        text: 'Hiçbir şey demezsin; "zaten işi bu" diye düşünürsün.',
        effect: 'islemez',
        why: 'Fark edilen ve söylenmeyen takdir karşı tarafa ulaşmaz; çaba görünmez kalabilir.',
      },
      {
        text: '"Güzel yaptın, ama bir dahaki sefere daha da iyi yapabilirsin." dersin.',
        effect: 'kismen',
        why: 'Takdirin hemen ardından gelen eleştiri, takdirin tadını azaltır; ikisini ayrı anlarda söylemek daha net olur.',
      },
    ],
    takeaway: 'Takdiri somut söyle: ne yaptı, sana ya da işe ne kattı.',
    aiContext:
      'Kullanıcı bir stajyerin iyi bir davranışını takdir edecek. İyi bir cevap neyi gördüğünü ve etkisini somut anlatır, samimi ve kısadır. Stajyer yeni, takdirden motivasyon alabilir, abartılı övgüye de rahat olmayabilir.',
  },
  {
    id: 'gb-05',
    category: 'geri-bildirim',
    title: 'Ev arkadaşı ve mutfak',
    situation:
      'Ev arkadaşın bulaşıkları sık sık gün boyu lavaboda bırakıyor. Şu ana kadar bir şey demedin ama mutfağa girerken hep bir gerginlik hissediyorsun.',
    prompt: 'Bunu nasıl açarsın?',
    options: [
      {
        text: '"Mutfağı ortak kullandığımız için bulaşık konusunda bir düzen kurabilir miyiz? Ben akşam yemeğinden sonra yıkamayı deneyebilirim, senin için hangi saat uygun olur?"',
        effect: 'isler',
        why: 'Konu ortak bir düzen olarak açılır ve karşı tarafın da fikri sorulur; suçlama yerine iş birliği ortaya çıkar.',
      },
      {
        text: 'Lavaboya "Bulaşıkları yıkayın!" yazılı bir not bırakırsın.',
        effect: 'islemez',
        why: 'Yüz yüze konuşmadan bırakılan not pasif-agresif algılanabilir; karşı taraf neyin sorun olduğunu soramaz.',
      },
      {
        text: 'Sinirlendiğin bir gün "Bu evde sadece ben mi yaşıyorum?" diye çıkışırsın.',
        effect: 'islemez',
        why: 'Biriken duygu patlak verdiğinde konu bulaşıktan çıkıp ilişkiye taşınır; savunma kaçınılmaz olur.',
      },
      {
        text: '"Bulaşıklar biraz birikmiş galiba" diye ima edersin.',
        effect: 'kismen',
        why: 'Konuyu hafifçe açarsın ama net bir istek içermediği için karşı taraf anlamayabilir.',
      },
    ],
    takeaway: 'Biriken sinirden önce küçük ve net bir konuşma, daha az sürtüşme getirir.',
    aiContext:
      'Kullanıcı bir ev arkadaşına ortak alanın düzeni hakkında geri bildirim verecek. İyi bir cevap belirli bir davranışı adlandırır, suçlamadan istek dile getirir ve karşı tarafın görüşünü sorar. Ev arkadaşı ilişkisi uzun süreli ve gündelik; ton sıcak kalmalı.',
  },
  {
    id: 'gb-06',
    category: 'geri-bildirim',
    title: 'Grup ödevinde geri bildirim istemek',
    situation:
      'Grup ödevindeki bölümünü bitirdin ve takım arkadaşlarına göndereceksin. Ne yazarsan sadece "güzel olmuş" gibi kısa cevaplar alıyorsun, oysa gerçekten faydalı bir görüş almak istiyorsun.',
    prompt: 'Mesajını nasıl kurarsın?',
    options: [
      {
        text: '"Bölümümü bitirdim. Özellikle giriş paragrafının akışı ve kaynakların yeterliliği konusunda görüşünü almak istiyorum. Takıldığın yer varsa not düşer misin?"',
        effect: 'isler',
        why: 'Belirli noktaları sormak karşı tarafa nereye bakacağını söyler; genel bir "nasıl olmuş" sorusundan daha ayrıntılı cevap getirir.',
      },
      {
        text: '"Bakar mısınız, nasıl olmuş?"',
        effect: 'kismen',
        why: 'Soru açıktır ama kapsamı geniş; çoğu insan genel ve kısa bir cevapla geçer.',
      },
      {
        text: '"Ben bunu çok iyi yaptım, siz de bir bakın, bir şey değiştirmeyin."',
        effect: 'islemez',
        why: 'Geri bildirim isteği gibi görünse de baştan kapıyı kapatır; arkadaşların görüş vermekten çekinir.',
      },
      {
        text: 'Hiçbir şey sormadan dosyayı paylaşır, tepkileri beklersin.',
        effect: 'islemez',
        why: 'Karşı taraf ne beklendiğini bilmez; çoğu zaman cevap gelmez ya da yüzeysel kalır.',
      },
    ],
    takeaway: 'Geri bildirim isterken nereye bakılmasını istediğini söyle.',
    aiContext:
      'Kullanıcı grup arkadaşlarından kendi bölümü için geri bildirim isteyecek. İyi bir cevap belirli noktaları sorar, davetkâr bir ton kullanır ve görüşe açık olduğunu belli eder. Takım arkadaşları meşgul olabilir ve genel sorulara kısa cevap verme eğiliminde.',
  },

  // ── İkna ve müzakere ─────────────────────────────────────────────────────
  {
    id: 'ik-01',
    category: 'ikna',
    title: 'Esnek çalışma saati',
    situation:
      'Sabah trafiği yüzünden iki saatini yolda geçiriyorsun. Yöneticinden, işe bir saat geç başlayıp bir saat geç çıkma esnekliği istemek istiyorsun. Ekip sabah toplantılarını 10.00 civarında yapıyor.',
    prompt: 'Talebini nasıl sunarsın?',
    options: [
      {
        text: '"Sabah toplantılarına yetişmek koşuluyla 09.30-18.30 çalışmayı deneyebilir miyim? Önce iki hafta deneyelim, işlerde bir aksama olursa eski düzene dönerim."',
        effect: 'isler',
        why: 'Talep net, ekibin ihtiyacıyla uyumlu ve geri alınabilir; karşı taraf risk almadan denemeye daha yatkın olur.',
      },
      {
        text: '"Yoldan çok yoruluyorum, bir şeyler yapmanız lazım."',
        effect: 'islemez',
        why: 'Talebin ne olduğu belirsiz; karşı taraf çözüm üretmek yerine yük bindirildiğini hissedebilir.',
      },
      {
        text: '"Herkes esnek çalışıyor, bana da izin verin."',
        effect: 'islemez',
        why: 'Karşılaştırma baskı gibi algılanabilir; ekibin ve işin ihtiyacı ele alınmaz.',
      },
      {
        text: '"Bu mümkün olabilir mi acaba?" diye genel bir soru sorarsın.',
        effect: 'kismen',
        why: 'Konuyu açarsın ama ayrıntı vermediğin için karşı taraf cevabı belirsiz bırakır.',
      },
    ],
    takeaway: 'İkna ederken talebini karşı tarafın ihtiyacıyla bağdaştır ve geri alınabilir bir deneme öner.',
    aiContext:
      'Kullanıcı yöneticisinden esnek çalışma saati isteyecek. İyi bir cevap somut talebi, işin ihtiyaçlarını gözeten bir gerekçeyi ve düşük riskli bir deneme önerisini içerir. Yönetici ekip uyumundan ve toplantı saatlerinden endişe edebilir.',
  },
  {
    id: 'ik-02',
    category: 'ikna',
    title: 'İkinci el fiyat pazarlığı',
    situation:
      'İkinci el bir bisiklet bakıyorsun, satıcı 6.000 TL istiyor. Piyasayı araştırdın, benzerleri 5.000 TL civarında. Satıcı kibar görünüyor ama fiyattan çok emin konuşuyor.',
    prompt: 'Pazarlığa nasıl girersin?',
    options: [
      {
        text: '"Bisiklet çok güzel durumda. Benzerlerini 5.000 TL civarında gördüm; 5.200 TL olursa bugün alabilirim. Sizin için olur mu?"',
        effect: 'isler',
        why: 'Ürünü takdir eder, dayanağını söyler, net bir rakam ve karar zamanı sunar. Satıcı rakamı tartışabilecek bir zeminde bulur.',
      },
      {
        text: '"Bu fiyat çok yüksek, kimse bu paraya almaz."',
        effect: 'islemez',
        why: 'Gerekçe vermeyen ve ürünü küçümseyen bir ton satıcıyı savunmaya geçirir.',
      },
      {
        text: 'Hiç pazarlık yapmadan, 6.000 TL’ye alırsın.',
        effect: 'kismen',
        why: 'Çatışma çıkmaz ama sonradan fiyata dair bir pişmanlık hissedebilirsin.',
      },
      {
        text: '"3.000 TL verebilirim, olmazsa gidiyorum." dersin.',
        effect: 'islemez',
        why: 'Gerçekçi olmayan teklif ve tehdit havası karşı tarafı konuşmadan çekilmeye iter.',
      },
    ],
    takeaway: 'Müzakerede rakamın yanında dayanağını ve kararı ne zaman vereceğini söyle.',
    aiContext:
      'Kullanıcı ikinci el bir ürün için fiyat pazarlığı yapacak. İyi bir cevap saygılı, dayanaklı ve net bir teklif içerir; tehdit etmez, ürünü gereksiz küçümsemez. Satıcı fiyattan emin, ama makul bir teklife açık olabilir.',
  },
  {
    id: 'ik-03',
    category: 'ikna',
    title: 'Aileyi tatil planına ikna',
    situation:
      'Aile olarak bu yaz yurt dışına çıkmak istiyorsun ama babanın "bu masraf gereksiz" diye düşündüğünü biliyorsun. Annen ise kararsız.',
    prompt: 'Planı nasıl açarsın?',
    options: [
      {
        text: '"Baba, bu yaz birlikte uzun süredir ertelediğimiz bir tatil yapmak istiyorum. Bütçeyi hesapladım: uçak ve konaklama toplam şu kadar. Hangi kısmı sana ağır geliyor, birlikte bakalım mı?"',
        effect: 'isler',
        why: 'Hazırlıklı gelmek ciddiyeti gösterir; karşı tarafın endişesini sormak onu itirazdan çıkarıp planın parçası yapar.',
      },
      {
        text: '"Hep aynı yere gidiyoruz, sıkıldım; başka yere gitmezsek ben de gelmem."',
        effect: 'islemez',
        why: 'Baskı ve ültimatom karşı tarafı direnmeye iter; planın kendisi konuşulmaz.',
      },
      {
        text: 'Annenle önceden konuşup birlikte babana baskı yaparsınız.',
        effect: 'kismen',
        why: 'Destek bulmak yararlı olabilir ama babanın kendini kuşatılmış hissetmesi konuşmayı zorlaştırabilir.',
      },
      {
        text: '"Para gerçekten bu kadar önemli mi?" dersin.',
        effect: 'islemez',
        why: 'Karşı tarafın kaygısını sorgulamak onu savunmaya iter; asıl neden konuşulmadan kalır.',
      },
    ],
    takeaway: 'İkna etmeden önce karşı tarafın itirazının ne olduğunu öğren.',
    aiContext:
      'Kullanıcı ailesini (özellikle masraf konusunda endişeli bir babayı) bir tatil planına ikna edecek. İyi bir cevap hazırlık gösterir, karşı tarafın itirazını sorar ve ortak çözüm arar. Baba pratik ve temkinli, anne kararsız; ton saygılı olmalı.',
  },
  {
    id: 'ik-04',
    category: 'ikna',
    title: 'Ekibi yeni araca geçirmek',
    situation:
      'Ekip dosyaları e-postayla gönderip eski sürümleri karıştırıyor. Ortak bir çalışma aracı önermek istiyorsun ama bazı kişiler "alıştık, değişmesin" diyor.',
    prompt: 'Önerini nasıl sunarsın?',
    options: [
      {
        text: '"Geçen hafta üç kez eski sürümle çalıştık ve yarım saat kaybettik. Bu aracı iki haftalığına tek bir projede deneyelim, işe yaramazsa eski düzene döneriz. Ben ilk hafta kurulumda yardım ederim."',
        effect: 'isler',
        why: 'Yaşanmış bir sorunu hatırlatır, küçük bir deneme önerir ve geçişin yükünü üstlenir; direnç azalır.',
      },
      {
        text: '"Herkes artık bunu kullanıyor, bir an önce geçmemiz gerek."',
        effect: 'islemez',
        why: 'Zorunluluk dili alışkanlığı sorgulanan kişileri daha da dirençli yapar.',
      },
      {
        text: 'Toplantıda aracın özelliklerini uzun uzun anlatırsın.',
        effect: 'kismen',
        why: 'Bilgilendirici olur ama ekibin yaşadığı sorunla bağ kurulmadığı için ilgi dağılabilir.',
      },
      {
        text: 'Hiç sormadan aracı kurar, herkese davet gönderirsin.',
        effect: 'islemez',
        why: 'Karar sürecine katılmayan ekip dayatma hisseder ve aracı kullanmaktan kaçınabilir.',
      },
    ],
    takeaway: 'Değişimi önerirken önce sorunu ortak gör, sonra küçük bir deneme sun.',
    aiContext:
      'Kullanıcı ekibine yeni bir çalışma aracı önerecek. İyi bir cevap yaşanan somut sorunu hatırlatır, küçük/geri alınabilir bir deneme önerir ve geçişte destek sunar. Ekibin bir kısmı alışkanlığını korumak istiyor, değişimi dayatma olarak algılayabilir.',
  },
  {
    id: 'ik-05',
    category: 'ikna',
    title: 'Öğretmenden ek süre',
    situation:
      'Dönem ödevinin teslimine üç gün kala hasta oldun ve ödevin yarısı eksik. Öğretmenin süre uzatma politikası katı ama anlayışlı biri olarak biliniyor.',
    prompt: 'Öğretmene ne yazarsın?',
    options: [
      {
        text: '"Hocam, bu hafta rahatsızlandığım için ödevimi teslim tarihine yetiştiremeyeceğim. Doktor raporumu ekledim. Ödevin %50’si hazır; cuma gününe kadar tamamlayıp getirmem mümkün mü?"',
        effect: 'isler',
        why: 'Neden, belge ve net bir yeni tarih verilir; öğretmen talebi değerlendirmek için ihtiyaç duyduğu bilgiye sahip olur.',
      },
      {
        text: '"Hocam çok hastayım, bir şey yapamıyorum, lütfen anlayın."',
        effect: 'kismen',
        why: 'Durumu anlatır ama yeni tarih ve ilerleme bilgisi eksik; öğretmenin karar vermesi için yeterli değil.',
      },
      {
        text: 'Hiçbir şey yazmadan, teslimden sonra "hastaydım" dersin.',
        effect: 'islemez',
        why: 'Önceden haber verilmemesi güvenilirliği zedeler; talep gecikmiş bir bahane gibi algılanabilir.',
      },
      {
        text: '"Hocam, herkese süre verdiniz, bana neden vermiyorsunuz?" dersin.',
        effect: 'islemez',
        why: 'Karşılaştırma ve suçlama öğretmeni savunmaya iter; durumun kendisi konuşulmaz.',
      },
    ],
    takeaway: 'Süre isterken neden, ilerleme durumu ve önerdiğin yeni tarihi birlikte yaz.',
    aiContext:
      'Kullanıcı hastalığı nedeniyle öğretmeninden ödev için ek süre isteyecek. İyi bir cevap gerekçeyi, belgeyi ve somut bir yeni tarihi içerir; saygılı ve kısadır. Öğretmen katı ama anlayışlı; samimi ve hazırlıklı bir talebe olumlu bakabilir.',
  },
  {
    id: 'ik-06',
    category: 'ikna',
    title: 'Arkadaş grubuyla mekân seçimi',
    situation:
      'Sekiz kişilik arkadaş grubu cumartesi akşamı için mekân arıyor. Sen küçük bir kafede, herkesin rahat konuşabileceği bir yer öneriyorsun; diğerleri kalabalık bir bara gitmek istiyor.',
    prompt: 'Nasıl ikna etmeye çalışırsın?',
    options: [
      {
        text: '"Bar eğlenceli, ama uzun zamandır görüşemedik ve ben sizi duyabilmek istiyorum. Önce kafede oturup sohbet etsek, sonra isteyenler bara geçse nasıl olur?"',
        effect: 'isler',
        why: 'Karşı tarafın isteğini kabul eder, kendi ihtiyacını açıkça söyler ve iki isteği birleştiren bir orta yol önerir.',
      },
      {
        text: '"Bar çok gürültülü, ben gelmem."',
        effect: 'islemez',
        why: 'Seçenek sunmadan çekilmek grubu karşı karşıya bırakır; dışarıda kalan sen olursun.',
      },
      {
        text: 'Bir şey demez, çoğunluğa uyarsın ama akşam boyu isteksiz durursun.',
        effect: 'islemez',
        why: 'Hoşnutsuzluk söylenmeden hissettirilir; hem sen hem grup akşamın tadını kaçırır.',
      },
      {
        text: '"Hep siz seçiyorsunuz, bu sefer ben seçeyim." dersin.',
        effect: 'kismen',
        why: 'Hak talebi haklı olabilir ama geçmişi anmak konuyu mekândan çıkarıp sıraya çevirir.',
      },
    ],
    takeaway: 'Müzakerede iki isteği birleştiren üçüncü bir seçenek çoğu zaman iş görür.',
    aiContext:
      'Kullanıcı bir arkadaş grubunu farklı bir mekâna ikna etmeye çalışıyor. İyi bir cevap karşı tarafın isteğini tanır, kendi ihtiyacını net söyler ve bir orta yol önerir. Ortam gayri resmi, ton samimi ve esprili olabilir.',
  },

  // ── Çatışmayı yumuşatma ──────────────────────────────────────────────────
  {
    id: 'ct-01',
    category: 'catisma',
    title: 'Öfkeli bir müşteri',
    situation:
      'Gişede çalışırken bir müşteri sesini yükselterek siparişinin iki kez yanlış geldiğini söylüyor. Arkasındaki kuyruk da bekliyor. Sorun senin hatan değil ama müşteri sana yöneliyor.',
    prompt: 'İlk cümlen ne olur?',
    options: [
      {
        text: '"Siparişiniz iki kez yanlış geldiği için sinirlenmenizi anlıyorum. Şimdi doğru ürünü hazırlıyorum, bu arada neyi beklediğinizi bir kez daha teyit edebilir miyim?"',
        effect: 'isler',
        why: 'Öfke kabul edilir, tartışmaya girilmez ve hemen bir adım atılır. Karşı taraf duyulduğunu hissettiğinde ses tonu çoğu zaman düşer.',
      },
      {
        text: '"Bağırmanıza gerek yok, size yardımcı olmaya çalışıyorum."',
        effect: 'islemez',
        why: 'Davranışı düzeltmeye çalışmak karşı tarafı daha da gerginleştirebilir; dinlenmediğini hisseder.',
      },
      {
        text: '"Bu benim hatam değil, mutfakla konuşun."',
        effect: 'islemez',
        why: 'Sorumluluğu başkasına yöneltmek müşterinin yaşadığı sorunu çözmez; öfke sana kilitlenir.',
      },
      {
        text: '"Çok özür dilerim, çok çok özür dilerim, kesinlikle yanlıştı…" diye üst üste özür dilersin.',
        effect: 'kismen',
        why: 'Samimi görünür ama tekrar eden özür yeni bir adım içermediği için çözüm gecikir.',
      },
    ],
    takeaway: 'Öfkeye önce duyulduğunu göstererek, sonra somut bir adımla karşılık ver.',
    aiContext:
      'Kullanıcı öfkeli bir müşteriyle konuşuyor. İyi bir cevap duygusunu kabul eder, savunmaya geçmez, bir çözüm adımı sunar ve sakin kalır. Müşteri iki kez aynı hatayı yaşamış ve yoruldu; asıl istediği çözüm ve duyulmak.',
  },
  {
    id: 'ct-02',
    category: 'catisma',
    title: 'İki arkadaşın arasında kalmak',
    situation:
      'İki yakın arkadaşın küsmüş. Her biri sana ayrı ayrı gelip diğerini anlatıyor. Bugün biri "Sen kimin tarafındasın?" diye sordu.',
    prompt: 'Ne cevap verirsin?',
    options: [
      {
        text: '"İkinizi de önemsiyorum ve taraf tutmak istemiyorum. Seni dinlerim, ama sorunu çözebilecek olan sizsiniz; istersen birlikte konuşmanıza yardımcı olabilirim."',
        effect: 'isler',
        why: 'Taraf tutmadan dinleme isteğini belirtir ve çözümün karşılıklı konuşmada olduğunu hatırlatır; iki tarafa da kapı açık kalır.',
      },
      {
        text: '"Sanırım haklı olan sensin." dersin.',
        effect: 'islemez',
        why: 'O an hoş gelir ama diğer arkadaşa da aynısı söylendiğinde güven zedelenir; çatışma büyür.',
      },
      {
        text: '"Ben karışmam, kendi aranızda halledin." deyip konuşmayı keserek uzaklaşırsın.',
        effect: 'kismen',
        why: 'Taraf tutmazsın ama destek de sunmamış olursun; kişi yalnız bırakıldığını hissedebilir.',
      },
      {
        text: 'Diğer arkadaşın söylediklerini anlatırsın, böylece aranızdaki yanlış anlaşılma çözülsün diye.',
        effect: 'islemez',
        why: 'Taşınan söz çoğunlukla bozulur ve yeni küskünlükler doğurur; iki taraf da sana temkinli yaklaşmaya başlar.',
      },
    ],
    takeaway: 'Aracı olmak yerine "ikiniz de önemlisiniz, çözüm sizin konuşmanızda" demek güveni korur.',
    aiContext:
      'Kullanıcı iki arkadaşı arasında kalmış durumda. İyi bir cevap taraf tutmaz, söylentiyi taşımaz, dinlemeye açık olduğunu belli eder ve doğrudan konuşmayı teşvik eder. Arkadaş cevap bekliyor, kendini destek görmek istiyor.',
  },
  {
    id: 'ct-03',
    category: 'catisma',
    title: 'Tartışma yükselirken',
    situation:
      'Ev arkadaşınla ortak masraflar konusunda konuşurken sesiniz yükselmeye başladı. İkiniz de kendi haklılığınızı anlatıyorsunuz ama kimse dinlemiyor.',
    prompt: 'Ne yaparsın?',
    options: [
      {
        text: '"Bir dakika, ikimiz de gerginleşiyoruz. On beş dakika ara verip sonra bu konuya sakin döner miyiz? Gerçekten çözmek istiyorum."',
        effect: 'isler',
        why: 'Gerginlik açıkça adlandırılır, geri dönüleceği söylenir; ara kaçış değil, daha sağlıklı konuşmaya geçiş olur.',
      },
      {
        text: 'Sesini daha da yükselterek haklılığını savunursun.',
        effect: 'islemez',
        why: 'Gerginlik artar, ikinizin de duyma kapasitesi düşer; asıl konu tonun gölgesinde kalır.',
      },
      {
        text: 'Hiçbir şey söylemeden odandan çıkıp kapıyı kapatırsın.',
        effect: 'islemez',
        why: 'Ne zaman döneceğini bilmeyen karşı taraf bunu kaçış ya da cezalandırma olarak yorumlayabilir.',
      },
      {
        text: '"Tamam, sen haklısın." deyip tartışmayı kesersin.',
        effect: 'kismen',
        why: 'Gerginlik kısa vadede düşer ama konu çözülmediği için başka bir zamanda tekrar açılabilir.',
      },
    ],
    takeaway: 'Gerginlik yükselince "ara verelim, sonra dönelim" demek konuşmayı kurtarır.',
    aiContext:
      'Kullanıcı bir ev arkadaşıyla yükselen bir tartışmayı yumuşatmak istiyor. İyi bir cevap gerginliği adlandırır, ara vermeyi ve geri dönmeyi önerir, suçlamaz. İki taraf da kendini haklı hissediyor ve dinlemekte zorlanıyor.',
  },
  {
    id: 'ct-04',
    category: 'catisma',
    title: 'Sözünün sürekli kesilmesi',
    situation:
      'Toplantıda bir meslektaşın cümlelerini ikinci kez yarıda kesti. Gerginlik hissediyorsun ama herkesin önünde çatışma çıkarmak istemiyorsun.',
    prompt: 'Ne yaparsın?',
    options: [
      {
        text: 'Sakin bir tonla "Cümlemi bitirebilir miyim, sonra senin görüşünü dinlemek isterim." dersin.',
        effect: 'isler',
        why: 'Sınırı net ve nazik koyar, karşı tarafa söz hakkı verildiğini de belirtir; kimse küçük düşmez.',
      },
      {
        text: 'Sözünü keserek "Sen konuşurken ben kesmedim ama!" dersin.',
        effect: 'islemez',
        why: 'Kesilmeye kesmekle karşılık vermek toplantıyı çekişmeye çevirir ve asıl konudan uzaklaştırır.',
      },
      {
        text: 'Susar ve düşündüğünü hiç söylemezsin.',
        effect: 'islemez',
        why: 'Görüşün toplantıya ulaşmaz; kesinti tekrarlanma ihtimali yükselir.',
      },
      {
        text: 'Toplantıdan sonra özelde "bunu bir daha yapma" dersin.',
        effect: 'kismen',
        why: 'Özelde konuşmak saygılıdır ama toplantıdaki an geçmiştir; "yapma" yerine beklentini açıklamak daha açık olur.',
      },
    ],
    takeaway: 'Sınırı o anda, kısa ve sakin bir cümleyle koymak çoğu zaman yeterli olur.',
    aiContext:
      'Kullanıcı toplantıda sözü kesilen taraf ve bunu çatışmaya dönüştürmeden düzeltmek istiyor. İyi bir cevap sakin, kısa, suçlamadan ve karşı tarafa da söz hakkı vererek yapılır. Ortam mesleki; herkesin önünde gerilim istenmiyor.',
  },
  {
    id: 'ct-05',
    category: 'catisma',
    title: 'Bayram sofrasında politika',
    situation:
      'Bayram sofrasında amcan güncel bir siyasi konuyu açtı ve kuzenin sert bir cevap verdi. Ortam gerilmeye başladı, annen sana bakıyor.',
    prompt: 'Ne dersin?',
    options: [
      {
        text: '"Hepimizin farklı görüşü olabilir, bunu bayram sonrası konuşuruz. Şimdi şu böreğin tarifini kim yaptı, çok güzel olmuş!"',
        effect: 'isler',
        why: 'Görüş ayrılığını kabul eder, yargılamaz ve konuyu nazikçe yönlendirir; kimse haksız çıkarılmaz.',
      },
      {
        text: 'Tarafını seçip amcana ya da kuzenine karşı çıkarsın.',
        effect: 'islemez',
        why: 'Gerginliğe yeni bir taraf eklenir; sofra herkes için zorlaşır.',
      },
      {
        text: '"Siz de hep bu konuları açıyorsunuz!" dersin.',
        effect: 'islemez',
        why: 'Genelleme ve suçlama kimseyi sakinleştirmez; karşı taraf savunmaya geçer.',
      },
      {
        text: 'Hiçbir şey demez, gergin bir sessizlikle yemeğini yersin.',
        effect: 'kismen',
        why: 'Taraf tutmamış olursun ama gerginlik süreceği için ortam rahatlamaz.',
      },
    ],
    takeaway: 'Gerginliği düşürmek için önce görüş farkını kabul et, sonra konuyu yönlendir.',
    aiContext:
      'Kullanıcı bir aile sofrasında siyasi tartışma yüzünden oluşan gerginliği yumuşatmak istiyor. İyi bir cevap taraf tutmaz, görüş farkını kabul eder, konuyu nazikçe değiştirir. Aile ortamında kimse küçük düşürülmek istemez.',
  },
  {
    id: 'ct-06',
    category: 'catisma',
    title: 'Mesajla yanlış anlaşılma',
    situation:
      'Arkadaşına yazdığın "Tamam, nasıl istersen." mesajı onu kırmış. "Hep böyle soğuk davranıyorsun." diye cevap verdi. Aslında yorgundun, kırıcı olmak istememiştin.',
    prompt: 'Ne yazarsın?',
    options: [
      {
        text: '"Mesajım soğuk geldiyse kusura bakma. Yorgundum ve kısa yazdım ama seni kırmak istemedim. Akşam istersen sesli konuşalım."',
        effect: 'isler',
        why: 'Etkiyi kabul eder, niyetini açıklar ve yazıdan yüz yüze konuşmaya geçmeyi önerir; tonun yanlış okunma ihtimali azalır.',
      },
      {
        text: '"Ben öyle bir şey demedim, sen abartıyorsun."',
        effect: 'islemez',
        why: 'Karşı tarafın hissini yok saymak onu daha da kırar; konu mesajdan çıkıp anlaşılma meselesine döner.',
      },
      {
        text: '"Tamam o zaman." diye daha kısa cevap verirsin.',
        effect: 'islemez',
        why: 'Kısa cevaplar soğukluk hissini pekiştirir; yanlış anlaşılma büyür.',
      },
      {
        text: 'Uzun bir açıklama mesajı yazıp kendini savunursun.',
        effect: 'kismen',
        why: 'Açıklama niyetini anlatır ama savunma ağırlıklı olursa karşı tarafın duygusu gölgede kalır.',
      },
    ],
    takeaway: 'Yanlış anlaşılmada önce etkiyi kabul et, sonra niyetini anlat.',
    aiContext:
      'Kullanıcı kısa bir mesajın arkadaşını kırması sonucu yaşanan yanlış anlaşılmayı toparlamak istiyor. İyi bir cevap etkiyi kabul eder, niyeti açıklar, savunmaya geçmez ve yüz yüze konuşmayı önerebilir. Arkadaş kırgın ama ilişki yakın.',
  },

  // ── Küçük konuşma ───────────────────────────────────────────────────────
  {
    id: 'km-01',
    category: 'kucuk-konusma',
    title: 'Asansörde komşu',
    situation:
      'Asansörde ikinci kattan yeni taşınan komşunla baş başasın. Birkaç kat boyunca ikiniz de sessizsiniz ve bir şey demek istiyorsun.',
    prompt: 'Ne dersin?',
    options: [
      {
        text: '"Merhaba, ben üçüncü kattaki Elif. Yeni taşınmışsınız, bu mahalleyi sevdiniz mi?"',
        effect: 'isler',
        why: 'Kendini kısaca tanıtır ve açık uçlu, hafif bir soru sorar; karşı taraf rahatça cevap verebilir.',
      },
      {
        text: 'Telefona bakıyormuş gibi yapıp sessiz kalırsın.',
        effect: 'kismen',
        why: 'Sorun çıkmaz ama bir tanışma fırsatı kaçar; yine de bazen bu da tercih edilebilir.',
      },
      {
        text: '"Hava çok sıcak değil mi?" der, sonra konuşmayı sürdürmezsin.',
        effect: 'kismen',
        why: 'Buzu kırar ama devamı gelmezse sohbet açılmadan kapanır.',
      },
      {
        text: '"Kaç kişi yaşıyorsunuz, ne iş yapıyorsunuz, maaşınız nedir?" diye art arda soru sorarsın.',
        effect: 'islemez',
        why: 'Hızlı ve kişisel sorular karşı tarafı sorguya çekilmiş gibi hissettirir.',
      },
    ],
    takeaway: 'Küçük konuşmayı açmak için kendini tanıt ve hafif, açık uçlu bir soru sor.',
    aiContext:
      'Kullanıcı yeni taşınan komşusuyla asansörde kısa bir sohbet başlatacak. İyi bir cevap sıcak, kısa, kişisel olmayan bir giriş yapar ve karşı tarafa cevap verme alanı bırakır. Karşı taraf sohbete açık ama yeni olduğu için temkinli olabilir.',
  },
  {
    id: 'km-02',
    category: 'kucuk-konusma',
    title: 'Yeni işte öğle yemeği',
    situation:
      'Yeni işe başladığın ilk hafta, öğle arasında yemekhanede tanımadığın bir grup oturuyor. Yalnız oturmak istemiyorsun ama araya girmekten de çekiniyorsun.',
    prompt: 'Nasıl yaklaşırsın?',
    options: [
      {
        text: '"Merhaba, ben bu hafta başladım. Bu masaya oturabilir miyim?" deyip oturduktan sonra "Burada yemek nasıl?" diye sorarsın.',
        effect: 'isler',
        why: 'Durumu dürüstçe söylemek ve izin sormak sıcak bir giriş yapar; yemek sorusu herkesin konuşabileceği hafif bir konudur.',
      },
      {
        text: 'Hiçbir şey demeden masanın ucuna sessizce oturursun.',
        effect: 'kismen',
        why: 'Orada olursun ama kendini tanıtmadığın için gruba dahil olman zaman alır.',
      },
      {
        text: 'Yemeğini alıp odana dönersin.',
        effect: 'kismen',
        why: 'Rahat bir seçenektir ama yeni insanlarla tanışma fırsatı kaçar.',
      },
      {
        text: 'Hemen kendi geçmişini ve başarılarını uzun uzun anlatmaya başlarsın.',
        effect: 'islemez',
        why: 'Karşı tarafa konuşma alanı bırakmayan tanıtım, sohbetten çok sunum gibi durur.',
      },
    ],
    takeaway: 'Gruba girerken kendini kısaca tanıt ve herkesin cevaplayabileceği basit bir soru sor.',
    aiContext:
      'Kullanıcı yeni işyerinde yemek arasında tanımadığı bir gruba katılacak. İyi bir cevap kısa, sıcak, izin isteyen ve soru soran bir girişe sahiptir. Grup rahat ama yeni birini beklemiyor olabilir.',
  },
  {
    id: 'km-03',
    category: 'kucuk-konusma',
    title: 'Sohbeti nazikçe bitirmek',
    situation:
      'Bir davette tanıştığın biri sana yirmi dakikadır işini anlatıyor. İlgisiz değilsin ama başka insanlarla da konuşmak ve bir şeyler almak istiyorsun.',
    prompt: 'Nasıl kapatırsın?',
    options: [
      {
        text: '"Bunları dinlemek çok güzeldi. Ben bir şeyler alıp diğer arkadaşlara da uğrayacağım; sonra yine konuşuruz."',
        effect: 'isler',
        why: 'Sohbeti takdir eder, ayrılma nedenini söyler ve kapıyı açık bırakır; karşı taraf reddedilmiş hissetmez.',
      },
      {
        text: 'Telefonuna bakıp sessizce uzaklaşırsın.',
        effect: 'islemez',
        why: 'Açıklama olmadan çekilmek karşı tarafa umursamazlık gibi gelir.',
      },
      {
        text: '"Pardon, çok sıkıldım, gidiyorum." dersin.',
        effect: 'islemez',
        why: 'Gereksiz yere kırıcı olur; aynı mesaj daha nazik biçimde verilebilirdi.',
      },
      {
        text: 'Sürekli saatine bakarsın ama bir şey demezsin.',
        effect: 'kismen',
        why: 'İma etmiş olursun ama karşı taraf anlamayabilir ya da küçümsendiğini düşünebilir.',
      },
    ],
    takeaway: 'Sohbeti bitirirken önce takdir et, sonra ayrılma nedenini söyle.',
    aiContext:
      'Kullanıcı bir davette uzun süren bir sohbeti nazikçe bitirmek istiyor. İyi bir cevap karşı tarafın anlattıklarını takdir eder, makul bir ayrılma nedeni sunar ve kapıyı açık bırakır. Karşı taraf kendini heyecanla anlatıyor, reddedilmiş hissetmek istemez.',
  },
  {
    id: 'km-04',
    category: 'kucuk-konusma',
    title: 'Düğünde tanımadığın masa',
    situation:
      'Bir akrabanın düğününde masada neredeyse kimseyi tanımıyorsun. Yanındaki kişi de sana benzer şekilde sessiz oturuyor.',
    prompt: 'Sohbeti nasıl açarsın?',
    options: [
      {
        text: '"Merhaba, ben damadın kuzeniyim. Siz nasıl tanıyorsunuz?"',
        effect: 'isler',
        why: 'Ortak noktayı (düğün) kullanarak basit bir tanışma sorusu sorar; karşı taraf rahatça cevaplar.',
      },
      {
        text: 'Telefona dalıp yemeği beklersin.',
        effect: 'kismen',
        why: 'Rahat bir seçenek olabilir ama tanışma fırsatı geçer.',
      },
      {
        text: '"Siz evli misiniz, çocuğunuz var mı, maaşınız nasıl?" diye sorarsın.',
        effect: 'islemez',
        why: 'Kişisel sorular ilk karşılaşmada rahatsız edici olabilir; sohbet kapanır.',
      },
      {
        text: 'Aileyi, damadı ya da gelini eleştirerek ortak bir konu yaratmaya çalışırsın.',
        effect: 'islemez',
        why: 'Ortamdaki biri hakkında olumsuz konuşmak güveni azaltır ve sohbeti gergin yöne çeker.',
      },
    ],
    takeaway: 'Ortak bağlamı (davet, mekân, etkinlik) küçük konuşmanın başlangıcı yap.',
    aiContext:
      'Kullanıcı düğünde tanımadığı insanlarla sohbet başlatacak. İyi bir cevap kendini tanıtır, ortak bağlam üzerinden sade bir soru sorar ve kişisel konulardan kaçınır. Ortam neşeli; insanlar tanışmaya açık ama temkinli.',
  },
  {
    id: 'km-05',
    category: 'kucuk-konusma',
    title: 'Sınıfta yeni arkadaş',
    situation:
      'Yeni dönemde sınıfa yeni geldin, kimseyi tanımıyorsun. Teneffüste yanında oturan biri de yalnız görünüyor.',
    prompt: 'Ne dersin?',
    options: [
      {
        text: '"Selam, ben yeni geldim. Bu dersin hocası nasıl biri, sınavları zor mu?"',
        effect: 'isler',
        why: 'Durumunu açıkça söyler ve karşı tarafın bilgisinden yararlanan bir soru sorar; insanlar yardımcı olmaktan genelde hoşlanır.',
      },
      {
        text: 'Bir şey söylemeden ders başlamasını beklersin.',
        effect: 'kismen',
        why: 'Risk almazsın ama yalnız kalma süresi uzar.',
      },
      {
        text: '"Burası sıkıcı, değil mi? Herkes çok sıradan görünüyor." dersin.',
        effect: 'islemez',
        why: 'Olumsuz bir ortak düşman yaratmaya çalışmak, karşı tarafı da rahatsız edebilir.',
      },
      {
        text: 'Başka bir grubun yanına gidip kendini kısaca tanıtmadan konuşmaya dalarsın.',
        effect: 'kismen',
        why: 'Girişimcisin ama tanıtım olmadan dahil olmak zor; grup sana alışana kadar zaman gerekir.',
      },
    ],
    takeaway: 'Yeni biriyle konuşurken karşı tarafın bilgisinden yararlanan soru sormak iyi bir giriştir.',
    aiContext:
      'Kullanıcı sınıfta yeni biriyle tanışmak istiyor. İyi bir cevap sade, samimi, olumsuz ya da kişisel olmayan bir giriş yapar ve bir soru sorar. Karşı taraf de yalnız olabilir, rahat bir tanışmaya açık.',
  },
  {
    id: 'km-06',
    category: 'kucuk-konusma',
    title: 'Konuşma sessizliğe düştü',
    situation:
      'İş görüşmesi sonrası kapıya kadar seni geçiren biriyle yürürken konuşma tükendi. Birkaç saniyelik sessizlik var ve garip hissediyorsun.',
    prompt: 'Ne yaparsın?',
    options: [
      {
        text: '"Ofis çok güzel, buradan çalışanlar manzarayı gerçekten seviyordur herhalde." diyerek ortamla ilgili hafif bir gözlem paylaşırsın.',
        effect: 'isler',
        why: 'Çevreyi konu edinmek kolay ve güvenli bir geçiştir; karşı taraf cevap verirse sohbet yeniden açılır.',
      },
      {
        text: 'Sessizliği doldurmak için aklına gelen her şeyi hızla söylersin.',
        effect: 'kismen',
        why: 'Sessizliği bozar ama konu bütünlüğü dağılabilir; kısa sessizlik çoğu zaman doğaldır.',
      },
      {
        text: 'Telefonunu çıkarıp mesajlara bakmaya başlarsın.',
        effect: 'islemez',
        why: 'Karşı tarafa ilgisizlik izlenimi verir; resmi bir ortamda da uygunsuz kaçabilir.',
      },
      {
        text: '"Ee, bu da bu kadar işte." diyerek konuşmayı sonlandırırsın.',
        effect: 'islemez',
        why: 'Kapanışı sert yapar ve ilişkiyi soğutur.',
      },
    ],
    takeaway: 'Kısa sessizlik doğaldır; çevreden bir gözlem sohbeti kolayca yeniden açar.',
    aiContext:
      'Kullanıcı resmi/yarı resmi bir ortamda sohbetin tükendiği anı toparlamak istiyor. İyi bir cevap rahat, kısa, kişisel olmayan bir gözlem ya da soru ile akışı sürdürür veya nazikçe kapatır. Karşı taraf nazik ama meşgul olabilir.',
  },

  // ── Toplulukta söz alma ─────────────────────────────────────────────────
  {
    id: 'tp-01',
    category: 'topluluk',
    title: 'Toplantıda söz almak',
    situation:
      'Toplantıda konuşulan konuyla ilgili elinde işe yarayacak bir bilgi var ama baskın birkaç kişi konuşmayı sürekli devralıyor. Söz almak için fırsat kollayıp duruyorsun.',
    prompt: 'Nasıl söz alırsın?',
    options: [
      {
        text: 'Bir cümle bittiğinde hafifçe öne eğilip "Bu konuda bir eklemem var, söz alabilir miyim?" dersin.',
        effect: 'isler',
        why: 'Beden dili ve net bir izin cümlesi, sözünü kesmeden dikkat çeker; toplantı akışı bozulmaz.',
      },
      {
        text: 'Konuşanın sözünü keserek konuşursun.',
        effect: 'islemez',
        why: 'Hızlı söz alırsın ama dinleyenlerin dikkati içerikten çıkıp kesintiye gider.',
      },
      {
        text: 'Sözünü almak için toplantının sonuna kadar beklersin, o zaman da zaman kalmaz.',
        effect: 'islemez',
        why: 'Bilgi, karar anında ortaya konmadığı için işe yaramaz.',
      },
      {
        text: 'Elini sessizce kaldırıp beklersin.',
        effect: 'kismen',
        why: 'Saygılı bir yöntem ama baskın konuşmacılar varsa fark edilmeyebilir; sözlü bir ifade desteklemek iyi olur.',
      },
    ],
    takeaway: 'Söz almak için hem beden dili hem kısa bir cümle kullan; kesmeden dikkat çek.',
    aiContext:
      'Kullanıcı bir toplantıda baskın konuşmacılar arasında söz almak istiyor. İyi bir cevap nazikçe ama net söz ister, içeriğe dikkat çeker ve kesmez. Toplantı hızlı ilerliyor, kısa ve net olması beklenir.',
  },
  {
    id: 'tp-02',
    category: 'topluluk',
    title: 'Sözün kesildiğinde devam etmek',
    situation:
      'Fikrini anlatırken biri araya girip başka bir konuya geçti. Söylemek istediğin önemli bir noktaya henüz gelmemiştin.',
    prompt: 'Ne yaparsın?',
    options: [
      {
        text: '"Bu da önemli bir nokta. Ben şu son bölümü tamamlayıp sonra buna dönmek isterim, çünkü karar için kritik."',
        effect: 'isler',
        why: 'Kesenin söylediğini küçümsemeden sözü geri alır ve neden önemli olduğunu belirtir; grup akışı korunur.',
      },
      {
        text: 'Sessizce geri çekilirsin.',
        effect: 'islemez',
        why: 'Önemli noktan söylenmez; kesinti tekrarlanma ihtimali yüksek.',
      },
      {
        text: 'Daha yüksek sesle ve hızla konuşmaya devam edersin.',
        effect: 'kismen',
        why: 'Sözünü sürdürürsün ama ses tonunun yükselmesi dinleyenleri savunmaya itebilir.',
      },
      {
        text: '"Her zaman sözümü kesiyorsunuz!" dersin.',
        effect: 'islemez',
        why: 'Genelleme suçlama gibi gelir ve konuşma içerikten çıkıp tona kayar.',
      },
    ],
    takeaway: 'Sözün kesilince onaylayıp geri al: "Bu da önemli; önce şunu bitireyim."',
    aiContext:
      'Kullanıcı bir toplulukta sözü kesildiğinde fikrini tamamlamak istiyor. İyi bir cevap kesinti yapanı küçümsemeden sözü nazikçe geri alır. Ortam grup tartışması; saygılı ve kısa olmak önemli.',
  },
  {
    id: 'tp-03',
    category: 'topluluk',
    title: 'Sınıfta soru sormak',
    situation:
      'Ders sırasında bir konuyu anlamadın ama sınıf kalabalık ve herkes anlamış gibi görünüyor. Muhtemelen birkaç kişi de aynı yerde takıldı.',
    prompt: 'Ne yaparsın?',
    options: [
      {
        text: 'Elini kaldırıp "Hocam, şu adımda neden bu formülü seçtiğimizi bir daha açıklayabilir misiniz?" diye sorarsın.',
        effect: 'isler',
        why: 'Somut, kısa bir soru hem sana hem takılan diğerlerine yarar; hoca neyin açıklanması gerektiğini bilir.',
      },
      {
        text: 'Çekinip sormaz, dersten sonra internetten araştırırsın.',
        effect: 'kismen',
        why: 'Öğrenme devam eder ama sınıfın akışını ve hocanın açıklamasını kaçırırsın.',
      },
      {
        text: '"Ben hiçbir şey anlamadım." dersin.',
        effect: 'kismen',
        why: 'Dürüst ama geniş; hoca nereyi açıklayacağını bilemez.',
      },
      {
        text: 'Yanındakine fısıldayarak sorarsın.',
        effect: 'kismen',
        why: 'Hızlı bir çözüm olabilir ama yanındaki de bilmiyorsa yanlış bilgiye gidebilirsin.',
      },
    ],
    takeaway: 'Soru sormak için hangi adımda takıldığını söylemek yeterlidir.',
    aiContext:
      'Kullanıcı sınıfta anlamadığı bir noktayı sormak istiyor. İyi bir cevap kısa, belirli bir noktayı gösteren ve saygılı bir soru içerir. Sınıf kalabalık, kendini aptal hissetmekten çekiniyor.',
  },
  {
    id: 'tp-04',
    category: 'topluluk',
    title: 'Apartman toplantısında öneri',
    situation:
      'Apartman toplantısında çatıdaki sızıntı konuşuluyor ama herkes başka konularla ilgileniyor. Tamirat için üç farklı usta teklifi topladın ve bunu önermek istiyorsun.',
    prompt: 'Öneriyi nasıl sunarsın?',
    options: [
      {
        text: '"Çatı konusunda üç usta teklifi topladım. En uygunu 18.000 TL, yazılı olarak elimde var. Bu teklifi oylamaya sunabilir miyiz?"',
        effect: 'isler',
        why: 'Hazırlıklı, somut ve karar odaklı; topluluk neyi oylayacağını net görür.',
      },
      {
        text: '"Çatı çok kötü, bir şey yapmalıyız!" diye heyecanla konuşursun.',
        effect: 'kismen',
        why: 'Aciliyeti anlatır ama somut öneri yoksa toplantı tartışmada kalabilir.',
      },
      {
        text: 'Teklifleri hiç göstermeden "bir usta buldum, güvenin bana" dersin.',
        effect: 'islemez',
        why: 'Şeffaflık olmadığı için topluluk karar vermeye çekinir.',
      },
      {
        text: 'Toplantıda bir şey demez, sonra tek tek komşulara anlatırsın.',
        effect: 'kismen',
        why: 'Birebir konuşma yararlı olabilir ama ortak karar toplantıda alınır; fırsat kaçabilir.',
      },
    ],
    takeaway: 'Toplulukta öneri sunarken somut veri ve net bir karar sorusu getir.',
    aiContext:
      'Kullanıcı bir apartman toplantısında çatı tamiri için öneri sunacak. İyi bir cevap hazırlıklı, rakamlı ve karar sorusu içerir; tehdit ya da suçlama yok. Dinleyenler farklı öncelikli komşular, uzun konuşmalardan sıkılabilirler.',
  },
  {
    id: 'tp-05',
    category: 'topluluk',
    title: 'Cevabını bilmediğin soru',
    situation:
      'Sunum sırasında salondan biri sana, hazırlamadığın bir konuda soru sordu. Cevabı net olarak bilmiyorsun ve herkes sana bakıyor.',
    prompt: 'Ne dersin?',
    options: [
      {
        text: '"Güzel soru, şu an kesin bir cevabım yok. Bunu araştırıp yarın size yazılı olarak iletebilirim."',
        effect: 'isler',
        why: 'Dürüst ve çözüm odaklı; dinleyenler bilmemeyi bir eksiklik değil, güvenilirlik olarak görür.',
      },
      {
        text: 'Tahmini bir cevap uydurursun.',
        effect: 'islemez',
        why: 'Yanlış bilgi sonradan ortaya çıkarsa güveni zedeler.',
      },
      {
        text: '"Bu konu bugünkü sunumun dışında." deyip geçersin.',
        effect: 'kismen',
        why: 'Sorunu konu dışı bırakmak olabilir ama soran kişi görmezden gelinmiş hissedebilir.',
      },
      {
        text: '"Bilmiyorum." deyip susarsın.',
        effect: 'kismen',
        why: 'Dürüst ama soran kişiye ne yapılabileceğini söylemediği için tatmin edici olmaz.',
      },
    ],
    takeaway: 'Bilmediğini söylemek ve bir sonraki adımı vermek, uydurmaktan daha güven verir.',
    aiContext:
      'Kullanıcı bir sunumda cevabını bilmediği bir soruyla karşılaştı. İyi bir cevap dürüst, kısa, soruyu takdir eden ve takip adımı sunan bir yanıttır. Salon dikkatle izliyor; güvenilirlik önemli.',
  },
  {
    id: 'tp-06',
    category: 'topluluk',
    title: 'Otuz saniyelik tanışma',
    situation:
      'Bir atölyenin ilk gününde herkes sırayla kendini otuz saniyede tanıtıyor. Sıra sende ve ne diyeceğini düşünürken elin ayağın birbirine dolanıyor.',
    prompt: 'Nasıl tanıtırsın?',
    options: [
      {
        text: '"Merhaba, ben Mert. Bir yazılım şirketinde çalışıyorum. Bu atölyeye sunumlarda daha rahat konuşmayı öğrenmek için geldim, hafta sonları da bisiklete biniyorum."',
        effect: 'isler',
        why: 'Ad, rol, amaç ve küçük bir kişisel ayrıntı; kısa ve sıcak, dinleyen sana bir konuşma konusu bulur.',
      },
      {
        text: '"Ben… şey… çok da önemli biri değilim aslında." diye geçiştirirsin.',
        effect: 'islemez',
        why: 'Kendini küçümsemek dinleyenlere de çekingenlik hissi verir; kimse seninle konuşmaya nereden başlayacağını bilemez.',
      },
      {
        text: 'Hayatını baştan sona beş dakika anlatırsın.',
        effect: 'islemez',
        why: 'Süreyi aşmak diğer katılımcıları bekletir ve ilginin dağılmasına yol açar.',
      },
      {
        text: 'Sadece adını söyleyip oturursun.',
        effect: 'kismen',
        why: 'Hızlı ve güvenli ama dinleyenlere seninle bağ kurabilecekleri bir ipucu vermez.',
      },
    ],
    takeaway: 'Kısa tanıtımda ad, rol, amaç ve küçük bir kişisel ayrıntı yeterlidir.',
    aiContext:
      'Kullanıcı bir grupta kendini otuz saniyede tanıtacak. İyi bir cevap kısa, sıcak, kendini küçümsemeyen ve en az bir paylaşılabilir ayrıntı içeren bir tanıtımdır. Grup yeni, herkes birbirini tanımaya açık.',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// Etkin dinleme alıştırmaları
// ───────────────────────────────────────────────────────────────────────────

export const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'ed-01',
    title: 'Yetişemeyen çalışan',
    utterance:
      'Bu hafta üç teslimim var ve hiçbirine yetişemeyeceğim gibi geliyor. Her gün geç saatlere kadar çalışıyorum ama liste kısalmıyor. Yöneticime bunu nasıl söyleyeceğimi de bilmiyorum.',
    feelingOptions: ['Bunalmış', 'Öfkeli', 'Neşeli', 'Kayıtsız'],
    feelingIndex: 0,
    needOptions: ['Yük konusunda destek ve yol göstermek', 'Tatil yapmak', 'Eleştirilmek', 'Yalnız bırakılmak'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Yetişemeyecekmişsin gibi hissettiğin için bunalmış görünüyorsun. Yöneticinle konuşmak için nasıl bir yardım işine yarar?',
        effect: 'isler',
        why: 'Duyguyu adlandırır ve konuşmayı çözüme açar; karşı taraf anlaşıldığını hisseder.',
      },
      {
        text: 'Herkesin zor haftaları olur, geçecek.',
        effect: 'kismen',
        why: 'Teselli etmek niyetli ama kişinin yaşadığı zorluğu küçültmüş gibi durabilir.',
      },
      {
        text: 'Daha iyi planlasaydın bu kadar sıkışmazdın.',
        effect: 'islemez',
        why: 'Yargılayıcı bir ton; kişi destek yerine suçlama aldığını hisseder.',
      },
    ],
  },
  {
    id: 'ed-02',
    title: 'Sınav sonrası öğrenci',
    utterance:
      'Üç haftadır sürekli çalıştım ama sınavda soruların yarısını bile yapamadım. Herkes bir şeyleri başarırken ben yerimde sayıyorum gibi geliyor. Belki de bu bölüm bana göre değil.',
    feelingOptions: ['Hayal kırıklığına uğramış', 'Heyecanlı', 'Rahatlamış', 'Meraklı'],
    feelingIndex: 0,
    needOptions: ['Emeğinin görülmesi ve anlaşılmak', 'Hızlı bir çözüm listesi', 'Tek başına kalmak', 'Başkalarıyla yarışmak'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Bu kadar emekten sonra beklediğin sonucu alamamak yorucu olmalı. İstersen sınavda seni en çok zorlayan kısmı konuşalım.',
        effect: 'isler',
        why: 'Duyguyu ve emeği kabul eder, devamı için kapıyı açık bırakır; karar vermeyi kişiye bırakır.',
      },
      {
        text: 'Bölümü bırakmalısın, belli ki sana uygun değil.',
        effect: 'islemez',
        why: 'Kişinin verdiği bir ihtimali karara çevirir; çözüm dayatmak dinlenmediği hissini yaratır.',
      },
      {
        text: 'Üzülme, bir sonraki sınav daha iyi geçer.',
        effect: 'kismen',
        why: 'İyi niyetli ama emeğin ve hayal kırıklığının üzerinden geçmeden teselliye atlar.',
      },
    ],
  },
  {
    id: 'ed-03',
    title: 'Yalnız hisseden arkadaş',
    utterance:
      'Son zamanlarda arkadaşlar hep plan yapıyor ama beni çağırmıyorlar. Belki ben fazla sıkıcıyım, bilmiyorum. Hafta sonu yine evde oturup telefonla uğraşacağım.',
    feelingOptions: ['Dışlanmış', 'Öfkeli', 'Keyifli', 'Utanç dolu'],
    feelingIndex: 0,
    needOptions: ['Değer verildiğini hissetmek', 'Para kazanmak', 'Tavsiye listesi', 'Konuşmayı kısa kesmek'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Planlara çağrılmadığını düşünmek incitici olmalı. Bu seni nasıl etkiliyor, biraz anlatmak ister misin?',
        effect: 'isler',
        why: 'Duyguyu adlandırır, yorumsuz bir soru sorar ve konuşmaya alan bırakır.',
      },
      {
        text: 'Hayır canım, sen hiç sıkıcı değilsin, saçmalama!',
        effect: 'kismen',
        why: 'Destek vermek istenir ama kişinin hissini hemen çürütmek, duygusunu yeterince dinlenmemiş gibi bırakabilir.',
      },
      {
        text: 'Onlara yazıp kendin plan yapsan olur.',
        effect: 'kismen',
        why: 'Pratik bir öneri ama duyguya değinmeden çözüme geçmek acele gibi durur.',
      },
    ],
  },
  {
    id: 'ed-04',
    title: 'Yeni anne',
    utterance:
      'Bebekle ilgilenmekten kendime vakit ayıramıyorum. Eşim yardım ediyor ama ben hâlâ her şeyi yarım yapıyormuşum gibi hissediyorum. Dün sadece dört saat uyudum.',
    feelingOptions: ['Yorgun ve yetersiz hissediyor', 'Öfkeli', 'Hevesli', 'Sıkılmış'],
    feelingIndex: 0,
    needOptions: ['Kabul görmek ve dinlenmek', 'Yeni bir hobi', 'Tartışma çıkarmak', 'Başka bir şehre taşınmak'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Uykusuzluk ve sorumluluk birleşince her şeyi yarım yapıyormuş gibi hissetmek çok anlaşılır. Şu an sana en çok ne iyi gelir?',
        effect: 'isler',
        why: 'Hem duyguyu hem koşulu kabul eder; ihtiyacı kişinin kendisinin söylemesine alan açar.',
      },
      {
        text: 'Ben de çocuklarken çok yorulmuştum, bu normaldir.',
        effect: 'kismen',
        why: 'Ortak deneyim paylaşmak bağ kurabilir ama konuşmanın odağını kendi hikâyene çevirebilir.',
      },
      {
        text: 'Eşin yardım ediyorsa şikâyet etmemelisin.',
        effect: 'islemez',
        why: 'Hissi geçersiz kılar; kişi anlatmaktan vazgeçebilir.',
      },
    ],
  },
  {
    id: 'ed-05',
    title: 'Fikri reddedilen stajyer',
    utterance:
      'Toplantıda önerdiğim fikri müdür iki cümleyle geçti. Bir hafta uğraşmıştım, belki de hiç söylememeliydim. Bundan sonra konuşmaya çekinirim herhalde.',
    feelingOptions: ['Kırılmış ve çekingen', 'Gururlu', 'Rahat', 'Meraklı'],
    feelingIndex: 0,
    needOptions: ['Emeğinin fark edilmesi', 'İşten ayrılmak', 'Daha çok iş', 'Hiç konuşmamak'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Bir haftalık emeğin hızlıca geçilince kırılmak çok doğal. Fikrin hakkında müdürden daha ayrıntılı geri bildirim istemek ister misin?',
        effect: 'isler',
        why: 'Emeği ve duyguyu görür, istersen bir sonraki adımı sunar; seçimi kişiye bırakır.',
      },
      {
        text: 'Müdür zaten hep böyle yapıyor, ciddiye alma.',
        effect: 'islemez',
        why: 'Üçüncü bir kişiyi yargılamak konuyu kişiden uzaklaştırır ve kırıklığı görmezden gelir.',
      },
      {
        text: 'Bence çok iyi bir fikirdi, bir daha önerirsen kabul edilir.',
        effect: 'kismen',
        why: 'Destekleyici olur ama garanti veremeyeceğin bir sonuca söz vermek yanlış beklenti oluşturabilir.',
      },
    ],
  },
  {
    id: 'ed-06',
    title: 'Taşınmaya hazırlanan arkadaş',
    utterance:
      'Başka bir şehre taşınıyorum, iş teklifi çok iyi. Ama burada her şeyi bırakıp gitmek içimi sıkıyor. Hem heyecanlıyım hem de gitmek istemiyorum gibi.',
    feelingOptions: ['Karışık duygular içinde', 'Öfkeli', 'Tamamen mutlu', 'Umursamaz'],
    feelingIndex: 0,
    needOptions: ['Kararında desteklenmek', 'Kararından vazgeçirilmek', 'Hızla ikna edilmek', 'Yalnız bırakılmak'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Hem heyecan hem üzüntü bir arada olabilir. Gitmeyi düşünürken seni en çok neyin üzdüğünü konuşalım mı?',
        effect: 'isler',
        why: 'İki duygunun birlikte var olabileceğini kabul eder ve konuşmayı açar.',
      },
      {
        text: 'Böyle bir teklif her zaman gelmez, hiç düşünme git.',
        effect: 'islemez',
        why: 'Kararı senin yerine verir; kişi içindeki tereddüdü paylaşamaz.',
      },
      {
        text: 'Gitme, burada ne güzel hayatın var!',
        effect: 'islemez',
        why: 'Kendi isteğini araya sokar; kişi iki yönlü hissini dile getirmekten çekinir.',
      },
    ],
  },
  {
    id: 'ed-07',
    title: 'Kırgın kardeş',
    utterance:
      'Annemle her konuştuğumda abini örnek veriyor. Ben de elimden geleni yapıyorum ama hiç yetmiyor gibi. Artık eve telefon etmek bile istemiyorum.',
    feelingOptions: ['Kırgın ve yeterince görülmediğini hisseden', 'Gururlu', 'Kayıtsız', 'Meraklı'],
    feelingIndex: 0,
    needOptions: ['Kendi çabasının takdir edilmesi', 'Abisiyle yarışmak', 'Annesini suçlamak', 'Konuşmamak'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Elinden geleni yaptığın hâlde kıyaslanmak ve yetmiyormuş gibi hissetmek seni kırmış. Bunu annenle paylaştın mı?',
        effect: 'isler',
        why: 'Çabayı ve duyguyu görür, açık bir soru sorar; yargı ya da yönlendirme yoktur.',
      },
      {
        text: 'Annen sadece iyiliğini istiyor, bu kadar alınma.',
        effect: 'islemez',
        why: 'Duyguyu küçültür; kişi anlaşılmadığını düşünüp konuşmayı keser.',
      },
      {
        text: 'Abin de aslında kolay değil, bilsen.',
        effect: 'kismen',
        why: 'Farklı bir bakış sunar ama o anki duyguyu atlayıp konuyu abiye taşır.',
      },
    ],
  },
  {
    id: 'ed-08',
    title: 'İş değiştiren kişi',
    utterance:
      'Yeni işte üç haftadır çalışıyorum ve her şey çok hızlı. Herkes ne yapacağını biliyor gibi, ben ise soru sormaya bile çekiniyorum. Yanlış karar verdim mi diye düşünüyorum.',
    feelingOptions: ['Çekingen ve kaygılı', 'Rahat', 'Kızgın', 'Gururlu'],
    feelingIndex: 0,
    needOptions: ['Uyum sağlamak için güvenli bir alan', 'Daha çok sorumluluk', 'Eski işine dönmek', 'Eleştirilmek'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Yeni bir ortamda herkes bilir gibi görününce soru sormak zor gelebilir. Sana en çok hangi konuda destek lazım olur?',
        effect: 'isler',
        why: 'Durumu adlandırır ve somut bir yardım alanı sorar; kişi yük bindirilmeden cevaplayabilir.',
      },
      {
        text: 'Üç haftada herkes böyle hisseder, geçer.',
        effect: 'kismen',
        why: 'Normalleştirme rahatlatabilir ama kişi duygusunun üzerinden geçilmiş hissedebilir.',
      },
      {
        text: 'Soru sormaktan korkma, kimse seni yargılamaz.',
        effect: 'kismen',
        why: 'Cesaretlendirici ama kişinin yaşadığı belirsizliği kabul etmeden çözüm sunar.',
      },
    ],
  },
  {
    id: 'ed-09',
    title: 'Hasta ebeveyni olan kişi',
    utterance:
      'Babam geçen hafta hastaneye yattı. İşte, evde ve hastanede koşturuyorum. Herkes nasıl olduğunu soruyor ama ne diyeceğimi bilemiyorum.',
    feelingOptions: ['Yorgun ve endişeli', 'Neşeli', 'Sinirli', 'Sıkılmış'],
    feelingIndex: 0,
    needOptions: ['Destek ve anlayış', 'Dikkat dağıtıcı konular', 'Haber vermek', 'Para yardımı'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Babanın durumu ve bunca koşturma çok yorucu olmalı. Şu an sadece dinlememi mi istersin, yoksa yapabileceğim bir şey var mı?',
        effect: 'isler',
        why: 'Durumu kabul eder ve kişinin hangi türde destek istediğini sorar; karar onda kalır.',
      },
      {
        text: 'Merak etme, babanın bir şeyi yoktur.',
        effect: 'islemez',
        why: 'Bilmediğin bir şeye güvence vermek hem yanlış bir umut oluşturur hem endişeyi geçersiz kılar.',
      },
      {
        text: 'Ben de geçen yıl dedemi kaybettim, ne kadar zor olduğunu bilirim.',
        effect: 'kismen',
        why: 'Paylaşım bağ kurabilir ama konuşmayı kendi deneyimine taşıyabilir.',
      },
    ],
  },
  {
    id: 'ed-10',
    title: 'Ekip arkadaşı kızgın',
    utterance:
      'Raporu son dakikada değiştirmeniz benim için büyük sorun oldu. Hazırladığım her şeyi yeniden yapmam gerekti. Bana önceden söylenmesini isterdim.',
    feelingOptions: ['Kızgın ve yok sayılmış', 'Mutlu', 'Meraklı', 'Rahat'],
    feelingIndex: 0,
    needOptions: ['Bilgilendirilmek ve saygı görmek', 'Raporu bırakmak', 'Özür dinlememek', 'Daha çok iş almak'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Son dakika değişikliğinin sana önceden haber verilmeden yapılması seni zor durumda bırakmış. Bundan sonra değişiklikler için nasıl bilgilendirilmek istersin?',
        effect: 'isler',
        why: 'Etkiyi kabul eder ve gelecek için ortak bir çözüm sorar; savunmaya geçmez.',
      },
      {
        text: 'Bu rapor zaten süreye bağlıydı, başka seçenek yoktu.',
        effect: 'islemez',
        why: 'Gerekçeyi anlatmak haklı olabilir ama önce duyguyu geçiştirdiği için savunma gibi gelir.',
      },
      {
        text: 'Tamam özür dilerim, bir daha olmaz.',
        effect: 'kismen',
        why: 'Özür hoş bir adımdır ama sorun anlaşılmadan verilen söz inandırıcı olmayabilir.',
      },
    ],
  },
  {
    id: 'ed-11',
    title: 'Kararsız lise öğrencisi',
    utterance:
      'Hangi bölümü seçeceğimi bilmiyorum. Ailem mühendislik diyor, ben ise resim yapmayı seviyorum. Her şeyi yanlış yapacağım diye korkuyorum.',
    feelingOptions: ['Kararsız ve baskı altında', 'Mutlu', 'Umursamaz', 'Öfkeli'],
    feelingIndex: 0,
    needOptions: ['Kendi isteğinin dinlenmesi', 'Ailesine karşı gelmek', 'Hemen karar vermek', 'Konuyu kapatmak'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Ailenin beklentisi ile kendi isteğin farklı olunca karar vermek çok zor. Resim yaparken sana ne hissettiriyor?',
        effect: 'isler',
        why: 'İki yönü de görür ve kişinin kendi isteğine dönmesini sağlayan açık bir soru sorar.',
      },
      {
        text: 'Mühendislik daha garanti, ona git.',
        effect: 'islemez',
        why: 'Kişinin yerine karar verir; kendi isteği konuşulmadan kalır.',
      },
      {
        text: 'Resim çok güzel, kesinlikle onu seç.',
        effect: 'islemez',
        why: 'Bu da kararı kişinin yerine vermek olur; aileyle yaşadığı baskı göz ardı edilir.',
      },
    ],
  },
  {
    id: 'ed-12',
    title: 'Kızgın müşteri',
    utterance:
      'Üç gündür bu kargoyu bekliyorum ve kimse bana bir cevap vermiyor. Her aradığımda başka birine aktarılıyorum. Artık sabrım kalmadı.',
    feelingOptions: ['Öfkeli ve sabırsız', 'Mutlu', 'Meraklı', 'Rahat'],
    feelingIndex: 0,
    needOptions: ['Net bir bilgi ve çözüm', 'Özür kartı', 'Başka bir şirket', 'Sohbet'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Üç gündür cevap alamamak ve sürekli aktarılmak sabrınızı tüketmiş. Şimdi kargonuzun durumunu birlikte netleştirelim.',
        effect: 'isler',
        why: 'Öfkeyi kabul eder ve hemen çözüme geçer; kişi duyulduğunu hisseder.',
      },
      {
        text: 'Sakin olun lütfen, sistem bazen gecikiyor.',
        effect: 'islemez',
        why: 'Sakin ol demek öfkeyi genelde artırır; açıklama da çözüm sunmaz.',
      },
      {
        text: 'Çok üzgünüm, gerçekten çok üzgünüm…',
        effect: 'kismen',
        why: 'Samimi görünür ama çözüm adımı yoksa kişi beklemeye devam eder.',
      },
    ],
  },
  {
    id: 'ed-13',
    title: 'Sınıf başkanı adayı',
    utterance:
      'Sınıf başkanlığına aday olacağım ama konuşma yapmaktan çok korkuyorum. Herkesin bana bakacağını düşününce ellerim titriyor. Yine de bunu denemek istiyorum.',
    feelingOptions: ['Kaygılı ama kararlı', 'Kayıtsız', 'Öfkeli', 'Sıkılmış'],
    feelingIndex: 0,
    needOptions: ['Cesaretlendirilmek ve dinlenmek', 'Adaylıktan vazgeçirilmek', 'Eleştirilmek', 'Yarışmak'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Korkmana rağmen denemek istemen cesaret ister. Konuşmanın hangi kısmında kendini daha rahat hissediyorsun, oradan başlayabiliriz.',
        effect: 'isler',
        why: 'Hem korkuyu hem kararlılığı kabul eder ve somut bir başlangıç noktası önerir.',
      },
      {
        text: 'Korkacak bir şey yok, herkes seni seviyor.',
        effect: 'kismen',
        why: 'Moral verir ama korkunun gerçek olduğunu geçiştirir.',
      },
      {
        text: 'Korkuyorsan aday olma bence.',
        effect: 'islemez',
        why: 'Kişinin denemek istediğini göz ardı eder; cesaretini kırabilir.',
      },
    ],
  },
  {
    id: 'ed-14',
    title: 'Emekli olan komşu',
    utterance:
      'Otuz yıl çalıştım ve artık sabahları ne yapacağımı bilmiyorum. Çocuklar uzakta, eşimle de eskisi kadar konuşacak şey bulamıyoruz. Zaman geçmiyor.',
    feelingOptions: ['Boşlukta ve yalnız hisseden', 'Çok neşeli', 'Öfkeli', 'Gururlu'],
    feelingIndex: 0,
    needOptions: ['Anlamlı bir uğraş ve bağ', 'Para', 'Eski işini sürdürmek', 'Tartışma'],
    needIndex: 0,
    reflectOptions: [
      {
        text: 'Otuz yıl düzenli bir hayattan sonra günlerin boş kalması zor olmalı. Eskiden en çok ne yapmaktan keyif alırdınız?',
        effect: 'isler',
        why: 'Değişimi kabul eder ve kişinin kendi geçmişine dönmesini sağlayan açık bir soru sorar.',
      },
      {
        text: 'Ne güzel, artık dinleniyorsunuz!',
        effect: 'islemez',
        why: 'Durumu olumlu göstermeye çalışmak kişinin hissini görmezden gelir.',
      },
      {
        text: 'Bir kursa yazılsanız ya, çok iş var yapacak.',
        effect: 'kismen',
        why: 'Faydalı bir öneri olabilir ama duyguyu dinlemeden hemen çözüm sunmak acele gibi durur.',
      },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────
// Günün iletişim ipuçları
// ───────────────────────────────────────────────────────────────────────────

export const COMM_TIPS: CommTip[] = [
  { id: 'tip-01', category: 'zor-konusma', text: 'Zor bir konuşmaya başlarken önce niyetini söyle: "Bunu seni üzmek için değil, işimizi kolaylaştırmak için açıyorum."' },
  { id: 'tip-02', category: 'zor-konusma', text: 'Hayır derken tek bir kısa gerekçe yeter; uzun açıklama genellikle pazarlık kapısı açar.' },
  { id: 'tip-03', category: 'zor-konusma', text: 'Hatanı kabul ederken "ama" demeden bitir; gerekçeni ayrı bir cümleyle ve ancak sorulursa ekle.' },
  { id: 'tip-04', category: 'zor-konusma', text: 'Kötü haberi vermeden önce bir cümlelik hazırlık yap: "Sana zor bir haberim var."' },
  { id: 'tip-05', category: 'zor-konusma', text: 'İtiraz ederken "Sen yanlış yapıyorsun" yerine "Ben şöyle görüyorum, sen nasıl görüyorsun?" demeyi dene.' },
  { id: 'tip-06', category: 'zor-konusma', text: 'Zor bir konuşmayı yazıyla değil, mümkünse sesli ya da yüz yüze yap; ton yazıda kolay kaybolur.' },
  { id: 'tip-07', category: 'zor-konusma', text: 'Konuşmadan önce tek cümlede ne istediğini yaz; konuşma dağılırsa o cümleye dönebilirsin.' },
  { id: 'tip-08', category: 'geri-bildirim', text: 'Geri bildirimde "sen hep…" yerine tek bir olayı anlat: ne oldu, sana etkisi ne oldu.' },
  { id: 'tip-09', category: 'geri-bildirim', text: 'Takdiri somut söyle: "İyi iş" yerine "Raporun özetini ilk sayfaya koyman işimi kolaylaştırdı."' },
  { id: 'tip-10', category: 'geri-bildirim', text: 'Eleştiri alırken ilk cevabın "Teşekkürler, bir örnek verir misin?" olsun; savunma sonraya kalsın.' },
  { id: 'tip-11', category: 'geri-bildirim', text: 'Geri bildirim isterken genel "Nasıl olmuş?" yerine belirli bir kısmı sor: "Girişin akışı nasıldı?"' },
  { id: 'tip-12', category: 'geri-bildirim', text: 'Geri bildirimi bir şeyin ne olması gerektiğiyle bitir, ne olmaması gerektiğiyle değil.' },
  { id: 'tip-13', category: 'geri-bildirim', text: 'Bugün birine, fark ettiğin somut bir iyi şeyi söyle ve nedenini ekle.' },
  { id: 'tip-14', category: 'ikna', text: 'İkna etmeden önce karşı tarafın en büyük endişesini sor; cevabını bilmeden ikna etmeye çalışma.' },
  { id: 'tip-15', category: 'ikna', text: 'Talebini geri alınabilir bir denemeye çevir: "İki haftalığına deneyelim, olmazsa döneriz."' },
  { id: 'tip-16', category: 'ikna', text: 'Rakam ve örnek ver; "çok" ve "bir sürü" yerine "üç kez" ve "yarım saat" daha ikna edicidir.' },
  { id: 'tip-17', category: 'ikna', text: 'Müzakerede iki isteği birleştiren üçüncü bir seçenek ara; "ya o ya bu" çoğu zaman tek yol değildir.' },
  { id: 'tip-18', category: 'ikna', text: 'Talebini karşı tarafın işine nasıl yarayacağıyla birlikte anlat.' },
  { id: 'tip-19', category: 'ikna', text: 'Karşı tarafın itirazını önce kendi kelimelerinle özetle, sonra cevap ver; dinlendiğini hisseden insan daha açık olur.' },
  { id: 'tip-20', category: 'catisma', text: 'Gerginlik yükselirken ses tonunu bilinçli olarak biraz alçalt; karşı taraf çoğu zaman uyum sağlar.' },
  { id: 'tip-21', category: 'catisma', text: '"Sakin ol" demek yerine "Seni anlamak istiyorum, bir daha anlatır mısın?" de.' },
  { id: 'tip-22', category: 'catisma', text: 'Tartışma kızışınca "On beş dakika ara verelim, sonra döneriz." demek kaçış değil, toparlanma hamlesidir.' },
  { id: 'tip-23', category: 'catisma', text: 'Mesajda yanlış anlaşıldığını fark edersen yazıyı uzatma; sesli konuşmayı öner.' },
  { id: 'tip-24', category: 'catisma', text: 'Haklı olmaktan önce anlaşılmayı hedefle: önce karşı tarafın görüşünü doğru özetle.' },
  { id: 'tip-25', category: 'catisma', text: '"Sen" cümlesini "ben" cümlesine çevir: "Beni dinlemiyorsun" yerine "Sözüm kesilince konuşmakta zorlanıyorum."' },
  { id: 'tip-26', category: 'kucuk-konusma', text: 'Küçük konuşmayı açık uçlu bir soruyla başlat: "Bugün nasıl geçti?" yerine "Bugün seni en çok ne yordu?" dene.' },
  { id: 'tip-27', category: 'kucuk-konusma', text: 'Sohbette karşındakinin söylediği bir ayrıntıyı hatırla ve sonra o ayrıntıya dön.' },
  { id: 'tip-28', category: 'kucuk-konusma', text: 'Sohbeti kapatırken önce takdir et, sonra neden ayrıldığını söyle: "Çok iyi sohbetti, ben şimdi şuraya uğrayayım."' },
  { id: 'tip-29', category: 'kucuk-konusma', text: 'Tanımadığın birine ortamdaki ortak noktayı sor: "Siz bu etkinliğe nasıl geldiniz?"' },
  { id: 'tip-30', category: 'kucuk-konusma', text: 'Kısa bir sessizlik sohbetin bittiği anlamına gelmez; üç saniye bekleyip çevreden bir gözlem paylaşmayı dene.' },
  { id: 'tip-31', category: 'kucuk-konusma', text: 'Bugün tanımadığın biriyle sadece bir cümle selamlaş ve kendini tanıt.' },
  { id: 'tip-32', category: 'topluluk', text: 'Toplantıda söz almak için bir sonraki cümleyi hazırla ve bir cümle bittiğinde "Bir ekleme yapabilir miyim?" de.' },
  { id: 'tip-33', category: 'topluluk', text: 'Sözün kesilirse "Bu da önemli; önce şunu bitireyim, sonra ona döneriz." de.' },
  { id: 'tip-34', category: 'topluluk', text: 'Bilmediğin bir soruda "Şu an kesin cevabım yok, bakıp sana yazarım." demek uydurmaktan daha güven verir.' },
  { id: 'tip-35', category: 'topluluk', text: 'Kendini tanıtırken ad, rol, amaç ve küçük bir kişisel ayrıntı söyle; otuz saniyeyi aşma.' },
  { id: 'tip-36', category: 'topluluk', text: 'Kalabalıkta konuşurken göz temasını tek tek insanlara yönelt, tüm salona değil.' },
  { id: 'tip-37', category: 'topluluk', text: 'Söz alırken önce sonucu söyle, sonra gerekçeni anlat; dinleyenlerin dikkati başta daha yüksektir.' },
  { id: 'tip-38', category: 'topluluk', text: 'Toplantıda sessiz kalmak yerine her toplantıda en az bir soru ya da yorum sunmayı hedefle.' },
  { id: 'tip-39', category: 'zor-konusma', text: 'Karşındakinin son cümlesini kendi kelimelerinle tekrar et, sonra cevap ver.' },
  { id: 'tip-40', category: 'geri-bildirim', text: 'Geri bildirim verirken karşı tarafa "Şimdi bu konuda görüş paylaşmamı ister misin?" diye sor; izin istemek kapıyı açar.' },
  { id: 'tip-41', category: 'ikna', text: 'Teklifini sunarken seçenek sayısını ikiyle üçte tut; çok seçenek kararı zorlaştırır.' },
  { id: 'tip-42', category: 'catisma', text: 'Karşındaki öfkeliyken önce duygusunu adlandır: "Bu durum seni çok yormuş gibi görünüyor."' },
  { id: 'tip-43', category: 'kucuk-konusma', text: 'Bir soruyu sorduktan sonra karşındakinin cevabını tam dinle; bir sonraki cümleni hazırlamayı bırak.' },
  { id: 'tip-44', category: 'topluluk', text: 'Konuşmaya başlamadan önce yavaşça nefes al; ilk cümleyi sakin söylemek gerisini kolaylaştırır.' },
  { id: 'tip-45', category: 'zor-konusma', text: 'Ağır bir konuşmanın sonunda bir sonraki adımı birlikte netleştir: "Bundan sonra ne yapalım?"' },
];

// ───────────────────────────────────────────────────────────────────────────
// Yardımcılar
// ───────────────────────────────────────────────────────────────────────────

/**
 * `pickForDay` salt'ı: projede 0-5, 9 ve 11 kullanımda (dictionDrills 0/1,
 * belagat 2/3, dailyTexts 4/5, risale 9, questions 3/11, Onboarding 3).
 * 6 boş.
 */
const COMM_TIP_SALT = 6;

export function scenariosByCategory(c: CommCategory): CommScenario[] {
  return COMM_SCENARIOS.filter((s) => s.category === c);
}

export function findScenario(id: string): CommScenario | undefined {
  return COMM_SCENARIOS.find((s) => s.id === id);
}

export function findListeningExercise(id: string): ListeningExercise | undefined {
  return LISTENING_EXERCISES.find((e) => e.id === id);
}

/** Günün iletişim ipucu — `pickForDay` ile deterministik. */
export function pickDailyTip(date: Date = new Date()): CommTip {
  return pickForDay(COMM_TIPS, date, COMM_TIP_SALT);
}
