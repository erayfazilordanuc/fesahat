# Fesahat (React Native / Expo SDK 54)

Fesahat, **dil, konuşma, anlayış, kavrayış ve iletişim becerilerini geliştiren** modüler bir mobil uygulamadır. Türkçe arayüz, açık + koyu tema, erişilebilir tasarım.

Uygulama **yapay zekâ katmanı** (BYOK — kullanıcı kendi Gemini anahtarını girer) içerir ama isteğe bağlıdır: anahtar yokken uygulamanın hiçbir parçası bozulmaz, her ekran açılır, ağ olmadan da %100 çalışır.

Geliştirme süreci ve kurallar için [CLAUDE.md](CLAUDE.md).

---

## 🗣 Beş Ayak: Fesahat Müfredatı

Uygulama 5 ana beceri alanı etrafında şekillenmiştir:

1. **Dil (Lugat & Türkçe):** Kelime hazinesi, anlam, söz kökenü (etimoloji), doğru yazım, deyim ve atasözü.
2. **Konuşma:** Diksiyon, artikülasyon, tonlama, konuşma temposu, dolgu kelime avı, hitabet nefesi ve beden kontrolü (diyafram nefes).
3. **Anlayış:** Okuduğunu / dinlediğini anlama, özetleme, okuma hızı (WPM), dinleme yeteneği.
4. **Kavrayış:** Sözel muhakeme, analoji, çıkarım, mantık, bağlamdan anlam.
5. **İletişim:** Etkin dinleme, empati, ikna, geri bildirim, zor konuşmalar, duygusal bağlantı.

### İleri Düzey: Klasik Belagat

Ek bölüm: **Meânî / Beyân / Bedîʿ** müfredatı — edebi sanatlar, fesahat ve belâğa klassikleri.

---

## 📱 Gezinme Yapısı (4 Ana Sekme)

Arayüz "Island" (Adacık) tarzı modern alt menüye ve açık/koyu tema desteğine sahiptir:

```
┌────────┬────────┬────────┬────────┐
│ Bugün  │ Atölye │ Karne  │ Profil │
└────────┴────────┴────────┴────────┘
```

- **Bugün (`TodayScreen`):** "Bugün ne yapmalıyım?" sorusunun tek ekranlık cevabı. Günlük pratik listesi, günün sözü (genel havuz / dinî mod) ve seri sayacı.
- **Atölye (`GrowthScreen`):** Beş ayağın eğitim merkezi (Hub). Beş kart: **Dil** · **Konuşma** · **Anlayış & Kavrayış** · **İletişim** · **Belagat** (ileri düzey). Altta araç: **Hatırlatıcılar**.
- **Karne (`ProgressScreen`):** Tüm becerilerin ölçümleri: modül serileri, test eğilimleri, pratik geçmişi ve ilerleme grafikleri.
- **Profil (`ProfileScreen`):** Kullanıcı kimliği, profil ikon seçicisi, uygulama ayarları (tema, dil), Gemini anahtarı ayarları.

---

## 🤖 Yapay Zekâ Katmanı (İsteğe Bağlı)

- **BYOK (Kendi Anahtarını Getir):** Kullanıcı kendi Google Gemini API anahtarını Profil → Ayarlar → Gemini'de girer. Anahtar cihazın güvenli kasasında (`expo-secure-store`) depolanır ve çıkmaz.
- **Çevrimdışı Garanti:** Anahtar yokken, ağ kesiliyken veya Gemini kapandığında uygulama **hiçbir parçası kırılmaz**. Tüm ekranlar açılır, pratikler çalışır, çağrılar sadece değerlendirme/üretim katmanında (AI Feedback) kapalı kalır. Teknik hata mesajı gösterilmez; yalnızca "Gemini şu an kullanılamıyor" bilgilendirmesi çıkar.
- **Google Gemini API (Doğrudan):** Çağrılar uygulamadan doğrudan Google'a gider. Sunucu yok. Anahtar / yanıt sadece cihaz üzerinde işlenir.

---

## ⚙️ Gereksinimler & Geliştirme Ortamı

- **Node.js:** v18+
- **JDK 17:** **Android derlemeleri için zorunludur.** Sistemde JDK 26 varsa brew üzerinden `openjdk@17` indirin ve `JAVA_HOME` olarak ayarlayın.
- **Expo SDK:** SDK 54 (`react-native` 0.81.5, NativeWind v4, `expo-sqlite`, `expo-secure-store`).
- **Expo Go:** Gerçek cihazda kablosuz test için (iOS / Android).
- **Android Emülatör / iOS Simülatörü:** Geliştirme için.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleme
```bash
npm install
```

**Sonrasında NativeWind yaması uygulanır:**
```bash
npx patch-package
```
*Not: `postinstall` bozuluyor, elle çalıştırın.*

### 2. Mobil Uygulamayı Başlatma
```bash
npm start
```
Ekranda QR Kod ve Metro Bundler konsolu açılır.

---

## 🧪 Test

### Gerçek Cihazda (Expo Go — Önerilen)
1. Telefonunuza **Expo Go** uygulamasını indirin.
2. Bilgisayarınız ve telefonunuz aynı Wi-Fi'da olsun.
3. `npm start` ile çıkan QR kodu taratın.

### Simülatör / Emülatör
```bash
npm start
# Sonrasında `i` (iOS) veya `a` (Android) tuşuna basın
# Veya doğrudan:
npm run ios
npm run android
```

### Kablolu Test
```bash
# USB bağlıyken:
adb reverse tcp:8081 tcp:8081
npx expo start --localhost
```

---

## 📦 Derleme (Build)

### Geliştirme Derlemesi (Yerel)

**Android:**
```bash
npx expo prebuild --platform android --clean
npm run android
```

**iOS:**
```bash
npx expo prebuild --platform ios --clean
npm run ios
```

*⚠️ Prebuild'den önce [CLAUDE.md](CLAUDE.md) → "Ortam tuzakları" oku.*

### Yayın Derlemesi (EAS)
```bash
eas build -p android --profile preview   # .apk
eas build -p ios --profile preview       # .ipa (Test Flight)
```

---

## ✅ Doğrulama

TypeScript derlemesi 0 hatada kalmalı:
```bash
npx tsc --noEmit
```

---

## 📁 Klasör Düzeni

```
src/
├── screens/           # Her sekmesi 4 ana ekran, + modal ekranlar
│   ├── TodayScreen.tsx
│   ├── GrowthScreen.tsx
│   ├── ProgressScreen.tsx
│   ├── ProfileScreen.tsx
│   └── ... (ComprehensionScreen, QuizScreen, SummaryScreen, vb.)
├── data/              # Statik veri: çalışmalar, sorular, sözler
│   ├── quiz.ts        # Okuma/dinleme/sözel soru setleri
│   ├── comprehension.ts
│   ├── verbalReasoning.ts
│   ├── communication.ts
│   ├── sozler.ts      # Günün sözü havuzu
│   └── ...
├── utils/             # Bağlam, depo, yardımcı araçlar
│   ├── ThemeContext.ts
│   ├── aiCredentials.ts      # Gemini anahtarı (expo-secure-store)
│   ├── aiAvailability.ts     # Anahtar denetim; teknik hata maskeleme
│   ├── comprehensionProgress.ts
│   ├── commProgress.ts
│   └── ...
└── components/        # UI bileşenleri
    ├── AppUI.tsx
    ├── ScreenBackground.tsx
    ├── AiFeedbackCard.tsx    # Yapay zekâ değerlendirmesi
    └── ...

assets/
├── brand/             # Marka tanımı, SVG kaynaklar
│   ├── ikon/
│   │   ├── fesahat-icon-master.svg
│   │   ├── fesahat-icon-mark.svg
│   │   └── fesahat-icon-white.svg
│   └── arsiv/         # Terakki'nin eski dosyaları
├── icon.png           # Uygulama ikonu (1024×1024)
├── splash-icon.png    # Açılış ekranı ikonu
└── ...

tools/icon-forge/      # Logo ve ikon üretimi (Python)
├── build_from_brand.py
├── draw.py
├── png.py
└── ...
```

---

## 💻 Teknoloji

- **React Native 0.81.5** (Expo SDK 54)
- **NativeWind v4** (Tailwind CSS)
- **TypeScript**
- **React Navigation** (Bottom Tab + Native Stack)
- **React Reanimated** (animasyonlar)
- **expo-sqlite** (cihaz deposu)
- **expo-secure-store** (Gemini anahtarı)
- **expo-notifications** (hatırlatıcılar)
- **Google Gemini API** (opsiyonel, BYOK)

---

## 📚 Belgeler

- **[CLAUDE.md](CLAUDE.md)** — geliştirme süreci, kurallar, build tuzakları, ajan tanımları
- **[assets/brand/README.md](assets/brand/README.md)** — marka, renkler, ikon dosyaları
- **[tools/icon-forge/README.md](tools/icon-forge/README.md)** — ikon türetme aracı

> `YAPILACAKLAR.md` (yol haritası), `KARARLAR.md` (verilen kararlar ve
> gerekçeleri) ve Terakki'den devralınan arşiv belgeleri **yerel çalışma
> belgeleridir**; depoya dahil edilmez.

---

## ♿ Erişilebilirlik

- Her Pressable öğeye `accessibilityRole` ve etiket eklenir.
- Renkler `src/components/themeTokens.ts`'den gelir; hiçbir renk sabit kodlanmaz.
- Yazı boyutları cihazın metni ölçekleme ayarına uyar.
- Açık + Koyu tema tam destekli.

---

## 📄 Lisans

(Lisans türü henüz belirlenmedi.)
