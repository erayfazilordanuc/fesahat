// Egzersizler sekmesinin kataloğu.
// İki hat var: bilişsel (hafıza, sözel muhakeme, örüntü) ve fizyolojik (nefes, ses, duruş).
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
    id: 'hafiza-muhakeme',
    track: 'cognitive',
    title: 'Hafıza & Sözel Muhakeme',
    description:
      'Sözle verilen ilişkileri zihinde tutma, sıralama ve kelime dizilerini tersten tekrar etme çalışmaları.',
    accent: 'blue',
  },
  {
    id: 'oruntu-analoji',
    track: 'cognitive',
    title: 'Örüntü & Analoji',
    description:
      'Kelime dizilerindeki kuralı yakalama, benzerlik ilişkilerini tamamlama ve sıra dışı olanı bulma alıştırmaları.',
    accent: 'violet',
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
      'Nefes kontrolü, stres yönetimi ve ses tellerinizi konuşmaya / hitabete hazırlayan teknikler.',
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
      'Ekrana eğilmekten gerilen boyun ve üst sırt için kısa gevşeme molası.',
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

  // ——— Hafıza & Sözel Muhakeme ———
  //
  // İçerik dil eksenine göre: günlük Türkçe kelimeler ve sözle verilen
  // ilişkiler. `accept` yalnızca cevabı tek ve yazımı öngörülebilir olan
  // sorulara yazıldı (KARARLAR → "Egzersizde otomatik kontrol ile
  // öz-değerlendirmenin ayrımı"); serbest ifadeli cevaplar öz-değerlendirmede.
  {
    id: 'konum-siralama',
    categoryId: 'hafiza-muhakeme',
    title: 'Konum ve Sıralama',
    description:
      'Sözle verilen konum ve sıra ilişkilerini zihninizde bir düzene oturtup sıralamayı çıkarma pratikleri.',
    difficulty: 'zor',
    minutes: 6,
    categoryLabel: 'Sözel Muhakeme',
    benefits: [
      'Sözle verilen ilişkileri zihinde tutmayı kolaylaştırır',
      'Dinlediğini sıraya koyarak anlama alışkanlığı verir',
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
          text: 'Beş katlı binada Ayşe, Berk, Can, Deniz ve Emre farklı katlarda oturuyor. Can en altta, Deniz en üstte. Berk, Ayşe’nin hemen üstünde. Emre, Can’ın hemen üstünde. Ayşe kaçıncı kattadır?',
          answer: '3. kat — Can 1, Emre 2, Ayşe 3, Berk 4, Deniz 5',
          accept: ['3 kat', '3'],
        },
        {
          text: 'Kitap, defterin sağında. Kalem, kitabın sağında. Silgi, defterin solunda. Soldan sağa sıralama nedir?',
          answer: 'Silgi · Defter · Kitap · Kalem',
          accept: ['silgi defter kitap kalem'],
        },
        {
          text: 'Kuyrukta Zeynep, Ali’nin önünde. Ali, Veli’nin önünde. Ayşe kuyruğun en sonunda değil. Kuyruğun en sonunda kim vardır?',
          answer: 'Veli — Zeynep, Ali, Veli sırası kesin; Ayşe en sonda olamayacağına göre son sırada Veli var',
          accept: ['veli'],
        },
        {
          text: 'Masada saat yönünde oturan 4 kişi: Ali’nin karşısında Veli var. Ayşe, Ali’nin solunda. Dördüncü kişi Zeynep. Veli’nin solunda kim oturur?',
          answer: 'Zeynep — saat yönünde Ali · Ayşe · Veli · Zeynep',
          accept: ['zeynep'],
        },
        {
          text: 'Elif, Burak’tan büyük. Burak, Cem’den büyük. Dilek, Elif’ten büyük. Yaşça en küçük ve en büyük kimdir?',
          answer: 'En küçük Cem, en büyük Dilek — Cem < Burak < Elif < Dilek',
        },
      ],
    },
  },
  {
    id: 'ters-siralama',
    categoryId: 'hafiza-muhakeme',
    title: 'Ters Sıralı Kelime Tekrarı',
    description:
      'Okunan kelime dizisini tersten tekrar ederek çalışma belleğini kullanma pratiği.',
    difficulty: 'orta',
    minutes: 4,
    categoryLabel: 'Hafıza',
    benefits: [
      'Ters sıralama görevinde ölçülebilir gelişme sağlar',
      'Uzun cümleleri akılda tutma pratiği verir',
    ],
    engine: {
      kind: 'prompt',
      instruction: 'Diziyi bir kez okuyun, kapatın ve tersten yazın.',
      secondsPerPrompt: 40,
      prompts: [
        {
          text: 'kalem · defter · kitap · silgi',
          answer: 'silgi · kitap · defter · kalem',
          accept: ['silgi kitap defter kalem'],
        },
        {
          text: 'sabır · kanaat · hikmet · edep · vakar',
          answer: 'vakar · edep · hikmet · kanaat · sabır',
          accept: ['vakar edep hikmet kanaat sabır'],
        },
        {
          text: 'deniz · dalga · kıyı · martı · fener',
          answer: 'fener · martı · kıyı · dalga · deniz',
          accept: ['fener martı kıyı dalga deniz'],
        },
        {
          text: 'sabah · öğle · ikindi · akşam · gece',
          answer: 'gece · akşam · ikindi · öğle · sabah',
          accept: ['gece akşam ikindi öğle sabah'],
        },
        {
          text: 'harf · hece · sözcük · tamlama · cümle · paragraf',
          answer: 'paragraf · cümle · tamlama · sözcük · hece · harf',
          accept: ['paragraf cümle tamlama sözcük hece harf'],
        },
        {
          text: 'şiir · roman · masal · deneme · makale · destan',
          answer: 'destan · makale · deneme · masal · roman · şiir',
          accept: ['destan makale deneme masal roman şiir'],
        },
      ],
    },
  },

  // ——— Örüntü & Analoji ———
  {
    id: 'oruntu-tanima',
    categoryId: 'oruntu-analoji',
    title: 'Sözel Örüntü ve Analoji',
    description:
      'Kelime dizilerindeki kuralı yakalayıp diziyi devam ettirme, benzerlik ilişkilerini tamamlama ve sıra dışı olanı bulma egzersizi.',
    difficulty: 'orta',
    minutes: 5,
    categoryLabel: 'Örüntü',
    benefits: [
      'Kelimeler arasındaki ilişkiyi görmeyi çalıştırır',
      'Bağlamdan anlam çıkarma alışkanlığı verir',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Diziyi devam ettirin, eksik halkayı bulun ya da sıra dışı olanı seçin. Süre dolunca cevap açılır, kendinizi dürüstçe puanlayın.',
      secondsPerPrompt: 40,
      prompts: [
        {
          text: 'Pazartesi · Çarşamba · Cuma · ?',
          answer: 'Pazar (her adımda bir gün atlanıyor)',
          accept: ['pazar'],
        },
        {
          text: 'Ocak · Mart · Mayıs · Temmuz · ?',
          answer: 'Eylül (her adımda bir ay atlanıyor)',
          accept: ['eylül'],
        },
        {
          text: 'okul : öğrenci :: hastane : ?',
          answer: 'hasta — yer : o yerde bulunan kişi (doktor da kabul edilebilir)',
        },
        {
          text: 'sıcak : soğuk :: yüksek : ?',
          answer: 'alçak (ya da düşük) — zıt anlam ilişkisi',
        },
        {
          text: 'Hangisi diğerlerinden farklı? elma · armut · kiraz · masa · üzüm',
          answer: 'masa — diğerleri meyve',
          accept: ['masa'],
        },
        {
          text: 'Hangisi diğerlerinden farklı? kalem · silgi · defter · bulut · cetvel',
          answer: 'bulut — diğerleri kırtasiye malzemesi',
          accept: ['bulut'],
        },
        {
          text: 'Hangisi diğerlerinden farklı? koşmak · yürümek · uçmak · sevinmek · sürünmek',
          answer: 'sevinmek — diğerleri hareket bildiren fiiller',
          accept: ['sevinmek'],
        },
      ],
    },
  },

  // ——— Fizyolojik & Beden ———
  {
    id: 'diksiyon-artikulasyon',
    categoryId: 'fizyolojik',
    title: 'Diksiyon ve Artikülasyon (Tekerleme)',
    description:
      'Zorlu tekerlemeleri ve ses kümeleri yoğun cümleleri takılmadan okuma antrenmanı.',
    difficulty: 'zor',
    minutes: 5,
    categoryLabel: 'Diksiyon',
    benefits: [
      'Konuşma sırasında dil sürçmelerini azaltmaya yardım eder',
      'Topluluk önünde konuşma akıcılığını çalıştırır',
    ],
    engine: {
      kind: 'prompt',
      instruction:
        'Her ifadeyi önce yavaş ve net, sonra normal hızda üç kez tekrarlayın. Sonu yutmadan bitirin.',
      secondsPerPrompt: 50,
      prompts: [
        { text: 'Bir berber bir berbere bre berber gel beraber bir berber dükkânı açalım.' },
        { text: 'Dal sarkar kartal kalkar, kartal kalkar dal sarkar.' },
        { text: 'Şu köşe yaz köşesi, şu köşe kış köşesi, ortada su şişesi.' },
        { text: 'Çarşıdan çalı çırpı çuvalı aldım, çuvalın çıkıntısı çatırdadı.' },
        { text: 'Kırk küp, kırkının da kulpu kırık kara küp.' },
        { text: 'Yağmurlu yamaçta yürüyen yorgun yolcu yarım yamalak yemek yedi.' },
      ],
    },
  },

  // ——— Fizyolojik ———
  {
    id: 'nefes-pacer',
    categoryId: 'fizyolojik',
    title: 'Odaklanma ve Nefes Açma (Pacer)',
    description:
      '4-4-4-4 kuralıyla uygulanan (Nefes Al, Tut, Ver, Bekle) interaktif nefes düzenleyici. Otonom sinir sistemini dengeler ve konuşma öncesi stresi azaltır.',
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
      'Diyafram kullanımını ve veriş kontrolünü geliştiren 4-7-8 nefes tekniği. Sesinizin konuşma sırasında daha güçlü ve titremeden çıkmasına yardımcı olur.',
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
      'Sunum ve konuşma öncesi kalp atışını düşürmek için kullanılan, eşit fazlı 5-5-5-5 nefes düzeni.',
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
