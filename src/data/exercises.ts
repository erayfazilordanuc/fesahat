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
  prompts: { text: string; answer?: string }[];
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
        },
        {
          text: "Bir zarın karşılıklı yüzleri toplamı 7'dir. Üst yüz 2, ön yüz 3 ise alt ve arka yüz kaçtır?",
          answer: 'Alt 5, arka 4',
        },
        {
          text: 'Dış yüzeyi tamamen boyanmış bir küp 3×3×3 = 27 küçük küpe bölünüyor. Kaç küçük küpün tam olarak iki yüzü boyalıdır?',
          answer: '12 — her biri bir kenarın ortasında duran küpler',
        },
        {
          text: "Saat 3'ü gösterirken akrep ile yelkovan arasındaki dar açı kaç derecedir?",
          answer: '90°',
        },
        {
          text: '"L" harfini saat yönünde 90° döndürürseniz ortaya nasıl bir şekil çıkar?',
          answer: 'Üstte yatay bir kol, sol ucundan aşağı inen dikey bir kol — yani "Γ" görünümü',
        },
        {
          text: 'Bir merdivenin 20 basamağı var. Ortadaki basamaktan 5 yukarı, sonra 8 aşağı inerseniz kaçıncı basamaktasınız?',
          answer: '7. basamak (10 → 15 → 7)',
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
        { text: '48 × 25 = ?', answer: '1200 — 48 × 100 ÷ 4' },
        { text: '17 × 18 = ?', answer: '306 — 17 × 18 = 17 × 20 − 17 × 2' },
        { text: "%15'i 240 olan sayı kaçtır?", answer: '1600 — 240 ÷ 0,15' },
        { text: "1'den 100'e kadar tam sayıların toplamı?", answer: '5050 — 100 × 101 ÷ 2' },
        { text: '384 ÷ 16 = ?', answer: '24 — 384 ÷ 8 = 48, 48 ÷ 2 = 24' },
        { text: '7² + 8² = ?', answer: '113 — 49 + 64' },
        {
          text: 'Bir sunucu saniyede 250 istek karşılıyor. Bir dakikada kaç istek eder?',
          answer: '15.000 — 250 × 60',
        },
        { text: "2¹⁰ kaçtır?", answer: '1024' },
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
        },
        {
          text: 'Beş katlı binada: Ayşe en üstte değil. Berk, Ayşe’nin bir üstünde. Can en altta. Deniz, Berk’in üstünde. Emre kalan katta. Ayşe kaçıncı kattadır?',
          answer: '3. kat — Can 1, Emre 2, Ayşe 3, Berk 4, Deniz 5',
        },
        {
          text: 'Bir servis A→B→C sırasıyla çağrılıyor. B çökerse hangi servisler etkilenir?',
          answer: 'C etkilenir (B’ye bağımlı), A ayakta kalır ama B’den yanıt alamaz',
        },
        {
          text: 'Dört modül: X, Y’ye bağımlı. Y, Z’ye bağımlı. W bağımsız. Hangi sırayla başlatılmalı?',
          answer: 'Z → Y → X; W sırada bağımsız, herhangi bir anda',
        },
        {
          text: 'Masada saat yönünde oturan 4 kişi: Ali’nin karşısında Veli var. Ayşe, Ali’nin solunda. Dördüncü kişi Zeynep. Veli’nin solunda kim oturur?',
          answer: 'Zeynep — saat yönünde Ali · Ayşe · Veli · Zeynep',
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
      instruction: 'Diziyi bir kez okuyun, kapatın ve tersten yüksek sesle tekrarlayın.',
      secondsPerPrompt: 40,
      prompts: [
        { text: 'radar · anten · dalga · filtre', answer: 'filtre · dalga · anten · radar' },
        {
          text: 'ivme · atalet · süzgeç · kalman · sapma',
          answer: 'sapma · kalman · süzgeç · atalet · ivme',
        },
        {
          text: 'menzil · irtifa · azimut · hedef · kilit',
          answer: 'kilit · hedef · azimut · irtifa · menzil',
        },
        {
          text: 'derleme · bağlama · yükleme · çalıştırma · kesme',
          answer: 'kesme · çalıştırma · yükleme · bağlama · derleme',
        },
        {
          text: 'gereksinim · tasarım · üretim · doğrulama · kabul · teslim',
          answer: 'teslim · kabul · doğrulama · üretim · tasarım · gereksinim',
        },
        {
          text: 'sensör · füzyon · karar · eyleyici · geri besleme · kayıt',
          answer: 'kayıt · geri besleme · eyleyici · karar · füzyon · sensör',
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
        { text: '2 · 6 · 12 · 20 · 30 · ?', answer: '42 (artış: 4, 6, 8, 10, 12)' },
        { text: '1 · 1 · 2 · 3 · 5 · 8 · ?', answer: '13 (Fibonacci)' },
        { text: '81 · 27 · 9 · 3 · ?', answer: "1 (her adımda 3'e bölünüyor)" },
        { text: '3 · 4 · 6 · 9 · 13 · ?', answer: '18 (artış: 1, 2, 3, 4, 5)' },
        { text: '2 · 3 · 5 · 7 · 11 · ?', answer: '13 (asal sayılar)' },
        { text: '1 · 4 · 9 · 16 · 25 · ?', answer: '36 (tam kareler)' },
        { text: '64 · 32 · 48 · 24 · 36 · ?', answer: '18 (sırayla ÷2 ve ×1,5)' },
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
    description:
      'Akciğer kapasitesini ve diyafram kullanımını geliştiren 4-7-8 nefes tekniği. Sesinizin mülakatta daha güçlü ve titremeden çıkmasını sağlar.',
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
