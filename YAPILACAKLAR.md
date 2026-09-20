# Yol Haritası

Son güncelleme: 2026-09-20

Bu dosya yalnızca **açık işleri** tutar: yapılacaklar, cihazda doğrulanacaklar ve
kullanıcı kararı bekleyen sorular. Tamamlanan işlerin ayrıntısı, gerekçesi ve
sınama notları → [YAPILACAKLAR_ARSIV.md](YAPILACAKLAR_ARSIV.md) (bölüm numaraları
aynı; koddaki `YAPILACAKLAR Bölüm X` yorumları oraya bakar). Kararlar →
[KARARLAR.md](KARARLAR.md).

---

## Vizyon

Mülakat simülatörü olarak başlayan uygulamayı **kişisel gelişim uygulamasına**
dönüştürmek. Tek soru: **"bugün kendini nerede geliştirdin?"**

| Sütun | Kapsam | Açık iş |
| --- | --- | --- |
| **Kariyer & Mülakat** | Simülasyon, yapay zekâ analizi, geçmiş, sektör haberleri | Bölüm 00 (katalog), Bölüm 3 |
| **Konuşma & Diksiyon** | Artikülasyon, tekerleme, vurgu-tonlama, tempo, dolgu kelime avı | Bölüm 6 |
| **Dil & İfade** | Lugat & Türkçe; ileri düzeyde belagat | Bölüm 7 |
| **Dinlenme & Denge** | Diyafram, nefes kontrolü, duruş, göz dinlendirme | Bölüm 1 |
| **Zihin & Odak** | Bilişsel lob haritası, mantık, hafıza, mekan | Bölüm 2 |
| **Alışkanlık & Rutin** | Günlük pratik hatırlatmaları, aralıklı hatırlatıcılar, alarmlar | Yalnızca cihaz doğrulaması + Bölüm 4 kısıtları |
| **Ölçüm & Karne** | Kasıtlı ölçümler, Karne ekranı, eğilimler | Bölüm 5 |

### Ortak ilkeler

Her yeni modül bunlara uyar — istisna yok:

1. **Kapatılabilir.** Modül ayarlarından (sağ üstteki çark) kapatılan modül ne kart gösterir ne bildirim kurar.
2. **Günlük bir işi var.** "Bugün ne yapmalıyım" sorusunun tek satırlık cevabı olmalı.
3. **Ölçülebilir.** Serisi, skoru ya da süresi tutulur; yoksa modül değil, içeriktir.
4. **Abartmaz.** Ölçtüğü neyse onu yazar. "Kapasiteni artırır", "zekânı yükseltir",
   "tedavi eder" gibi karşılığı olmayan cümleler kurulmaz.
5. **Yeni durum `createPersistentStore` deseniyle** eklenir; ikinci bir state
   kütüphanesi (Zustand vb.) eklenmez.

### Sıra

1. ⏳ **2026-09-20 turu** — türün iki kısmı birbirini takip etti (kod tamam, `tsc` temiz;
   **cihazda doğrulanacak**).
   - **1. kısım:** ikon degradesi B'ye geçti ve kaynak-çıktı ayrışması kapandı,
     `expo-system-ui` kuruldu, günlük süre Bugün listesini belirliyor, duruş
     öz-kontrol ölçümü eklendi.
   - **2. kısım:** egzersizde yazı girişi + otomatik kontrol (`accept` alanı,
     öz-değerlendirme ayrılması), belagat "Tamamladım" düğmesine yeşil onay kartı
     + yanıt defteri yazımı, **Yanıt Defteri** yeni ekranı (Belagat · Egzersiz ·
     Lugat · Mülakat sekmesi), mülakat ses kayıtları kalıcı cihazda saklanıyor
     ve Mülakat Geçmişi'nden dinlenebiliyor. Ayrıntı Bölüm 2, Belagat, Egzersiz,
     Mülakat, 0.4'te.
2. ⏳ **2026-09-19 turu** — kararı gerektirmeyen küçük açıklar kapatıldı (kod
   tamam, `tsc` temiz; **cihazda doğrulanacak**): sade 5 dk 4-6 seansı, Rahat
   Tutma → ölçüm yönlendirmesi, çene gevşetme hatırlatıcısı, torasik ekstansiyon
   egzersizi, lugat tekrar sayacı, favicon. Ayrıntı ilgili bölümlerde. Yol
   üstünde ikon kaynağıyla teslim edilen ikonun ayrıştığı bulundu (Bölüm 8).
3. **Alanı kataloğa taşıma** (Bölüm 00 → aşama 2) — Savunma + Yazılım &
   teknoloji. Kariyer genişlemelerinden **önce**, yoksa yeni özelliklere de
   savunma varsayımı girer.
4. **Kariyer, Diksiyon, Dil & İfade genişlemeleri** (Bölüm 3, 6, 7).
5. **Tek "Nefes" çatısı** ve nefes kalanları (Bölüm 1) — CO₂ tabloları, nefes kontrolü egzersizleri.
6. **Vecizelerim + Gmail** (Bölüm 9) ve vecize doğrulaması.
7. **Su hedefi kişiye göre** (Bölüm 4).
8. **Zihin & Zekâ** (Bölüm 2) ve ona bağlı bilişsel başlangıç ölçümü (Bölüm 5).
9. **Gerçek alarm** (Bölüm 4) — native iş.
10. **Cihazda doğrulama turu** — aşağıdaki liste uzadı; bir sonraki build'de topluca bakılmalı.
11. *İleride değerlendirilecek:* Oyunlaştırma & liderlik tablosu. ⚠️ Global
   sıralama sunucu/kimlik bağımlılığı getirir ve öz-ölçümlerde (nefes, okuma
   hızı) hileye açıktır; tercih **kişisel rekorlar / öz-rekabet**.

---

## 00. Genele açılma

**İlke:** *sistemi uygulama versin, alanı katalog versin.* Alan koddan çıkar ama
kullanıcıya değil hazır kataloğa gider — kullanıcı yazmaz, seçer (KARARLAR).

**Aşama 1b · Yapay zekâyı herkesin açabilmesi** — ⏳ **BYOK uygulandı**
(2026-09-20, kod tamam, `tsc` temiz; **cihazda doğrulanacak**). Kullanıcı kendi
Google Gemini anahtarını giriyor, çağrılar doğrudan Google'a gidiyor, sunucu
gerekmiyor. Anahtar cihazın kasasında (`expo-secure-store`). Yeni
`src/screens/AiSetupScreen.tsx`; kapalıyken kartlardan ve Ayarlar'dan
açılabiliyor. Karar ve gerekçe → KARARLAR "Yapay zekâ kullanıcının kendi
anahtarıyla çalışır (BYOK)".

⚠️ **Yeni native modüller:** `expo-secure-store` ve `expo-clipboard` eklendi.
Cihazda çalıştırmadan önce **yeniden derleme** gerekiyor — iOS'ta önce
`npx pod-install`, Android'de autolinking hallediyor.
`npx expo prebuild` **çalıştırma**: `ios/` altındaki açılış ekranı ve ikon
özelleştirmeleri elle düzenlenmiş, prebuild onları ezer.
`npm install` yamayı sildiği için `npx patch-package` elle çalıştırıldı ve
doğrulandı (DEVAM.md "Ortam tuzakları" 2).

- [ ] **İleriye dönük — ortak sunucu seçeneği (eski "kurulumsuz" plan).**
      `server/server.ts` proxy'si ve `geminiClient`'ın proxy yolu duruyor,
      Ayarlar → Yapay Zekâ → Gelişmiş altından kullanılabiliyor. Ortak bir
      sunucu açılacaksa önce şunlar ölçülmeli: ücretsiz kotanın gerçek sınırı
      ve **tüm kullanıcılar arasında paylaşıldığı** gerçeği; sunucusuz
      platformların (Cloudflare Workers, Vercel, Render) ücretsiz katman
      limitleri; kötüye kullanım (açık proxy'yi herkes çağırabilir — `APP_TOKEN`
      var ama tek başına yetmez, cihaz başına hız sınırı gerekiyor).
- [ ] **İleriye dönük — anahtarsız denemelik.** Anahtar girmek istemeyen için
      sınırlı sayıda (ör. birkaç analiz) denemelik kota. Ortak sunucu
      olmadan yapılamaz; yukarıdaki maddeye bağlı.
- [ ] Ses MIME türü değişikliği doğrulanacak: proxy `audio/m4a` gönderiyordu,
      doğrudan çağrıda `audio/mp4`'e çevrildi (m4a IANA'da kayıtlı değil,
      Gemini'nin desteklenen türler listesinde yok). Sesli mülakat analizi
      cihazda sınanmalı.

**Aşama 2 · Alanı kataloğa taşı** — ⏳ yapılmadı.

*Sade anlatımla:* Kariyer & Mülakat bölümü bugün yalnızca savunma sanayiine
hazırlanan birine göre kurulu. Şirket listesi beş savunma firmasından ibaret
(ASELSAN, Roketsan, Baykar, TUSAŞ, HAVELSAN) ve kodda sabit; haber akışı
yalnızca savunma haberlerini gösteriyor; yapay zekâya "sen savunma sanayii
mülakat kurulu üyesisin" deniyor. Yazılım şirketine hazırlanan biri uygulamayı
açtığında kendine uygun hiçbir şey bulamaz. Bu iş, sektörü seçilebilir bir
"katalog" hâline getirir: kullanıcı ilk açılışta (ya da ayarlardan) sektörünü
seçer, şirketler, sorular, haberler ve yapay zekâ istemi ona göre gelir.

**Karar (2026-09-19):** katalogda **Savunma sanayii + Yazılım & teknoloji**.

Bugünkü hâl:

| Bulgu | Yer |
| --- | --- |
| Uygulama hiçbir sunucuyla gelmiyor | `appSettings.ts` → `DEFAULT_API_BASE_URL = ''` |
| Kurumlar bir **tip** olarak sabit | `companies.ts` → `CompanyId = 'aselsan' \| 'roketsan' \| …` |
| Bölümler üçle sınırlı | `questions.ts` → `DEPARTMENTS` (yazilim, arge, ik) |
| Haber akışı sektöre kilitli | `defenseNews.ts` |
| Yapay zekâ istemleri sektöre kilitli | `AnalysisScreen.tsx:116`, `InterviewHistoryScreen.tsx:35` ("Sen Türk savunma sanayii…") |

Yapılacak: `CompanyId` → serbest kimlik + hazır katalog (savunma sanayii bir
girdi olur); `DEPARTMENTS` genişler; haber akışı sektör parametreli; istemler
katalog seçimine göre üretilir; alan seçimi oryantasyona (Bölüm 0.1) bir adım
olarak eklenir ve Ayarlar'dan değiştirilebilir. Yazılım & teknoloji için
şirketler, bölümler (ör. backend, mobil, veri, ürün), soru bankası ve haber
kaynakları hazırlanacak.

---

## 0. Gezinme

- [ ] Bildirim yönlendirmesi (`data.screen` → `DiaphragmExercise`,
      `SpeechExercise`, `BelagatExercise`, `DailyText`, `Language`, Dinlenme &
      Denge) cihazda bir kez sınanmalı — "Cihazda doğrulanacaklar"da.

---

## 0.1. Oryantasyon — kalanlar

- [ ] **Konumlu ipucu balonları** — sekmelere işaret eden 4 adımlı tur; şimdilik tek "Kısa tur" kartı var.
- ⏳ **Günlük süre Bugün listesini belirliyor** (2026-09-20, kod; cihazda
      doğrulanacak) — modüllerin kaba süreleri veriden hesaplanıyor (metin
      `approxSeconds`, diyafram `totalSeconds`, konuşma `drillSeconds`; lugat
      ve belagat tahmini sabit), hedef sırasına göre dakika bütçesine sığdıkça
      listeleniyor. Bütçe dışı kalanlar "Daha fazlası (N)" ile açılıyor,
      kapanmıyor; 10 dk = hepsi. Süre Ayarlar → "Günlük Hedef Süresi" ve
      Profil panelinden seçiliyor. Süre **hiç seçilmediyse** (eski kullanıcı,
      oryantasyonu atlayan) liste kısalmıyor — `onboarding.dailyMinutesChosen`.
      İncelemede düzeltilenler: (a) oryantasyonda süre adımında hiçbir çipe
      dokunmadan "Devam" denince özet "5 dk" derken seçim kaydedilmiyordu —
      artık "Devam" ekrandaki değeri onaylıyor; (b) bütçe sığmayan modülü atlayıp
      arkasındaki küçük modülü öne alıyordu, artık **ilk sığmayanda kesiliyor**
      (hedef sırası bozulmasın); (c) Profil ve Bugün'de kalan `uppercase`
      sınıfları temizlendi — değişken metinler (`{seri} günlük seri`, ikon grup
      başlıkları) `trUpper`'a alındı, yoksa "GÜNLÜK SERI" gibi noktasız I
      çıkıyordu.
- [ ] **Günlük modülü olmayan hedefler** — yalnız Zihin & Odak ya da Kariyer
      seçenin hatırlatması **kendi ekranını** açsın (karar 2026-09-19): zihin
      egzersizleri / mülakat ekranı. Şu an "Günün metni"ne kuruluyor.
- [ ] **Başlangıç testi → seviye önerisi** (Bölüm 5'ten) — öneri üretir,
      kullanıcının seçimini ezmez.

## 0.4. SQLite ve Kalıcı Depolar

| Aşama | Durum |
| --- | --- |
| 1 · Anahtar-değer (`kv`) | ⏳ Kod tamam — yeniden derleyip cihazda doğrulanacak |
| 2 · Geçmiş tabloları (`interview_sessions`, `exercise_logs`) | ⏳ Kod tamam — cihazda doğrulanacak |
| 2b · Ses dosyaları (`AudioStore`) | ⏳ Yeni `src/utils/audioStore.ts` — mülakat kayıtları kalıcı klasöre taşınıyor. Cihazda doğrulanacak. |
| 2c · Yanıt Defteri (`ResponseHistory`) | ⏳ Yeni `src/utils/responseHistory.ts` — belagat, egzersiz, lugat, mülakat cevapları. Yeni `ResponseJournalScreen.tsx`. Cihazda doğrulanacak. |
| 3 · Katalog | [ ] Soru bankası, tekerlemeler, okuma metinleri ve lugat `catalog_*` tablolarına; FTS5 arama. İçerik büyümesine bağlı (Bölüm 00, 7). Tarih aralığı / ortalama sorguları ihtiyaç duyan ekranla birlikte (Bölüm 5) |
| Temizlik | [ ] Aşama 1 cihazda doğrulandıktan birkaç sürüm sonra `savunma-store/` yedek klasörünü sil |

### Açık kalan işler ve sınırlar (2026-09-20)

- ⚠️ **Ses kaydı depolama sınırı yok** — kayıtlar birikiyor, cihaz belleği arttıkça yer kullanımı kontrol edilmeli. Otomatik temizlik (en eski N gün) ya da kullanıcı kotası henüz yok.
- ⚠️ **Yanıt Defteri kayıt sayısı sınırı yok** — quiz cevapları hızlı birikir. Sayfalama var (ilk 50 + "Daha fazla"), ama uzun listeler yavaşlayabilir.
- ⚠️ **Uygulama çöküşü sırasında kayıt** — yarıda bırakılan mülakatta yalnızca kullanıcının bilerek çıkması ele alındı (X düğmesi, geri tuşu ve geri jesti; hepsi çıkış uyarısına düşüyor). Uygulama çökerse ya da sistem tarafından arka planda sonlandırılırsa kayıt hâlâ kaybolur.
- ℹ️ **`historyTablesReady()` üç tabloyu birlikte varsayıyor** — `practice_responses`'ın taşınacak eski verisi olmadığı hâlde, mülakat/egzersiz `kv`→tablo göçü başarısız olursa yanıt defteri de gereksiz yere dosya/kv yoluna düşüyor. Veri kaybı yok, iki yol da güvenli; yalnızca SQLite tablosu boşuna kullanılmıyor.
- ⏳ **Belagat üretim cümlesi deftere yazılıyor** — "Tamamladım" basıldığında; `correct` alanı bilerek boş bırakılıyor (üretimde tek doğru yok).
- ⏳ **Egzersiz yazı yanıtları deftere yazılıyor** — `accept` varsa doğruluk ölçülerek, yoksa öz-değerlendirmeyle ya da süre dolarken damgasız.
- ⏳ **Mülakat defterin dışında** — defterin mülakat sekmesi `interviewHistory`'yi doğrudan okuyor, ikinci bir yazım yok (tek kaynak ilkesi).

---

## 1. Nefes & Beden

**Ne yapar, ne yapmaz (metin kuralı):** akciğeri büyütmez — vital kapasite
büyük ölçüde boy, yaş, yapıyla belirlenir; kas gücü dirençli cihazla çalışılır.
Yapar: verişin kontrolü, nefesi cümleye bölme, baskı altında toparlanma.
Uygulamada **"kapasite" geçmez.** Duruş egzersizleri duruşu **düzeltmez**, ağrı
**tedavi etmez** — fark ettirir ve gevşetir.

### ⚠️ Güvenlik (her yeni nefes içeriğinde)

- Baş dönmesi, karıncalanma, göğüste sıkışma → dur, normal nefese dön.
- Nefes tutma **asla suda, araç kullanırken veya ayakta**; öncesinde hiperventilasyon yok.
- Astım, KOAH, kalp rahatsızlığı, gebelik → hekime danış. "Tıbbi tavsiye değildir" ibaresi.
- Güçlü hiperventilasyon protokolleri (Wim Hof tarzı) **eklenmeyecek**.

### 2026-09-19 turu (kod tamam; cihazda doğrulanacak)

- ⏳ **Sade 5 dakikalık 4-6 seansı** — `breathingPrograms.ts` → `SIMPLE_46`
  (tek segment, 30 döngü, 4 sn al · 6 sn ver). Diyafram → Pratik'te "Sade 5 dk ·
  4-6" kartı, tek dokunuşla başlıyor; aktifken mod/seviye seçimi gizleniyor,
  "Çık" ile ayarlı programa dönülüyor. Her 5 döngüde "Karnın şişsin, göğsün
  sabit kalsın." (`reminderEvery`), bitişte "30 döngü tamamlandı."
  (`announceCycleCount`), Rehber'de "Ne Kazandırır" gizli. Sesli sayım yok
  (açık soru).
- ⏳ **Rahat Tutma → ölçüm yönlendirmesi** — `ExerciseEngineScreen` bitişinde,
  yalnız iki Rahat Tutma egzersizinde: "Birkaç dakika normal nefesle
  dinlendikten sonra…" + Diyafram → Ölçüm'ü açan düğme (Karne'nin
  `findMeasureTest` rotası). Teşvik/rekor dili yok.
- ⏳ **Çene gevşetme hatırlatıcısı** (`cene` şablonu, 90 dk, hedef 6,
  varsayılan kapalı) — "Dişlerin birbirine değmesin, dilin damağında, çenen
  gevşek olsun." + diş hekimi notu. Ekran yönlendirmesi yok (karşılık gelen
  egzersiz yok).
- ⏳ **Torasik ekstansiyon** — `torasik-ekstansiyon`, Duruş & Sırt, 5 adım ≈ 2 dk,
  oturarak; "düzeltmez, tedavi etmez" ibaresi.

### Açık

- [ ] **Tek "Nefes" çatısı** (karar 2026-09-19) — nefesle ilgili her şey tek
      yerde: diyafram programları, sade 4-6, Rahat Tutma, aşağıdaki nefes
      kontrolü egzersizleri ve CO₂ tabloları, nefes ölçümleri. Bugün Rahat
      Tutma Dinlenme & Denge'nin egzersiz listesinde, diyafram ayrı ekranda —
      ikisi birleşecek. Ekranın adı "Nefes"; düzen (karar 2026-09-19):
      **Pratik** (diyafram programları, sade 4-6) · **Antrenman** (kaburga
      genişletme, büzük dudak, basamaklı alma, Rahat Tutma, CO₂) · **Konuşma
      Nefesi** ("aaa" uzatma, sayarak verme; Diksiyon'dan kısayol) · **Ölçüm** ·
      **Rehber**. Diksiyon ayrı modül olarak aynen kalır. Bildirim yönlendirmeleri
      (`DiaphragmExercise`) ve Karne'nin "Ölç" rotaları yeni yapıya taşınmalı.
- [ ] **CO₂ tabloları** (sabit tutma, kısalan dinlenme) — asıl ilerletici yöntem.
      `BreathEngine` her turda aynı fazları çalıştırıyor; motor `cycles` yerine
      tur listesi alacak şekilde genişletilmeli.
- [ ] **Nefes kontrolü egzersizleri** (hepsi `progressive` moda):

      | Egzersiz | Ne yapar (gerçekte) | Ölçüm |
      | --- | --- | --- |
      | Büzük dudak nefesi | 2 sn al, dudak büzük 4 sn ver; verişte geri basınç. Kapasite artırmaz | Tur |
      | Kaburga genişletme | Nefesi yanlara genişleterek al; göğüs kafesi farkındalığı | Tur |
      | Basamaklı alma | 3-4 kısa nefesle doldur, tek seferde ver | Basamak |
      | Maksimum fonasyon süresi | Tek nefeste sabit "aaa"; hacim ölçüsü **değil** | sn |
      | Sayarak verme | Kontrollü verişin konuşmaya çevrilmiş hâli | Sayı |

- [ ] **4 haftalık kademeli plan** — hafta başı ölçüme göre hedef. Yeni faz türü
      (`stackedInhale`) ya da ayrı `BreathDrill` tipi gerekebilir. "Nefes"
      çatısının içinde.
- ⏳ **Duruş öz-kontrol ölçümü** (2026-09-20, kod; cihazda doğrulanacak) —
      `postureSelfCheck`, 5 maddelik liste, 0-5 referans skala, `improvement:
      'higher'`; Dinlenme & Denge → Duruş & Sırt'ta "Öz-kontrol" kartı, Karne'de
      yeni **Duruş** alanı. Açık: Karne'deki "Ölç" ekranı açıyor ama kategoriye
      kaydırmıyor (ekranda kaydırma çapası deseni yok) — gerekirse ayrı iş.
- [ ] **Mola sıklığı önerisi** (karar 2026-09-19: eklensin) — farkındalık
      önerisi olarak ("belli aralıklarla kalk, esne"), sağlık iddiası yok;
      "Ayağa kalk & esne" hatırlatıcısına bağlanır.
- [ ] Duruş adımları için görsel anlatım (adım çizimleri).
- [ ] Sade 5 dk aktifken sağ üst çark panelinde mod/seviye hâlâ değiştirilebiliyor
      (seansı bozmuyor, "Çık" sonrası geçerli oluyor; ama Pratik sekmesinde
      gizlenen seçimle tutarsız). Küçük; panelde de gizlenmeli ya da not düşülmeli.
- [ ] **Dairesel geri sayım** — yatay `ProgressBar` yerine; `react-native-svg`
      kurulu. Öncelik düşük.
- [ ] **Bildirimden tek dokunuşla 60-90 sn'lik mini akış** — "Duruş kontrolü"
      bildirimi şu an kategoriyi açıyor, doğrudan akışa girmiyor.

---

## 2. Zihin & Zekâ

**Metin kuralı:** zekâyı yükseltmez; iyileşme ağırlıkla **çalışılan görevde**.
"IQ artırır", "beynini geliştirir" yazılmaz.

### Egzersiz motoru — yazı girişi + otomatik kontrol (2026-09-20)

⏳ **Uygulandı:** `PromptEngine.prompts` öğesi `accept?: string[]` alanı alıyor. 
- Beş egzersizin (`oruntu-tanima`, `zihinden-hesap`, `mekansal-kurgu`, `konum-siralama`, `ters-siralama`) 32 sorusu gözden geçirildi.
- 32 sorunun 30'una `accept` yazıldı (sayı, yön, sıralama gibi çekirdeği tek olan cevaplar).
- İki soruya kasıtlı **yazılmadı** — cevabı serbest ifade olduğu için tek doğru yazımı yok: Mekansal Kurgu "'L' harfini döndürme" ve Konum Sıralama "B çökerse hangi servisler etkilenir". İkisi öz-değerlendirmeye ("Doğru bildim" / "Bilemedim") düşüyor.
- `ExerciseEngineScreen` yazı kutusu + "Kontrol Et" düğmesi.
- Süre dolarken yazılmış ama kontrol edilmemiş yanıt otomatik kontrol edilip kaydediliyor.
- `ExerciseLog`'a `correctCount?` / `checkedCount?` alanları (doğruluk ölçümü için; efor puanı tanımı değişmedi).
- Tamamlama kartına "Doğru" kutusu (yalnızca kontrol edilen soru varsa görünür).
- **Cihazda doğrulanacak:** klavye açıkken "Kontrol Et" düğmesine ilk dokunuş; yanıtların deftere düşmesi; efor puanı ve trend grafiğinin eskisi gibi kalması.

### Yeni egzersizler

- [ ] Yeni egzersizler (`src/data/cognitiveDrills.ts`):

      | Alan | Egzersiz | Ölçüm |
      | --- | --- | --- |
      | Çalışma belleği | n-back, rakam dizisi geri okuma | Seviye (n), doğruluk |
      | Dikkat & odak | Seçici dikkat, dikkat dağıtıcı altında görev | Doğruluk, tepki süresi |
      | İşlem hızı | Sembol eşleme, hızlı aritmetik | Doğru/dk |
      | Mantık & örüntü | Sayı-şekil örüntüleri, çıkarım | Doğruluk |
      | Hafıza teknikleri | Loci, gruplama, akrostiş | Hatırlanan öğe |
      | Hızlı okuma | Göz sıçraması, geri dönüşü azaltma | Kelime/dk + anlama |

- [ ] Her egzersize mülakat bağlantısı alanı (`interviewUse` benzeri).
- [ ] **Zorluk uyarlaması** — skor yükseldikçe seviye artar, düştükçe iner.
- [ ] **Bilişsel başlangıç ölçümü** (n-back + işlem hızı) — Bölüm 5'ten ertelendi, bununla birlikte.

---

## 3. Kariyer & Mülakat

### Mülakat ses kaydı (2026-09-20)

⏳ **Uygulandı:** Mülakat sırasında kaydedilen ses **kalıcı** saklanıyor ve Mülakat Geçmişi'nden dinlenebiliyor.
- Çıkış uyarısı üç seçenekli: "Kaydet ve çık" · "Kaydetmeden çık" · "Vazgeç". Kaydetmeden çıkışta ses kalıcı klasöre hiç taşınmaz, geçici dosyası silinir ve kayıt oluşmaz.
- `RecordedSession`'a `audioFile?` ve `aborted?` alanları eklendi.
- Yeni `src/utils/audioStore.ts`: ses dosyası `Paths.document/terakki-audio/` altına taşınıyor. Depo değil, ince bir dosya katmanı — tablo ya da JSON indeks yok, bağ geçmiş kaydındaki dosya adı.
- iOS'ta veri klasörü yolu güncellemede değişebileceği için kayıtta **dosya adı** tutuluyor, tam yol değil.
- Ses JSON deposuna girmiyor: megabaytlarca base64 her yazımda tüm bloğu yeniden serileştirirdi.
- Mülakat Geçmişi'ne oynatma, "Yarıda kaldı" etiketi, toplam boyut göstergesi ve "Ses kayıtlarını sil" eklendi.
- Analiz ekranı bellek buffer'ı boşsa sesi diskten okuyor (sonradan analiz imkanı).
- **Cihazda doğrulanacak:** yarıda çıkış → kayıt kalıcı, Geçmiş'ten dinlenebiliyor; sessiz moddaki iPhone; ekrandan çıkınca oynatma kesilip durumu güncelleniyor.

### İleride

- [ ] **Başvuru takibi** — şirket, aşama, tarih, sonuç; basit liste/kanban.
- [ ] **STAR cevap kurucu** — Durum → Görev → Eylem → Sonuç şablonuyla yaz, kaydet.
- [ ] **Şirket araştırma notları** — şirket başına not; simülasyon öncesi hatırlatılır.
- [ ] **Maaş görüşmesi senaryosu** — ayrı simülasyon modu.
- [ ] **Mülakat sonrası takip** — teşekkür mesajı şablonu, öz-değerlendirme formu.
- [ ] **Teknik soru bankası** — departman bazlı; yanlışlar tekrar havuzuna düşer.

⚠️ Bölüm 00 aşama 2'den (katalog) önce yapılırsa savunma sanayii varsayımı
yeni özelliklere de gömülür — sıra kararı buna göre verilmeli.

---

## 4. Alışkanlık & Rutin — teknik kısıtlar

4a (aralıklı hatırlatıcılar) ve 4b (serbest alarmlar) kod olarak tamam; açık
olan yalnızca cihaz doğrulaması ve şunlar:

- [ ] Bildirim kimlik şeması `savunma.habit.<id>.<slot>` biçimine genişletilecek
      (hayalet bildirim riski `kind` alanıyla zaten kapandı; bu temizlik işi).
- [ ] **Gerçek alarm eklenecek** (karar 2026-09-19: şimdilik bildirim yeter,
      ileride eklenecek). Tam saatinde, kullanıcı kapatana kadar çalan alarm.
      `expo-notifications` *inexact* alarm kuruyor (Android 14+ birkaç dakika
      kaydırabilir) ve ısrarlı çalmayı desteklemiyor; native iş (Android
      `AlarmManager.setAlarmClock` + tam ekran bildirim, iOS'ta sınırlı —
      iOS 26 AlarmKit araştırılmalı).
- [ ] **Su hedefi kişiye göre** (karar 2026-09-19) — sabit 10 bardak yerine
      kullanıcıya boy, kilo, günlük etkinlik (ve istenirse iklim) sorulup bir
      **aralık** önerilir; kullanıcı değiştirebilir. Metin kuralı: öneri tıbbi
      değil, abartmaz; böbrek/kalp rahatsızlığında hekime danış notu.
      Kaynak/formül seçilirken yaygın kılavuzlar (ör. kg başına ml
      yaklaşımları) karşılaştırılıp gerekçesi KARARLAR'a yazılmalı. Sayacı olan
      diğer hatırlatıcılara da (göz molası vb.) elle hedef seçimi gelir.
- ⚠️ **iOS 64 bekleyen bildirim sınırı:** bütçe `NOTIFICATION_BUDGET = 56`,
  günlük pratiğe `DAILY_PRACTICE_RESERVE = 28`. Yeni bildirim kuran her modül
  bu bütçeden pay almalı.
- [ ] Alarm için özel ses (`sound`) — native kaynak gerektiriyor; istenirse ayrı madde.

---

## 5. Ölçüm & Karne

**Kural:** yeni test `src/data/measureTests.ts` kaydı + `MeasureTests.tsx`
arayüzüyle eklenir, altyapı ikinci kez kurulmaz. Öz-ölçüm olduğu ekranda yazar;
"kapasite" yok; aynı koşul notu ölçümden önce; yönü aralık olan ölçümde
`improvement: 'none'`. Mikrofonla otomatik süre ölçümü yok.

- [ ] **Zayıf ses tespiti** — sonucu ses listesi, `TestResult` sayısal; ayrı veri
      yapısı + `dictionDrills.focus` eşlemesi. Bölüm 6'daki zayıf ses odaklı
      seansla birlikte. Karar (2026-09-19): **öneri** — günün seansı değişmez.
- [ ] **Belagat sanat seviye tespiti** — 10 soruluk sınav (istatistik var, sınav yok) — Bölüm 7.
- [ ] **Nefes/metin oranı metin ayrımı** — skala metin değiştikçe kayıyor; aynı
      metnin tekrar okunması için metin kimliğine göre ayrı geçmiş.
- [ ] Bilişsel başlangıç → Bölüm 2. Başlangıç testi → Bölüm 0.1.

---

## 6. Konuşma & Diksiyon

- [ ] **Zayıf ses odaklı seans** — `dictionDrills.ts`'e ses etiketleri; tespit
      edilen sesler için günün seansının yanında "zayıf seslerine özel seans"
      düğmesi. Günün seansı **değişmez** (karar 2026-09-19).
- [ ] **Kayıttan dinleme** — sesini kaydet, geri dinle, önceki kayıtla karşılaştır (`expo-av` var).
- [ ] **Sunum provası** — konuşmayı belirlenen süreye sığdırma, süre aşımı uyarısı.

---

## 7. Dil & İfade — Lugat & Türkçe

Sütunun ekseni söz varlığı ve doğru Türkçe; belagat ikincil/ileri düzey (KARARLAR).

### Yanıt Defteri (2026-09-20)

⏳ **Uygulandı:** Lugat quizleri (anlam testi, boşluk doldurma, seviye tespiti) cevapları
**Yanıt Defteri**'ne yazılıyor. Yeni `src/screens/ResponseJournalScreen.tsx` ekranı:
- Beş sekme: Tümü · Belagat · Egzersiz · Lugat · Mülakat
- Satır genişletme (soru + beklenen cevap), silme, sayfalama (ilk 50 + "Daha fazla" düğmesi)
- Lugat sekmesinde quiz türü (anlam / boşluk doldurma / seviye tespiti) ve doğru-yanlış damgası görünüyor
- **Açık:** kayıt sayısı sınırsız büyüyor, otomatik budama yok

### İlerleme

- ⏳ **Tekrar sırası göstergesi** (2026-09-19, kod; cihazda doğrulanacak) —
  Alıştırma sekmesinde (Anlam testi / Boşluk doldurma) "Tekrar sırası gelen: N
  kelime — testlerde önce bunlar sorulur"; N=0 ve Seviye tespitinde gizli.
  `lugatProgress.ts` → `useDueCount()` (gün dönümünde yenilenir). Ayrı tekrar
  modu yapılmadı.
- [ ] **Deyim/atasözü doğrulaması** — 22 madde TDK Atasözleri ve Deyimler
      Sözlüğü ile tek tek doğrulanmadı (GTS uç noktası deyimlerde JSON dönmedi).
- [ ] **İçerik genişletme** — hedef ≥500 kelime (şu an 68); TDK GTS doğrulama iş akışı; kaynak/lisans notu.
- [ ] **Günün metninde kelime işaretleme** — okurken dokun → anlam.
- [ ] **Eş/zıt anlam ve kök-ek (türetme) alıştırmaları.**
- [ ] **Deyim/atasözü alıştırması.**
- [ ] **Yazım kuralları mini dersleri** — "de/da", "mi", "ki".
- [ ] **Okuduğunu anlama soruları** — günün metni üzerinden.
- [ ] SQLite kataloğuna taşıma — Bölüm 0.4 aşama 3.

### Belagat

Şu anki durum (2026-09-20):
- ⏳ **"Tamamladım" düğmesi düzeltildi** (kod tamam, cihazda doğrulanacak) — eskiden
  basınca ekranda hiçbir değişiklik olmuyordu, kullanıcı "çalışmıyor" diye bildirdi.
  Artık yeşil onay kartı çıkıyor, cümle yanıt defterine yazılıyor ve "Yanıt Defterini
  Aç" düğmesi geliyor. Metin değişirse "Tamamladım" geri gelir (aynı cümle iki kez
  yazılmaz); boş metinle kayıt açılmaz.

- [ ] **Seviye tespit sınavı** (10 soru) ve kol bazlı başarı yüzdesi.
- [ ] **Zayıf sanat tekrarı** — yanlış bilinen sanatlar tanıma havuzunda daha sık.
- [ ] **Metinden sanata geçiş** — okuma metinlerindeki `belagatArtIds` ile metni okurken sanatı işaretleme.

---

## 8. Kimlik

- ✅ **`favicon.png`** (2026-09-19) — `92912c1`'de silinmişti ama `app.json` →
  `web.favicon` onu gösteriyordu. `build_from_brand.py` artık favicon da
  üretiyor (alan ortalamasıyla 48×48); bu seferlik teslim edilen `icon.png`'den
  küçültüldü (aşağıdaki madde yüzünden).
- ✅ **İkon kaynağı ile çıktı eşitlendi** (2026-09-20). Ayrışma şuydu: `48c91c1` ikonlara 3
      duraklı degrade (`#0EA876 → #0A8D65 → #077456`) uyguladı ama betik
      üzerinden değil; `terakki-icon-master.svg` hâlâ 2 duraklı
      (`#10B981 → #04614A`). `build_from_brand.py` çalıştırılırsa ikonlar eski
      degradeye dönüyordu. Yapıldı: master.svg 3 duraklıya çevrildi, betiğin
      çıktısı commit'teki ikonlarla piksel piksel karşılaştırıldı (Android
      zemininde en büyük fark 1/255; ikon yalnızca figür kenar yumuşatmasında
      ayrılıyor, gözle aynı). Ardından kullanıcı **B adayını** seçti:
      `#05B179 → #029568 → #007B59` (doygunluk %12 artırıldı). Eski ikon ve
      eski kaynak SVG `assets/brand/arsiv/` altında. Orta durak `#029568`
      `app.json` (iki yer), `SplashOverlay.tsx` ve iOS
      `SplashScreenBackground.colorset` ile eşitlendi; splash degradesi de
      (eskiden hâlâ iki duraklıydı) yeni degradeye çevrildi. ⏳ Cihazda: ikon,
      açılış ekranı ve Android adaptif zemin. ⚠️ Native taraftaki kopyalar
      (`ios/Terakki/Images.xcassets/AppIcon.appiconset/…`, Android res klasörleri)
      hâlâ eski degradede — `npx expo prebuild` (ya da yeniden derleme)
      çalıştırılmadan telefonda yeni ikon görünmez.
- ⏳ **`expo-system-ui` kuruldu** (2026-09-20) — `~6.0.9`; `npx patch-package`
      çalıştırıldı, `tsc` temiz. Etkisi ancak **yeniden derlemeden sonra**
      görülür: `userInterfaceStyle: "automatic"` Android'de çalışmalı, prebuild
      uyarısı kalkmalı.

---

## 9. Kişisel içerik — dinî mod

⚠️ Terakki'ye özel; İrtifa'ya eklenmez, Fesahat için karar açık (KARARLAR →
"Kişiye özel içerik diğer uygulamalara taşınmaz").

- [ ] **Vecize doğrulaması** — 10 vecizenin lafzı ve künyesi asıl metinden
      doğrulanmadı; netleşmeyenin `source`'u düzeltilecek ya da madde çıkacak.
- [ ] Doğrulama bitince havuzu genişlet.
**Vecize kaynağı — karar (2026-09-19): uygulama + sunucu.** Ayrı bir "admin
modu" yok: uygulama tek kişilik, telefonu tutan zaten sahibi.

- [ ] **Vecizelerim (uygulama)** — Günün Metni içinde liste: yaz / yapıştır /
      dosyadan al (`expo-document-picker`, satır başına bir vecize), düzenle,
      sil. Eklenenler yerel havuza katılır, günlük seçim ikisinden birden
      yapılır. Çevrimdışı çalışır. Yeni depo `createPersistentStore` ile.
- [ ] **Gmail'den çekme (sunucu)** — `server/server.ts`'e belirli bir Gmail
      etiketini okuyan uç; OAuth2 yalnızca sunucuda (istemci sırrı uygulamaya
      gömülmez). Uygulama sunucuya ulaşınca yeni vecizeleri çeker, yerel
      havuza kaydeder (tekrarları atar); sunucu kapalıyken hiçbir şey bozulmaz
      ve teknik hata gösterilmez (`aiAvailability` benzeri kontrol). Bültenin
      HTML'i değişirse ayrıştırıcı boş dönebilir — boş sonuç sessizce yok
      sayılmalı, havuzu silmemeli.
- [ ] Gmail tarafı için kullanıcıdan: hangi gönderici/bülten, hangi etiket;
      Google Cloud projesi ve OAuth onayı (kurulum adımları sunucu README'sine).

---

## Genel

- [ ] `README.md` — yeni modüllerin özellik listesine eklenmesi.
- ⚠️ **Türkçe büyük harf:** `uppercase` sınıflı yerlere küçük harfli başlık
  yazılırsa "KELIMESI" hatası geri döner. Yeni başlıkları doğrudan büyük harfle
  yaz ya da `src/utils/text.ts` → `trUpper()`'dan geçir.

---

## Cihazda doğrulanacaklar

Aşağıdakiler yalnızca `tsc` (ve saf modüller için Node betikleri) ile doğrulandı;
telefonda görülmedi. Build aldıktan sonra bakılacak.

**Yeni (2026-09-20 turu — 3. kısım: yapay zekâ kurulumu)**

- [ ] `expo-secure-store` native modülü: prebuild + yeniden derleme sonrası uygulama açılıyor mu; anahtar kaydedilip uygulama yeniden başlatıldığında hâlâ duruyor mu.
- [ ] Kurulum akışı: "Ücretsiz anahtar al" tarayıcıyı açıyor mu; "Panodan yapıştır" çalışıyor mu; geçersiz anahtar **kaydedilmeden** anlaşılır bir hata veriyor mu.
- [ ] Kapalıyken kartlardaki ve analiz ekranındaki "Yapay Zekâyı Aç" düğmeleri kuruluma götürüyor mu; anahtar girilip dönünce ekranlar kendiliğinden tazeleniyor mu.
- [ ] Gerçek mülakat analizi uçtan uca: metin ve **ses** ile (ses MIME değişikliği yüzünden özellikle sesli olan).
- [ ] Anahtarı kaldırınca yapay zekâ tekrar kapanıyor ve uygulamanın geri kalanı bozulmuyor mu.

**Yeni (2026-09-20 turu — 2. kısım)**

- [ ] Mülakat ses kaydı: kamera modunda kayıt sürerken kapat → "Kaydet ve çık"; ses dosyası gerçekten kalıcı klasöre taşınıp Mülakat Geçmişi'nde dinlenebiliyor mu. "Kaydetmeden çık" → ne kayıt ne ses dosyası kalıyor mu, mikrofon serbest bırakılıyor mu (sonraki mülakatta kayıt başlıyor mu).
- [ ] Mülakattan geri tuşu/jestiyle çıkış: Android donanım geri tuşu ve iOS kenardan kaydırma da çıkış uyarısını getiriyor mu (denetimde bulundu: eskiden yalnızca başlıktaki X çalışıyordu, geri tuşuyla çıkan kaydını kaybediyordu).
- [ ] Ses oynatma: sessiz moddaki iPhone'da duyuluyor mu; ikinci bir kayda basınca ilki duruyor mu; ekrandan çıkınca ses kesiliyor mu.
- [ ] Egzersiz yazı girişi: klavye açıkken "Kontrol Et"e **ilk** dokunuş çalışıyor mu; doğru/yanlış kararı beklendiği gibi mi (özellikle Türkçe harfsiz yazımda); `accept`'siz iki soruda öz-değerlendirme düğmeleri çıkıyor mu; efor puanı ve trend grafiği eskisi gibi mi.
- [ ] Yanıt Defteri: beş sekme de doğru listeyi gösteriyor mu; satır genişletme ve silme çalışıyor mu; "Daha fazla" düğmesi; birkaç yüz kayıtla akıcı mı; belagat üretim satırında doğru/yanlış damgası **görünmüyor** mu (tek doğru yok).
- [ ] SQLite v3 göçü: mevcut veritabanı (v2) açılıp `practice_responses` tablosu yaratılıyor mu; eski mülakat/egzersiz geçmişi yerinde duruyor mu; göç başarısız olursa uygulama `kv` yoluna düşüp çalışmaya devam ediyor mu.
- [ ] Belagat "Tamamladım": yeşil onay kartı çıkıyor, cümle deftere yazılıyor, "Yanıt Defterini Aç" çalışıyor; metin değişince "Tamamladım" geri geliyor; boş metinle kayıt açılmıyor.

**Yeni (2026-09-20 turu — 1. kısım)**

- [ ] İkon: telefon ana ekranında yeni degrade (`#05B179 → #029568 → #007B59`) nasıl duruyor; Android adaptif ikon zemini ve açılış ekranı aynı yeşilde mi; native (düz) açılıştan degradeli katmana geçişte renk sıçraması var mı.
- [ ] `expo-system-ui`: yeniden derlemeden sonra prebuild uyarısı kalktı mı; koyu temada sistem parçaları (durum çubuğu, klavye zemini) uyumlu mu.
- [ ] Oryantasyon: süre adımında hiçbir şeye dokunmadan "Devam" → Bugün listesi 5 dk'ya göre kısalıyor mu (özetle tutuyor mu); en üstteki "Atla" ile çıkınca liste kısalmıyor mu.
- [ ] Günlük süre: 3 dk seçince Bugün listesi kısalıyor, "Daha fazlası" hepsini açıyor mu; 10 dk'da hepsi görünüyor mu; Ayarlar ve Profil'den değiştirince liste anında değişiyor mu; süre hiç seçilmemişken (mevcut kurulum) liste **kısalmıyor** mu; gizlenen modülün hatırlatması yine geliyor mu; seriler bozulmadı mı.
- [ ] Duruş öz-kontrol: Dinlenme & Denge → Duruş & Sırt'ta kart görünüyor, işaretleme kaydediliyor mu; Karne'de "DURUŞ" alanı noktalı Ş/İ ile doğru mu; ikinci ölçümden sonra skala ve eğri çıkıyor mu.

**2026-09-19 turu**

- [ ] Sade 5 dk 4-6: tek dokunuşla başlıyor mu; 30 döngü 4/6 sn; her 5 döngüde hatırlatma; bitişte döngü sayısı; `benefits` görünmüyor mu.
- [ ] Rahat Tutma bitişinde ölçüm yönlendirmesi çıkıyor mu, Diyafram → Ölçüm sekmesini açıyor mu; diğer egzersizlerin bitişi değişmedi mi.
- [ ] Çene gevşetme hatırlatıcısı Aralıklı Hatırlatıcılar'da varsayılan kapalı görünüyor mu, açınca bildirim geliyor mu.
- [ ] Torasik ekstansiyon Dinlenme & Denge → Duruş & Sırt'ta listeleniyor, adım adım ilerliyor mu.
- [ ] Dil & İfade → Alıştırma'da tekrar sırası sayacı; yanlış cevaplanan kelimeden sonra artıyor mu.

**Arayüz**

- [ ] Ayarlar'daki anahtarlar: tutamak iki uçta eşit boşlukta mı, açıp kapatırken takılma var mı (özellikle Android).
- [ ] Belagat'ta "Günün Sanatı" sekmesi taşmıyor mu; diğer dört sekmeli ekranlarda etiketler okunur mu.
- [ ] Sekme ikonları: Diyafram (Pratik/Ölçüm/Rehber), Zihin (Bilişsel/Fizyolojik), Konuşma (Alıştırma/Fesahat), Günün Metni (Okuma/Hız & Tahlil) — dar ekranda etiketler taşmıyor mu.
- [ ] Kaydırma göstergesi: uzun ekranlarda sağda çubuk görünüyor mu.
- [ ] Alt boşluk: dört sekmede de son kart yüzen sekme çubuğunun altında kalmıyor mu — jest çubuğu olan ve olmayan cihazda.
- [ ] Alt çubuğun dört sekmeyle görünümü ve her sekmenin degrade zemini.
- [ ] Türkçe büyük harf: "GÜNÜN KELİMESİ", "GÜNLÜK PRATİK", "PROFİLİ DÜZENLE", Karne'de "DİL & İFADE", İlerleme'de "EGZERSİZ" noktalı İ ile mi; hiçbir başlık taşmıyor mu.
- [ ] Profil → Hedef ve tercihler: dört satır basılınca soluyor mu; "Dinî İçerik Modu" satırı Ayarlar'ı açıyor, sağında ok var mı.
- [ ] Profil rengi: fotoğrafla ve fotoğrafsız, iki temada.

**Açılış ekranı**

- [ ] Splash geçişi; yazı figürün altında ortalı, eskisiyle aynı boyda mı (genişlik 134px, arası 21px); "Terakki"nin son 'i' noktası çıkıyor mu.
- [ ] Splash hızı: font beklemesi kalktı, degradeye geçiş eskisinden erken olmalı.
- [ ] Splash süresi **sürüm derlemesinde**: düz yeşil native ekran kısa mı? Uzunsa ayrı madde açılacak.

**Sekmeler ve ekranlar**

- [ ] Bugün: dua ve vecize tek kartta mı; seri kartı ve "Gelişim sekmesine bak" yazısı gitti mi; dinî mod kapalıyken kart hiç çıkmıyor mu. Günün Metni → Okuma'da da aynı birleşik kart.
- [ ] Gelişim: alan listesi 6 satır mı; sıralama hedeflere göre doğru mu; Alışkanlık & Rutin Hatırlatıcılar'ı açıyor mu.
- [ ] İlerleme: üç bölüm (Özet · Seriler · Kayıtlar); Seriler'de yalnız başlanmış modüller satır, başlanmamışlar altta adlarıyla tek satırda; hiçbiri başlanmamışken kart düzgün mü; hepsi başlanmışken özet satırı çıkmıyor mu. Özet kutuları (compact) iki tema ve dar ekranda taşmıyor mu; Egzersiz Geçmişi/Detayı'ndaki kutuların boyutu değişmemiş mi. Gelişim eğrisi verisi yokken bölüm görünmüyor mu.
- [ ] Dört modül ekranında sağ üst çark → panel açılıyor mu; hatırlatma saati değişince bildirim yeni saate kuruluyor mu.
- [ ] Hatırlatıcılar ekranı Gelişim → Alışkanlık & Rutin ve Profil → Hatırlatıcılar'dan açılıyor mu.
- [ ] Dil & İfade: dört sekme, dar ekranda etiketler; öğrenilen/kaydedilen kelimeler uygulama kapanıp açılınca duruyor mu.
- [ ] Günün Kelimesi: Bugün kartında "Öğrendim" → sayaç artıyor mu; hepsi bitince ✓ ve seri Bugün'den çıkmadan güncelleniyor mu.
- [ ] Paylaşılan ilerleme: başka modülü tamamlayıp Bugün / İlerleme / Profil'e dönünce ✓ ve seri yeniden başlatmadan görünüyor mu.

**Oryantasyon**

- [ ] Temiz kurulumda açılıyor, kullanılan cihazda açılmıyor mu; saat seçilince izin isteniyor ve bildirim o saate kuruluyor mu; izin reddinde akış ilerliyor mu; nefes ısınması ekrandan çıkınca duruyor mu; bitince geri tuşu oryantasyona dönmüyor mu; Ayarlar'dan yeniden açılıp geri çıkılınca bir sonraki açılışta tekrar çıkmıyor mu.
- [ ] Hedefler: Bugün listesi ve Gelişim sırası değişiyor mu; Profil → Hedef ve tercihler paneli; "Kısa tur" kartı "Anladım" ile kalıcı kapanıyor mu.

**Depolama (önce yeniden derle — `expo-sqlite` native modül)**

- [ ] Ayarlar → Sistem Bilgileri'nde "Depolama: SQLite"; profil, seriler, ayarlar, kelimeler ve geçmiş derleme sonrası **aynen** duruyor mu; değişiklik uygulama kapanıp açılınca kalıyor mu; `savunma-store/` yedek olarak yerinde mi.
- [ ] Aşama 2: mülakat ve egzersiz geçmişi aynı sırayla mı; yeni kayıt en üstte ve kalıcı mı; silinen kayıt geri gelmiyor mu.
- [ ] Yedek yol: yeniden derlenmemiş eski derleme Metro ile çökmeden "Depolama: Dosya" ile çalışıyor mu.

**Ölçüm**

- [ ] Her test (nefes tutma, kontrol duraklaması, tek nefeste sayma, diyafram izolasyonu, dolgu oranı, nefes/metin, kelime seviyesi) ölçülüp kaydediliyor mu; ikinci ölçümden sonra eğri; koşul/güvenlik notu ölçümden önce.
- [ ] Ölçüme başlama: sayaç/liste testlerinde "başla" düğmesi; ölçüm kaydedildikten sonra kapı kapanmıyor mu.
- [ ] Skala: işaretçi doğru dilimde mi (ör. 16 nefes/dk "Tipik"); Karne'de de görünüyor mu; dar ekran ve iki tema. Kişisel skala tek ölçümde "ikinci ölçümünden sonra" yazısı; bütün ölçümler aynıysa uyarı satırı.
- [ ] Karne: İlerleme'deki düğme ayrı ekranı açıyor mu; "Ölç" doğru ekran + sekme; geri dönünce "N/M testte ölçümün var" güncel mi.

**Bildirimler**

- [ ] Günün kelimeleri hatırlatması Dil & İfade'yi açıyor mu; diğer modül bildirimleri kendi ekranlarını açıyor mu.
- [ ] Aralıklı hatırlatıcılar: bildirim aktif saat aralığında geliyor, gece gelmiyor mu; gün süzgeci çalışıyor mu.
- [ ] Sayaç: bildirime dokununca artıyor mu; kartta "+1"; ertesi gün sıfırlanıyor mu.
- [ ] "Duruş kontrolü" bildirimi Dinlenme & Denge'yi açıyor, sayacı artırıyor mu.
- [ ] Bütçe: 5 modül + "2 günde 1" + birkaç aralıklı hatırlatıcı açıkken iOS'ta sessizce düşen bildirim var mı.
- [ ] Android kanalları: Günlük Pratik, Aralıklı Hatırlatıcılar, Alarmlar ayrı mı; biri sessizken diğerleri geliyor mu.
- [ ] Serbest alarmlar: o saatte çalıyor mu; "her gün" alarmı uygulama açılmadan ertesi gün de çalıyor mu; gün seçimi; silinen/kapatılan alarm susuyor mu. 10 alarm sınırında "ekle" pasif mi; boş etikette "Alarm" yazıyor mu.

**İçerik**

- [ ] Duruş egzersizleri: Duruş & Sırt kategorisi; üç (artık dört) egzersiz adım adım; süreler tutuyor mu.
- [ ] Rahat Tutma — Hazırlık/Geliştirme: 6 ve 12 sn tutma doğru sayılıyor mu; güvenlik uyarısı başlamadan önce okunuyor, kartta kesilmiyor mu.
- [ ] Gün dönümü: uygulama açıkken gece yarısı geçince (ya da arka plandan dönünce) günün kelimesi, metni, dua/vecize ve pratik satırları yenileniyor mu; yarıda kalan mülakatta soru **değişmiyor** mu.
- [ ] Aralıklı tekrar: yanlış cevaplanan kelime testi yeniden açınca ilk sorularda mı; doğru cevaplanan ertesi gün gelmiyor mu; eski kayıtlar çökertmiyor mu.
- [ ] Günün vecizesi: dinî mod açıkken Bugün ve Günün Metni'nde; kapalıyken yok; ertesi gün değişiyor, duayla aynı sıraya düşmüyor mu.

---

## Açık sorular

2026-09-19'da hepsi cevaplandı → KARARLAR → "Kullanıcı karar turu (2026-09-19)".
Açık soru kalmadı.
