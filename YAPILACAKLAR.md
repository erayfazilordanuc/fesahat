# Yol Haritası

Son güncelleme: 2026-09-09

Bu dosya uygulamanın **nereye gittiğini** anlatır: eklenecek özellikler, hangi sırayla
geleceği ve her birinin ne vaat edip ne vaat etmediği. Kod değil, karar defteri.

---

## Vizyon

Uygulama bir mülakat simülatörü olarak başladı. Hedef, onu **kişisel gelişim
uygulamasına** dönüştürmek — kariyerden diksiyona, nefesten zihne kadar tek çatı altında.

Tek soru etrafında kuruluyor: **"bugün kendini nerede geliştirdin?"**

### Sütunlar

| Sütun | Kapsam | Durum |
| --- | --- | --- |
| **Kariyer & Mülakat** | Simülasyon, yapay zekâ analizi, geçmiş, sektör haberleri | ✅ Var → Bölüm 3 ile genişleyecek |
| **Konuşma & Diksiyon** | Artikülasyon, tekerleme, vurgu-tonlama, tempo, dolgu kelime avı | ✅ Var → Bölüm 6 |
| **Dil & İfade (Belagat)** | Meânî / beyân / bedî' müfredatı, öğren → tanı → üret | ✅ Var → Bölüm 7 |
| **Dinlenme & Denge** | Diyafram programları, nefes kontrolü, 20-20-20 göz dinlendirme | ✅ Var |
| **Zihin & Odak** | Bilişsel lob haritası, mantık, hafıza, mekan egzersizleri | ✅ Var |
| **Alışkanlık & Rutin** | Aralıklı hatırlatıcılar, serbest alarmlar, günlük sayaçlar | ❌ Yok → Bölüm 4 |
| **Ölçüm & Karne** | Kişisel testler, ilerleme geçmişi, seviye tespiti | ❌ Yok → Bölüm 5 |

### Ortak ilkeler

Her yeni modül bunlara uyacak — istisna yok:

1. **Kapatılabilir.** Ayarlardan kapatılan modül ne kart gösterir ne bildirim kurar.
2. **Günlük bir işi var.** "Bugün ne yapmalıyım" sorusunun tek satırlık cevabı olmalı.
3. **Ölçülebilir.** Serisi, skoru ya da süresi tutulur; yoksa modül değil, içeriktir.
4. **Abartmaz.** Ölçtüğü neyse onu yazar. "Kapasiteni artırır", "zekânı yükseltir" gibi
   karşılığı olmayan cümleler kurulmaz — bu kural bölüm bölüm aşağıda uygulanmış durumda.

### Sıra

00. ✅ **Genele açılma & AI Esnekliği** (Bölüm 00) — Yapay zekâsız %100 çalışma, kırılganlık korumaları.
0. ✅ **Gezinme mimarisi** (Bölüm 0) — Dört sekme (Bugün, Gelişim, İlerleme, Profil).
0.1 **Uygulamaya Isındırma & Oryantasyon Modülü** (Bölüm 0.1) — Duolingo tarzı ilk açılış ve mikro-pratik akışı.
0.2 ✅ **İlerleme & Profil Sekmeleri UI/UX İyileştirmeleri** (Bölüm 0.2) — Seriler 2 satırlı (2x2) ızgaraya, geçmişler tek satırda yan yana butonlara dönüştürüldü; ekran büzülerek alttaki geçmişlerin kaydırmaya gerek kalmadan tek bakışta görünmesi sağlandı. Profil hedefleri ve rozet vitrini tamamlandı.
0.3 ✅ **Modül Ayarlarının Modül İçlerine Taşınması** (Bölüm 0.3) — Ayarlar ekranı genel tercihlere indirgendi; modül içi ayar kontrolleri ilgili ekranlara taşındı.
0.4 **SQLite Veritabanı Geçişi & Katalog Mimarisi** (Bölüm 0.4) — `expo-sqlite` ile offline soru, tekerleme, metin kataloğu ve geçmiş veri yönetimi.
0.5 **Oyunlaştırma & Liderlik Tablosu (Gamification & Leaderboard)** (İleride Değerlendirilecek) —
   * ⚠️ **Mimarî ve Felsefî Uyarı:** Uygulama öz-farkındalık ve çevrimdışı (offline-first) ilkelerine dayanır. Global rekabet tabloları; (1) Sunucu ve kimlik doğrulama bağımlılığı getirir, (2) Nefes ve okuma hızı gibi öz-ölçümlerde hileye ve sahte skor yarışına yol açıp pratiğin amacını bozabilir. Küresel sıralama yerine **Kişisel Rekorlar (Öz-Rekabet)** veya yerel kıyaslamalar tercih edilmelidir.
1. ✅ **Kimlik: logo ve ikonlar** (Bölüm 8) — "Kademe" logo kararı ve `tools/icon-forge/build_app_assets.py` ile tüm ikon türetmeleri tamamlandı.
2. **Ölçüm & Karne** (Bölüm 5) — İlerleme sekmesi derinleştirmesi.
3. **Alışkanlık & Rutin** (Bölüm 4) — Bildirim ve hatılatıcı altyapısı genişlemesi.
4. **Kariyer, Diksiyon, Belagat genişlemeleri** (Bölüm 3, 6, 7).

---

## 00. Genele açılma — uygulamanın en temel dönüşümü

**Hedef:** Uygulamayı yalnızca yazarının değil, herkesin kullanabileceği hâle
getirmek — genele hitap eden bir yüz, isteyene açılan bir derinlik.

**İlke:** *sistemi uygulama versin, alanı katalog versin.* Motor (günlük pratik,
ölçüm, seri, bildirim, egzersiz altyapısı) zaten alan-bağımsız; sorun içeriğin
koda gömülü olması. Alan koddan çıkar ama **kullanıcıya değil hazır kataloğa**
gider — kullanıcı yazmaz, seçer. Gerekçe [KARARLAR.md](KARARLAR.md)'de.

### Bugün nerede takılıyor

| Bulgu | Yer |
| --- | --- |
| Uygulama hiçbir sunucuyla gelmiyor | `appSettings.ts` → `DEFAULT_API_BASE_URL = ''` |
| Kurumlar bir **tip** olarak sabit | `companies.ts` → `CompanyId = 'aselsan' \| 'roketsan' \| ...` |
| Bölümler üçle sınırlı | `questions.ts` → `DEPARTMENTS` (yazilim, arge, ik) |
| Haber akışı sektöre kilitli | `defenseNews.ts` |
| İlk açılış akışı hiç yok | — |

Sonuç: uygulama açılışta kullanıcının savunma sanayii adayı olduğunu
**varsayıyor**.

### Aşamalar

**1 · Yapay zekâyı kurulumsuz ve kırılgan olmayan hâle getir**

İki çıktısı vardı; **ikincisi yapıldı (2026-09-08)**, birincisi kararı bekliyor.

*a) Yapay zekâsız da tam çalışma* — ✅ **yapıldı**

Yeni `src/utils/aiAvailability.ts` tek kaynak: `aiAvailable()` / `useAiAvailable()`
ve ortak `AI_UNAVAILABLE_HINT` metni. Yapay zekâ isteyen her yer artık çağrıyı
yapıp hatayı yakalamak yerine önce buraya soruyor.

- `AnalysisScreen` kapalıyken çağrıyı hiç denemiyor; "Değerlendirme kapalı"
  diyen nötr bir durum gösteriyor. Eskiden kullanıcı şunu görüyordu:
  *"Sunucu adresi tanımlı değil. Ayarlar → Backend API Adresi alanını
  doldurun."* — son kullanıcıya söylenecek bir cümle değil, üstelik uygulamayı
  yeni kuran **herkes** bunu görüyordu.
- `AiInsightCard` (iki geçmiş ekranının paylaştığı kart) düğmeyi baştan kapalı
  gösteriyor, nedenini sade dille yazıyor. Kart gizlenmiyor ki özelliğin
  varlığı bilinsin.
- Doğrulandı: mülakat kaydı `addSession` ile **analizden önce** diske yazılıyor,
  yani yapay zekâ hiç çalışmasa da kayıt kaybolmuyor; `RecordedSession.analysis`
  zaten isteğe bağlı ve geçmiş ekranı "Analiz yok" rozetiyle çiziyor.

*b) Kurulumsuz çalışma* — ⏳ kararı verildi, yolu doğrulanmadı. Ücretsiz kota ve
sunucusuz barındırma sınırları ölçülecek (ayrıntı KARARLAR'da).

**2 · Alanı kataloğa taşı**

- `CompanyId` birleşim tipi → serbest kimlik + hazır katalog. Savunma sanayii
  kataloğun bir girdisi olur, tipin tamamı değil.
- `DEPARTMENTS` aynı şekilde genişler.
- Haber akışı sektör parametreli olur.
- Kullanıcı hiçbir şey **yazmaz**; ilk açılışta seçer.
- ⚠️ Alan varsayımı yalnızca veri dosyalarında değil, **yapay zekâ istemlerinde**
  de var: `AnalysisScreen` prompt'u "Sen Türk savunma sanayii firmalarında görev
  yapmış kıdemli bir mülakat kurulu üyesisin" diye başlıyor. Katalog seçimine
  göre üretilmeli.

**3 · İlk açılış**

Üç adım, hepsi tek dokunuşluk: neyi geliştirmek istiyorsun (sütunlar) → hangi
alan (katalog) → hatırlatma saati. Yeni state deseni açılmaz, mevcut store'lara
yazar. Uygulamayı "yazarının uygulaması" olmaktan çıkaran asıl adım budur.

**4 · Gezinme** — Bölüm 0'daki dört sekme.

**5 · Modül derinliği** — her sütunun sade bir yüzü, bir de "daha ileri" yüzü.

### Sıra neden böyle

Sekmeleri (Bölüm 0) yeniden dizip içine yine savunma sanayii varsayımı koymak
işi iki kez yapmak olur; o yüzden alan katmanı gezinmeden önce geliyor. Yapay
zekâ da en başta, çünkü "yapay zekâsız da çalışır" kuralı diğer üç aşamanın
tasarımını etkiliyor.

### Derinlik kaybolmuyor

Yedi sütun bağımsız açılıp kapanıyor. Sadece nefes + okuma açan tutarlı ve
küçük bir uygulama görür; hepsini açan bugünkü derinliği görür. "Genele hitap"
varsayılandan, "içi dolu" talepten geliyor — ikisi çelişmiyor.

---

## 0. Gezinme mimarisi

**Karar tarihi:** 2026-09-08. Kararlar verildi, uygulanıyor.

### Neyi düzeltiyoruz

| Sorun | Bugünkü hâli |
| --- | --- |
| Giriş ekranı mülakat | `SimulationScreen`'in **en büyük öğesi** "Günlük Mülakata Başla"; asıl günlük pratik listesi en altta |
| Mülakat sistemin dışında | Dört günlük pratik modülü var (`dailyText`, `diaphragm`, `speech`, `belagat`); mülakat bunlardan biri değil, ayrıcalıklı duruyor |
| Tek sütun sekme kapmış | "Egzersizler" sekmesi yalnızca Zihin & Zekâ'yı gösteriyor; konuşma, belagat, nefes, alışkanlık, ölçüm alt ekranlarda gizli |
| Ölçüm dili mülakat merkezli | Profilde iki istatistik kutusu (Mülakat, Egzersiz) ve grafikte iki seri; metin, nefes, konuşma, belagat hiç görünmüyor |
| Ekran iki iş yapıyor | `SimulationScreen` = günün duası + üç mülakat girişi + günlük pratik listesi |

### Sekmeler

```
┌────────┬─────────┬──────────┬────────┐
│ Bugün  │ Gelişim │ İlerleme │ Profil │
└────────┴─────────┴──────────┴────────┘
```

| Sekme | İşi | Nereden geliyor |
| --- | --- | --- |
| **Bugün** | "Bugün ne yapmalıyım" sorusunun tek ekranlık cevabı: günlük pratik listesi, seri, günün duası (açıksa) | `SimulationScreen`'in pratik yarısı |
| **Gelişim** | Yedi sütunun hub'ı. Her sütun bir kart; mülakat da bunlardan **biri** | Yeni ekran; `BrainExercisesScreen` sekmeden karta iner |
| **İlerleme** | Yedi sütunun tamamının ölçümü: seriler, test eğilimleri, mülakat ve egzersiz geçmişi | `ProfileScreen`'in ölçüm yarısı |
| **Profil** | Yalnızca kimlik ve ayarlar | `ProfileScreen`'in kalanı |

⚠️ **"Gelişim" ile "İlerleme" anlamca yakın.** Adlandırma bilerek seçildi; ayrımı
alt başlık ve ikon taşıyacak. Gelişim = *ne çalışacağım*, İlerleme = *ne kadar
yol aldım*. Alt başlıklar bunu açıkça söylemeli, kullanıcı tahmin etmemeli.

### Mülakatın yeri: yalnızca hub

**Karar:** mülakat günlük pratik modülü **olmayacak**. Bugün listesinde
görünmez; Gelişim sekmesindeki "Kariyer & Mülakat" kartından açılır.

Sonucu: mülakat alışkanlığı kurmak isteyen için günlük hatırlatıcı olmuyor.
Kabul edildi — uygulama artık mülakat uygulaması değil, mülakat bir sütun.

### Gelişim hub'ının içeriği

| Kart | Açtığı yer | Durum |
| --- | --- | --- |
| Kariyer & Mülakat | yeni `InterviewScreen` (günlük mülakat, özelleştirilmiş, sektörel gelişmeler, geçmiş) | `SimulationScreen`'den ayrılacak |
| Konuşma & Diksiyon | `SpeechExerciseScreen` | var |
| Dil & İfade | `BelagatExerciseScreen` + `DailyTextScreen` | var |
| Nefes & Beden | `DiaphragmExerciseScreen` | var |
| Zihin & Zekâ | `BrainExercisesScreen` | var, sekmeden karta iniyor |
| Alışkanlık & Rutin | `RemindersScreen` | Bölüm 4'te yazılacak |
| Ölçüm & Karne | İlerleme sekmesine kısayol | Bölüm 5 |

Sektörel gelişmeler (savunma sanayii haberleri) **kalıyor** — Kariyer & Mülakat
sütununun altında.

Kapalı modüller hub'da da görünmez.

### İlerleme sekmesi: yedi sütunun hepsi

Bugünkü iki kutu + iki seri yetersiz. İlerleme, uygulamanın **ölçtüğü her şeyi**
gösterir: modül serileri, test eğilimleri (`TestTrend`), mülakat geçmişi,
egzersiz geçmişi. Mülakat artık ayrıcalıklı bir yer tutmuyor.

### Yapılacaklar

1. ✅ `SimulationScreen` ikiye ayrıldı → `TodayScreen` + `InterviewScreen`, sonra silindi.
2. ✅ `GrowthScreen` (Gelişim hub'ı) yazıldı — yedi sütun, kapalı modüller
   görünmüyor, henüz yazılmamış ikisi (Alışkanlık & Rutin, Ölçüm & Karne) kilitli.
3. ✅ `ProgressScreen` (İlerleme) yazıldı; seriler + test eğilimleri + kariyer/zihin
   kutuları + gelişim eğrisi + geçmiş girişleri.
4. ✅ `ProfileScreen` kimlik + ayarlara indi.
5. ✅ `App.tsx` sekmeler dörde çıktı; `BrainExercisesScreen` ve yeni
   `InterviewScreen` stack ekranı oldu. Dört sekmenin ortak kalıbı `TabItem`
   bileşenine çıkarıldı.
6. ✅ `BackgroundVariant` güncellendi. Uyarı yerindeydi: tip değişince TypeScript
   iki yeri birden yakaladı (`ScreenBackground` varsayılan bağlamı ve
   `App.tsx`'teki `useState`). Sessiz düşme olmadı.
7. ⏳ Ana sekmenin ikonu artık `Sunrise`; nihai hâli logo kararıyla gelecek (Bölüm 8).

### Cihazda doğrulanmayı bekliyor

Telefon takılı olmadığı için görsel doğrulama yapılamadı. Bakılacaklar:
alt çubuğun dört sekmeyle görünümü, her sekmenin degrade zemini, Gelişim'deki
kilitli kartlar, İlerleme'nin boş durumları.

### Dokunulmayacak

Bildirim yönlendirmesi (`data.screen` → `DiaphragmExercise`, `SpeechExercise`,
`BelagatExercise`, `DailyText`) stack ekranlarına gidiyor, sekme yapısına bağlı
değil. Yeniden düzenlemede bozulmaz ama iş bitince bir kez sınanmalı.

---

## 0.1. Uygulamaya Isındırma & Oryantasyon Modülü (Duolingo Tarzı Isındırma Akışı)

**Karar:** Uygulamayı ilk kez açan kullanıcının karmaşık sekme ve egzersiz seçenekleriyle doğrudan baş başa kalmasını engellemek; Duolingo ve benzeri başarılı kişisel gelişim uygulamalarında olduğu gibi, ilk 60 saniyede kullanım amacını netleştirip "ilk zaferini" (First Win & 1 Günlük Seri) elde etmesini sağlamak.

### Neden Gerekli? (Araştırma & Emsaller)

- **Duolingo Akışı**: Kullanıcıyı ilk açılışta uzun kayıtlara ve formlara yönlendirmez. 3 basit mikro-soru sorar (*"Ne öğrenmek istiyorsun?", "Günde kaç dakika?", "Hatırlatıcı saatin?"*), ardından hemen **10-20 saniyelik etkileşimli bir mikro pratik** yaptırır. Kullanıcı ana ekrana geldiğinde ilk gün serisi başlar ve sistemin değerini anlar.
- **Blinkist / Elevate / Headspace**: Kullanıcıyı katalog sayfalarında yalnız bırakmaz. Seçilen 1-2 alana göre dinamik **"Günün Isındırma Paketi"** hazırlar.
- **Bilişsel Yükü Azaltma**: Uygulamamız 7 ayrı sütun (Kariyer, Diksiyon, Belagat, Nefes, Zihin vb.) barındırdığı için, ilk açılışta oryantasyon olmadan giren kullanıcı uygulamayı terk edebilir. Isındırma modülü uygulamayı "anlaşılır ve alışkanlık yapıcı" kılar.

### Modül Akışı & Bileşen Tasarımı

1. **Adım 1: Hedef & İlgi Alanı Seçimi (3 Dokunuşluk Oryantasyon)**
   - **Odak Alanı**: Neyi geliştirmek istiyorsun? (*Kariyer & Mülakat, Diksiyon, Belagat, Nefes & Denge, Odak & Zihin*).
   - **Günlük Taahhüt**: Günde kaç dakika ayırabilirsin? (*3 dk / 5 dk / 10 dk*).
   - **Hatırlatıcı Zamanı**: Günün hangi diliminde pratik yapacaksın? (*Sabah / Öğle / Akşam*).

2. **Adım 2: 60 Saniyelik İlk Isındırma Pratiği (Interactive First Win)**
   - Seçilen alana göre anında interaktif mikro pratik başlatılır:
     - *Diksiyon:* 1 tekerleme kartı veya hızlı artikülasyon testi.
     - *Nefes:* 30 saniyelik 4-6 diyafram nefesi çemberi.
     - *Kariyer:* 1 kriz yönetimi veya STAR tekniği sorusu.
   - Bitişte: Rozet animasyonu ve **"1 Günlük Seri Başladı! 🎉"** kutlaması.

3. **Adım 3: Kişiselleştirilmiş Ana Sayfa (`TodayScreen`) & Mikro İpucu Turu**
   - Kullanıcının oryantasyonda seçtiği sütunlar `TodayScreen`'de üst sıraya alınır.
   - 4 sekme (Bugün, Gelişim, İlerleme, Profil) üzerinde 4 adımlı hafif, rahatsız etmeyen ipucu balonları (contextual tooltips) gösterilir.

### Teknik Yapı & Entegrasyon Planı

- **Store & State**: `dailyPracticeSettings` içinde `onboardingCompleted: boolean`, `userGoals: string[]`, `dailyTargetMinutes: number`.
- **Ekran / Akış**: `src/screens/OnboardingScreen.tsx` modal veya stack ekranı.
- **Giriş Kontrolü**: `App.tsx` yüklenirken `onboardingCompleted === false` ise ana sekmeler öncesi `OnboardingScreen` tetiklenir.

---

## 0.2. İlerleme & Profil Sekmeleri UI/UX İyileştirmeleri

**Karar:** İlerleme sekmesindeki boşluk/bozuk görünüm hissini ve Profil sekmesindeki aşırı boşluğu gidermek; her iki sekmenin görsel dengesini, içerik kalitesini ve doluluğunu artırmak.

### Neden Gerekli? (Sistem İncelemesi & Bulgular)

1. **İlerleme Sekmesi (`ProgressScreen.tsx`) Üst Boşluk & Boş Durum Sorunları**:
   - `TabHeader` altındaki ilk `SectionLabel` bileşeni kendi içinde varsayılan `mt-7` (28px) taşıyor. Ekran kodunda üstüne ekstra `<View className="mt-1">` eklenince `TabHeader` açıklaması ile ilk başlık arasında gereksiz büyük bir boşluk oluşuyor.
   - Henüz hiçbir pratik yapılmadığında `SERİLER` boş duruma geçiyor, `ÖLÇÜMLER` tamamen gizleniyor ve `Gelişim Eğrisi` tek satırlık gri bir kutuya düşüyor. Sayfa bu haliyle terkedilmiş/bozuk görünüyor.

2. **Profil Sekmesi (`ProfileScreen.tsx`) Aşırı Boşluk Sorunu**:
   - Ölçüm ve geçmiş ögeleri İlerleme sekmesine taşındıktan sonra Profil ekranı yalnızca tek bir kullanıcı avatar/isim kartından ibaret kaldı (%85 boş alan).
   - Kullanıcının kazanımlarını, günlük hedeflerini veya uygulama tercihlerini görebileceği zengin bir kontrol paneli (Dashboard) eksik.

### Modül Akışı & Bileşen Tasarımı

#### 1. İlerleme Sekmesi (`ProgressScreen.tsx`) İyileştirmeleri
- **Header Boşluğu**: İlk `SectionLabel` üzerindeki ekstra üst marj sıfırlanacak, `TabHeader` ile ilk içerik arasındaki dikey mesafe sıkılaştırılacak.
- **Dengeli Boş Durumlar (Graceful Empty States)**:
  - Hiç seri olmasa bile 4 modül (Günün metni, Diyafram nefesi, Konuşma egzersizi, Belagat) pasif/gri kartlarla listelenecek (ör. *"0 Gün - Henüz Başlanmadı"*), sayfa çökük görünmeyecek.
  - Ölçüm ve Grafik alanına rehber niteliğinde taslak çizgi (Placeholder Chart & Test Prompts) yerleştirilerek kullanıcının ilk testini yapması teşvik edilecek.

#### 2. Profil Sekmesi (`ProfileScreen.tsx`) İyileştirmeleri
- **Günlük Hedef & Tercihler Kartı**: Kullanıcının seçtiği günlük hedef süre (ör. *5 dk/gün*), aktif hatırlatıcı durumu ve odaklandığı ana gelişim sütunları.
- **Kazanımlar & Rozet Vitrini (Milestones / Badges)**:
  - *"İlk Mülakat"*, *"7 Günlük Seri"*, *"Nefes Ustası"*, *"Diksiyon Çırağı"* gibi rozetler ve kilitli başarı simgeleri.
- **Hızlı Erişim Kartları**:
  - Bildirim ve Hatırlatıcı Yönetimi kısayolu.
  - Yapay Zekâ & Çevrimdışı Çalışma Durumu (Offline AI Status indicator).
  - Hakkında, Sürüm (v1.0.0) ve Geri Bildirim kartları.

---

## 0.3. Modül Ayarlarının Modül Ekranlarına Taşınması

**Karar:** Genel `SettingsScreen` (Ayarlar) ekranını aşırı kalabalıktan kurtarmak; modüle özel tüm detaylı tercihleri ilgili egzersiz/modül ekranlarının içerisine taşımak.

### Neden Gerekli? (UX İncelemesi)
- Şu an `SettingsScreen` tek bir dev dosya halinde tüm modüllerin tercihlerini (Diyafram seviyesi/modu, Konuşma tekerleme & dolgu şalterleri, Belagat dal seçimi, Günün metni kaynağı) içeriyor.
- Kullanıcı egzersiz ekranındayken (*ör. Nefes veya Diksiyon*) seviye veya çalışma modunu değiştirmek istediğinde egzersizden çıkıp Profil → Ayarlar'a gitmek zorunda kalıyor.

### Yapılacak Düzenlemeler
1. **Genel Ayarlar Ekranı (`SettingsScreen.tsx`)**:
   - Sadece **Uygulama Geneli** ayarları barındıracak: Tema (Açık/Koyu/Sistem), Bildirim İzinleri & Ana Şalter, Backend AI Sunucu Adresi, Dini İçerik Şalteri.
2. **Modül Ekranlarına Ayar İkonu & Paneli**:
   - `DiaphragmExerciseScreen`: Sağ üst çark ikonu veya modül içi kart ile Çalışma Biçimi (Günlük/Gelişim) ve Seviye (1/2/3) seçimi.
   - `SpeechExerciseScreen`: Tekerlemeler ve Dolgu Kelime Avı aktiflik ayarları.
   - `BelagatExerciseScreen`: Çalışılacak kol seçimi (Meânî, Beyân, Bedî').
   - `DailyTextScreen`: Metin kaynağı seçimi (Dinî, Edebî, Hitabet, Karışık).

---

## 0.4. SQLite Veritabanı Altyapısına Geçiş (`expo-sqlite`)

**Karar:** Mevcut basit JSON dosya kalıcılığından (`expo-file-system` / `storage.ts`), büyük veri ölçeklenmesi, hızlı kategorik arama ve performans için `expo-sqlite` ilişkisel veritabanı yapısına geçmek.

### Neden Gerekli? (Mimari İnceleme)

- **Şu Anki Durum**: Ayarlar, seriler ve mülakat geçmişi `JSON.stringify` ile tekil `.json` dosyalarına yazılıyor (`readJson` / `writeJson`). Küçük veriler için hızlı ve bağımlılıksız olsa da, veri hacmi büyüdükçe sınırları var.
- **Neden SQLite (`expo-sqlite`)?**:
  1. **Katalog & İçerik Arama (Bölüm 00.2)**: Savunma/genel mülakat soruları, diksiyon tekerlemeleri, meânî/beyân/bedî' soru bankası ve okuma metinleri büyüdüğünde hepsini belleğe yüklü JSON olarak almak yerine SQLite ilişkisel tablolarında indeksli tutmak %100 çevrimdışı ve çok daha hızlı çalışır.
  2. **Gelişmiş Geçmiş & İstatistik Sorguları (Bölüm 5)**: Zaman serisi verileri (tüm mülakat analizleri, egzersiz kayıtları, günlük test sonuçları) binlerce kayıta ulaştığında `GROUP BY`, tarih aralığı filtreleme ve ortalama hesapları SQLite ile anında yapılır.
  3. **Tam Metin Arama (FTS5)**: Soru bankası veya metinler içinde anında kelime araması yapabilme.

### Veritabanı Şeması & Geçiş Planı

- `settings` tablosu (Key-Value)
- `sessions` tablosu (Mülakat oturumları & AI analiz sonuçları)
- `exercise_logs` tablosu (Bilişsel & fizyolojik egzersiz geçmişi)
- `test_results` tablosu (Ölçüm & karne test verileri)
- `catalog_questions`, `catalog_drills` tabloları (Offline hazır katalog)
- İlk aşamada mevcut JSON verilerini SQLite'a aktaran otomatik göç (migration) script'i.

---

## 1. Nefes & Beden

**Amaç:** mevcut diyafram modülü nefesin *nereden* alındığını öğretiyor; bu bölüm nefesin
**nasıl yönetildiğini** çalıştırıyor — verişi uzatmak, sabit basınçta tutmak, cümleyi
kalan nefese sığdırmak, baskı altında toparlanmak.

### Ne yapar, ne yapmaz

**Yapmaz — akciğerini büyütmez.** Vital kapasite büyük ölçüde boy, yaş, cinsiyet ve
yapıyla belirleniyor; nefes egzersizleriyle akciğer hacmi anlamlı biçimde artmıyor.
Solunum kaslarının **gücü** artırılabilir, ama bunun yolu dirençli bir cihazla yapılan
inspiratuar kas antrenmanı — telefon uygulamasıyla olmaz.

**Yapar:** verişin kontrolü, nefesin cümleye bölünmesi, baskı anında toparlanma, solunum
kaslarında bir miktar dayanıklılık.

Bu yüzden modülün adında "kapasite" geçmiyor ve uygulama içinde de geçmeyecek.

### Eklenecek egzersizler

"Ne yapar" sütunu abartısız yazıldı; uygulamadaki açıklama metinleri de bunu kullanacak.

| Egzersiz | Ne yapar (gerçekte) | Ölçüm |
| --- | --- | --- |
| **Büzük dudak nefesi** | Burundan 2 sn al, dudakları büzüp 4 sn ver. Verirken hava yollarında hafif geri basınç oluşturur; küçük hava yollarının erken çökmesini ve hava hapsini azaltır. Kapasite artırmaz — boşaltmayı ve veriş kontrolünü iyileştirir. Kanıt tabanı KOAH / pulmoner rehabilitasyon. | Tur sayısı |
| **Kaburga genişletme** | Eller yan kaburgalarda, nefesi yanlara doğru genişleterek al. Göğüs kafesi hareketliliği ve nefesin nereye gittiğinin farkındalığı. Akciğeri büyütmez. | Tur sayısı |
| **Uzatılmış tutma** | Tam al → 3-5 sn tut → yavaş ver. Alma sonunda kalma toleransı, göğüs duvarı esnekliği. Klinikte ameliyat sonrası atelektazi önlemede kullanılıyor; sağlıklı kişide hacim artırmaz. | Tutma süresi (sn) |
| **Basamaklı alma** | 3-4 kısa nefesle kademeli doldur, tek seferde ver. İnspiratuar rezervi hissettirir. Sağlıklıda farkındalık egzersizi. | Basamak sayısı |
| **Maksimum fonasyon süresi (MPT)** | Tek nefeste sabit "aaa" / "sss". Akciğer hacmi ölçüsü **değil** — hem hacim hem ses tellerinin kapanma verimi karışıyor. Diksiyon için anlamlı, kapasite için dolaylı. | Süre (sn) |
| **Kontrol duraklaması** | Nefes ihtiyacına dayanma eşiği. Ölçtüğü şey akciğer değil, refleks toleransı ve alışkanlık. Popüler ölçütlerin (BOLT vb.) sağlık göstergesi olarak kanıtı zayıf — "kapasite skoru" diye sunulmayacak. | sn |
| **Sayarak verme** | Kontrollü verişin konuşmaya çevrilmiş hâli; diksiyona bağlanır. MPT ile aynı çekince. | En yüksek sayı |

### Sade 5 dakikalık 4-6 seansı

Tek düğmeyle başlayan, baştan sona sabit ritimli, süslemesiz rehberli seans:

```
Toplam süre : 5 dakika → 30 döngü
Döngü       : 4 sn burundan al · 6 sn ağızdan ver (tutma yok)
Sayım       : her saniye sayılır, faz adı net gösterilir
Hatırlatma  : aralarda "karnın şişsin, göğsün sabit kalsın"
Bitiş       : tamamlanan döngü sayısı bildirilir
Ton         : sakin, yavaş, zorlamasız — motivasyon cümlesi yok
```

**Kısmen var.** [breathingPrograms.ts:56](src/data/breathingPrograms.ts#L56) içindeki
`l1-awareness` tam bu ritmi kullanıyor ama 6 döngü (1 dk) sürüp başka segmentlere geçiyor.

| İstenen | Şu an | Yapılacak |
| --- | --- | --- |
| 30 döngü, tek ritim | 6 döngü, sonra 4-4-6 ve "sss" | Tek segmentli yeni preset |
| Her saniyeyi say | ✅ Daire içinde geri sayım — görsel, sessiz | Sesli istenirse `expo-av` (var) ile ses dosyası |
| Aralarda hatırlatma | Kısmen — `tip` yalnızca alttaki statik kartta | Her 5 döngüde bir çalışan ekranda göster |
| Bitişte döngü sayısı | ❌ "Program tamamlandı." | `cycleCount` bitiş metnine eklenecek |
| Motivasyon cümlesi yok | ❌ `benefits` listesi gösteriliyor | Bu preset'te gizlenecek |

### Program yapısı

- Ayarlarda artık **iki mod** var: `daily` (kısa bakım programı) ve `progressive`
  (seviyeli uzun program) — `BreathingMode`. Yeni egzersizler `progressive` tarafına girecek.
- **4 haftalık kademeli plan**; hafta başındaki ölçüme göre hedefler belirlenir.
- Mevcut `BreathingProgram` / `BreathingSegment` / `BreathPhase` tipleri yeterli.
  Yeni faz türü gerekebilir (`stackedInhale`) ya da ayrı bir `BreathDrill` tipi yazılır.
- Ekran: yeni `BreathControlScreen`, ya da `DiaphragmExerciseScreen` içinde
  **"Rahatla / Antren"** iki sekmesi.

### ⚠️ Güvenlik

`BreathingProgram.safetyNote` alanı var, görünür kalacak:

- Baş dönmesi, karıncalanma, göğüste sıkışma → **dur**, normal nefese dön
- Nefes tutma egzersizleri **asla suda, araç kullanırken veya ayakta** yapılmaz
- Astım, KOAH, kalp rahatsızlığı, gebelik → hekime danışmadan yapılmaz
- Açık bir "**bu tıbbi tavsiye değildir**" ibaresi
- Güçlü hiperventilasyon protokolleri (Wim Hof tarzı) **eklenmeyecek** — bilinç kaybı riski var

---

## 2. Zihin & Zekâ

**Mevcut:** `BrainExercisesScreen`, `ExerciseEngineScreen`, interaktif beyin görseli ve
egzersiz geçmişi ekranları — beyin bölgelerine dokunarak bilişsel alanlara giriliyor.

### Ne yapar, ne yapmaz

**Yapmaz — zekânı yükseltmez.** Bilişsel egzersizler ağırlıkla **çalışılan görevde**
iyileşme sağlıyor; genel zekâya ya da günlük hayata transferin kanıtı zayıf. Uygulamada
"IQ artırır", "beynini geliştirir" gibi cümleler kurulmayacak.

**Yapar:** düzenli pratikle o beceride ölçülebilir iyileşme, dikkat süresini fark etme
alışkanlığı ve mülakat baskısı altında düşünme provası.

### Eklenecek

| Alan | Egzersiz | Ölçüm |
| --- | --- | --- |
| **Çalışma belleği** | n-back, rakam dizisi geri okuma | Seviye (n), doğruluk |
| **Dikkat & odak** | Seçici dikkat, dikkat dağıtıcı altında görev | Doğruluk, tepki süresi |
| **İşlem hızı** | Sembol eşleme, hızlı aritmetik | Doğru/dk |
| **Mantık & örüntü** | Sayı-şekil örüntüleri, çıkarım soruları | Doğruluk |
| **Hafıza teknikleri** | Loci (hafıza sarayı), gruplama (chunking), akrostiş | Hatırlanan öğe sayısı |
| **Hızlı okuma** | Göz sıçraması, geri dönüşü azaltma | Kelime/dk + anlama testi |

**Mülakata bağlantı:** hafıza teknikleri şirket araştırma notlarını, hızlı okuma sektör
haberlerini, dikkat egzersizleri baskı altında soru dinlemeyi doğrudan besliyor. Her
egzersizin `interviewUse` benzeri bir alanı olacak — belagat modülündeki gibi.

**Zorluk uyarlaması:** skor yükseldikçe seviye artar, düştükçe geri iner. Sabit zorluk
birkaç günde ya sıkıcı ya imkânsız hâle geliyor.

---

## 3. Kariyer & Mülakat

**Mevcut:** şirket/pozisyon seçimli simülasyon, geri sayım, kamera, yapay zekâ analizi
(kriz yönetimi, duruş, akıcılık, dolgu kelime), mülakat geçmişi, sektör haberleri.

### Eklenecek

| Özellik | İş |
| --- | --- |
| **Başvuru takibi** | Hangi şirket, hangi aşama, hangi tarih, sonuç ne oldu — basit bir kanban/liste |
| **STAR cevap kurucu** | Durum → Görev → Eylem → Sonuç şablonuyla cevap yazma ve kaydetme |
| **Şirket araştırma notları** | Şirket başına not defteri; simülasyon öncesi hatırlatılır |
| **Maaş görüşmesi senaryosu** | Ayrı bir simülasyon modu — sayı verme, gerekçelendirme, sessizlik yönetimi |
| **Mülakat sonrası takip** | Teşekkür mesajı şablonu, kendi kendine değerlendirme formu |
| **Teknik soru bankası** | Departman bazlı genişletme; yanlış cevaplananlar tekrar havuzuna düşer |

---

## 4. Alışkanlık & Rutin

**Amaç:** uygulamayı "mülakat öncesi açılan" bir şey olmaktan çıkarıp günlük ritme
yerleştirmek.

### 4a. Aralıklı hatırlatıcılar

Örnek: saatte bir su içme bildirimi.

```
enabled          → açık/kapalı
intervalMinutes  → 30 | 45 | 60 | 90 | 120
activeHours      → { start: 09:00, end: 22:00 }   ← gece uyandırmasın
activeDays       → hafta günleri
message          → özelleştirilebilir metin
```

**Hazır şablonlar:** su içme, ayağa kalk & esne, göz molası (20-20-20), duruş kontrolü,
nefes molası (diyafram modülüne bağlanır), şükür/niyet notu.

**Günlük sayaç:** "bugün 6/10 bardak" — bildirime dokununca artan sayaç.
`dailyPracticeProgress.ts`'teki `dayKey` bazlı yapı aynen kullanılabilir.

### 4b. Serbest alarmlar

```
{ id, label, time: { hour, minute }, days: [1,2,3,4,5], enabled, sound }
```

Birden fazla alarm, liste hâlinde yönetim (ekle / düzenle / sil / aç-kapat), gün seçimi
ve ayrı bir Android kanalı (`personal-reminders`) — günlük pratik kanalından bağımsız
sessize alınabilsin.

### ⚠️ Teknik kısıtlar — tasarımdan önce çözülecek

1. **Aktif saat aralığı + tekrarlı interval birlikte çalışmıyor.** `TIME_INTERVAL` +
   `repeats: true` 7/24 çalar. Çözüm: aralığı **ayrık `DAILY` bildirimlere açmak**
   (09:00-22:00 / 60 dk → 14 ayrı bildirim).

2. **iOS'ta bekleyen bildirim limiti 64.** Yukarıdaki yöntem limiti hızla yer. Şu an 4
   bildirim kullanılıyor. Çözüm: her açılışta yalnızca **önümüzdeki 2-3 günü** planla.

3. **Silme tarafı çözüldü.** `cancelAllReminders()` artık sabit kimlik listesi yerine
   `getAllScheduledNotificationsAsync()` üzerinden içerikteki `kind === 'daily-practice'`
   alanına bakıyor — dinamik sayıda kayıt da temizleniyor. Yeni modüller kendi `kind`
   değerini koyarsa aynı desen çalışır. Kimlik şeması yine de genişletilecek
   (`savunma.habit.<id>.<slot>`), ama hayalet bildirim riski geçti.

4. **Android 14+ tam zamanlı alarm.** `expo-notifications` varsayılan olarak *inexact*
   alarm kuruyor; sistem birkaç dakika kaydırabilir. Su hatırlatıcısı için sorun değil,
   gerçek "alarm saati" beklentisi için olabilir. Çalan/ısrarlı alarm isteniyorsa
   `expo-notifications` yetmez, native taraf gerekir.

5. **Gün aşırı mod emsal oluşturuyor.** `syncReminders(settings, { everyOtherDay: true })`
   tekrarlayan tetikleyici kullanamadığı için 14 ayrı tek seferlik `DATE` bildirimi kuruyor
   ve pencereyi her açılışta kaydırıyor. Aralıklı hatırlatıcılar da tam olarak bu deseni
   kullanacak — yeniden icat edilmeyecek. iOS 64 limiti bu yüzden daha da önemli:
   tek modül şimdiden 14 slot yiyor.

6. **Bildirim izni akışı zaten doğru**: izin ana şalter açıldığında isteniyor,
   `Device.isDevice` false ise `'unsupported'` dönüyor. Yeni modüller aynı akışı kullanacak.

---

## 5. Ölçüm & Karne

**Amaç:** alıştırma yapmak ayrı, **ilerlediğini görmek** ayrı.

### Zaten var olanlar

Bu bölüm ilk yazıldığında "hiç yok" varsayılmıştı; doğru değil. Karne altyapısının
büyük kısmı çalışıyor:

| Parça | Durum |
| --- | --- |
| `TrendChart` — çok serili çizgi/alan grafiği (`react-native-svg`) | ✅ Var, `ProfileScreen` ve `ExerciseHistoryScreen` kullanıyor |
| `interviewHistory` + `interviewStats` — oturum kaydı, ortalama puan | ✅ Var |
| `exerciseHistory` + `exerciseStats` — süre, adet, favori kategori | ✅ Var |
| `ProfileScreen` — istatistik kutuları + gelişim grafiği + boş durum | ✅ Var, karne ekranı bu |
| `InterviewHistoryScreen` / `ExerciseHistoryScreen` — geçmiş + grafik + yapay zekâ yorumu | ✅ Var |
| `dailyPracticeProgress` — modül serileri, belagat sanatı istatistikleri | ✅ Var |

**Yani ayrı bir `TestsScreen` ve `Sparkline` yazmaya gerek yok.** Eksik olan tek şey
şu: yukarıdakilerin hepsi *uygulama kullanıldıkça kendiliğinden biriken* veriler.
**Kasıtlı ölçüm** kavramı yok — kullanıcının "şimdi ölçüyorum" deyip tekrarladığı,
zaman içinde karşılaştırılan bir test yok. `longestExhaleSeconds` bunun tek örneği,
o da yalnızca rekoru tutuyor, geçmişi yok.

> **Baştan net olsun:** aşağıdaki testlerin **hiçbiri akciğer hacmi ölçmüyor.** Hacim
> ölçümü spirometre işi. Buradakiler kontrol, dayanıklılık ve konuşma verimi ölçüyor —
> hepsi **kendi geçmişinle** karşılaştırıldığında anlamlı. Ekranda "kapasite" geçmeyecek.

### Testler

| Alan | Test | Birim | Durum |
| --- | --- | --- | --- |
| Nefes | **Kontrollü veriş süresi** — tek nefeste sabit "sss" | sn | ✅ Ölçüm + geçmiş + eğri |
| Nefes | **Nefes tutma** — tam al, tut | sn | ❌ |
| Nefes | **Dinlenik solunum hızı** — 60 sn, her alışta dokun | nefes/dk | ✅ Ölçüm + geçmiş + eğri |
| Nefes | **Kontrol duraklaması** — ilk nefes ihtiyacına kadar | sn | ❌ |
| Nefes | **Diyafram izolasyonu** — 5 maddelik öz-kontrol | 0-5 | ❌ |
| Veriş | **Tek nefeste sayma** | sayı | ❌ |
| Veriş | **Nefes/cümle oranı** — metni kaç nefeste okudun | nefes | ❌ |
| Diksiyon | **Okuma hızı** — günün metnini sesli oku | kelime/dk | ✅ Ölçüm + geçmiş + eğri |
| Diksiyon | **Dolgu kelime oranı** — 60 sn serbest konuşma | dolgu/dk | ⚠️ Sayaç var, test formatı yok |
| Diksiyon | **Zayıf ses tespiti** — hangi seslerde takılıyorsun | ses listesi | ❌ |
| Zihin | **Bilişsel başlangıç** — n-back + işlem hızı | seviye | ❌ |
| Belagat | **Seviye tespit** — 10 soruluk sınav | % | ⚠️ İstatistik var, sınav yok |

**Zayıf ses tespiti en değerli bağlantı:** işaretlenen sesler `dictionDrills.ts`'teki
`focus` alanıyla eşleşirse günün seansı otomatik o seslere ağırlık verir.

### Altyapı

```ts
type TestResult = { testId: string; day: string; value: number; note?: string };
```

Ortak parça: `TestTrend` ("son N ölçüm", ilk→son farkı, eğri). `improvement` alanı
üç durumlu — `'higher'` | `'lower'` | `'none'`. Hedefi bir ARALIK olan ölçümlerde
(okuma hızı, dinlenik solunum hızı) `'none'` kullanılıyor: artışı yeşile boyamak
yanlış bilgi verirdi.

**✅ Kuruldu (2026-09-06).** `dailyPracticeProgress.ts` içinde: `TestResult` tipi,
`ProgressState.tests`, `normalize()` satırı, `MAX_TEST_RESULTS = 100` ve genel
`recordTest()` / `testHistory()` / `bestTestValue()` fonksiyonları. Gösterim mevcut
`TrendChart` üzerinden — yeni grafik bileşeni yazılmadı. **Yeni testler bu yoldan
geçecek, altyapı ikinci kez kurulmayacak.**

Yol boyunca çıkan hata: `recordExhaleRecord()` rekor kırmayan ölçümleri tamamen
atıyordu (`if (seconds <= best) return state`), yani ilerleme zaten görülemezdi.
Artık her ölçüm geçmişe giriyor, rekor ayrıca güncelleniyor.

Kalan altyapı işi:

- **Başlangıç testi:** ilk açılışta seviye **önerisi** üretir; kullanıcının seçimini ezmez.
- **Karne toplaması:** test geçmişleri şu an yalnızca kendi egzersiz ekranında görünüyor;
  `ProfileScreen`'de hepsini bir arada gösteren bir bölüm henüz yok.

### ⚠️ Ölçüm dürüstlüğü

- Bunlar **öz-ölçüm**, klinik ölçüm değil — ekranda açıkça yazacak.
- Hiçbir sonuç "akciğer kapasiten şu kadar" diye sunulmayacak. Ölçülen neyse o yazacak:
  *kontrollü veriş süresi*, *nefes ihtiyacı eşiği*, *konuşma hızı*.
- Karşılaştırma ancak **aynı koşullarda** anlamlı: benzer saat, oturur pozisyon, tok
  karnına değil. Test ekranı bunu ölçümden önce hatırlatmalı.
- Nefes tutma testleri **oturarak**; suda / araç kullanırken asla.
- **Mikrofonla otomatik süre ölçümü** v1'de yok: gürültüde eşik güvenilmez, manuel
  bas-tut daha dürüst sonuç veriyor.

---

## 6. Konuşma & Diksiyon

**Mevcut ve çalışıyor:** `SpeechExerciseScreen` + `dictionDrills.ts` — 5 tür, ~20
alıştırma (artikülasyon, 8 tekerleme, vurgu-tonlama, tempo & ses hacmi, dolgu kelime avı),
günün seansı, dolgu sayacı, seans özeti, günün fesahat kusuru.

### Eklenecek

- **Zayıf ses odaklı seans** — Bölüm 5'teki tespite göre günün seansı ağırlık değiştirir
- **Kayıttan dinleme** — kendi sesini kaydet, geri dinle, önceki kayıtla karşılaştır
  (`expo-av` projede var)
- **Sunum provası** — belirlenen süreye konuşmayı sığdırma, süre aşımı uyarısı

---

## 7. Dil & İfade — Belagat

**Mevcut ve çalışıyor:** meânî (8) / beyân (7) / bedî' (12) müfredatı, 6 fesahat kusuru,
öğren → tanı → üret akışı, sanat bazlı doğru/yanlış istatistiği.

### Eklenecek

- **Seviye tespit sınavı** (10 soru) ve kol bazlı başarı yüzdesi
- **Zayıf sanat tekrarı** — yanlış bilinen sanatlar tanıma havuzunda daha sık çıkar
- Okuma metinlerindeki sanat etiketleri (`belagatArtIds`) üzerinden **metinden sanata**
  geçiş — metni okurken sanatı işaretleme

---

## 8. Kimlik: isim ve ikonlar

### İsim ✅

**Terakki** (2026-09-07). Kaynak dosyalar, native taraf (`expo prebuild --clean`)
ve derleme tamam; paket kimliği `com.terakki.app`. Gerekçe [KARARLAR.md](KARARLAR.md)'de.

### Logo ✅

Mevcut logo **Kademe** (4 eşit adımla yükselen ve 4. adımı 'sıradaki gelişmeyi' simgeleyen boş modül) olarak belirlendi ve `assets/brand/` altında belgelendi.

### İkon dosyalarının durumu (Güncellendi — 2026-09-10)

Logo türetimleri `tools/icon-forge/build_app_assets.py` script'i çalıştırılarak saf Python rasterleştiricisi ile üretildi ve `assets/` dizinine yerleştirildi.

| Dosya | Gereken | Durum |
| --- | --- | --- |
| `icon.png` | 1024×1024, kenarlara kadar dolu degrade zemin + beyaz Kademe figürü | ✅ 1024×1024 — üretildi ve güncellendi |
| `splash-icon.png` | 1024×1024, **şeffaf zeminli** zümrüt yeşili Kademe logosu | ✅ 1024×1024, şeffaf — üretildi |
| `android-icon-foreground.png` | 1024×1024, **şeffaf**, logo ortadaki güvenli alanda (scale %72) | ✅ 1024×1024, şeffaf — üretildi |
| `android-icon-monochrome.png` | 1024×1024, tek renk beyaz siluet, şeffaf zemin | ✅ 1024×1024, şeffaf — üretildi |
| `android-icon-background.png` | Düz / zümrüt yeşili degrade zemin | ✅ `#059669` `app.json` adaptiveIcon rengiyle eşlendi |
| `notification-icon.png` | Beyaz siluet + şeffaf zemin (96×96) | ✅ 96×96, tek renk `#ffffff` siluet — üretildi |
| `favicon.png` | 48×48 web simgesi | ✅ 48×48, degrade zemin + beyaz Kademe figürü — üretildi |

`app.json` içinde `adaptiveIcon.backgroundColor: "#059669"` ve `foregroundImage` / `monochromeImage` yolları doğru şekilde bağlandı.

### Yapılanlar & Tamamlanan Adımlar

1. ✅ **Logo kararı** — "Kademe" (yükselen 4 modül) markası kabul edildi.
2. ✅ **Şeffaf zeminli türetim** — `tools/icon-forge/build_app_assets.py` ile tek kaynaktan `icon.png`, `splash-icon.png`, `android-icon-foreground.png`, `android-icon-monochrome.png`, `notification-icon.png`, `favicon.png` dosyaları üretildi.
3. ✅ `android-icon-monochrome.png` gerçek siluete çevrildi (şeffaf zemin üzerine beyaz maske).
4. ✅ `favicon.png` 48×48 boyutuna indirildi.
5. ✅ Adaptive icon güvenli alanı ayarlandı (%72 ölçekleme ile güvenli marj sağlandı).
6. ✅ `app.json` konfigürasyonu güncellendi.
7. ✅ Native çıktı derlemesi için icon asset'leri `assets/` klasörüne işlendi (`npx expo prebuild --clean` ile kullanılabilir).

### Not: `userInterfaceStyle` ölü ayar

`app.json` `userInterfaceStyle: "light"` diyor ama `expo-system-ui` kurulu değil;
prebuild bunu açıkça uyarıyor ("Install expo-system-ui in your project to enable
this feature"). Uygulama temayı zaten JS tarafında `ThemeContext` ile yönetiyor,
o yüzden acil değil — ama ayar yanıltıcı: kaldırılmalı ya da paket eklenmeli.

---

## Ortak altyapı işleri

### Tamamlanan Altyapı İşleri (Bölüm 0 & 00)
| Dosya | İş | Durum |
| --- | --- | --- |
| `src/screens/TodayScreen.tsx` | Bugün sekmesi — günlük pratik ve seri takibi | ✅ Yapıldı |
| `src/screens/GrowthScreen.tsx` | Gelişim hub'ı — yedi sütun kartı ve dinamik başlıklar | ✅ Yapıldı |
| `src/screens/ProgressScreen.tsx` | İlerleme sekmesi — seriler, karne ve test eğilimleri | ✅ Yapıldı |
| `src/screens/InterviewScreen.tsx` | Kariyer & Mülakat modülü — simülasyon ve geçmiş | ✅ Yapıldı |
| `src/screens/ProgressScreen.tsx` | Üst marj büzüldü; 4 modül serisi ve rehber test kartları dinamikleştirildi | ✅ Yapıldı (Bölüm 0.2) |
| `src/screens/ProfileScreen.tsx` | Günlük taahhüt, rozet vitrini ve yapay zekâ/sistem durum kartları eklendi | ✅ Yapıldı (Bölüm 0.2) |
| `src/screens/SettingsScreen.tsx` | Modül ayarlarından arındırıldı, genel uygulama ayarlarına odaklandı | ✅ Yapıldı (Bölüm 0.3) |
| `src/screens/SimulationScreen.tsx` | Eski iki işlevli ekran kaldırıldı | ✅ Temizlendi |
| `App.tsx` | Sekmeler 4'e çıkarıldı; stack yönlendirmeleri tamamlandı | ✅ Yapıldı |
| `src/components/ScreenBackground.tsx` | Sekme isimlerine uygun degrade bağlamı eklendi | ✅ Yapıldı |
| `app.json` & `assets/` | Terakki Kademe ikonu (1024x1024), splash ve zemin yeşili (`#059669`) kuruldu | ✅ Yapıldı |

### Bekleyen Altyapı & Modül Dosyaları
| Yeni / Değişecek Dosya | İş | Bölüm |
| --- | --- | --- |
| `src/screens/OnboardingScreen.tsx` | Duolingo tarzı oryantasyon ve ilk ısındırma akışı ekranı | Bölüm 0.1 |
| `src/utils/sqliteDatabase.ts` | `expo-sqlite` ilişkisel veritabanı sürücüsü & göç (migration) altyapısı | Bölüm 0.4 |
| `src/data/breathControlDrills.ts` | Nefes kontrolü egzersizleri + 4 haftalık plan | Bölüm 1 |
| `src/screens/BreathControlScreen.tsx` | Antrenman akışı + ölçüm | Bölüm 1 |
| `src/data/personalTests.ts` | Test tanımları: birim, talimat, güvenlik notu | Bölüm 5 |
| `src/screens/TestsScreen.tsx` | Ölçüm akışı — kayıt ve karşılaştırma (grafik `TrendChart`'tan) | Bölüm 5 |
| `src/utils/habitReminders.ts` | Aralıklı hatırlatıcı ayarları + slot açma | Bölüm 4 |
| `src/utils/customAlarms.ts` | Serbest alarm CRUD + planlama | Bölüm 4 |
| `src/screens/RemindersScreen.tsx` | Hatırlatıcı ve alarm yönetimi | Bölüm 4 |
| `src/components/practice/HabitCard.tsx` | Ana ekranda günlük sayaç kartı | Bölüm 4 |
| `src/data/cognitiveDrills.ts` | Zihin egzersizleri + zorluk uyarlaması | Bölüm 2 |
| `src/data/breathingPrograms.ts` | 5 dk sade 4-6 preset'i + yeni faz türleri | Bölüm 1 |
| `src/screens/DiaphragmExerciseScreen.tsx` | Preset girişi, aralıklı hatırlatma, bitişte döngü sayısı | Bölüm 1 |
| `src/utils/dailyPracticeSettings.tsx` | Yeni modül ayarları (`onboardingCompleted`, `userGoals` vb.) | Bölüm 0.1 / 4 |
| `src/utils/dailyNotifications.ts` | Dinamik kimlik şeması, slot açma, iOS bildirim bütçesi | Bölüm 4 |
| `src/data/dictionDrills.ts` | Zayıf ses eşleşmesi için ses etiketleri | Bölüm 6 |
| `src/screens/SpeechExerciseScreen.tsx` | Dolgu sayacı test formatına bağlanacak | Bölüm 6 |
| `README.md` | Yeni modüllerin özellik listesine eklenmesi | Genel |

---

## Açık sorular

- [x] ~~Uygulama adı ne olacak?~~ **Terakki** (2026-09-07). Ayrıntı [KARARLAR.md](KARARLAR.md)'de.
- [x] ~~Sekme yapısı ne olacak?~~ **Dört sekme: Bugün · Gelişim · İlerleme · Profil**
      (2026-09-08). Ayrıntı Bölüm 0'da.
- [x] ~~Testler ayrı sekme mi, `ProfileScreen` altında "karne" bölümü mü?~~
      **Ayrı sekme (İlerleme)** ve yedi sütunun tamamını gösterecek.
- [ ] Nefes modülü ayrı ekran mı, `DiaphragmExerciseScreen` içinde iki sekme mi?
- [ ] Alarm beklentisi: sıradan bildirim mi, çalan/ısrarlı alarm mı? (İkincisi native iş.)
- [ ] Sayım sesli mi olacak? `expo-av` var; konuşan sayım için `expo-speech` gerekir.
- [ ] Zayıf ses tespiti günün seansını otomatik mi değiştirsin, öneri olarak mı kalsın?
      (Otomatik olursa günlük içerik deterministik olmaktan çıkar; bildirim metniyle
      ekran içeriği tutmayabilir.)
- [ ] Su sayacı hedefi sabit mi (8 bardak), kullanıcı mı belirleyecek?
