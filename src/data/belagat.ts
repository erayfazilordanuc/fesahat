import { dayIndex, pickForDay } from '../utils/dateUtils';
import type { BelagatBranchFilter } from '../utils/dailyPracticeSettings';

/**
 * Belâgat müfredatı.
 *
 * Belâgat, sözün "yerinde, yeterince ve zamanında" söylenmesini inceleyen ilim dalıdır ve
 * klasik tasnifte üç kola ayrılır:
 *   - meânî : sözün hâlin gereğine (muktezâ-yı hâl) uygun olmasının kuralları
 *   - beyân : aynı manayı farklı yollarla ifade etme usulleri (teşbih, istiare, mecaz, kinaye)
 *   - bedî' : lafzın ve mananın süslenmesi (cinas, seci, tıbak, mukabele...)
 * Bunların önkoşulu fesahattir: sözün açık, seçik ve söylenmesi kolay olması.
 *
 * Bu modül müfredatı üç şekilde kullanılabilir hale getirir:
 *   1. Kart olarak öğrenme (tanım + örnek + mülakatta kullanım)
 *   2. Tanıma alıştırması (örnek verilir, sanat sorulur)
 *   3. Üretim alıştırması (mülakat bağlamında o sanatla cümle kurma)
 * Ayrıca fesahat kusurları, diksiyon tarafıyla doğrudan bağlantılı bir "kaçınılacaklar" listesi verir.
 */

export type BelagatBranch = 'meani' | 'beyan' | 'bedi';

export const BRANCH_LABELS: Record<BelagatBranch, string> = {
  meani: 'Meânî',
  beyan: 'Beyân',
  bedi: "Bedî'",
};

export const BRANCH_DESCRIPTIONS: Record<BelagatBranch, string> = {
  meani:
    'Sözün duruma, muhataba ve zamana uygun olması. Ne kadar söyleyeceğine, neyi öne alacağına ve neyi hiç söylemeyeceğine dair kurallar.',
  beyan:
    'Aynı manayı farklı yollarla anlatma sanatı. Teşbih, istiare, mecaz ve kinaye bu kolun temel konularıdır.',
  bedi: 'Söz ve mananın süslenmesi. Anlam kurulduktan sonra ifadeyi akılda kalıcı hale getiren sanatlar.',
};

export type BelagatArt = {
  id: string;
  branch: BelagatBranch;
  name: string;
  /** Yaygın diğer adı / Türkçe karşılığı. */
  aka?: string;
  /** Bildirimde ve listede kullanılan tek satırlık tanım. */
  shortDefinition: string;
  definition: string;
  /** Neden işe yarıyor — dinleyicide oluşturduğu etki. */
  effect: string;
  example: { text: string; source?: string; note: string };
  /** Savunma sanayii mülakatı bağlamında somut kullanım. */
  interviewUse: string;
  /** Üretim alıştırması. */
  exercise: { prompt: string; hint: string; sampleAnswer: string };
};

const MEANI: BelagatArt[] = [
  {
    id: 'muktaza',
    branch: 'meani',
    name: 'Muktezâ-yı Hâl',
    aka: 'Hâlin gereğine uygunluk',
    shortDefinition: 'Sözü muhataba, ortama ve zamana göre ayarlamak.',
    definition:
      'Belâgatin temel ilkesidir. Aynı bilgi, karşısındaki kişinin uzmanlığına, ortamın resmiyetine ve konuşmanın anına göre farklı biçimde kurulur. Doğru bilgi yanlış hâlde söylendiğinde belâgat bozulur.',
    effect:
      'Dinleyici "bu kişi beni okuyor" hisseder; aynı cevap, muhatabı değiştiğinde de işlevini korur.',
    example: {
      text: 'Aynı arıza: teknik ekibe "besleme hattında 40 mV dalgalanma var", yöneticiye "kartın gücü kararsız, iki günde çözülür".',
      note: 'Bilgi aynı, seçilen ayrıntı düzeyi ve terimler hâle göre değişti.',
    },
    interviewUse:
      'Karşınızda üç kişilik bir panel varsa cevabı en teknik olmayan üyeye göre kurun, sonra teknik derinliği katman katman ekleyin.',
    exercise: {
      prompt:
        'Yaptığınız bir teknik işi iki kez anlatın: (1) alan uzmanına, (2) İK uzmanına. Cümle sayısı aynı olsun.',
      hint: 'İK versiyonunda terim değil sonuç konuşun; uzman versiyonunda yöntemi konuşun.',
      sampleAnswer:
        'Uzmana: "Sonlu elemanlar modelinde ağ yakınsamasını doğrulayıp kritik bölgede gerilme yığılmasını %18 düşürdük." / İK\'ya: "Parçanın kırılma riskini ölçtük ve tasarımı değiştirerek riski beşte bir oranında azalttık."',
    },
  },
  {
    id: 'icaz',
    branch: 'meani',
    name: 'Îcâz',
    aka: 'Sözü öz tutma',
    shortDefinition: 'Az sözle çok mana; gereksiz olanı düşürmek.',
    definition:
      'Manayı eksiltmeden lafzı kısaltmaktır. İki türü vardır: îcâz-ı kasr (söz kısa ama mana geniş) ve îcâz-ı hazif (bir öğe, bağlamdan anlaşıldığı için düşürülür).',
    effect: 'Kararlılık ve hâkimiyet duygusu verir. Uzun cevap her zaman güçlü cevap değildir.',
    example: {
      text: '"Bunu bilmiyorum. Nasıl bulacağımı biliyorum."',
      note: 'İki kısa cümle, uzun bir savunmadan daha güçlü. Fazlalık atılmış.',
    },
    interviewUse:
      'Sorunun cevabı "evet" ise önce "evet" deyin, sonra tek cümle gerekçe ekleyin. Girizgâhla başlayan cevaplar zayıf duyulur.',
    exercise: {
      prompt: 'Aşağıdaki cevabı anlamından bir şey kaybetmeden yarıya indirin.',
      hint: 'Dolgu kalıpları ("şunu belirtmek isterim ki", "aslında bakacak olursanız") ilk gidenler olsun.',
      sampleAnswer:
        'Önce: "Aslında şunu belirtmek isterim ki bu konuda daha önce de benzer bir çalışma yapmıştım ve o çalışmada da benzer bir yöntem kullanmıştım." → Sonra: "Bu yöntemi daha önce benzer bir çalışmada kullandım."',
    },
  },
  {
    id: 'itnab',
    branch: 'meani',
    name: 'İtnâb',
    aka: 'Maksatlı uzatma',
    shortDefinition: 'Bir amaca hizmet ettiği için sözü genişletmek.',
    definition:
      'Sözün, bir fayda gözetilerek uzatılmasıdır. Amaçsız uzatma kusur (tatvîl) sayılır; itnâb ise açıklama, pekiştirme veya duygu yoğunlaştırma için yapılır.',
    effect: 'Karmaşık bir fikrin dinleyicide oturmasını sağlar; tekrar, öğretici bir işlev görür.',
    example: {
      text: '"Üç seçeneği değerlendirdik. Birincisi maliyeti düşürüyordu. İkincisi süreyi kısaltıyordu. Üçüncüsü ikisini de biraz iyileştiriyordu. Üçüncüyü seçtik."',
      note: 'Tek cümlede söylenebilirdi; sayarak söylemek kararın yöntemli olduğunu gösteriyor.',
    },
    interviewUse:
      'Karar süreçlerinizi anlatırken kasten sayın. "Şu üç kriteri kullandım" demek, sonucu tek cümlede söylemekten daha güvenilir duyulur.',
    exercise: {
      prompt: 'Bir teknik kararınızı, kriterleri tek tek sayarak anlatın.',
      hint: 'En fazla üç kriter. Dördüncüsü dinleyiciyi kaybettirir.',
      sampleAnswer:
        '"Malzemeyi seçerken üçe baktım: tedarik süresi, sıcaklık dayanımı ve sertifikasyon geçmişi. İlk ikisinde alüminyum alaşımı öndeydi, üçüncüsünde kompozit. Programın takvimi kritik olduğu için alüminyumda kaldım."',
    },
  },
  {
    id: 'takdim-tehir',
    branch: 'meani',
    name: 'Takdîm-Tehîr',
    aka: 'Öne alma – sona bırakma',
    shortDefinition: 'Vurgulanacak öğeyi cümlenin başına ya da sonuna taşımak.',
    definition:
      'Cümle öğelerinin sırasını değiştirerek vurguyu yönetmektir. Türkçede vurgu yüklemden hemen önceki öğededir; bir öğeyi oraya taşımak onu öne çıkarır.',
    effect: 'Dinleyicinin dikkatini, siz nereye istiyorsanız oraya kilitler.',
    example: {
      text: '"Bu analizi ben yaptım." / "Ben bu analizi yaptım." / "Yaptım bu analizi ben."',
      note: 'Üç cümle aynı bilgi, üç farklı vurgu: kim, ne, kesinlik.',
    },
    interviewUse:
      'Katkınızı vurgulayacaksanız özneyi yüklemin hemen önüne alın. Sonucu vurgulayacaksanız sayıyı oraya koyun: "maliyeti yüzde on iki düşürdük" değil, "yüzde on iki düşürdük maliyeti" bile olabilir.',
    exercise: {
      prompt: 'Bir başarınızı üç farklı öğe sırasıyla söyleyin ve kaydedip dinleyin.',
      hint: 'Hangi sıralamada en az böbürlenme duyuluyor? Onu kullanın.',
      sampleAnswer:
        '"Test süresini yarıya indiren otomasyonu ben yazdım." → katkı vurgulu. "Yazdığım otomasyon test süresini yarıya indirdi." → sonuç vurgulu; mülakatta bu ikincisi daha güçlü.',
    },
  },
  {
    id: 'kasr',
    branch: 'meani',
    name: 'Kasr',
    aka: 'Tahsis / sınırlama',
    shortDefinition: 'Bir hükmü yalnızca bir şeye hasretmek.',
    definition:
      '"Ancak, sadece, yalnızca" gibi araçlarla ya da cümle kuruluşuyla, bir niteliği tek bir özneye veya nesneye kilitlemektir.',
    effect: 'Cevaba kesinlik katar; tereddüt izlenimini siler.',
    example: {
      text: '"Bu arızayı çözen tek şey besleme filtresiydi."',
      note: '"Besleme filtresi de işe yaradı" demekle arasındaki fark, kesinlik farkıdır.',
    },
    interviewUse:
      'Emin olduğunuz yerde kasr kullanın, emin olmadığınız yerde kesinlikle kullanmayın — panel bunu test eder.',
    exercise: {
      prompt: 'Kesin olarak bildiğiniz bir teknik gerçeği kasr ile ifade edin.',
      hint: 'Yanlış yerde kullanılan kasr, bir sonraki soruda size geri döner.',
      sampleAnswer: '"Bu devrede gürültüyü belirleyen tek unsur topraklama düzenidir."',
    },
  },
  {
    id: 'hazif',
    branch: 'meani',
    name: 'Hazif',
    aka: 'Öğe düşürme',
    shortDefinition: 'Bağlamdan anlaşılan öğeyi hiç söylememek.',
    definition:
      'Yüklem, özne veya tümleç gibi bir öğenin, dinleyici tarafından zaten tamamlanabildiği için düşürülmesidir. Îcâzın en sık kullanılan aracıdır.',
    effect: 'Konuşmayı hızlandırır ve dinleyiciyi cümleyi tamamlamaya ortak eder.',
    example: {
      text: '"— Kaç kişilik ekiptiniz? — Dört." ',
      note: '"Dört kişilik bir ekipteydik" demeye gerek yok; hazif doğal ve güçlü.',
    },
    interviewUse:
      'Kısa sorulara kısa cevap verin. Tam cümle kurma zorunluluğu hissetmek, gerginliğin en görünür belirtisidir.',
    exercise: {
      prompt: 'Beş kısa soruya tek kelimeyle veya tek öbekle cevap verme provası yapın.',
      hint: 'Cevaptan sonra susmayı deneyin. Boşluğu doldurmayın.',
      sampleAnswer: '"— Kaç yıl? — Üç. — Hangi platformda? — İnsansız hava aracı aviyoniği."',
    },
  },
  {
    id: 'fasl-vasl',
    branch: 'meani',
    name: 'Fasl ve Vasl',
    aka: 'Cümleleri ayırma ve bağlama',
    shortDefinition: 'Cümleleri bağlaçla birleştirmek ya da kesip ayırmak.',
    definition:
      'İki cümle arasındaki ilgi güçlüyse bağlaçla birleştirilir (vasl), ilgi başka türdense veya vurgu gerekiyorsa kesilir (fasl). Yanlış tercih, sözü ya dağıtır ya da hantallaştırır.',
    effect: 'Kısa cümleler kararlılık, bağlı cümleler mantıksal bütünlük duygusu verir.',
    example: {
      text: '"Testi tekrarladık ve sonuç değişmedi." / "Testi tekrarladık. Sonuç değişmedi."',
      note: 'İkincisi, sonucun beklenmediğini de duyurur.',
    },
    interviewUse:
      'Uzun, "ve"lerle bağlanmış cevaplar nefesi de bitirir. Bir cevapta en fazla iki bağlaç kuralı koyun.',
    exercise: {
      prompt: 'Üç bağlaçlı uzun bir cevabı, bağlaçları silerek kısa cümlelere bölün.',
      hint: 'Bölünmüş hâli yüksek sesle okuyun; nefesinizin nerede rahatladığını fark edin.',
      sampleAnswer:
        'Önce: "Modeli kurdum ve doğruladım ve sonra ekiple paylaştım ve geri bildirimle güncelledim." → Sonra: "Modeli kurdum, doğruladım. Ekiple paylaştım. Geri bildirimle güncelledim."',
    },
  },
  {
    id: 'insai-uslup',
    branch: 'meani',
    name: 'İnşâî Üslup',
    aka: 'Soru, emir, temenni kipleri',
    shortDefinition: 'Bildirmek yerine sormak, istemek, çağırmak.',
    definition:
      'Haberî üslup doğru ya da yanlış olabilen bir bildirimdir; inşâî üslup ise soru, emir, dilek, ünlem gibi doğruluk değeri taşımayan kalıplardır. Sözü canlandırmak için ikisi dönüşümlü kullanılır.',
    effect:
      'Soru biçiminde kurulan bir cümle, dinleyiciyi cevabı kendi içinde üretmeye zorlar; akılda daha çok kalır.',
    example: {
      text: '"Doğrulamayı atlarsak ne olur? Sahada öğreniriz."',
      note: 'Bildirim yerine soru: dinleyici sonucu kendisi kurar.',
    },
    interviewUse:
      'Bir tasarım tercihini savunurken önce riski soru olarak ortaya atın, sonra cevaplayın. Tek yönlü anlatımı kırar.',
    exercise: {
      prompt: 'Bir teknik savunmanızı, ortasına bir retorik soru koyarak yeniden kurun.',
      hint: 'Soruyu sorduktan sonra bir saniye susun — cevabı hemen vermeyin.',
      sampleAnswer:
        '"Neden daha pahalı sensörü seçtik? Çünkü ucuz olanın kalibrasyon kayması, iki yılda maliyet farkının üç katını doğuruyordu."',
    },
  },
];

const BEYAN: BelagatArt[] = [
  {
    id: 'tesbih',
    branch: 'beyan',
    name: 'Teşbih',
    aka: 'Benzetme',
    shortDefinition: 'Bir şeyi, ortak bir nitelik üzerinden başka bir şeye benzetmek.',
    definition:
      'Dört unsuru vardır: benzeyen (müşebbeh), kendisine benzetilen (müşebbehün bih), benzetme yönü (vech-i şebeh) ve benzetme edatı (gibi, sanki, kadar). Beyân ilminin temel konusudur.',
    effect: 'Bilinmeyeni bilinene bağlar; teknik bir fikri tek hamlede anlaşılır kılar.',
    example: {
      text: '"Bu alt sistem, uçağın bağışıklık sistemi gibi çalışır: tehdidi kendi başına tanır ve karşılık üretir."',
      note: 'Benzeyen: alt sistem. Benzetilen: bağışıklık sistemi. Yön: kendi başına tanıyıp karşılık üretmesi. Edat: gibi.',
    },
    interviewUse:
      'Teknik olmayan bir panel üyesine sisteminizi anlatırken tek bir teşbih kurun ve cevap boyunca ona sadık kalın. İki farklı benzetme dinleyiciyi kaybettirir.',
    exercise: {
      prompt: 'Üzerinde çalıştığınız bir sistemi, mühendislik dışı bir şeye benzeterek anlatın.',
      hint: 'Benzetme yönünü açıkça söyleyin; söylenmeyen benzetme yönü yanlış anlaşılır.',
      sampleAnswer:
        '"Elektronik harp alıcısı, kalabalık bir salonda kendi adını duyan kulak gibidir: her sesi kaydeder ama yalnızca kendisini ilgilendirene tepki verir."',
    },
  },
  {
    id: 'tesbih-belig',
    branch: 'beyan',
    name: 'Teşbîh-i Belîğ',
    aka: 'Kısaltılmış benzetme',
    shortDefinition: 'Edat ve benzetme yönü düşürülerek yapılan güçlü benzetme.',
    definition:
      'Teşbihin yalnızca benzeyen ve benzetilen unsurlarıyla kurulmasıdır. "Gibi" düştüğü için benzetme, bir iddia gücü kazanır.',
    effect: 'Kısa ve keskin. Benzetmeyi açıklamak yerine dinleyicinin zihnine bırakır.',
    example: {
      text: '"Doğrulama, tasarımın sigortasıdır."',
      note: '"Sigorta gibidir" demek zayıf; "sigortasıdır" demek iddia.',
    },
    interviewUse:
      'Cevabınızı kapatırken kullanın. Son cümlenin bir teşbîh-i belîğ olması, cevabı akılda bırakır.',
    exercise: {
      prompt: 'Mesleğinizle ilgili bir kavramı "…dır" kalıbında bir benzetmeye dönüştürün.',
      hint: 'Klişeleri (savaş, yolculuk, orkestra) elemeye çalışın.',
      sampleAnswer: '"Konfigürasyon yönetimi, mühendisliğin hafızasıdır."',
    },
  },
  {
    id: 'istiare',
    branch: 'beyan',
    name: 'İstiare',
    aka: 'Eğretileme',
    shortDefinition: 'Benzetmenin iki temel unsurundan yalnızca birini söylemek.',
    definition:
      'Yalnızca benzetilen söylenirse açık istiare, yalnızca benzeyen söylenip benzetilene ait bir nitelikle anılırsa kapalı istiaredir. Kelime, gerçek anlamının dışında ve benzetme ilgisiyle kullanılır.',
    effect: 'Teşbihten daha yoğundur; dinleyici eksik unsuru kendi tamamladığı için etki kalıcıdır.',
    example: {
      text: '"Bir hilâl uğruna ya Rab, ne güneşler batıyor!"',
      source: 'Mehmet Âkif Ersoy',
      note: 'Şehitler için "güneşler" denmiş; benzeyen söylenmemiş — açık istiare.',
    },
    interviewUse:
      'Ölçülü kullanın. Teknik bir mülakatta bir cevapta en fazla bir istiare; fazlası edebiyat yapma izlenimi verir.',
    exercise: {
      prompt: 'Bir başarısızlık deneyiminizi tek bir istiareyle anlatın.',
      hint: 'Benzetilen kelimeyi seçin, benzeyeni söylemeyin.',
      sampleAnswer:
        '"O projede iki ay boyunca duvara konuştuk." → benzeyen (iletişimsiz ekip) söylenmedi.',
    },
  },
  {
    id: 'mecaz-i-mursel',
    branch: 'beyan',
    name: 'Mecâz-ı Mürsel',
    aka: 'Ad aktarması / düz değişmece',
    shortDefinition: 'Benzetme dışında bir ilgiyle bir şeyi başka bir adla anmak.',
    definition:
      'Parça-bütün, iç-dış, sebep-sonuç, yer-halk gibi ilgilerle kurulur. Teşbih ilgisi yoktur; bu yüzden istiareden ayrılır.',
    effect: 'Konuşmayı kısaltır ve doğallaştırır; günlük dilin en yaygın mecazıdır.',
    example: {
      text: '"Ankara kararını açıkladı." / "Bütün fabrika ayakta."',
      note: 'Şehir → kurum; yapı → içindeki insanlar.',
    },
    interviewUse:
      'Kurum ve ekip adlarını kısaltarak kullanmak akıcılık verir; ama panel kimin ne yaptığını sorarsa net isim vermeye hazır olun.',
    exercise: {
      prompt: 'Bir ekip çalışmanızı mecâz-ı mürsel kullanarak özetleyin, sonra netleştirin.',
      hint: 'Mecaz akıcılık için, netleştirme güvenilirlik için.',
      sampleAnswer:
        '"Bütün hat üç gün uyumadı." → ardından: "Üretimden altı, testten dört kişiydik."',
    },
  },
  {
    id: 'kinaye',
    branch: 'beyan',
    name: 'Kinaye',
    aka: 'Dolaylı anlatım',
    shortDefinition: 'Gerçek anlamı da mümkün olmakla birlikte mecaz anlamı kastetmek.',
    definition:
      'Bir sözün hem gerçek hem mecazi anlamının geçerli olduğu, ancak asıl kastedilenin mecaz olduğu anlatımdır. Deyimlerin büyük kısmı kinayedir.',
    effect: 'Sertliği yumuşatır; söylenmesi zor olanı incitmeden söyletir.',
    example: {
      text: '"O dönemde elimizi taşın altına koyduk."',
      note: 'Gerçek anlam mümkün, kastedilen sorumluluk almak.',
    },
    interviewUse:
      'Eski ekibinizle yaşadığınız sorunu anlatırken kinayeye başvurun. Doğrudan suçlama, mülakatta en pahalı hatadır.',
    exercise: {
      prompt: 'Bir çatışma deneyiminizi tek bir kinayeyle, kimseyi suçlamadan anlatın.',
      hint: 'Kişi değil durum anlatın.',
      sampleAnswer: '"Ekipte herkesin kendi takvimi vardı; biz de ortak bir saat kurmakla başladık."',
    },
  },
  {
    id: 'tariz',
    branch: 'beyan',
    name: "Ta'rîz",
    aka: 'Dokundurma / imalı söyleyiş',
    shortDefinition: 'Sözün görünen anlamının tam tersini veya bir imayı kastetmek.',
    definition:
      'Muhataba, söylenenin dışında bir mana ile dokunmaktır. Kinayeden farkı, kastedilenin sözün zıddı ya da doğrudan bir ima olmasıdır.',
    effect: 'Güçlüdür ama risklidir; yanlış ortamda alaycılık olarak anlaşılır.',
    example: {
      text: '"Kızım sana söylüyorum, gelinim sen anla."',
      note: 'Muhatap görünürde kız, kastedilen gelin.',
    },
    interviewUse:
      'Mülakatta neredeyse hiç kullanmayın. Tanımasının değeri şudur: karşı taraf ta\'rîz yaparsa (örneğin "önceki adaylar bunu bilirdi"), bunu kişisel almadan sakin cevap verirsiniz.',
    exercise: {
      prompt: 'Size ta\'rîz ile yüklenen bir soruya, imayı görmezden gelen sakin bir cevap yazın.',
      hint: 'İmaya değil, sorunun teknik çekirdeğine cevap verin.',
      sampleAnswer:
        'Soru: "Bu kadar tecrübeyle hâlâ mı burada?" → Cevap: "Bu alanda derinleşmeyi seçtim; şu üç problemi çözebildiğim yer burasıydı."',
    },
  },
  {
    id: 'teshis-intak',
    branch: 'beyan',
    name: 'Teşhis ve İntak',
    aka: 'Kişileştirme ve konuşturma',
    shortDefinition: 'İnsan dışı varlığa insan niteliği vermek, hatta onu konuşturmak.',
    definition:
      'Teşhis, insana ait bir özelliğin başka bir varlığa aktarılmasıdır; intak ise o varlığın konuşturulmasıdır. İntak her zaman teşhis içerir.',
    effect: 'Soyut ya da cansız olanı dinleyici için canlı bir aktöre çevirir.',
    example: {
      text: '"Sistem, hata verdiğinde bize nedenini söylemiyordu; sadece susuyordu."',
      note: 'Susmak insana ait; sistem kişileştirilmiş.',
    },
    interviewUse:
      'Hata ayıklama (debug) hikâyelerinde çok işe yarar: sistemi bir aktör gibi anlatmak, kronolojiyi dinlenebilir kılar.',
    exercise: {
      prompt: 'Bir hata ayıklama sürecini, sistemi kişileştirerek anlatın.',
      hint: 'Kişileştirme anlatıyı taşısın, süslemesin.',
      sampleAnswer:
        '"Kart açılışta üç saniye tereddüt ediyordu. O tereddüdün nerede olduğunu bulunca sorun bitti: besleme, saat devresinden önce hazır olmuyordu."',
    },
  },
];

const BEDI: BelagatArt[] = [
  {
    id: 'cinas',
    branch: 'bedi',
    name: 'Cinas',
    aka: 'Sesteş kullanım',
    shortDefinition: 'Yazılışı veya söylenişi aynı, anlamı farklı kelimeleri bir arada kullanmak.',
    definition:
      'Lafza ait bir güzelleştirme sanatıdır (muhassinât-ı lafziyye). Aynı sesin iki farklı anlamda kullanılmasıyla söz, kulakta bir tokuşma etkisi yaratır.',
    effect: 'Cümleyi akılda tutulur kılar; sunumlarda başlık üretmek için idealdir.',
    example: {
      text: 'Kısmetindir gezdiren yer yer seni / Göklüde ölecek yer yer seni',
      source: 'Kadı Burhaneddin',
      note: 'İlk "yer yer" = zaman zaman; ikinci "yer yer" = toprak seni yer.',
    },
    interviewUse:
      'Sunum ve rapor başlıklarında kullanın; konuşma içinde fazlası dikkat dağıtır.',
    exercise: {
      prompt: 'Kendi teknik alanınızdan bir sesteş çift bularak tek cümle kurun.',
      hint: '"yüz", "kat", "yaz", "aç", "el" gibi kelimeler işe yarar.',
      sampleAnswer: '"Testte yüz aldık ama sahada yüz bulamadık."',
    },
  },
  {
    id: 'seci',
    branch: 'bedi',
    name: 'Seci',
    aka: 'Düzyazıda kafiye',
    shortDefinition: 'Nesirde cümle sonlarını ses bakımından uyumlu bitirmek.',
    definition:
      'Şiirdeki kafiyenin düzyazı karşılığıdır. Cümle veya cümle parçalarının son sesleri birbirine uydurulur.',
    effect: 'Söze ritim verir; dinleyici cümlelerin bittiğini kulakla takip eder.',
    example: {
      text: '"Ölçtük, biçtik, seçtik."',
      note: 'Üç yüklem aynı sesle bitiyor; karar sürecinin özeti bir ritim kazanıyor.',
    },
    interviewUse:
      'Bir cevabı üçlü ve ses uyumlu bir listeyle kapatmak, kapanışı profesyonelleştirir.',
    exercise: {
      prompt: 'Çalışma yönteminizi, sonları uyumlu üç kelimeyle özetleyin.',
      hint: 'Üçten fazlası nutuk gibi duyulur.',
      sampleAnswer: '"Kurgula, doğrula, belgele."',
    },
  },
  {
    id: 'tibak',
    branch: 'bedi',
    name: 'Tıbâk',
    aka: 'Tezat / karşıtlık',
    shortDefinition: 'Zıt anlamlı iki kavramı aynı ifadede kullanmak.',
    definition:
      'Manaya ait güzelleştirmelerdendir (muhassinât-ı ma\'neviyye). Karşıtlık, her iki kavramı da belirginleştirir.',
    effect: 'Bir tercihin bedelini ve kazancını aynı cümlede göstermeye yarar.',
    example: {
      text: '"Küçük bir ihmalin büyük bir bedeli oldu."',
      note: 'Küçük–büyük karşıtlığı, cümlenin dersini taşıyor.',
    },
    interviewUse:
      'Öğrenilen ders (lessons learned) anlatırken en verimli sanattır: hata küçük, sonuç büyük.',
    exercise: {
      prompt: 'Bir teknik ödünleşimi (trade-off) tıbâk ile tek cümlede anlatın.',
      hint: 'Zıt çifti cümlenin iki ucuna koyun.',
      sampleAnswer: '"Ağırlıktan kazandığımızı ömürden kaybettik."',
    },
  },
  {
    id: 'mukabele',
    branch: 'bedi',
    name: 'Mukabele',
    aka: 'Karşılıklı denkleme',
    shortDefinition: 'Birden çok kavramı ve onların karşıtlarını sıralı biçimde karşılaştırmak.',
    definition:
      'Tıbâkın genişletilmiş hâlidir: iki veya daha fazla kavram sıralanır, ardından karşıtları aynı sırayla verilir.',
    effect: 'İki seçeneği simetrik biçimde karşılaştırarak analitik bir izlenim bırakır.',
    example: {
      text: '"Birincisi hızlı ve pahalıydı, ikincisi yavaş ve ucuzdu."',
      note: 'hızlı–yavaş ve pahalı–ucuz çiftleri aynı sırada.',
    },
    interviewUse:
      'Alternatif çözümleri karşılaştırırken bu kalıbı kurun; panel karşılaştırma yeteneğinizi doğrudan görür.',
    exercise: {
      prompt: 'İki tasarım alternatifini mukabele kalıbıyla karşılaştırın.',
      hint: 'Sıralamayı ikinci yarıda bozmayın; bozarsanız etki kaybolur.',
      sampleAnswer:
        '"Alüminyum hafif ve tedariki kolaydı; çelik ağır ve tedariki zordu — ama biri yorulmaya dayanmıyordu, diğeri dayanıyordu."',
    },
  },
  {
    id: 'husn-i-talil',
    branch: 'bedi',
    name: "Hüsn-i Ta'lîl",
    aka: 'Güzel nedene bağlama',
    shortDefinition: 'Bir olayı, gerçek nedeni dışında hoş bir nedene bağlamak.',
    definition:
      'Sebebi bilinen bir durumun, edebî bir amaçla başka ve güzel bir sebebe bağlanmasıdır.',
    effect: 'Anlatıya sıcaklık katar; ancak teknik doğruluk gerektiren yerde kullanılmaz.',
    example: {
      text: '"Ekip o gece kalmadı; işi yarım bırakmayı sevmiyordu."',
      note: 'Gerçek sebep takvim baskısı olabilir; anlatıcı erdemli bir sebep gösteriyor.',
    },
    interviewUse:
      'Motivasyon sorularında ("neden bu alan?") işe yarar. Teknik kök-neden sorularında kesinlikle kullanmayın.',
    exercise: {
      prompt: '"Neden savunma sanayii?" sorusunu hüsn-i ta\'lîl ile cevaplayın.',
      hint: 'Neden gerçekten sizin olsun; uydurma sebep hemen duyulur.',
      sampleAnswer:
        '"Bu alanı seçmemin sebebi zorluğu değil, hata payının olmayışıydı; beni en çok geliştiren şey bu oldu."',
    },
  },
  {
    id: 'tecahul',
    branch: 'bedi',
    name: "Tecâhül-i Ârif",
    aka: 'Bilerek bilmezlikten gelme',
    shortDefinition: 'Bilinen bir şeyi, bir amaçla bilmiyormuş gibi söylemek.',
    definition: 'Bir nükte veya incelik gözetilerek, bilinen bir hususun bilinmiyormuş gibi sunulmasıdır.',
    effect: 'Alçakgönüllü bir merak tonu yaratır; karşı tarafı açıklamaya davet eder.',
    example: {
      text: '"Bu mimarinin neden böyle kurulduğunu tam çözemedim; sizin gerekçeniz neydi?"',
      note: 'Konuşan gerekçeyi tahmin ediyor ama karşı tarafa söz veriyor.',
    },
    interviewUse:
      'Panelin bir tercihini eleştirmek zorundaysanız bu tonu kullanın: eleştiri, soru kılığında gelir.',
    exercise: {
      prompt: 'Katılmadığınız bir teknik tercihi, tecâhül-i ârif tonuyla sorgulayın.',
      hint: 'Cümlenin sonu soru olsun; iddia olmasın.',
      sampleAnswer:
        '"Senkron tasarımın burada tercih edilme gerekçesini kaçırmış olabilirim — gecikme bütçesini nasıl kapattınız?"',
    },
  },
  {
    id: 'mubalaga',
    branch: 'bedi',
    name: 'Mübalağa',
    aka: 'Abartma',
    shortDefinition: 'Bir niteliği olduğundan büyük ya da küçük göstermek.',
    definition:
      'Abartının derecesine göre tebliğ (mümkün), iğrak (akla yakın ama zor) ve gulüv (imkânsız) olarak ayrılır.',
    effect: 'Duyguyu yükseltir; fakat teknik güvenilirliği en hızlı tüketen sanattır.',
    example: {
      text: '"O hafta ekip nefes almadı."',
      note: 'Gulüv derecesinde abartı; anlatıda kabul edilir, raporda edilmez.',
    },
    interviewUse:
      'Sayı verirken asla kullanmayın. "Yüzde elli iyileştirdik" diyorsanız yüzde elli olmalı — panel bunu kovalar.',
    exercise: {
      prompt: 'Bir başarınızı abartısız, yalnızca ölçülebilir ifadelerle yeniden yazın.',
      hint: 'Her sıfatı bir sayıyla değiştirmeyi deneyin.',
      sampleAnswer:
        'Önce: "Sistemi inanılmaz hızlandırdık." → Sonra: "Ortalama yanıt süresini 420 ms\'den 180 ms\'ye indirdik."',
    },
  },
  {
    id: 'tevriye',
    branch: 'bedi',
    name: 'Tevriye',
    aka: 'İki anlamlı kullanım',
    shortDefinition:
      'Birden çok anlamı olan bir kelimeyi, yakın anlamı kastediliyormuş gibi kullanıp uzak anlamı kastetmek.',
    definition:
      'Cinasla karıştırılmamalıdır: cinasta iki ayrı kelime vardır, tevriyede tek kelime iki anlam taşır ve kastedilen uzak anlamdır.',
    effect: 'Zekâ göstergesi olarak algılanır; nükteli bir derinlik katar.',
    example: {
      text: 'Bir bûse mi bir gül mü verirsin dedi gönlüm / Bir nîm tebessümle o âfet "gül" dedi "gül"',
      source: 'Nedîm',
      note: '"Gül" hem çiçek hem "gülmek" emri; kastedilen ikincisi.',
    },
    interviewUse:
      'Teknik mülakatta yeri yok, ama sunum başlıklarında ve ekip içi iletişimde etkilidir.',
    exercise: {
      prompt: 'Alanınızdan çok anlamlı bir terim seçip tevriyeli bir başlık kurun.',
      hint: '"yük", "akım", "hat", "kalkan" gibi terimler uygundur.',
      sampleAnswer: '"Yükü paylaşmak" — hem elektriksel yük hem ekip sorumluluğu.',
    },
  },
  {
    id: 'telmih',
    branch: 'bedi',
    name: 'Telmih',
    aka: 'İma / anıştırma',
    shortDefinition: 'Bilinen bir olay, kişi veya söze açıkça anmadan gönderme yapmak.',
    definition:
      'Ortak kültürel bilgiye dayanır. Dinleyici göndermeyi tanımazsa sanat işlevini yitirir; bu yüzden muktezâ-yı hâle en bağımlı sanattır.',
    effect: 'Ortak zemin kurar; "aynı şeyleri biliyoruz" duygusu yaratır.',
    example: {
      text: '"O prototip bizim için bir Truva atıydı: içine koyduğumuz her ek özellik takvimi içeriden çökertti."',
      note: 'Göndermeyi tanımayan dinleyici cümleyi kaybeder.',
    },
    interviewUse:
      'Sektör tarihine yapılan telmihler (bilinen bir program, bir standart, bir kaza raporu) hazırlıklı olduğunuzu gösterir.',
    exercise: {
      prompt: 'Alanınızdan bilinen bir vakaya telmih yaparak bir mühendislik dersini anlatın.',
      hint: 'Göndermeyi tanımayan biri için tek cümlelik açıklama bırakın.',
      sampleAnswer:
        '"Bu tür bir birim karışıklığı, bir Mars görevini kaybettirmişti; biz de birim denetimini derleme aşamasına taşıdık."',
    },
  },
  {
    id: 'irsal-i-mesel',
    branch: 'bedi',
    name: 'İrsâl-i Mesel',
    aka: 'Atasözü / vecize kullanımı',
    shortDefinition: 'Söylenen fikri, bir atasözü veya özdeyişle desteklemek.',
    definition:
      'İfadeyi güçlendirmek için ortak kabul görmüş bir söz getirilir. İktibasla akrabadır; iktibasta kaynak kutsal veya belirli bir metindir.',
    effect: 'Kişisel bir iddiayı ortak akla dayandırır; direnci düşürür.',
    example: {
      text: '"Ölçmediğinizi yönetemezsiniz; o yüzden ilk iş ölçüm altyapısını kurduk."',
      note: 'Yaygın kabul görmüş söz, teknik kararın gerekçesi olarak kullanılıyor.',
    },
    interviewUse:
      'Bir kararınıza itiraz gelirse ortak bir ilkeye dayandırın. Ama tek başına gerekçe olarak kullanmayın; ardından veri gelmeli.',
    exercise: {
      prompt: 'Bir kararınızı bir atasözü ya da mühendislik ilkesiyle destekleyin, ardından veriyi ekleyin.',
      hint: 'Söz + sayı sıralaması en ikna edici olan.',
      sampleAnswer:
        '"Erken kırılan ucuza kırılır: o yüzden entegrasyondan iki ay önce arayüz testine başladık ve sonraki aşamada sıfır arayüz hatası aldık."',
    },
  },
  {
    id: 'tekrir',
    branch: 'bedi',
    name: 'Tekrîr',
    aka: 'Anlamlı tekrar',
    shortDefinition: 'Bir kelimeyi veya yapıyı vurgu için bilinçli olarak yinelemek.',
    definition:
      'Amaçsız yinelemeler fesahat kusuru (kesret-i tekrar) sayılırken, vurgu ve ritim için yapılan tekrar bedî\' sanatlarındandır.',
    effect: 'Bir fikri çekiçler; dinleyicinin aklından çıkmayan tek cümleyi üretir.',
    example: {
      text: '"Ölçtük. Yine ölçtük. Sonuç değişmeyince tasarımı değiştirdik."',
      note: 'Tekrar, ısrarın kendisini anlatıyor.',
    },
    interviewUse:
      'Cevabınızın tek bir ana fikri varsa o fikri iki kez, farklı yerlerde söyleyin. Panel, tekrarlananı hatırlar.',
    exercise: {
      prompt: 'Bir cevabınızın ana fikrini, başta ve sonda birer kez söyleyecek şekilde kurun.',
      hint: 'İkinci tekrarda kelimeleri biraz değiştirin; birebir tekrar yapay durur.',
      sampleAnswer:
        '"Bu işte belirleyici olan doğrulamaydı. … Sonuç olarak bizi kurtaran şey, en başta kurduğumuz doğrulama disipliniydi."',
    },
  },
  {
    id: 'aliterasyon',
    branch: 'bedi',
    name: 'Aliterasyon ve Asonans',
    aka: 'Ses tekrarı',
    shortDefinition: 'Aynı ünsüzün (aliterasyon) veya ünlünün (asonans) tekrarıyla ritim kurmak.',
    definition:
      'Lafza ait güzelleştirmelerdendir. Ses tekrarı, cümlenin kulakta bıraktığı izi güçlendirir.',
    effect: 'Slogan ve başlık üretiminin temel aracı; söyleyişi de kolaylaştırır.',
    example: {
      text: '"Sade, sağlam, sürdürülebilir."',
      note: 'Üç sözcükte "s" tekrarı — akılda kalıcı bir ilke seti.',
    },
    interviewUse:
      'Kendi çalışma ilkelerinizi anlatırken ses uyumlu bir üçlü kurun; hazırlıklı olduğunuzu gösterir.',
    exercise: {
      prompt: 'Çalışma prensiplerinizi aynı sesle başlayan üç kelimeyle ifade edin.',
      hint: 'Anlamı zorlamayın; ses uyumu için yanlış kelime seçilmesi hemen belli olur.',
      sampleAnswer: '"Belgele, birleştir, bitir."',
    },
  },
];

export const BELAGAT_ARTS: BelagatArt[] = [...MEANI, ...BEYAN, ...BEDI];

/* ------------------------------------------------------------------ */
/* Fesahat — belâgatin önkoşulu                                        */
/* ------------------------------------------------------------------ */

/**
 * Fesahat kusurları doğrudan diksiyonla ilgilidir: söylenmesi zor ses yığılmaları,
 * anlaşılmayan kelimeler ve kurgusu bozuk cümleler. Konuşma egzersiziyle birlikte çalışılır.
 */
export type FesahatFlaw = {
  id: string;
  name: string;
  shortDefinition: string;
  definition: string;
  badExample: string;
  goodExample: string;
  interviewRisk: string;
};

export const FESAHAT_FLAWS: FesahatFlaw[] = [
  {
    id: 'tenafur',
    name: 'Tenâfür-i Hurûf',
    shortDefinition: 'Söylenmesi zor ses yığılması.',
    definition:
      'Yan yana gelen seslerin telaffuzu zorlaştırmasıdır. Kulağı tırmalar ve konuşurken dili tökezletir.',
    badExample:
      '"Sorumluluklarımızdakilerin sıralanmasındaki sıkıntılar sürdürülebilirliği zorlaştırdı."',
    goodExample: '"Görev dağılımındaki karışıklık işi yavaşlattı."',
    interviewRisk:
      'Gerginken bu tür cümlelerde takılırsınız ve takılma, bilgi eksikliği gibi algılanır.',
  },
  {
    id: 'garabet',
    name: 'Garâbet',
    shortDefinition: 'Muhatabın bilmediği, yabancı veya çok az kullanılan kelime.',
    definition:
      'Sözün anlaşılmasını engelleyen alışılmadık kelime kullanımıdır. Belâgatte kusurdur, çünkü belâgatin ölçütü muhataptır.',
    badExample: '"Sistemin mütekabiliyet esasına müstenit bir mimarisi var."',
    goodExample: '"Sistemin iki tarafı da birbirine aynı kuralla cevap veriyor."',
    interviewRisk:
      'Gereksiz jargon, uzman olmayan panel üyesini dışarıda bırakır ve gösteriş olarak okunur.',
  },
  {
    id: 'takid-lafzi',
    name: "Ta'kîd-i Lafzî",
    shortDefinition: 'Kelime sırasının bozukluğu yüzünden anlamın karışması.',
    definition:
      'Öğelerin yanlış sıralanması sebebiyle cümlenin ilk okunuşta yanlış anlaşılmasıdır.',
    badExample: '"Testi geçen kartı ekibe teslim eden mühendisi aradım."',
    goodExample: '"Kartı ekibe teslim eden mühendisi aradım; kart testi geçmişti."',
    interviewRisk:
      'Panel cümleyi ikinci kez kurmak zorunda kalır; dikkat cevaptan çıkıp cümleye kayar.',
  },
  {
    id: 'takid-manevi',
    name: "Ta'kîd-i Ma'nevî",
    shortDefinition: 'Mecazın veya göndermenin anlaşılmaması.',
    definition:
      'Kullanılan mecaz, kinaye veya telmihin muhatap tarafından çözülememesidir. Sanat, anlaşılmadığı yerde kusura döner.',
    badExample: '"O projede hep sırtımızda bir kambur taşıdık." (neyin kastedildiği belirsiz)',
    goodExample: '"O projede eski bir kod tabanını sürüklemek zorunda kaldık."',
    interviewRisk: 'Anlaşılmayan mecaz, cevabınızı içi boş gösterir.',
  },
  {
    id: 'kesret-i-tekrar',
    name: 'Kesret-i Tekrar',
    shortDefinition: 'Amaçsız tekrar.',
    definition:
      'Vurgu üretmeyen, yalnızca söz kalabalığı yaratan yinelemelerdir. Amaçlı tekrar (tekrîr) sanattır; amaçsızı kusurdur.',
    badExample:
      '"Yani bu konuda şunu söyleyebilirim ki bu konu bizim için önemli bir konuydu."',
    goodExample: '"Bu konu bizim için kritikti."',
    interviewRisk:
      'Dolgu kelimelerle birlikte gelir ve uygulamanın analizindeki "dolgu kelime" puanını doğrudan düşürür.',
  },
  {
    id: 'zaf-i-telif',
    name: "Za'f-ı Te'lîf",
    shortDefinition: 'Dilbilgisi kurallarına aykırı cümle kurulumu.',
    definition:
      'Cümlenin gramer bakımından kusurlu olmasıdır; özne-yüklem uyumsuzluğu, düşük cümle ve yanlış tamlamalar bu başlığa girer.',
    badExample: '"Ekip olarak yapılan testlerde başarılı olundu ve rapor sunuldu."',
    goodExample: '"Testleri ekip olarak yaptık, geçtik ve raporu sunduk."',
    interviewRisk:
      'Edilgen ve düşük cümleler katkınızı görünmez kılar; panel kimin ne yaptığını anlamaz.',
  },
];

/* ------------------------------------------------------------------ */
/* Seçim ve alıştırma üretimi                                          */
/* ------------------------------------------------------------------ */

export function artsForBranch(filter: BelagatBranchFilter): BelagatArt[] {
  if (filter === 'karisik') return BELAGAT_ARTS;
  return BELAGAT_ARTS.filter((art) => art.branch === filter);
}

export function findArt(id: string): BelagatArt | undefined {
  return BELAGAT_ARTS.find((art) => art.id === id);
}

/** Günün sanatı. Aynı gün içinde her açılışta aynı sonucu verir. */
export function pickDailyBelagatArt(
  filter: BelagatBranchFilter,
  date: Date = new Date(),
): BelagatArt {
  const pool = artsForBranch(filter);
  return pickForDay(pool.length > 0 ? pool : BELAGAT_ARTS, date, 2);
}

export function pickDailyFesahatFlaw(date: Date = new Date()): FesahatFlaw {
  return pickForDay(FESAHAT_FLAWS, date, 3);
}

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

function seededShuffle<T>(items: T[], seed: number): T[] {
  const rand = seededRandom(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export type RecognitionQuestion = {
  /** Örnek metin — kullanıcı bunun hangi sanat olduğunu bulacak. */
  example: BelagatArt['example'];
  options: { id: string; name: string; branch: BelagatBranch }[];
  correctId: string;
  /** Cevap verildikten sonra gösterilecek açıklama. */
  explanation: string;
};

/**
 * Tanıma alıştırması üretir: bir örnek gösterilir, dört seçenek sunulur.
 * Çeldiriciler öncelikle aynı koldan seçilir — böylece ayrım gerçekten öğrenilir.
 */
export function buildRecognitionQuiz(
  filter: BelagatBranchFilter,
  count = 5,
  date: Date = new Date(),
): RecognitionQuestion[] {
  const pool = artsForBranch(filter);
  const source = pool.length >= 4 ? pool : BELAGAT_ARTS;
  const seedBase = dayIndex(date);

  const targets = seededShuffle(source, seedBase).slice(0, Math.min(count, source.length));

  return targets.map((target, index) => {
    const sameBranch = BELAGAT_ARTS.filter(
      (a) => a.branch === target.branch && a.id !== target.id,
    );
    const otherBranch = BELAGAT_ARTS.filter((a) => a.branch !== target.branch);
    const distractors = [
      ...seededShuffle(sameBranch, seedBase + index * 31),
      ...seededShuffle(otherBranch, seedBase + index * 57),
    ].slice(0, 3);

    const options = seededShuffle([target, ...distractors], seedBase + index * 13).map((a) => ({
      id: a.id,
      name: a.name,
      branch: a.branch,
    }));

    return {
      example: target.example,
      options,
      correctId: target.id,
      explanation: `${target.name} (${BRANCH_LABELS[target.branch]}) — ${target.example.note}`,
    };
  });
}
