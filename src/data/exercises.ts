// Egzersizler sekmesinin kataloğu.
// İki hat var: bilişsel (beyin bölgelerine göre gruplanmış) ve fizyolojik (nefes/ses).
// Her egzersiz bir "motor" bildirir; ExerciseEngineScreen bu motora göre çalışır.

export type ExerciseTrack = 'cognitive' | 'physiological';

export type Difficulty = 'kolay' | 'orta' | 'zor';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  kolay: 'Kolay',
  orta: 'Orta',
  zor: 'Zor',
};

export type AccentTone = 'violet' | 'blue' | 'rose' | 'emerald';

export type ExerciseCategory = {
  id: string;
  track: ExerciseTrack;
  title: string;
  description: string;
  accent: AccentTone;
};

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  {
    id: 'frontal',
    track: 'cognitive',
    title: 'Ön Lob (Frontal) - Karar & Çözüm',
    description: 'Stres altında mantıklı karar verme ve hızlı kriz senaryosu çözme egzersizleri.',
    accent: 'violet',
  },
  {
    id: 'parietal',
    track: 'cognitive',
    title: 'Yan Lob (Parietal) - Mekansal & Sayısal',
    description:
      'Zihinde şekil döndürme, yön takibi ve baskı altında sayısal işlem yapma çalışmaları.',
    accent: 'emerald',
  },
  {
    id: 'temporal',
    track: 'cognitive',
    title: 'Şakak Lobu (Temporal) - Hafıza & Dil',
    description: 'Teknik terimleri baskı altında hatırlama ve toparlayarak ifade etme çalışmaları.',
    accent: 'blue',
  },
  {
    id: 'oksipital',
    track: 'cognitive',
    title: 'Arka Lob (Oksipital) - Görsel Algı',
    description: 'Örüntü yakalama, şema okuma ve görsel bilgiyi hızlı yorumlama pratikleri.',
    accent: 'rose',
  },
  {
    id: 'goz-sagligi',
    track: 'physiological',
    title: 'Göz Dinlendirme & Sağlık',
    description:
      '20-20-20 kuralı uzağa bakma, göz kası esnetme ve palming ile dijital göz yorgunluğu önleme pratikleri.',
    accent: 'emerald',
  },
  {
    id: 'durus',
    track: 'physiological',
    title: 'Duruş & Sırt',
    description:
      'Masa başında çöken duruşu fark edip toparlamak için kısa pratikler. Duruş bozukluğunu tedavi etmez, gerginliği fark ettirip gevşetir.',
    accent: 'blue',
  },
  {
    id: 'fizyolojik',
    track: 'physiological',
    title: 'Fizyolojik & Genel Hazırlık',
    description:
      'Nefes kontrolü, stres yönetimi ve ses tellerinizi mülakata hazırlayacak teknikler.',
    accent: 'emerald',
  },
];

/** Zamanlanmış komut kartları — her kart süresi dolunca bir sonrakine geçer. */
export type PromptEngine = {
  kind: 'prompt';
  instruction: string;
  secondsPerPrompt: number;
  prompts: {
    text: string;
    answer?: string;
    /**
     * Otomatik kontrol için kabul edilen yanıtlar (normalize edilip tam
     * eşitlikle karşılaştırılır — `answersMatch`). Yoksa kullanıcı kendini
     * değerlendirir: serbest ifadeli, tek doğru yazımı olmayan cevaplarda
     * bilerek boş bırakılır.
     */
    accept?: string[];
  }[];
};

export type BreathPhaseKind = 'inhale' | 'hold' | 'exhale' | 'wait';

/** Nefes düzenleyici — daire fazlarla birlikte büyüyüp küçülür. */
export type BreathEngine = {
  kind: 'breath';
  cycles: number;
  phases: { kind: BreathPhaseKind; seconds: number }[];
};

export type ExerciseEngine = PromptEngine | BreathEngine;

export type Exercise = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  /** Kart üzerinde gösterilen yaklaşık süre. */
  minutes: number;
  /** Kart altındaki kısa etiket — geçmiş ekranında kategori olarak da kullanılır. */
  categoryLabel: string;
  benefits: string[];
  engine: ExerciseEngine;
};

export const EXERCISES: Exercise[] = [
  // ——— Duruş & Sırt ———
  //
  // ⚠️ Abartılı vaat yok (KARARLAR "Modüller abartılı vaat vermez"): bunlar
  // duruş bozukluğunu düzeltmez, ağrı tedavi etmez. Yaptıkları şey, uzun
  // oturmada çöken duruşu fark ettirmek ve gerilen bölgeyi gevşetmek.
  // "Duruş kontrolü" aralıklı hatırlatıcısı (habitTemplates.ts) buraya bağlı.
  {
    id: 'durus-sifirlama',
    categoryId: 'durus',
    title: 'Duruş Sıfırlama',
    description:
      'Masa başında çöken duruşu tek tek adımlarla toparlama. Hatırlatıcıdaki "sırtını dikleştir, omuzlarını geri al, çeneni içeri çek" cümlesinin uzun hâli.',
    difficulty: 'kolay',
    minutes: 2,
    categoryLabel: 'Duruş',
    benefits: [
      'Çöken duruşu fark ettirir',
      'Omuz ve boyun çevresindeki gerginliği azaltır',
      'Çökük otururken daralan göğüs kafesine yer açar',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Sandalyede otururken yapılır. Zorlama yok; keskin bir ağrı hissedersen dur. Her adımda sakin nefes al.',
      secondsPerPrompt: 20,
      prompts: [
        { text: '1. Adım: Ayaklarını yere tam bas, dizlerin kalça hizasında olsun. Kalçanı sandalyenin arkasına kaydır.' },
        { text: '2. Adım: Omuzlarını kulaklara doğru kaldır, sonra geriye ve aşağıya bırak. Kürek kemiklerin birbirine yaklaşsın.' },
        { text: '3. Adım: Çeneni hafifçe içeri çek — başını geriye atma. Kulakların omuz hizasına gelsin.' },
        { text: '4. Adım: Sırtını dikleştir ama kasma. Göğsünü öne itme; omurga uzasın, karın gevşek kalsın.' },
        { text: '5. Adım: Bu duruşta üç sakin nefes al. Sonra doğal duruşuna dön ve aradaki farkı hisset.' },
      ],
    },
  },
  {
    id: 'omuz-gogus-acma',
    categoryId: 'durus',
    title: 'Omuz ve Göğüs Açma',
    description:
      'Klavye başında öne kapanan omuzları geriye açan, aletsiz yapılan yavaş esnetme dizisi.',
    difficulty: 'orta',
    minutes: 3,
    categoryLabel: 'Duruş',
    benefits: [
      'Öne kapanan omuzları geriye açar',
      'Uzun klavye kullanımının verdiği sertliği azaltır',
      'Derin nefes için göğüs kafesine yer açar',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Ayakta ya da sandalyenin ucunda yapılır. Hareketleri yavaş yap; omuzda keskin ağrı olursa bırak. Nefesini tutma.',
      secondsPerPrompt: 30,
      prompts: [
        { text: '1. Adım: Ellerini arkada birleştir, kollarını düz tut ve göğsünü yavaşça aç. Omuzları kulaklardan uzaklaştır.' },
        { text: '2. Adım: Kollarını iki yana aç, avuç içlerin yukarı baksın. Kürek kemiklerini birbirine yaklaştır, 5 saniye tut.' },
        { text: '3. Adım: Sağ kolunu göğsünün önünden karşıya uzat, sol kolunla hafifçe kendine çek. 15 saniye bekle.' },
        { text: '4. Adım: Aynısını sol kolla yap. Omuz yukarı kalkmasın, boynun gevşek kalsın.' },
        { text: '5. Adım: Omuzlarını yavaşça 5 kez geriye doğru çevir, sonra 5 kez öne.' },
        { text: '6. Adım: Kollarını serbest bırak, iki derin nefes al. Omuzların şimdi nerede durduğunu fark et.' },
      ],
    },
  },
  {
    id: 'boyun-ust-sirt-molasi',
    categoryId: 'durus',
    title: 'Boyun ve Üst Sırt Molası',
    description:
      'Ekrana eğilmekten gerilen boyun ve üst sırt için kısa gevşeme molası. Göz molasıyla birlikte yapılabilir.',
    difficulty: 'kolay',
    minutes: 2,
    categoryLabel: 'Duruş',
    benefits: [
      'Ekrana eğilmekten gerilen boyun kaslarını gevşetir',
      'Üst sırttaki tutukluğu azaltır',
      'Kısa molayı düzenli hâle getirir',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Otururken yapılır. Baş hareketlerini yavaş yap, asla zorlamayla itme. Baş dönmesi olursa dur.',
      secondsPerPrompt: 20,
      prompts: [
        { text: '1. Adım: Başını yavaşça sağa yatır, sağ kulağın sağ omzuna yaklaşsın. Omuz yukarı kalkmasın. 15 saniye bekle.' },
        { text: '2. Adım: Aynısını sola yap. Nefesini tutma, sakin al ver.' },
        { text: '3. Adım: Çeneni göğsüne doğru indir, ensenin uzadığını hisset. Başını elinle bastırma.' },
        { text: '4. Adım: Başını nötr konuma getir, çeneni hafifçe içeri çek ve 5 saniye tut.' },
        { text: '5. Adım: Ellerini üst sırtına destek yapıp göğsünü hafifçe yukarı aç, omurganı uzat. Sonra gevşe.' },
      ],
    },
  },

  {
    id: 'torasik-ekstansiyon',
    categoryId: 'durus',
    title: 'Üst Sırt Açma (Torasik Ekstansiyon)',
    description:
      'Sandalyede otururken üst sırtı (torasik bölge) nazikçe açan kısa bir pratik. Duruş bozukluğunu düzeltmez, ağrı tedavi etmez; uzun oturmadan sertleşen üst sırta hareket hissini geri getirir.',
    difficulty: 'orta',
    minutes: 2,
    categoryLabel: 'Duruş',
    benefits: [
      'Uzun oturmadan sertleşen üst sırta hareket getirir',
      'Göğüs kafesini nefes için açar',
      'Omuz ve boyun gerginliğini tamamlayan bir hareket ekler',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Sandalyede otururken yapılır. Hareketi yavaş ve küçük tut; ağrı ya da uyuşma hissedersen dur, zorlama.',
      secondsPerPrompt: 20,
      prompts: [
        { text: '1. Adım: Sandalyenin ucuna otur, ayaklarını yere bas. Ellerini ensende birleştir, dirseklerin yanlara açık kalsın.' },
        { text: '2. Adım: Bel boşluğunu artırmadan göğüs kemiğini yavaşça tavana doğru kaldır, üst sırtın hafifçe arkaya kıvrılsın.' },
        { text: '3. Adım: Bu pozisyonda derin bir nefes al, ver. Boynunu geriye atma, çeneni nötr tut.' },
        { text: '4. Adım: Yavaşça başlangıç pozisyonuna dön. 3 kez tekrar et, her tekrarda hareketi biraz büyüt ama zorlama.' },
        { text: '5. Adım: Ellerini bırak, omuzlarını salla ve üst sırtındaki farkı hisset.' },
      ],
    },
  },

  // ——— Ön Lob (Frontal) ———
  {
    id: 'tersine-muhendislik',
    categoryId: 'frontal',
    title: 'Tersine Mühendislik Algoritması',
    description:
      'Gündelik bir cihazın (örn: kahve makinesi) çalışma prensibini zihninizde en temel donanım bileşenlerine kadar ayrıştırma.',
    difficulty: 'zor',
    minutes: 15,
    categoryLabel: 'Problem Çözme',
    benefits: ['Analitik düşünmeyi keskinleştirir', 'Karar verme mekanizmasını hızlandırır'],
    engine: {
      kind: 'prompt',
      instruction:
        'Her cihazı sırayla ele alın: enerji girişi → dönüştürücü → kontrol birimi → geri besleme → çıkış. Yüksek sesle anlatın.',
      secondsPerPrompt: 150,
      prompts: [
        { text: 'Kahve makinesi — suyu 93°C\'de tutan kontrol döngüsünü bileşenlerine ayırın.' },
        { text: 'Otomatik kapı — cismi algılayan sensörden motora kadar sinyal zincirini kurun.' },
        { text: 'Klima — istenen sıcaklığı koruyan geri besleme mekanizmasını tarif edin.' },
        { text: 'Elektrikli süpürge — emiş gücünü belirleyen fiziksel parametreleri sıralayın.' },
        { text: 'Asansör — kat seçiminden fren sistemine kadar güvenlik katmanlarını sayın.' },
        { text: 'İnsansız hava aracı — irtifa sabitleme için hangi sensör füzyonu gerekir?' },
      ],
    },
  },
  {
    id: 'hizli-senaryo',
    categoryId: 'frontal',
    title: 'Hızlı Senaryo Değerlendirmesi',
    description:
      'Size verilen kriz senaryosuna 10 saniye içerisinde en az 3 farklı alternatif çözüm üretme pratikleri.',
    difficulty: 'orta',
    minutes: 8,
    categoryLabel: 'Problem Çözme',
    benefits: ['Kriz anında donup kalmayı engeller', 'Esnek düşünme becerisini artırır'],
    engine: {
      kind: 'prompt',
      instruction:
        'Her senaryoya en az üç farklı çözüm üretin ve birini gerekçeyle seçin. Süre dolmadan karar verin.',
      secondsPerPrompt: 60,
      prompts: [
        { text: 'Saha testinden 2 saat önce kritik sensör arızalandı. Yedek yok.' },
        { text: 'Teslimden bir gün önce müşteri kapsamı değiştirmek istiyor.' },
        { text: 'Test sonuçları doğru ama simülasyon modeliyle %15 sapıyor.' },
        { text: 'Ekipten iki kişi aynı hafta ayrıldı, kritik modül sahipsiz kaldı.' },
        { text: 'Gizli belge yanlış bir dağıtım listesine gönderildi.' },
        { text: 'Tedarikçi, kritik bileşende 6 ay gecikme bildirdi.' },
        { text: 'Entegrasyon testinde iki alt sistem aynı adresi kullanıyor.' },
        { text: 'Sunum sırasında demo çöktü, kurul karşınızda bekliyor.' },
      ],
    },
  },
  {
    id: 'diksiyon-artikulasyon',
    categoryId: 'frontal',
    title: 'Diksiyon ve Artikülasyon (Tekerleme)',
    description:
      'Baskı altında zorlu tekerlemeleri veya karmaşık mühendislik cümlelerini takılmadan okuma antrenmanı.',
    difficulty: 'zor',
    minutes: 5,
    categoryLabel: 'Nefes',
    benefits: [
      'Mülakat esnasında dil sürçmelerini önler',
      'Topluluk önünde konuşma akıcılığını artırır',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Her ifadeyi önce yavaş ve net, sonra normal hızda üç kez tekrarlayın. Sonu yutmadan bitirin.',
      secondsPerPrompt: 50,
      prompts: [
        { text: 'Bir berber bir berbere bre berber gel beraber bir berber dükkânı açalım.' },
        { text: 'Elektromanyetik uyumluluk testlerinde parazit bastırma katsayısı ölçülür.' },
        { text: 'Şu köşe yaz köşesi, şu köşe kış köşesi, ortada su şişesi.' },
        { text: 'Atalet ölçüm birimi, ivmeölçer ve dönüölçer verilerini birlikte değerlendirir.' },
        { text: 'Kırk küp, kırkının da kulpu kırık kara küp.' },
        { text: 'Sentetik açıklıklı radar görüntüleri, çözünürlüğü hareketle artırır.' },
      ],
    },
  },

  // ——— Yan Lob (Parietal) ———
  {
    id: 'mekansal-kurgu',
    categoryId: 'parietal',
    title: 'Mekansal Kurgu',
    description:
      'Küp, yön ve döndürme sorularını kâğıda çizmeden, yalnızca zihninizde canlandırarak çözme.',
    difficulty: 'orta',
    minutes: 6,
    categoryLabel: 'Mekansal Algı',
    benefits: [
      'Şema ve montaj çizimlerini zihinde çevirmeyi kolaylaştırır',
      'Bu tarz sorularda çözüm süresini kısaltır',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Kâğıt kullanmayın, şekli zihninizde canlandırın. Süre dolunca cevap açılır, kendinizi dürüstçe puanlayın.',
      secondsPerPrompt: 45,
      prompts: [
        {
          text: 'Kuzeye bakıyorsunuz. Sağa 90° dönüp ardından 180° daha dönerseniz hangi yöne bakarsınız?',
          answer: 'Batı (kuzey → doğu → batı)',
          accept: ['batı'],
        },
        {
          text: "Bir zarın karşılıklı yüzleri toplamı 7'dir. Üst yüz 2, ön yüz 3 ise alt ve arka yüz kaçtır?",
          answer: 'Alt 5, arka 4',
          accept: ['alt 5 arka 4', '5 4'],
        },
        {
          text: 'Dış yüzeyi tamamen boyanmış bir küp 3×3×3 = 27 küçük küpe bölünüyor. Kaç küçük küpün tam olarak iki yüzü boyalıdır?',
          answer: '12 — her biri bir kenarın ortasında duran küpler',
          accept: ['12'],
        },
        {
          text: "Saat 3'ü gösterirken akrep ile yelkovan arasındaki dar açı kaç derecedir?",
          answer: '90°',
          accept: ['90'],
        },
        {
          text: '"L" harfini saat yönünde 90° döndürürseniz ortaya nasıl bir şekil çıkar?',
          answer: 'Üstte yatay bir kol, sol ucundan aşağı inen dikey bir kol — yani "Γ" görünümü',
        },
        {
          text: 'Bir merdivenin 20 basamağı var. Ortadaki basamaktan 5 yukarı, sonra 8 aşağı inerseniz kaçıncı basamaktasınız?',
          answer: '7. basamak (10 → 15 → 7)',
          accept: ['7 basamak', '7'],
        },
      ],
    },
  },
  {
    id: 'zihinden-hesap',
    categoryId: 'parietal',
    title: 'Zihinden Hesap',
    description:
      'Teknik mülakatlarda sorulan büyüklük tahmini ve kafadan işlem sorularına süre baskısı altında hazırlık.',
    difficulty: 'orta',
    minutes: 5,
    categoryLabel: 'Sayısal İşlem',
    benefits: [
      'Kafadan işlem hızını artırır',
      'Sayısal soruda donup kalmayı azaltır',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Hesap makinesi ve kâğıt yok. Süre dolunca cevap açılır, kendinizi dürüstçe puanlayın.',
      secondsPerPrompt: 30,
      prompts: [
        { text: '48 × 25 = ?', answer: '1200 — 48 × 100 ÷ 4', accept: ['1200'] },
        { text: '17 × 18 = ?', answer: '306 — 17 × 18 = 17 × 20 − 17 × 2', accept: ['306'] },
        { text: "%15'i 240 olan sayı kaçtır?", answer: '1600 — 240 ÷ 0,15', accept: ['1600'] },
        {
          text: "1'den 100'e kadar tam sayıların toplamı?",
          answer: '5050 — 100 × 101 ÷ 2',
          accept: ['5050'],
        },
        { text: '384 ÷ 16 = ?', answer: '24 — 384 ÷ 8 = 48, 48 ÷ 2 = 24', accept: ['24'] },
        { text: '7² + 8² = ?', answer: '113 — 49 + 64', accept: ['113'] },
        {
          text: 'Bir sunucu saniyede 250 istek karşılıyor. Bir dakikada kaç istek eder?',
          answer: '15.000 — 250 × 60',
          accept: ['15000'],
        },
        { text: "2¹⁰ kaçtır?", answer: '1024', accept: ['1024'] },
      ],
    },
  },
  {
    id: 'konum-siralama',
    categoryId: 'parietal',
    title: 'Konum ve Sıralama',
    description:
      'Sözle verilen konum ilişkilerini zihninizde bir düzene oturtup sıralamayı çıkarma pratikleri.',
    difficulty: 'zor',
    minutes: 6,
    categoryLabel: 'Sistem Algısı',
    benefits: [
      'Karmaşık bağımlılıkları zihinde tutmayı kolaylaştırır',
      'Sözlü anlatılan mimariyi takip etmeyi hızlandırır',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Not almayın, ilişkileri zihninizde kurun. Süre dolunca cevap açılır, kendinizi dürüstçe puanlayın.',
      secondsPerPrompt: 50,
      prompts: [
        {
          text: "A, B'nin solunda. C, B'nin sağında. D, A'nın solunda. Soldan sağa sıralama nedir?",
          answer: 'D · A · B · C',
          accept: ['d a b c', 'dabc'],
        },
        {
          text: 'Beş katlı binada: Ayşe en üstte değil. Berk, Ayşe’nin bir üstünde. Can en altta. Deniz, Berk’in üstünde. Emre kalan katta. Ayşe kaçıncı kattadır?',
          answer: '3. kat — Can 1, Emre 2, Ayşe 3, Berk 4, Deniz 5',
          accept: ['3 kat', '3'],
        },
        {
          text: 'Bir servis A→B→C sırasıyla çağrılıyor. B çökerse hangi servisler etkilenir?',
          answer: 'C etkilenir (B’ye bağımlı), A ayakta kalır ama B’den yanıt alamaz',
        },
        {
          text: 'Dört modül: X, Y’ye bağımlı. Y, Z’ye bağımlı. W bağımsız. Hangi sırayla başlatılmalı?',
          answer: 'Z → Y → X; W sırada bağımsız, herhangi bir anda',
          accept: ['z y x', 'z y x w', 'w z y x', 'z w y x', 'z y w x'],
        },
        {
          text: 'Masada saat yönünde oturan 4 kişi: Ali’nin karşısında Veli var. Ayşe, Ali’nin solunda. Dördüncü kişi Zeynep. Veli’nin solunda kim oturur?',
          answer: 'Zeynep — saat yönünde Ali · Ayşe · Veli · Zeynep',
          accept: ['zeynep'],
        },
      ],
    },
  },

  // ——— Şakak Lobu (Temporal) ———
  {
    id: 'terim-zinciri',
    categoryId: 'temporal',
    title: 'Teknik Terim Zinciri',
    description:
      'Verilen başlıkla ilgili terimleri zincirleme hatırlayıp her birini tek cümleyle tanımlama alıştırması.',
    difficulty: 'orta',
    minutes: 6,
    categoryLabel: 'Hafıza',
    benefits: ['Terim hatırlamayı hızlandırır', 'Cevaplarda teknik derinliği artırır'],
    engine: {
      kind: 'prompt',
      instruction:
        'Başlıkla ilgili en az 6 terim sayın, her birini tek cümleyle tanımlayın. Duraklamadan devam edin.',
      secondsPerPrompt: 60,
      prompts: [
        { text: 'Radar sistemleri' },
        { text: 'Gömülü yazılım doğrulama' },
        { text: 'Güdüm ve kontrol' },
        { text: 'Elektronik harp' },
        { text: 'Sistem mühendisliği süreçleri' },
        { text: 'Siber güvenlik temelleri' },
      ],
    },
  },
  {
    id: 'ters-siralama',
    categoryId: 'temporal',
    title: 'Ters Sıralı Terim Tekrarı',
    description:
      'Okunan terim dizisini tersten tekrar ederek çalışan bellek görevlerinde pratik yapma çalışması.',
    difficulty: 'orta',
    minutes: 4,
    categoryLabel: 'Hafıza',
    benefits: ['Ters sıralama görevinde ölçülebilir gelişme sağlar', 'Uzun soruları akılda tutma pratiği verir'],
    engine: {
      kind: 'prompt',
      instruction: 'Diziyi bir kez okuyun, kapatın ve tersten yazın.',
      secondsPerPrompt: 40,
      prompts: [
        {
          text: 'radar · anten · dalga · filtre',
          answer: 'filtre · dalga · anten · radar',
          accept: ['filtre dalga anten radar'],
        },
        {
          text: 'ivme · atalet · süzgeç · kalman · sapma',
          answer: 'sapma · kalman · süzgeç · atalet · ivme',
          accept: ['sapma kalman süzgeç atalet ivme'],
        },
        {
          text: 'menzil · irtifa · azimut · hedef · kilit',
          answer: 'kilit · hedef · azimut · irtifa · menzil',
          accept: ['kilit hedef azimut irtifa menzil'],
        },
        {
          text: 'derleme · bağlama · yükleme · çalıştırma · kesme',
          answer: 'kesme · çalıştırma · yükleme · bağlama · derleme',
          accept: ['kesme çalıştırma yükleme bağlama derleme'],
        },
        {
          text: 'gereksinim · tasarım · üretim · doğrulama · kabul · teslim',
          answer: 'teslim · kabul · doğrulama · üretim · tasarım · gereksinim',
          accept: ['teslim kabul doğrulama üretim tasarım gereksinim'],
        },
        {
          text: 'sensör · füzyon · karar · eyleyici · geri besleme · kayıt',
          answer: 'kayıt · geri besleme · eyleyici · karar · füzyon · sensör',
          accept: ['kayıt geri besleme eyleyici karar füzyon sensör'],
        },
      ],
    },
  },

  // ——— Arka Lob (Oksipital) ———
  {
    id: 'oruntu-tanima',
    categoryId: 'oksipital',
    title: 'Hızlı Örüntü Tanıma',
    description:
      'Sayı ve şekil dizilerindeki kuralı süre dolmadan yakalayıp diziyi devam ettirme egzersizi.',
    difficulty: 'orta',
    minutes: 5,
    categoryLabel: 'Görsel Algı',
    benefits: ['Şema ve grafik okumayı hızlandırır', 'Teknik testlerde tepki süresini kısaltır'],
    engine: {
      kind: 'prompt',
      instruction: 'Diziyi devam ettirin. Süre dolunca cevap açılır, kendinizi dürüstçe puanlayın.',
      secondsPerPrompt: 40,
      prompts: [
        { text: '2 · 6 · 12 · 20 · 30 · ?', answer: '42 (artış: 4, 6, 8, 10, 12)', accept: ['42'] },
        { text: '1 · 1 · 2 · 3 · 5 · 8 · ?', answer: '13 (Fibonacci)', accept: ['13'] },
        { text: '81 · 27 · 9 · 3 · ?', answer: "1 (her adımda 3'e bölünüyor)", accept: ['1'] },
        { text: '3 · 4 · 6 · 9 · 13 · ?', answer: '18 (artış: 1, 2, 3, 4, 5)', accept: ['18'] },
        { text: '2 · 3 · 5 · 7 · 11 · ?', answer: '13 (asal sayılar)', accept: ['13'] },
        { text: '1 · 4 · 9 · 16 · 25 · ?', answer: '36 (tam kareler)', accept: ['36'] },
        { text: '64 · 32 · 48 · 24 · 36 · ?', answer: '18 (sırayla ÷2 ve ×1,5)', accept: ['18'] },
      ],
    },
  },

  // ——— Fizyolojik & Beden ———
  {
    id: 'goz-20-20-20',
    categoryId: 'goz-sagligi',
    title: '20-20-20 Göz Dinlendirme Kuralı',
    description:
      'Ekran başında uzun süre çalışanlar için göz odaklanma kaslarını gevşeten ve dijital yorgunluğu önleyen 20 saniyelik mola pratiği.',
    difficulty: 'kolay',
    minutes: 2,
    categoryLabel: 'Göz Sağlığı',
    benefits: [
      'Göz odaklanma kaslarını (siliyer kaslar) gevşetir',
      'Ekran yorgunluğunu ve baş ağrısını azaltır',
      'Göz kuruluğu ve batma hissini düşürür',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Her adımda bakışlarınızı ekrandan tamamen ayırıp en az 6 metre (20 fit) uzaktaki bir noktaya odaklanın.',
      secondsPerPrompt: 20,
      prompts: [
        { text: '1. Adım: Bakışlarınızı ekrandan ayırın. Ufuktaki veya uzaktaki sabit bir noktaya odaklanın.' },
        { text: '2. Adım: Derin nefes alırken uzaktaki nesnenin detaylarına (renk, çizgi, kenar) dikkat edin.' },
        { text: '3. Adım: Göz kaslarınızın esnediğini hissedin. Gözlerinizi yavaşça iki kez kırpın.' },
        { text: '4. Adım: Sakince nefes verin ve uzağa bakmaya devam edin. Bakışlarınızı yumuşatın.' },
        { text: '5. Adım: Ekranınıza dönmeden önce gözlerinizi kapatıp 5 saniye karanlıkta dinlendirin.' },
      ],
    },
  },
  {
    id: 'goz-esnetme-8-cizme',
    categoryId: 'goz-sagligi',
    title: 'Göz Kasları Esnetme & 8 Çizimi',
    description:
      'Ekrana sabit bakmaktan sertleşen göz çevresi motor kaslarını esnetmek ve göz takip hızını artırmak için dairesel ve yönlü pratik.',
    difficulty: 'orta',
    minutes: 3,
    categoryLabel: 'Göz Kasları',
    benefits: [
      'Göz motor kaslarının esnekliğini artırır',
      'Göz içi kan dolaşımını canlandırır',
      'Odak değiştirme hızını ve geniş açılı algıyı geliştirir',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Başınızı tamamen sabit tutun. Hareketleri YALNIZCA gözlerinizi döndürerek uygulayın.',
      secondsPerPrompt: 25,
      prompts: [
        { text: 'Yukarı - Aşağı: Başınız sabit. Bakışlarınızı tavan ile zemin arasında yavaşça 5 kez gidip getirin.' },
        { text: 'Sağ - Sol: Bakışlarınızı başınızı çevirmeden en sola, ardından en sağa yavaşça 5 kez kaydırın.' },
        { text: 'Çapraz Esnetme: Sol üst köşeden sağ alt köşeye, ardından sağ üstten sol alta bakın.' },
        { text: 'Hayali 8 Çizimi: 3 metre ötede dev bir "8" işareti olduğunu hayal edin ve gözlerinizle yavaşça çizin.' },
        { text: 'Tersine 8 Çizimi: Hayali 8 işaretini şimdi ters yönde yavaşça takip edin.' },
        { text: 'Yakın & Uzak Odak: Parmağınızı burnunuzdan 15 cm uzağa koyun. Parmağınız ile uzaktaki duvar arasında odağı değiştirin.' },
      ],
    },
  },
  {
    id: 'goz-palming-isitmali-dinlenme',
    categoryId: 'goz-sagligi',
    title: 'Avuç İçi Isıtma (Palming)',
    description:
      'Avuç içlerini ovuşturarak ısıtıp gözlerin üzerine kapatma. Zifiri karanlık ve doğal sıcaklık ile optik sinirleri derinlemesine dinlendirir.',
    difficulty: 'kolay',
    minutes: 3,
    categoryLabel: 'Göz Dinlendirme',
    benefits: [
      'Optik sinirleri ve göz çevresi dokularını rahatlatır',
      'Göz içi tansiyonu ve baskı hissini düşürür',
      'Zihinsel yorgunluğu ve göz parlamasını azaltır',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Ellerinizi ovuşturun. Avuçlarınızı göz kürelerine basbayağı bastırmadan, göz yuvalarını kapatacak şekilde kubbe yapın.',
      secondsPerPrompt: 30,
      prompts: [
        { text: '1. Ellerinizi Isıtın: Avuç içlerinizi sürtünerek sıcaklık hissedene kadar 10 saniye hızlıca ovuşturun.' },
        { text: '2. Koyu Kubbe Yapın: Avuçlarınızı gözlerinizin üzerine yerleştirin. Işık sızmadığından emin olun.' },
        { text: '3. Derin Karanlık: Gözler kapalı. Karanlığın derinliğine odaklanın, omuzlarınızı serbest bırakın.' },
        { text: '4. Isı Transferi: Avuçlarınızdaki sıcaklığın göz çevrenizdeki kaslara yayıldığını hissedin.' },
        { text: '5. Yavaşça Açın: Ellerinizi yavaşça çekin. Kirpiklerinizi yavaşça aralayarak ortama uyum sağlayın.' },
      ],
    },
  },

  // ——— Fizyolojik ———
  {
    id: 'nefes-pacer',
    categoryId: 'fizyolojik',
    title: 'Odaklanma ve Nefes Açma (Pacer)',
    description:
      '4-4-4-4 kuralıyla uygulanan (Nefes Al, Tut, Ver, Bekle) interaktif nefes düzenleyici. Otonom sinir sistemini dengeler ve mülakat öncesi stresi azaltır.',
    difficulty: 'kolay',
    minutes: 3,
    categoryLabel: 'Nefes',
    benefits: ['Oksijen akışını artırır', 'Stres hormonlarını azaltır', 'Odaklanmayı kolaylaştırır'],
    engine: {
      kind: 'breath',
      cycles: 11,
      phases: [
        { kind: 'inhale', seconds: 4 },
        { kind: 'hold', seconds: 4 },
        { kind: 'exhale', seconds: 4 },
        { kind: 'wait', seconds: 4 },
      ],
    },
  },
  {
    id: 'derin-diyafram',
    categoryId: 'fizyolojik',
    title: 'Derin Diyafram Geliştirme',
    // "Akciğer kapasitesini geliştiren" ifadesi 2026-09-19'da kaldırıldı:
    // nefes egzersizi akciğer hacmini anlamlı biçimde artırmıyor
    // (YAPILACAKLAR Bölüm 1 → "Ne yapar, ne yapmaz").
    description:
      'Diyafram kullanımını ve veriş kontrolünü geliştiren 4-7-8 nefes tekniği. Sesinizin mülakatta daha güçlü ve titremeden çıkmasını sağlar.',
    difficulty: 'orta',
    minutes: 5,
    categoryLabel: 'Nefes',
    benefits: ['Diyafram kasını güçlendirir', 'Ses titremesini engeller'],
    engine: {
      kind: 'breath',
      cycles: 15,
      phases: [
        { kind: 'inhale', seconds: 4 },
        { kind: 'hold', seconds: 7 },
        { kind: 'exhale', seconds: 8 },
      ],
    },
  },
  {
    id: 'kutu-nefesi',
    categoryId: 'fizyolojik',
    title: 'Kutu Nefesi (Box Breathing)',
    description:
      'Sunum ve mülakat öncesi kalp atışını düşürmek için kullanılan, eşit fazlı 5-5-5-5 nefes düzeni.',
    difficulty: 'kolay',
    minutes: 4,
    categoryLabel: 'Nefes',
    benefits: ['Kalp atışını düzenler', 'Zihinsel bulanıklığı azaltır'],
    engine: {
      kind: 'breath',
      cycles: 12,
      phases: [
        { kind: 'inhale', seconds: 5 },
        { kind: 'hold', seconds: 5 },
        { kind: 'exhale', seconds: 5 },
        { kind: 'wait', seconds: 5 },
      ],
    },
  },

  // ——— Nefesi daha uzun tutabilmek ———
  //
  // Neden SABİT ve kısa tutmalar: nefesi uzun tutmayı sağlayan şey akciğer
  // hacmi değil, büyük ölçüde CO₂ toleransı ve gevşeme. Maksimuma zorlayan
  // "kendini sına" türü tasarım hem yanlış bilgi verir hem tehlikelidir
  // (YAPILACAKLAR Bölüm 1 → "Yapmaz — akciğerini büyütmez").
  //
  // ⚠️ GÜVENLİK: `breath` motorunda ekranda yalnızca faz etiketi görünüyor,
  // `instruction` alanı yok. Bu yüzden uyarılar `description` içinde — detay
  // ekranı (ExerciseDetailScreen) başlamadan önce onu gösteriyor.
  {
    id: 'rahat-tutma-hazirlik',
    categoryId: 'fizyolojik',
    title: 'Rahat Tutma — Hazırlık',
    description:
      'Nefesi daha uzun tutabilmenin ilk basamağı: 6 saniyelik, zorlamasız tutmaların tekrarı. Amaç maksimuma dayanmak değil, tutma anında gevşek kalabilmek — süre asıl olarak böyle uzuyor. ⚠️ Oturarak ya da uzanarak yap; suda, araç kullanırken veya ayakta ASLA. Öncesinde hızlı derin nefesler alma (hiperventilasyon): bayılmaya yol açabilir. Rahatsızlık, baş dönmesi ya da karıncalanma başlarsa bırak ve normal nefesine dön. Kalp/solunum rahatsızlığın varsa veya hamileysen hekimine danışmadan yapma. Bu egzersiz akciğerini büyütmez.',
    difficulty: 'kolay',
    minutes: 3,
    categoryLabel: 'Nefes',
    benefits: [
      'Tutma anındaki kasılmayı azaltır',
      'Nefes ihtiyacı hissine alışmayı kolaylaştırır',
      'Uzun verişle toparlanmayı öğretir',
    ],
    engine: {
      kind: 'breath',
      cycles: 8,
      phases: [
        { kind: 'inhale', seconds: 4 },
        { kind: 'hold', seconds: 6 },
        { kind: 'exhale', seconds: 8 },
        { kind: 'wait', seconds: 2 },
      ],
    },
  },
  {
    id: 'rahat-tutma-gelistirme',
    categoryId: 'fizyolojik',
    title: 'Rahat Tutma — Geliştirme',
    description:
      '12 saniyelik tutmaların tekrarı. Çalıştırdığı şey CO₂ toleransı: nefes ihtiyacı hissini erken panikle karşılamamak. Süreyi zorlayarak uzatmak bir başarı ölçüsü değildir; rahat kalabildiğin süre önemlidir. ⚠️ Oturarak ya da uzanarak yap; suda, araç kullanırken veya ayakta ASLA. Öncesinde hiperventilasyon yapma. Baş dönmesi, karıncalanma veya rahatsızlıkta bırak. Kalp/solunum rahatsızlığın varsa veya hamileysen hekimine danışmadan yapma. Bu egzersiz akciğerini büyütmez.',
    difficulty: 'orta',
    minutes: 4,
    categoryLabel: 'Nefes',
    benefits: [
      'Nefes ihtiyacı hissine toleransı artırır',
      'Tutarken omuz ve çeneyi gevşek tutmayı öğretir',
      'Ölçümdeki "Nefes tutma" testine hazırlık olur',
    ],
    engine: {
      kind: 'breath',
      cycles: 8,
      phases: [
        { kind: 'inhale', seconds: 4 },
        { kind: 'hold', seconds: 12 },
        { kind: 'exhale', seconds: 8 },
        { kind: 'wait', seconds: 4 },
      ],
    },
  },
];

export const BREATH_PHASE_LABELS: Record<BreathPhaseKind, string> = {
  inhale: 'Nefes Al',
  hold: 'Tut',
  exhale: 'Ver',
  wait: 'Bekle',
};

export function getExercise(id: string): Exercise | undefined {
  return EXERCISES.find((exercise) => exercise.id === id);
}

export function getCategory(id: string): ExerciseCategory | undefined {
  return EXERCISE_CATEGORIES.find((category) => category.id === id);
}

/** Bir hattın kategorilerini, içindeki egzersizlerle birlikte döndürür. */
export function categoriesForTrack(track: ExerciseTrack) {
  return EXERCISE_CATEGORIES.filter((category) => category.track === track).map((category) => ({
    category,
    exercises: EXERCISES.filter((exercise) => exercise.categoryId === category.id),
  }));
}

/** Egzersizin gerçek toplam süresi (saniye) — motor tanımından hesaplanır. */
export function totalSeconds(exercise: Exercise): number {
  const engine = exercise.engine;
  if (engine.kind === 'prompt') {
    return engine.prompts.length * engine.secondsPerPrompt;
  }
  const cycleSeconds = engine.phases.reduce((sum, phase) => sum + phase.seconds, 0);
  return cycleSeconds * engine.cycles;
}

/** Egzersiz motorunun toplam adım sayısı — efor puanı bunun üzerinden hesaplanır. */
export function totalSteps(exercise: Exercise): number {
  return exercise.engine.kind === 'prompt'
    ? exercise.engine.prompts.length
    : exercise.engine.cycles;
}
