import { COMPANIES, type CompanyId } from './companies';
import { pickForDay } from '../utils/dateUtils';

// Mülakat soru havuzu.
// Günlük mülakat, gün numarasına göre deterministik seçer: aynı gün uygulamayı kaç kez
// açarsanız açın aynı kurum ve aynı soru gelir.

export type InterviewType = 'genel' | 'teknik';

export type DepartmentId = 'yazilim' | 'arge' | 'ik';

export type Department = {
  id: DepartmentId;
  label: string;
  description: string;
};

export const DEPARTMENTS: Department[] = [
  {
    id: 'yazilim',
    label: 'Yazılım & Bilişim',
    description: 'Gömülü yazılım, gerçek zamanlı sistemler, veri füzyonu',
  },
  {
    id: 'arge',
    label: 'Ar-Ge & İnovasyon',
    description: 'Sistem tasarımı, prototipleme, teknoloji olgunluğu',
  },
  {
    id: 'ik',
    label: 'İnsan Kaynakları & Yönetim',
    description: 'Ekip yönetimi, süreç, gizlilik ve yetkinlik gelişimi',
  },
];

export type Question = {
  id: string;
  text: string;
  type: InterviewType;
  department?: DepartmentId;
  /** Boşsa her kurum için geçerli. */
  companyIds?: CompanyId[];
  /** Bu sorunun adayı neden zorladığı — mülakat sonrası ipucu olarak gösterilir. */
  stressFactor: string;
  /** Sessizliğe dayanma / cevap kurma tavsiyesi. */
  tip: string;
};

const GENERAL_QUESTIONS: Question[] = [
  {
    id: 'g-01',
    text: 'Hangi yönlerinizin geliştirilmeye açık olduğunu düşünüyorsunuz?',
    type: 'genel',
    stressFactor: 'Aday kendi zayıflığını, savunmaya geçmeden kabul etmek zorunda kalır.',
    tip: 'Gerçek bir eksiği söyleyin ve hemen ardından onu kapatmak için ne yaptığınızı ekleyin.',
  },
  {
    id: 'g-02',
    text: 'Neden savunma sanayiinde çalışmak istiyorsunuz?',
    type: 'genel',
    stressFactor: 'Ezber cevaplar burada hemen fark edilir; kurul samimiyeti ölçer.',
    tip: 'Kurumun somut bir projesine bağlanın; "vatan hizmeti" klişesinde kalmayın.',
  },
  {
    id: 'g-03',
    text: 'Baskı altında verdiğiniz ve sonradan yanlış olduğunu anladığınız bir kararı anlatın.',
    type: 'genel',
    stressFactor: 'Hata itirafı ile özgüven arasındaki dengeyi tutturmak gerekir.',
    tip: 'Durum → karar → sonuç → çıkarılan ders sırasını izleyin; suçu kimseye atmayın.',
  },
  {
    id: 'g-04',
    text: 'Ekip arkadaşınızın teknik hatasını fark ettiniz, ancak teslim tarihi yarın. Ne yaparsınız?',
    type: 'genel',
    stressFactor: 'Teknik doğruluk ile ekip ilişkisi arasında açık bir tercih beklenir.',
    tip: 'Riski büyüklüğüne göre sınıflandırın; "önce ölçer, sonra bildiririm" yaklaşımını anlatın.',
  },
  {
    id: 'g-05',
    text: 'Gizlilik dereceli bir projede çalışırken yakın çevrenize işinizi nasıl anlatırsınız?',
    type: 'genel',
    stressFactor: 'Gizlilik disiplininin içselleştirilip içselleştirilmediği ölçülür.',
    tip: 'Sınırı net çizin: proje adı, kabiliyet ve takvim paylaşılmaz. Örnek cümlenizi hazır tutun.',
  },
  {
    id: 'g-06',
    text: 'Sivil bir teknoloji şirketi iki katı maaş teklif etse ne yaparsınız?',
    type: 'genel',
    stressFactor: 'Kuruma bağlılık, doğrudan ve rahatsız edici biçimde sorgulanır.',
    tip: 'Parayı yok saymayın; kariyer, proje ölçeği ve teknik derinlik üzerinden gerekçelendirin.',
  },
  {
    id: 'g-07',
    text: 'Hiç bilmediğiniz bir konuda soru sorulduğunda ne yaparsınız?',
    type: 'genel',
    stressFactor: 'Bilmediğini söyleyebilme cesareti ile hazırlıksızlık arasındaki ince çizgi.',
    tip: '"Bilmiyorum" deyip nasıl öğreneceğinizi anlatın; uydurmak en hızlı eleme sebebidir.',
  },
  {
    id: 'g-08',
    text: 'Bu kurumun son bir yılda öne çıkan hangi projesini takip ettiniz ve neden?',
    type: 'genel',
    stressFactor: 'Hazırlık yapmayan aday burada tamamen açığa düşer.',
    tip: 'Tek bir projeyi seçip teknik bir detayına inin; liste saymak etki bırakmaz.',
  },
  {
    id: 'g-09',
    text: 'Bir yıl boyunca sonuç vermeyen bir görevde motivasyonunuzu nasıl korursunuz?',
    type: 'genel',
    companyIds: ['roketsan', 'tusas'],
    stressFactor: 'Uzun geliştirme döngülerine dayanıklılık sınanır.',
    tip: 'Ara kilometre taşları ve ölçülebilir küçük çıktılar üzerinden anlatın.',
  },
];

const TECHNICAL_QUESTIONS: Question[] = [
  // Yazılım & Bilişim
  {
    id: 't-yz-01',
    text: 'Gerçek zamanlı bir sistemde döngü süresi (deadline) aşılırsa ne olur ve bunu nasıl önlersiniz?',
    type: 'teknik',
    department: 'yazilim',
    stressFactor: 'Teorik bilgi ile sahadaki sonuçlarını birlikte açıklamak gerekir.',
    tip: 'Hard/soft real-time ayrımını yapın; WCET ölçümü ve öncelik atamasından bahsedin.',
  },
  {
    id: 't-yz-02',
    text: 'Güvenlik kritik yazılımda dinamik bellek ayırmanın neden kısıtlandığını açıklayın.',
    type: 'teknik',
    department: 'yazilim',
    stressFactor: 'Standart bilgisi (DO-178C, MISRA) doğrudan yoklanır.',
    tip: 'Belirlenebilirlik ve parçalanma (fragmentation) argümanlarını somut örnekle verin.',
  },
  {
    id: 't-yz-03',
    text: 'Gömülü bir sistemde watchdog timer ne işe yarar? Yanlış kullanımı hangi soruna yol açar?',
    type: 'teknik',
    department: 'yazilim',
    stressFactor: 'Basit görünen soru, derinleşmezseniz yüzeysel kalır.',
    tip: 'Besleme noktasının yanlış yere konmasının maskelediği kilitlenmeyi anlatın.',
  },
  {
    id: 't-yz-04',
    text: 'İki sensörden gelen verinin zaman damgaları uyuşmuyor. Füzyon katmanını nasıl tasarlarsınız?',
    type: 'teknik',
    department: 'yazilim',
    companyIds: ['aselsan', 'havelsan'],
    stressFactor: 'Tasarım sorusu; tek doğru cevabı yok, gerekçelendirme ölçülür.',
    tip: 'Ortak zaman referansı, tamponlama ve enterpolasyon seçeneklerini karşılaştırın.',
  },
  {
    id: 't-yz-05',
    text: 'CAN bus üzerinde mesaj önceliklendirmesi nasıl çalışır ve tıkanma nasıl tespit edilir?',
    type: 'teknik',
    department: 'yazilim',
    stressFactor: 'Protokol detayına inmeyi gerektirir; genel geçer cevap yetmez.',
    tip: 'Kimlik tabanlı arbitrasyonu ve bus yükü ölçümünü örnekle açıklayın.',
  },
  {
    id: 't-yz-06',
    text: 'Sahada yalnızca bir kez tekrarlanabilen bir yazılım hatasını nasıl kök nedene indirirsiniz?',
    type: 'teknik',
    department: 'yazilim',
    stressFactor: 'Metodik düşünme, panik yerine süreç kurma becerisi ölçülür.',
    tip: 'Kayıt (log) stratejisi, durum dökümü ve yeniden üretim ortamı üzerinden ilerleyin.',
  },

  // Ar-Ge & İnovasyon
  {
    id: 't-ar-01',
    text: 'Bir güdüm algoritmasının test edilebilirliğini nasıl artırırsınız?',
    type: 'teknik',
    department: 'arge',
    companyIds: ['roketsan'],
    stressFactor: 'Doğrulama maliyeti ile tasarım özgürlüğü arasındaki gerilim.',
    tip: 'Donanım döngüde (HIL) simülasyon ve gözlemlenebilirlik kavramlarını kullanın.',
  },
  {
    id: 't-ar-02',
    text: "TRL 4'ten TRL 6'ya geçerken karşılaşılan en büyük risk nedir?",
    type: 'teknik',
    department: 'arge',
    stressFactor: 'Teknoloji olgunluk seviyesi kavramını gerçekten bilmek gerekir.',
    tip: 'Laboratuvar koşullarından ilgili ortama geçişteki entegrasyon riskine odaklanın.',
  },
  {
    id: 't-ar-03',
    text: 'Rüzgâr tüneli verisi ile CFD sonucu çelişiyor. Hangisine güvenirsiniz ve neden?',
    type: 'teknik',
    department: 'arge',
    companyIds: ['tusas', 'roketsan'],
    stressFactor: 'Kesin cevap beklenmez; mühendislik muhakemesi ölçülür.',
    tip: 'Belirsizlik bütçesi, sınır koşulları ve ölçüm hatası üzerinden tartışın.',
  },
  {
    id: 't-ar-04',
    text: 'Geliştirdiğiniz bir prototipin başarısız olduğu anı ve kök neden analizinizi anlatın.',
    type: 'teknik',
    department: 'arge',
    stressFactor: 'Başarısızlığı teknik dille anlatabilmek gerekir; savunmaya geçmek kötü sinyal.',
    tip: 'Hipotez → ölçüm → eleme adımlarını sırayla verin; sonucu sayıyla ifade edin.',
  },
  {
    id: 't-ar-05',
    text: 'Yerlileştirme çalışmasında kritik bir bileşenin tedarikçisi çekildi. Yol haritanız ne olur?',
    type: 'teknik',
    department: 'arge',
    stressFactor: 'Teknik çözüm ile takvim gerçekliğini aynı anda savunmak zor.',
    tip: 'Kısa vade stok/ikame, orta vade alternatif tasarım, uzun vade yerli geliştirme kurgusu.',
  },

  // İnsan Kaynakları & Yönetim
  {
    id: 't-ik-01',
    text: 'İki kıdemli mühendis teknik konuda anlaşamıyor ve proje duruyor. Nasıl çözersiniz?',
    type: 'teknik',
    department: 'ik',
    stressFactor: 'Hem teknik hakemlik hem insan yönetimi aynı anda beklenir.',
    tip: 'Kararı kişiden ölçüte taşıyın: ortak kriter belirleyip veriyle kapatın.',
  },
  {
    id: 't-ik-02',
    text: 'Gizlilik ihlali şüphesi bulunan bir çalışan hakkında nasıl bir süreç işletirsiniz?',
    type: 'teknik',
    department: 'ik',
    stressFactor: 'Prosedür bilgisi ile kişi hakları arasındaki denge sınanır.',
    tip: 'Önce erişimi sınırla, sonra yetkili birime bildir; kendi başına soruşturma yürütmeyin.',
  },
  {
    id: 't-ik-03',
    text: 'Nitelikli mühendisi kurumda tutmak için hangi araçları kullanırsınız?',
    type: 'teknik',
    department: 'ik',
    stressFactor: 'Maaş dışında somut araç sayamayan aday zayıf kalır.',
    tip: 'Teknik kariyer basamağı, proje sahipliği ve eğitim bütçesi gibi ölçülebilir araçlar verin.',
  },
  {
    id: 't-ik-04',
    text: 'Performansı düşen bir takım liderine geri bildirimi nasıl verirsiniz?',
    type: 'teknik',
    department: 'ik',
    stressFactor: 'Rol çatışması: hem koruyucu hem denetleyici olmak gerekir.',
    tip: 'Gözleme dayalı, davranış odaklı ve tek bir eyleme bağlanan geri bildirim kurgulayın.',
  },
  {
    id: 't-ik-05',
    text: 'Kritik teslim döneminde ekipte tükenmişlik belirtileri gördünüz. İlk adımınız ne olur?',
    type: 'teknik',
    department: 'ik',
    stressFactor: 'Takvim baskısı ile insan sağlığı arasında açık tercih istenir.',
    tip: 'Önce yükü ölçün (kim, ne kadar), sonra kapsam pazarlığını yönetime taşıyın.',
  },
];

export const ALL_QUESTIONS: Question[] = [...GENERAL_QUESTIONS, ...TECHNICAL_QUESTIONS];

export type InterviewConfig = {
  companyId: CompanyId;
  type: InterviewType;
  /** Yalnızca teknik mülakatta anlamlı. */
  department?: DepartmentId;
};

/** Verilen yapılandırmaya uyan soruları döndürür; hiç yoksa tür bazında geri çekilir. */
export function filterQuestions(config: InterviewConfig): Question[] {
  const matchesCompany = (q: Question) =>
    !q.companyIds || q.companyIds.includes(config.companyId);

  const exact = ALL_QUESTIONS.filter(
    (q) =>
      q.type === config.type &&
      (config.type === 'genel' || q.department === config.department) &&
      matchesCompany(q),
  );
  if (exact.length > 0) return exact;

  // 1. geri çekilme: kuruma özel soru yoksa kurum kısıtını bırak.
  const byDepartment = ALL_QUESTIONS.filter(
    (q) => q.type === config.type && (config.type === 'genel' || q.department === config.department),
  );
  if (byDepartment.length > 0) return byDepartment;

  // 2. geri çekilme: departmana da soru yoksa yalnızca türe bak.
  //
  // Eskiden bu adım yoktu ve "geri çekilme" departman kısıtını koruduğu için
  // aslında geri çekilmiyordu: sorusu olmayan bir departman seçilirse havuz boş
  // dönüyor, `pickRandomQuestion` `undefined` veriyor, ekran onun alanlarını
  // okuyunca patlıyordu. Bugün her kombinasyonun sorusu var ama katalog
  // genişleyince (YAPILACAKLAR Bölüm 00) bu kaçınılmaz hâle gelirdi.
  const byType = ALL_QUESTIONS.filter((q) => q.type === config.type);
  return byType.length > 0 ? byType : ALL_QUESTIONS;
}

/** Özelleştirilmiş mülakat için rastgele soru. */
export function pickRandomQuestion(config: InterviewConfig): Question {
  const pool = filterQuestions(config);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Günün mülakatı: kurum ve soru gün numarasına göre sabit. */
export function pickDailyInterview(date: Date = new Date()): {
  companyId: CompanyId;
  question: Question;
} {
  const company = pickForDay(COMPANIES, date);
  const pool = filterQuestions({ companyId: company.id, type: 'genel' });
  // salt=3 ile kurum seçiminden bağımsız bir dağılım elde ediyoruz.
  return { companyId: company.id, question: pickForDay(pool, date, 3) };
}

/**
 * Günün teknik sorusu: hedef alana göre, gün numarasına göre sabit.
 *
 * `pickDailyInterview` genel havuzdan seçiyor; bu ikincisi seçilen departmanın
 * teknik havuzundan. İkisi aynı gün yan yana duruyor (Bugün sekmesindeki
 * mülakat şeridi), o yüzden kurum ve soru için ayrı `salt` değerleri kullanılıyor
 * — yoksa ikisi aynı kuruma düşüp aynı gün tekrar hissi veriyor.
 *
 * ⚠️ Kurum salt'ı seçerken dikkat: `pickForDay` salt'ı `salt * 7` olarak
 * uyguluyor, yani 5 kurumla `salt = 5` → `35 % 5 = 0` ve sonuç günün
 * mülakatıyla (salt 0) **birebir aynı** kuruma düşüyor. `salt = 2` offset'i 4
 * veriyor; kurum listesi büyürse bu hesap yeniden yapılmalı.
 */
export function pickDailyTechnical(
  department: DepartmentId,
  date: Date = new Date(),
): { companyId: CompanyId; question: Question } {
  const company = pickForDay(COMPANIES, date, 2);
  const pool = filterQuestions({ companyId: company.id, type: 'teknik', department });
  return { companyId: company.id, question: pickForDay(pool, date, 11) };
}

export function getDepartment(id: DepartmentId): Department {
  const department = DEPARTMENTS.find((d) => d.id === id);
  if (!department) throw new Error(`Bilinmeyen departman: ${id}`);
  return department;
}
