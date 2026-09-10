# Kararlar

Verilmiş ve verilmemiş kararlar. Bir karar değiştiğinde burası güncellenir;
gerekçesi de kalır ki aynı tartışma ikinci kez yapılmasın.

---

## Verildi · Uygulamanın adı: **Terakki**

**Karar (2026-09-07):** Uygulamanın adı **Terakki**.

**Neden:** "Terakki" ilerleme, yükselme, gelişme demek — kişisel gelişimin birebir
Türkçe karşılığı. Uygulamanın yedi sütununun (kariyer, diksiyon, belagat, nefes,
zihin, alışkanlık, ölçüm) hepsini kapsıyor ve ölçüm/karne fikriyle de uyumlu.
Eski isimlerin üçü de mülakata kilitliydi; uygulama artık mülakattan ibaret değil.

**Elenenler:** Talim (sıradan, askerî çağrışım), Meleke (ayırt edici ama açıklama
istiyor), Mihenk (ölçümü öne çıkarıyor, egzersiz tarafını anlatmıyor), Pusula
(çok kullanılmış metafor, isim çakışması riski yüksek).

### Yeni kimlikler

| Yer | Değer |
| --- | --- |
| Uygulama adı (`app.json` → `name`) | `Terakki` |
| Expo slug | `terakki` |
| Android paketi | `com.terakki.app` |
| iOS bundle id | `com.terakki.app` |
| npm paket adı | `terakki` |
| Sunucu paketi | `terakki-backend` |
| Repo (hedef) | `terakki` |

### ⚠️ Paket kimliği tek seferlik

`com.savunmamulakat.mobile` → `com.terakki.app` değişimi **yeni bir uygulama** demek:
telefondaki eski kurulum güncellenmez, yan yana ikinci bir uygulama olarak kurulur ve
eski kurulumun verileri (profil, ilerleme, ayarlar) yeni uygulamada görünmez. Uygulama
henüz yayınlanmadığı için bedeli yok — **Play Store'a çıktıktan sonra imkânsız olurdu.**
Eski uygulama telefondan elle silinmeli.

### Uygulandı (2026-09-07)

Kaynak dosyalar önceki turda, native taraf bu turda: `npx expo prebuild --clean`
`android/` ve `ios/`'u `com.terakki.app` ile baştan üretti, `expo run:android`
başarıyla derleyip cihaza kurdu, uygulama çalışıyor. Doğrulanan değerler
[DEVAM.md](DEVAM.md)'de.

Cihazdaki eski kurulumun paket adı beklenen `com.savunmamulakat.mobile` değil,
**`com.savunma.kariyer`** çıktı (sürüm 1.0.18) — telefondaki son kurulum daha
eski bir yapılandırmadan kalmış. Silinecek olan bu.

Kalan iki iş kullanıcı eylemi: GitHub reposunun yeniden adlandırılması
(`gh` CLI bu makinede kurulu değil) ve eski uygulamanın telefondan silinmesi.

---

## Açık · Logo ne olacak

**Soru:** Mevcut logo — kalkan içinde beyin + roket — Terakki adıyla uyumlu mu?

**Neden soru:** Kalkan savunma sanayii amblemi; uygulama "Savunma AI" iken
yerindeydi. Uygulama artık yedi sütunlu bir kişisel gelişim uygulaması ve adı
"ilerleme, yükselme" demek. Kalkan koruma anlatıyor, ilerleme değil.

**Neden bekletilemez:** Bütün ikon işi (Bölüm 8) buna bağlı. Üstelik mevcut
görsel *mavi zemin üzerine beyaz figür* olduğu için şeffaf splash ikonu ondan
**türetilemiyor** — zemini silince beyaz üstüne beyaz kalıyor. Logo ya yeniden
çizilecek ya da zeminden bağımsız, renkli bir figüre dönüştürülecek. Her iki
durumda da önce karar gerekiyor.

**Bağlı olan:** `icon.png`, `splash-icon.png`, `favicon.png`,
`android-icon-foreground.png`, `android-icon-monochrome.png`,
`notification-icon.png` ve ana ekrandaki kalkan ikonu.

---

## Verildi · Splash zemini temaya göre ayrılacak

**Karar (2026-09-07):** Açılış ekranı zemini tek renk olmayacak; açık temada
beyaz, koyu temada `#121214` olacak.

**Neden:** `splash.backgroundColor` şu an `#ffffff`. Koyu tema kullanan biri
uygulamayı her açtığında tam ekran beyaz bir flaş görüyor, ardından arayüz
karartıyor. Marka mavisi de düşünüldü ama açık/koyu geçişinde uygulamanın
kendi zeminiyle uyuşmuyordu.

**Bedeli:** `expo-system-ui` kurulacak ve `app.json`'a ayrı bir koyu tema
yapılandırması girecek. Şu an `userInterfaceStyle: "light"` ayarı da bu paket
kurulu olmadığı için ölü duruyor — ikisi birlikte çözülecek.

**Bağlı:** ikon işiyle aynı turda yapılacak, çünkü ikisi de
`npx expo prebuild --clean` gerektiriyor.

---

## Verildi · Yapay zekâ uygulamayla gelir, ama şart değildir

**Karar (2026-09-08):** Yapay zekâ özelliği kullanıcıdan hiçbir kurulum
istemeden çalışmalı. Aynı zamanda uygulama, yapay zekâ hiç çalışmasa da
**tam** kullanılabilir olmalı.

**Neden:** `DEFAULT_API_BASE_URL` şu an `''`. Yani yeni bir kullanıcı mülakat
analizini görmek için kendi makinesinde Express sunucusu ayağa kaldırıp
telefonu aynı ağa almak zorunda. "Başkaları da kullansın" hedefi bu satırda
duruyordu.

**Elenen seçenek:** kullanıcının kendi API anahtarını girmesi — anahtar almak
için Google hesabı, konsol, fatura kartı adımları var; sıradan kullanıcı
buradan döner.

### Bedavaya nasıl olur — araştırılacak yol

Kurgu şu: mevcut `server/server.ts` proxy'si ücretsiz bir sunucusuz platforma
konur, arkasında Gemini'nin ücretsiz kotası kullanılır. Anahtar sunucuda kalır,
uygulama anahtarı hiç görmez — bugünkü mimari zaten böyle.

⚠️ **Doğrulanmadı.** Aşağıdakiler karar verilmeden önce sınanmalı:

- Ücretsiz kotanın gerçek sınırı ne, ve o sınır **tüm kullanıcılar arasında
  paylaşılıyor** (anahtar tek). Kullanıcı sayısı arttıkça kota biter.
- Sunucusuz platformların ücretsiz katmanları (Cloudflare Workers, Vercel,
  Render vb.) hangi limitlerle geliyor.
- Kötüye kullanım: açık bir proxy'yi herkes çağırabilir. `APP_TOKEN` mekanizması
  sunucuda zaten var ama tek başına yeterli değil; cihaz başına hız sınırı
  gerekiyor.

**Bu yüzden ikinci kural şart:** kota bittiğinde, sunucu kapalıyken ya da ağ
yokken uygulama **bozulmaz**. Yapay zekâ bir bonus katman; günlük pratik,
egzersizler, ölçüm ve karne ona hiç dokunmadan çalışır. Mülakat modülü yapay
zekâsız da soru sorar ve süre tutar, yalnızca analiz kısmı devre dışı kalır.

---

## Verildi · Kullanıcıdan içerik yazması istenmez

**Karar (2026-09-08):** Uygulama kullanıcıya "kendi kurumunu ekle", "kendi
sorularını yaz" gibi içerik üretme işi yüklemez. Alan seçimi **hazır listeden
tek dokunuşla** yapılır.

**Neden:** Önceki öneri, alanı koddan çıkarıp kullanıcıya bırakmaktı. Doğru
teşhis, yanlış çözüm: veri girmek zorunda kalan kullanıcı uygulamayı bırakır.

**Doğrusu:** alan yine koddan çıkar ama **kullanıcıya değil, hazır kataloğa**
gider. Bugün `CompanyId` beş savunma sanayii şirketinden oluşan bir *tip*;
`DEPARTMENTS` üç bölümle sınırlı; `defenseNews.ts` sektöre kilitli. Bunlar
seçilebilir veri hâline gelir, savunma sanayii kataloğun **bir** girdisi olur.
Kullanıcı ilk açılışta yalnızca seçer.

Serbest metin yalnızca **isteğe bağlı** yerlerde kalır (profildeki "Kariyer
Hedefi" gibi) ve boş bırakılabilir — `careerContext()` zaten boşken cümle
kurmuyor.

---

## Verildi · Modüller abartılı vaat vermez

**Karar:** Bir modülün metni ölçtüğü şeyi yazar; karşılığı olmayan iyileştirme
vaadi kurulmaz.

**Neden:** "Akciğer kapasiteni artırır" ve "zekânı geliştirir" tipi cümlelerin
karşılığı yok. Vital kapasite boy/yaş/yapıyla belirleniyor, nefes egzersizleriyle
anlamlı ölçüde artmıyor; bilişsel egzersizler de ağırlıkla çalışılan görevde
iyileşme sağlıyor, genel zekâya transferin kanıtı zayıf.

**Uygulandı (2026-09-06):** koddaki yedi metin düzeltildi — ekrandaki
"Kapasite Testi" → "Kontrollü Veriş Süresi", erişilebilirlik etiketi,
`dailyPracticeProgress` ve `BreathingMode` yorumları, ayarlardaki "seviyeli
kapasite programı", `BrainExercisesScreen` alt satırı ve `exercises.ts`'teki
açıklama + fayda cümlesi.

---

## Verildi · Tasarım: mevcut dili sadeleştir

**Karar:** Yeni bir tasarım dili kurulmuyor. Renkler, bileşenler ve island alt
menü aynı kalıyor; görsel gürültü azaltılıyor.

**Uygulandı (2026-09-06):** `Surface` gölge yerine tek 1px kenarlığa indi, sekme
başlıkları `23px/black` → `22px/semibold`, bölüm etiketleri `11px` → `10px` +
geniş tracking, günlük pratik listesindeki satır ayırıcıları kaldırılıp yerini
boşluk aldı.

### Degrade yönü — denendi, geri alındı

Bir ara degradenin renkli ucu üste alınmıştı (gerekçe: altta içeriğin yoğun
olduğu yeri boyuyor). **Kullanıcı eskisini tercih etti.** Yön geri alındı:
yukarıdan aşağı koyulaşıyor, `locations` yine `[0, 0.4, 1]`. Bunun yerine
doygunluk düşürüldü — alt uç `#bfdbfe` (blue-200) yerine `#dfeafc`, mor ve
yeşil sekmelerde de aynı ölçüde soluk. Yön tartışması kapandı.

---

## Verildi · Koyu tema nötr olacak

**Karar:** Açık tema beyaz + gri tonlarıyla kuruluyorsa koyu tema da siyah + gri
tonlarıyla kurulur. Renk yalnızca vurguda (mavi/mor/yeşil ikon kutuları, sekme
zemini) bulunur; yüzeylerde bulunmaz.

**Neden:** Koyu temada kartlar ve zeminler lacivert tonlarındaydı (`#11182e`,
`#1d2946`, `#090d16`) ve uygulama "koyu" değil "mavi" görünüyordu.

**Uygulandı (2026-09-06):**

```
screenBg     #090d16 → #121214
cardBg       #11182e → #1c1c1f
cardBorder   #1d2946 → #2e2e33
divider      #1c2742 → #2e2e33
body/muted   slate-300/400 → zinc-300/400
iconColor    #94a3b8 → #a1a1aa
```

İlk denemede zemin fazla koyu kaçtı ve bileşenler seçilmiyordu; değerler bir tık
açıldı (yukarıdaki son hâl). Açık temadaki ilişki korunuyor: **kart zeminden açık,
giriş alanı karttan koyu** (`#141417`). Alt menü de zeminden ayrılsın diye
`rgba(38,38,43) → rgba(32,32,37)` aralığında.

Ayrıca `SimulationScreen`, `BrainExercisesScreen`, `TextField`, `Segmented`,
`RoundButton` ve `ActionButton` içindeki gömülü lacivertler nötrlendi.
`ActionButton`'ın soft varyantı sabit indigo yerine artık `toneSoft(tone)`
kullanıyor — ton neyse zemini o.

**Dokunulmayanlar:** `toneSoft`'un mavi/mor/yeşil/amber/rose kutuları ve günlük
pratikteki "tamamlandı" yeşili. Bunlar açık temadaki `bg-blue-50` vb.
karşılıkları — vurgu, yüzey değil.

---

## Verildi · Sunucu adresi koda gömülmez

**Karar:** `DEFAULT_API_BASE_URL` boş. Adres Ayarlar'dan giriliyor.

**Neden:** Gömülü olan `192.168.1.53:3000` yalnızca tek bir makinenin yerel
ağında çalışıyordu; başka herkeste uygulama sessizce bozuk açılıyordu.

---

## Verildi · Bildirim planlaması tek yönlü

**Karar:** Ayarlar kaynak, planlanmış bildirimler türev. `syncReminders()` önce
**yalnızca kendi** kimliklerimizi iptal ediyor, sonra baştan kuruyor.

**Neden:** İki yönlü eşitleme (planlanmışı okuyup ayarla karşılaştırma) her
kenar durumda ayrışıyordu. Tek yön hem basit hem de kullanıcının uygulama dışı
bildirimlerine dokunmuyor.

**Bağlı kurallar:**
- İzin, kullanıcı ana şalteri **açtığında** isteniyor — açılışta değil.
- `Device.isDevice` false ise `'unsupported'` dönüyor ve ayrı mesaj gösteriliyor;
  sessizce başarısız olmuyor.
- Bir modülün bildirimi ancak `notificationsEnabled && module.enabled &&
  module.reminder` üçü birden doğruysa kuruluyor (`reminderActive`).
- Bildirim metni o günün içeriğinden üretiliyor, böylece bildirimle ekran tutuyor.

**Kimlik önekleri kozmetik.** `cancelAllReminders()` planlanmış bildirimleri
kimlik dizesine göre değil `data.kind === 'daily-practice'` alanına göre
süzüyor. Bu yüzden önek `savunma.daily.*` → `terakki.daily.*` yeniden
adlandırması (2026-09-07) hiçbir geçiş planı gerektirmedi.

---

## Verildi · Belagat müfredatı klasik tasnife göre kuruldu

**Karar:** Modül, belâgatın klasik üç kolunu izliyor ve önkoşulu olan fesahati
diksiyon tarafına bağlıyor.

- **Meânî** — sözün hâlin gereğine (*muktezâ-yı hâl*) uygunluğu: îcâz, itnâb,
  takdîm-tehîr, kasr, hazif, fasl-vasl, inşâî üslup.
- **Beyân** — aynı manayı farklı yollarla anlatma: teşbih, teşbîh-i belîğ,
  istiare, mecâz-ı mürsel, kinaye, ta'rîz, teşhis-intak.
- **Bedî'** — lafzın ve mananın süslenmesi: cinas, seci, tıbâk, mukabele,
  hüsn-i ta'lîl, tecâhül-i ârif, mübalağa, tevriye, telmih, irsâl-i mesel,
  tekrîr, aliterasyon.

**Neden fesahat diksiyona bağlı:** Fesahat kusurları (*tenâfür-i hurûf*,
*garâbet*, *ta'kîd*, *kesret-i tekrar*, *za'f-ı te'lîf*) doğrudan telaffuz ve
akıcılık sorunları. Bu yüzden konuşma egzersizi ekranı her gün bir fesahat
kusuru gösteriyor (kusurlu → düzeltilmiş), belagat ekranı ise üç aşamalı
ilerliyor: **öğren → tanı → üret**.

**Bağlı tasarım kuralları:**
- Her sanatın `interviewUse` alanı var — müfredat mülakat pratiğine bağlı.
- Okuma metinleri içerdikleri sanatların id'leriyle etiketli (`belagatArtIds`);
  metni sesli okumak aynı zamanda sanat tanımaya dönüşüyor.
- Günlük seçim `dayIndex` üzerinden **deterministik**: gün içinde uygulama kaç
  kez açılırsa açılsın aynı sanat, aynı metin, aynı egzersiz geliyor.
- Telif: yalnızca kamu malı metinler (Yunus Emre, Fuzûlî, Şeyh Gâlib, Ziya Paşa,
  Kadı Burhaneddin, Nedîm, Mehmet Âkif Ersoy, Atatürk) ve kısa meal/hadis
  aktarımları.

**Kaynaklar:**
- [BELÂGAT — TDV İslâm Ansiklopedisi](https://islamansiklopedisi.org.tr/belagat)
- [BEDÎ' — TDV İslâm Ansiklopedisi](https://islamansiklopedisi.org.tr/bedi--belagat)
- [Belâgatta Meânî İlmi (DergiPark)](https://dergipark.org.tr/tr/download/article-file/543080)
- ["Teşbîh" ve "İstiâre"nin Belâgat Kitaplarındaki Görünümü](https://www.researchgate.net/publication/279171941_Tesbih_ve_Istiarenin_Belagat_Kitaplarindaki_Gorunumu_Uzerine)
- [Nefes Egzersizleri — Diyafram Nefesi (TRT Akademi)](https://www.trtakademi.com/tr/blog/nefes-egzersizleri-diyafram-nefesi-27)
- [Diksiyon Dersleri İçin Nefes Egzersizleri](https://sinemaakademi.com.tr/diksiyon/diksiyon-dersleri-icin-nefes-egzersizleri)

---

## Açık · İki tasarım sistemi birleşecek mi

`src/components/AppUI.tsx` (623 satır) ile `src/components/practice/PracticeUI.tsx`
(295 satır) örtüşen bileşenler taşıyor: `AppScreen`/`ScreenShell`,
`Surface`/`Card`, `ActionButton`/`PrimaryButton`, `SectionLabel`/`SectionTitle`.
16 ekranın 13'ü ikisini birden import ediyor. Renk kaynağı ortak
(`themeTokens`), sorun bileşen ikiliğinde.

Birleştirme 16 ekranda import değişikliği demek — riskli, ayrı bir turda
yapılmalı. Karar: **henüz verilmedi.**

---

## Verildi · Bildirim şalteri hiyerarşisi

**Soru neydi:** `appSettings.reminderFrequency` (`off`/`daily`/`everyOtherDay`)
ile `dailyPracticeSettings.notificationsEnabled` + modül başına `reminder` aynı
konuyu iki yerden yönetiyor. Kullanıcı sıklığı "Kapalı" yaptığında modül
anahtarları ne olacaktı?

**Cevap (2026-09-08):** Karar aslında kodda çoktan verilmiş, yalnızca yazıya
geçmemişti. Okunup doğrulandı:

- `notificationsEnabled` **ana şalter**. Kapalıyken hiçbir modül bildirim kurmaz
  (`reminderActive = notificationsEnabled && module.enabled && module.reminder`).
- Sıklık "Kapalı" seçildiğinde `changeFrequency` yalnızca ana şalteri kapatıyor;
  **modül `reminder` bayraklarına dokunmuyor.** Yani tercihler korunuyor ve
  bildirimler yeniden açıldığında aynen geri geliyor.
- Ekranda görünen sıklık türetilmiş bir değer: ana şalter kapalıysa "Kapalı"
  gösteriliyor, açıksa `reminderFrequency` gösteriliyor (`'off'` ise "Günlük"e
  düşüyor).

Bu davranış doğru; kalıcı hâle getirildi.

### ⚠️ Kalan pürüz: iki kaynak

Aynı gerçeği iki alan tutuyor ve tutarsız kalabiliyorlar. Örnek: sıklık "Kapalı"
iken günlük pratik bölümündeki ana şalter açılırsa `notificationsEnabled = true`
olur ama `reminderFrequency` `'off'` kalır. Ekran "Günlük" gösterir, davranış da
günlüktür — yani **kullanıcıya yansıyan bir hata yok**, çünkü türetme bunu
örtüyor. Ama depolanan değer ekranla çelişiyor.

Temizliği: `reminderFrequency`'den `'off'` seçeneğini kaldırıp sıklığı yalnızca
`daily`/`everyOtherDay` yapmak, açık/kapalıyı tek başına `notificationsEnabled`e
bırakmak. Küçük iş, davranış değişmiyor — Bölüm 00 turunda yapılabilir.
