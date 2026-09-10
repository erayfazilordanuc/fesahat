# Devam — yeni oturum brifingi

Bu dosya geçici. Konuşma koptuğunda yeni bir oturumun hiçbir şey sormadan devam
edebilmesi için var; iş bitince silinebilir. **Kalıcı bilgi buraya yazılmaz** —
kararlar `KARARLAR.md`'ye, plan `YAPILACAKLAR.md`'ye gider.

---

## Yeni oturumda yapıştırılacak istem

> Bu proje **Terakki** adında bir React Native (Expo SDK 54) kişisel gelişim
> uygulaması. Kökteki `DEVAM.md`, `YAPILACAKLAR.md` (yol haritası) ve
> `KARARLAR.md` (kararlar + gerekçeleri) — üçünü de oku.
>
> Sıradaki iş `YAPILACAKLAR.md`'deki "Sıra" başlığında.
>
> Cihazda çalıştırma kuralları aşağıdaki "Ortam tuzakları"nda; onları okumadan
> build almaya çalışma.

---

## Proje ne

Savunma sanayii mülakat simülatörü olarak doğdu, artık **yedi sütunlu bir kişisel
gelişim uygulaması**: kariyer & mülakat, konuşma & diksiyon, dil & ifade
(belagat), nefes & beden, zihin & zekâ, alışkanlık & rutin, ölçüm & karne.

Arayüz Türkçe. Açık + koyu tema. Ekranlar `src/screens/`, paylaşılan bileşenler
`src/components/AppUI.tsx` ve `src/components/practice/PracticeUI.tsx`, renk
kaynağı `src/components/themeTokens.ts`.

Yapay zekâ çağrıları `server/server.ts` (Express + Gemini proxy) üzerinden;
anahtar yalnızca sunucuda. Uygulama sunucu adresini Ayarlar'dan alıyor.

---

## Şu an nerede duruyoruz

**Yeniden adlandırma bitti.** Kaynak, native (`expo prebuild --clean`) ve
derleme tamam; paket kimliği `com.terakki.app`. Kod tabanında eski isim
kalmadı.

Geriye **iki kullanıcı eylemi** kaldı:

1. GitHub reposunu `savunmamulakat-mobile` → `terakki` olarak web arayüzünden
   yeniden adlandır (`gh` CLI bu makinede yok), **sonra**:
   ```bash
   git remote set-url origin https://github.com/erayfazilordanuc/terakki.git
   ```
2. Telefondaki eski uygulamayı sil — paket adı **`com.savunma.kariyer`**
   (beklenen `com.savunmamulakat.mobile` değil; cihazdaki son kurulum daha eski
   bir yapılandırmadan kalmış). Verisi de gider:
   ```bash
   adb uninstall com.savunma.kariyer
   ```
   Kullanıcı "eski veriyi başka klasörde sakla" dedi; uygulama **debuggable
   değil** (`run-as` reddediyor), o yüzden `adb backup` denenmeli — cihazda elle
   onay istiyor.

`git status`: 18 `ios/SavunmaAI*` dosyası silinmiş, `ios/Terakki*` eklenmiş,
`Podfile*` değişmiş. Henüz commit'lenmedi.

---

## Bekleyen kararlar

- **Logo** — dört aday üretildi, kullanıcı seçecek. Görseller
  `~/Desktop/terakki-logo-adaylari/`, üretici kod `tools/icon-forge/`.
  Karar verilmeden ikon türetmeye başlanmamalı (gerekçe YAPILACAKLAR Bölüm 8).

---

## Doğrulama durumu

- ✅ **Profil ikon seçici** — cihazda uçtan uca denendi: buton → modal →
  gruplar → seçim → kapanış → kaydetme. Diske `{"icon":"megaphone"}` yazıldığı
  `run-as` ile görüldü.
- ⏳ **Switch animasyonu** — kod yolu doğrulandı (basışta hedef sürülüyor;
  `toggleNotifications`'ta `setPermission` + `setSetting` ardışık senkron
  çağrılar olduğu için aralarında ara render oluşmuyor, yani geri zıplama riski
  yok). Ama **gözle görülmedi** — makinede `ffmpeg` olmadığı için ekran
  kaydından kare çıkarılamadı, izin de zaten verilmiş olduğu için diyalog testi
  işlemedi. Bir anahtarı açıp kapatıp bakmak gerekiyor.

---

## Ortam tuzakları — build almadan önce oku

Hepsi bu projede gerçekten başa geldi.

### 1. JDK 17 şart, sistemde JDK 26 var

`~/.zshrc` düzeltildi. Doğru değer:

```sh
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
```

⚠️ `$(/usr/libexec/java_home -v 17)` **KULLANMA**. Brew'in `openjdk@17`'si
`/Library/Java/JavaVirtualMachines/` altına kayıtlı olmadığı için `java_home`
onu bulamıyor ve sessizce JDK 26'yı döndürüyor. Belirti:

```
Error resolving plugin [id: 'com.facebook.react.settings']
> 26.0.1
```

⚠️ Ayrıca: editörden açılan kabuk `~/.zshrc`'yi okumayabiliyor. Gradle
çalıştıran her komutta `JAVA_HOME`'u **açıkça** dışa aktar.

### 2. `npm install` sonrası yamayı geri koy

`patches/react-native-css-interop+0.2.4.patch` **kritik**. NativeWind'ın
`stringify()`'ı prop'ları özyinelemeli geziyor ve React Navigation'ın
`NavigationStateContext` varsayılanındaki patlayan getter'lara çarpıyor.

Belirti (tema değiştirirken):
```
Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?
```

npm bu projede lifecycle script'lerini engelliyor, yani `postinstall` çalışmıyor.
Her `npm install` / `expo install` sonrası elle:

```bash
npx patch-package
grep -c "Getter Error" node_modules/react-native-css-interop/dist/runtime/native/render-component.js   # 1 dönmeli
```

Sonra Metro'yu `npx expo start --clear` ile başlat.

> `expo prebuild` bu yamayı bozmuyor — `npm install` çalıştırmıyor. Yine de
> prebuild sonrası bir kez kontrol et.

### 3. Telefon USB'den çıkıp girdiyse

`adb reverse` eşlemesi kaybolur, uygulama splash'ta takılır. Yeniden derleme
gerekmez:

```bash
adb reverse tcp:8081 tcp:8081
```

### 4. Cleartext HTTP

`expo-build-properties` eklentisi `android.usesCleartextTraffic: true` veriyor —
sunucu `http://` olduğu için şart. Ama `expo run:android`, `android/` klasörü
varken prebuild'i tekrar çalıştırmaz; eklenti uygulanmaz. Değişiklikten sonra
`npx expo prebuild --platform android --clean` gerekiyor. Doğrulama:

```bash
grep -o 'usesCleartextTraffic="[^"]*"' android/app/src/main/AndroidManifest.xml
```

### 5. `expo-av` deprecated

SDK 54'te kaldırılacağını söylüyor, proje SDK 54'te. Çalışıyor;
`expo-audio` + `expo-video`'ya geçiş yol haritasında.

---

## Kod taraması (2026-09-08)

### Düzeltildi

- **Gezinme mimarisi yeniden kuruldu** (Bölüm 0). Üç sekme → dört:
  **Bugün · Gelişim · İlerleme · Profil**. Giriş ekranı artık mülakat değil,
  günün pratiği. Mülakat Gelişim hub'ındaki bir sütun. `SimulationScreen`
  ikiye ayrılıp silindi; `TodayScreen`, `GrowthScreen`, `ProgressScreen`,
  `InterviewScreen` eklendi. `ProfileScreen` kimlik + ayarlara indi.
  Sekme rota adlarıyla `BackgroundVariant` tipi birbirine bağlı — biri
  değişince diğeri de değişmeli, TypeScript bunu yakalıyor.

- **Yapay zekâ artık isteğe bağlı bir katman** (Bölüm 00 · aşama 1a). Yeni
  `src/utils/aiAvailability.ts` tek kaynak. `AnalysisScreen` ve `AiInsightCard`
  kapalıyken çağrı denemiyor, teknik hata mesajı yerine sade bir açıklama
  gösteriyor. Eski davranış: uygulamayı yeni kuran herkes mülakat sonunda
  *"Sunucu adresi tanımlı değil. Ayarlar → Backend API Adresi alanını
  doldurun."* görüyordu.

- **`getCompany` diskten gelen kimlikte fırlatıyordu.** `InterviewHistoryScreen`
  kayıtlı oturumun `companyId`'siyle çağırıyor; kurum listeden kalkarsa fırlatma
  ErrorBoundary köke kadar çıkıp **tüm uygulamayı** düşürürdü. Kurum listesinin
  kataloğa dönüşmesi zaten planlı (Bölüm 00), yani bu bomba kurulmuş
  durumdaydı. Eklenen `findCompany()` gevşek arama yapıyor; satır artık
  "BİLİNMEYEN KURUM" etiketiyle çiziliyor, geçmiş kaybolmuyor.
- **`filterQuestions` geri çekilmiyordu.** "Kurum kısıtını gevşet" adımı
  departman kısıtını koruyordu; sorusu olmayan bir departman seçilse havuz boş
  döner, `pickRandomQuestion` `undefined` verir, ekran patlardı. Bugün her
  kombinasyonun sorusu var (yazilim 6, arge 5, ik 5 — doğrulandı) ama katalog
  genişleyince kaçınılmazdı. Üçüncü katman eklendi: departmana da soru yoksa
  yalnızca türe bakılıyor.
- **Üç `Pressable`'da erişilebilirlik niteliği yoktu** (belagat sanatı akordiyonu,
  metin seçimi, "günün metnini sesli oku"). `accessibilityRole` + etiket + durum
  eklendi.

### Bakıldı, sorun çıkmadı

Yanlış alarmları da yazıyorum ki aynı yerler ikinci kez kazılmasın.

| Şüphe | Sonuç |
| --- | --- |
| Zamanlayıcı sızıntısı | 12 `setInterval`/`setTimeout`, hepsinin `clear`'ı var |
| Gezinme hedefleri | 9 `navigate()` hedefi ve 4 bildirim ekranı, hepsi kayıtlı |
| Veri çapraz referansları | Belagat sanatı atıfları, kurum ve bölüm kimlikleri — hepsi çözülüyor |
| `recordTest` hiç çağrılmıyor | **Yanlış alarm.** `useDailyProgress` içindeki `logTest`/`recordExhale` sarmalayıcıları üzerinden çağrılıyor; üç testin de yazma noktası var |
| Ertelenmiş yazımlar kayboluyor | `storage.ts` `AppState` değişiminde flush ediyor |
| Reanimated worklet'leri JS thread'de | Babel eklentisi doğru (`react-native-reanimated/plugin` → `react-native-worklets/plugin` kabuğu) |

Ölü kod taraması aynı dosyadaki sarmalayıcıları göremediği için çok sayıda
yanlış pozitif veriyor — çıktısına doğrulamadan güvenilmemeli.

---

## Bilinen, dokunulmayan izler

- ⚠️ **`STORE_DIR` hâlâ `savunma-store`** (`src/utils/storage.ts:16`). Cihazda
  doğrulandı: veriler `files/savunma-store/` altında duruyor. Bildirim
  öneklerinden farklı olarak bu **gerçek kullanıcı verisi** tutuyor (profil,
  ilerleme, ayarlar) — düz yeniden adlandırma hepsini öksüz bırakır. Düzeltmek
  için açılışta bir kerelik göç gerekiyor: yeni klasör yoksa ve eskisi varsa
  klasörü taşı. Kullanıcı kararı bekliyor.

- `Segmented`'in seçili seçeneği açık temada `shadow-sm` alıyor; sınıf yalnızca
  seçiliyken eklendiği için NativeWind her seçimde "components … will remount"
  uyarısı basıyor. Görsel aksama yok ama seçenek yeniden bağlanıyor.
- Tema değişimi tüm ağacı yeniden render ediyor (`useThemeTokens` her bileşende
  bağlama abone). Switch takılması bundan bağımsız çözüldü; genel maliyet
  KARARLAR'daki "iki tasarım sistemi / iki state deseni" başlığıyla ele alınmalı.
- `EXERCISE_CATEGORIES`'te `oksipital` hâlâ tek egzersizli.
- 17 `Pressable`'ın 3'ü hariç hepsi erişilebilirlik niteliği taşıyor; kalan
  eksikler kapatıldı. Yeni ekranlarda `accessibilityRole` eklemeyi unutma.
- `app.json`'daki `userInterfaceStyle: "light"` ölü — `expo-system-ui` kurulu
  değil, prebuild bunu uyarıyor. Splash zemini kararıyla birlikte çözülecek.
- Kökteki `notes` dosyası (kullanıcının kendi notu) tamamen tüketildi: üç
  maddesinin üçü de yapıldı ya da YAPILACAKLAR'a taşındı. Silinebilir.
