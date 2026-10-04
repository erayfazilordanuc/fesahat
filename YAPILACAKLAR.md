# 📖 YAPILACAKLAR — Fesahat

**Son güncelleme:** 2026-10-04
**Durum:** Terakki kopyasından Fesahat'a dönüşüm **kaynak tarafında tamamlandı**.
`npx tsc --noEmit` 0 hata. **Hiçbiri cihazda görülmedi** — aşağıdaki "Cihazda
doğrulanacaklar" listesi bu turun çıktısı.

**Kapsam:** Dil, konuşma, anlayış, kavrayış ve iletişim becerileri. Beş ayak +
ikincil belagat; ayrıntı `CLAUDE.md` başındaki tabloda.

**Çevrimdışı çalışır, yapay zekâ isteğe bağlıdır.** Uygulamanın tamamı ağ
olmadan çalışır — bu bir garanti, hedef değil. Üstüne BYOK yapay zekâ katmanı
gelir: anahtar yokken hiçbir parça bozulmaz ve teknik hata mesajı gösterilmez,
yalnızca değerlendirme/üretim katmanı kapalı kalır.

---

## Sıra

1. ⏳ **Cihazda doğrulama turu** — aşağıdaki liste. Kopyalanan kodun bir kısmı
   Terakki'de de doğrulanmamıştı; bulunan hata muhtemelen orada da duruyor.
2. **İçerik doğrulaması** — "Doğrulanacak içerik" bölümü (söz lafızları, TDK
   tanımları, kamu malı metin künyeleri).
3. **Lugat & Türkçe genişlemesi** — ana eksen, hâlâ en çok iş burada.
4. **Yapay zekâ bağlama** — diksiyon ses analizi ve belagat "üret" değerlendirmesi.
5. **Production** — gerçek keystore, store metni, izin temizliği.

---

## ✅ Dönüşümde yapılanlar (2026-10-04)

### Kimlik ve budama

- [x] `app.json`: ad `Fesahat`, slug `fesahat`, `com.fesahat.app` (iOS + Android).
- [x] Depo kimlikleri: `STORE_DIR = 'fesahat-store'`, `DB_NAME = 'fesahat.db'`,
      `AUDIO_DIR = 'fesahat-audio'`, bildirim önekleri `fesahat.*`.
- [x] **Mülakat motoru söküldü**: `companies.ts`, `questions.ts`,
      `defenseNews.ts`, beş mülakat ekranı, `AnalysisScreen`,
      `interviewHistory.ts`, `captureBuffer.ts` ve tüm atıfları.
- [x] **Proxy sunucu yolu söküldü**: `server/` klasörü, `apiBaseUrl` / `appToken`
      ayarları, `geminiClient`'ın sunucu dalı. Yalnızca doğrudan Google (BYOK) kaldı.
- [x] **Kapsam dışı modüller** (kullanıcı kararı: duruş + nefes molası kalsın):
      göz sağlığı egzersizleri, su/ayağa kalk/göz molası hatırlatıcıları, serbest
      alarmlar (`customAlarms`, `alarmPlan`, `alarmNotifications`) ve iş odaklı
      bilişsel egzersizler (`tersine-muhendislik`, `hizli-senaryo`,
      `terim-zinciri`, `mekansal-kurgu`, `zihinden-hesap`) çıkarıldı.
      Kalan bilişsel egzersizlerin içeriği sözel muhakemeye göre yeniden yazıldı.
- [x] Kamera izni kalktı (`blockedPermissions`); mikrofon diksiyon kaydı için kaldı.
- [x] Kullanılmayan bağımlılıklar kaldırıldı (`expo-camera`, `@google/genai`,
      `react-native-rss-parser`, express/cors/dotenv/tsx, `motion`),
      `expo-speech` eklendi.

### Yeni ayaklar

- [x] **Ortak soru modeli** `src/data/quiz.ts` — okuma, dinleme ve sözel setler
      aynı yapıyı paylaşıyor; ikinci bir soru modeli kurulmadı.
- [x] **Anlayış** (`comprehension.ts`): 28 okuma seti (84 soru), 13 dinleme seti
      (39 soru), 12 özetleme alıştırması. Ekranlar: `ComprehensionScreen` (hub),
      `QuizScreen`, `SummaryScreen`.
- [x] **Kavrayış** (`verbalReasoning.ts`): 18 set / 90 soru — analoji, cümle
      tamamlama, bağlamdan anlam, ana fikir, çıkarım, tutarsızlık yakalama.
- [x] **İletişim** (`communication.ts`): 36 senaryo (6 kategori), 14 etkin
      dinleme alıştırması, 45 günün ipucu. Ekranlar: `CommunicationScreen`,
      `CommScenarioScreen`, `ListeningSkillScreen`.
- [x] **Günün sözü** (`sozler.ts`): 49 genel + 21 dinî söz. Dinî mod artık içeriği
      *kapatmıyor*, havuza **ekliyor** (kullanıcı kararı 2026-10-04 → KARARLAR).
- [x] Günün metni havuzu 12 → 35 metne çıktı; `felsefi` kategorisi eklendi.

### Mimari

- [x] Sekmeler: Bugün · **Atölye** · **Karne** · Profil (eski: Gelişim/İlerleme).
- [x] **Atölye beş kart**: Dil · Konuşma · Anlayış & Kavrayış · İletişim ·
      (ileri düzey) Belagat. Birleştirilen alt alanlar kart altındaki **kısayol
      çipleriyle** açılıyor; araçlar (Hatırlatıcılar) ayrı başlık altında.
- [x] İki yeni günlük modül (`comprehension`, `communication`): ayarlar, ilerleme,
      bildirim, Bugün listesi ve Karne kırılımı bağlandı.
- [x] Yeni depolar `createPersistentStore` deseniyle:
      `comprehensionProgress.ts` (beceri kırılımlı doğruluk, özet öz-değerlendirmesi),
      `commProgress.ts` (tamamlanma — doğruluk değil).
- [x] Oryantasyon hedefleri beş ayağa göre yeniden kuruldu.
- [x] Yanıt Defteri'ne **Özet** ve **İletişim** sekmeleri; iki ekran da deftere yazıyor.
- [x] `AiFeedbackCard` — tek bir cevabın değerlendirmesi (özet, iletişim serbest
      cevabı). `AiInsightCard` birikmiş kaydı yorumluyor; ikisi ayrı iş.
- [x] Geçici marka işareti (konuşma balonu + "F") ve tüm ikonlar yeniden üretildi.

---

## ⏳ Cihazda doğrulanacaklar

Hiçbiri telefonda görülmedi. İlk build'de sırayla bak.

### Devralınan, Terakki'de de doğrulanmamış

1. **Uygulama açılıyor mu** — dört native modül (`expo-sqlite`,
   `expo-secure-store`, `expo-clipboard`, `expo-system-ui`) linklendi mi.
2. **SQLite** — Ayarlar → Sistem Bilgileri "Depolama: SQLite" diyor mu.
   ⚠️ Fesahat temiz kurulum olduğu için göç yolu boş çalışacak; yine de şema
   kurulumu doğrulanmalı.
3. **BYOK** — anahtar kaydediliyor, uygulama kapanıp açılınca duruyor, geçersiz
   anahtar kaydedilmeden reddediliyor mu.
4. **Yanıt Defteri + egzersizde yazı girişi** — en az sınanmış kod.
5. **Ses kaydı** — `audio/mp4` MIME değişikliği hiç denenmedi.

### Bu turda yazılan

6. **Atölye beş kart** — kısayol çipleri doğru ekranlara gidiyor mu; modül
   kapatılınca kart ve çipleri kayboluyor mu.
7. **`QuizScreen`** — üç tür (okuma/dinleme/sözel) ayrı ayrı; soru akışı,
   açıklama, tamamlama kartı, kayıt.
8. ⚠️ **Dinlediğini anlama TTS** — `expo-speech` cihazda Türkçe okuyor mu.
   Android'de ses listesi boş dönebiliyor, iOS'ta Türkçe ses kurulu olmayabilir.
   **Yedek yol** (metni göster) gerçekten devreye giriyor mu — bu en kırılgan yer.
9. **`SummaryScreen`** — yazma, kelime sayacı, öz-değerlendirme işaretleme,
   kaydetme; anahtar yokken kartın kapalı hâli.
10. **İletişim akışı** — senaryo seçimi, etki açıklamaları, etkin dinleme üç adımı.
11. **Karne → Anlayış & İletişim bölümü** — kayıt yokken bölüm hiç görünmemeli;
    kayıt varken doğruluk ve tamamlanma doğru sayılmalı.
12. **Bugün listesi** — yeni iki modül bütçeye (`dailyMinutes`) doğru giriyor mu.
13. **Bildirimler** — yeni iki modülün hatırlatması kuruluyor ve doğru ekranı
    açıyor mu; iOS 64 bekleyen bildirim bütçesi (`NOTIFICATION_BUDGET = 56`)
    yedi modülle hâlâ yetiyor mu. ⚠️ Modül sayısı 5'ten 7'ye çıktı, bütçe
    paylaşımı yeniden ölçülmeli.
14. **Yeni ikonlar** — ana ekranda, bildirim çekmecesinde (tek renk silueti
    okunuyor mu) ve açılış ekranında.
15. **Oryantasyon** — beş yeni hedef, ısınma adımı (anlayış/iletişim/belagat
    hedefleri ortak nefes ısınmasına düşüyor — yerine kendi ısınmaları yazılmalı).

### İlk build'in sırası

`app.json` kimliği değiştiği ve native klasör hâlâ Terakki'den geldiği için:

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
npx expo prebuild --clean
npx patch-package          # prebuild sonrası bir kez doğrula
npm run android
```

⚠️ `prebuild --clean` iOS tarafındaki elle yapılmış açılış ekranı
özelleştirmelerini (`SplashScreenBackground.colorset`) ezer; sonra tekrar
uygulanmalı.

---

## 🔍 Doğrulanacak içerik

Yapay zekâ ile üretilen içerikte **kaynak doğruluğu kullanıcı tarafından
sınanmalı.** Hiçbir söz asıl eserden birebir doğrulanmadı (`Soz.verified`
hepsinde `false`).

- [ ] **Günün sözü lafızları** — özellikle Mevlânâ'ya atfedilenler ("Gel, gel,
      ne olursan ol", "Cömertlikte akarsu gibi ol"), Hz. Ali, İmam Şâfiî,
      Sokrates, Zenon, Plutarkhos. Atfı tartışmalı olanlar `author` alanında
      "…'e atfedilir" ile işaretli; doğrulananın `verified` alanı `true` yapılmalı.
- [ ] **Alıntı künyeleri** — Seneca (mektup 114), Konfüçyüs (Analekt 13.3),
      Pascal (Taşra Mektupları 16) numaraları hafızadan yazıldı.
- [ ] **Kutadgu Bilig / Kaşgarlı Mahmud aktarımları** — beyit künyesi yok.
- [ ] **Ziya Paşa "Âyinesi iştir kişinin"** — Terkîb-i Bend'e atfedildi, yeri
      doğrulanmadı.
- [ ] **Günün metni havuzu** — "Fesahat için yazıldı" künyeli özgün metinler
      dışındaki alıntıların lafzı ve kamu malı durumu.
- [ ] **Lugat tanımları** — TDK Güncel Türkçe Sözlük ile karşılaştırılmalı.
- [ ] **Sözel kavrayış: tartışmaya açık sorular** — analoji setindeki
      "Doktor : Hastane :: Öğretmen : ?" ve "Pusula : Yön :: Terazi : ?",
      tutarsızlık setlerindeki simetrik çelişkiler (ressam, yürüyüş).

---

## 1. 📚 Dil & Türkçe (ana eksen) — en çok iş burada

- [ ] Kelime havuzunun büyütülmesi; seviye dengesi (temel/orta/ileri).
- [ ] Doğru Türkçe maddeleri ve deyim/atasözü kataloğunun genişletilmesi.
- [ ] Kelime testleri: anlam, boşluk doldurma, eş/zıt anlam, kök-ek türetme.
- [ ] Aralıklı tekrar (spaced repetition) aralıklarının cihazda sınanması.

## 2. 🎙️ Konuşma

- [ ] **Kayıttan dinleme** — tekerleme ve okuma kaydını geri dinleme
      (`audioStore` hazır, mikrofon izni duruyor).
- [ ] **Yapay zekâ ses analizi** — dolgu kelime sayımı, tempo, duraklama.
      Altyapı hazır (`geminiClient` ses gönderimi); Fesahat'ın işine bağlanmadı.
- [ ] Dolgu kelime avı ölçümünün karneye bağlanması.

## 3. 🧠 Anlayış & Kavrayış

- [ ] **Okuma hızı (WPM)** ölçümünün okuma setleriyle ilişkilendirilmesi.
- [ ] Dinleme setlerinin sayıca artırılması (şu an 13).
- [ ] Soru setlerinde zorluk kademesi — bugün yalnızca sözel setlerde var.

## 4. 💬 İletişim

- [ ] Senaryolarda **serbest cevabın deftere kaydı**: bugün yalnızca seçimden
      *önce* yazılan metin kaydediliyor; sonradan yazılan yalnızca yapay zekâ
      değerlendirmesinde kullanılıyor.
- [ ] Etkin dinleme alıştırmalarının artırılması (şu an 14).

## 5. ✒️ Belagat (ikincil)

- [ ] **"Üret" aşamasının yapay zekâ ile değerlendirilmesi** — bugün
      "Tamamladım" cümleyi deftere yazıyor, doğruluk ölçmüyor (tek doğru yok).
      `AiFeedbackCard` hazır; belagat ekranına bağlanmadı.

## 6. 🤖 Yapay zekâ — bağlanacak işler

- [x] Özetleme değerlendirmesi (`SummaryScreen`).
- [x] İletişim senaryosunda serbest cevap (`CommScenarioScreen`).
- [ ] Belagat "üret" aşaması (Bölüm 5).
- [ ] Diksiyon ses analizi (Bölüm 2).
- [ ] **İçerik üretimi (araştırılacak)** — okuma/dinleme soruları ve sözel setleri
      elle yazmak pahalı. Çözülecek üç şey: determinizm (gün başına bir kez üret,
      yerele yaz), kota (kullanıcının kendi anahtarı), kalite denetimi. Yerel
      havuz her hâlükârda çevrimdışı taban olarak kalır.

## 7. 🎨 UI/UX

- [ ] **Okuma tipografisi** — ayarlanabilir punto (16-26pt), nefes aralıklı satır
      dizilimi.
- [ ] Marka renklerinin (Sıcak Kâğıt `#fcfbf7`) tema belirteçlerine işlenmesi;
      bugün açık tema `bg-slate-50` kullanıyor.
- [ ] Dar ekranlarda taşma kontrolü.

## 8. 🪪 Marka

- [ ] **Nihai logo kararı açık.** Bugünkü işaret (konuşma balonu + "F") geçici.
      Adaylar `assets/brand/adaylar/` altında.

## 9. 📦 Production & Store

- [ ] ⚠️ **Gerçek release keystore** — `android/app/build.gradle` release
      varyantını hâlâ **debug keystore** ile imzalıyor (Expo şablonu varsayılanı).
      Play Store bunu kabul etmez. Kendi keystore'unu üret, `signingConfigs.release`
      tanımla. ⚠️ **Keystore'u kaybetme** — kaybedersen o paket adıyla bir daha
      güncelleme yayınlayamazsın. Şifresi ve yedeği repoya **girmez**.
- [ ] `eas.json` Android APK/AAB yapılandırması.
- [ ] Store metni ve ekran görüntüleri: eksen **dil & Türkçe**, ikincil belagat.
      Yapay zekâ **isteğe bağlı özellik** olarak anlatılır ("kendi anahtarınla
      açılır"), çevrimdışı çalıştığı ayrıca yazılır.
- [ ] İzin açıklamaları: mikrofon yalnızca kayıttan dinleme yapılacaksa kalsın.

---

## Bilinen izler

- `expo-av` deprecated (SDK 54'te çalışıyor) → `expo-audio` geçişi.
- `Segmented`'in seçili seçeneği açık temada `shadow-sm` alıyor; NativeWind her
  seçimde "components … will remount" uyarısı basıyor. Görsel aksama yok.
- Tema değişimi tüm ağacı yeniden render ediyor (`useThemeTokens` her bileşende
  bağlama abone).
- `ActionButton` `accessibilityLabel` almıyor; etiket metinden okunuyor.
- `SectionLabel` içinde CSS `uppercase` var — Türkçe 'i' sorunu. Çağıran yerler
  metni zaten büyük yazıyor, ama küçük harfle verilirse bozulur.
- `ProgressBar` yalnızca `blue`, `violet`, `emerald` tonlarını destekliyor.
- Özet "Tamamladım" sonrası kilitleniyor; düzeltme yolu yok.
