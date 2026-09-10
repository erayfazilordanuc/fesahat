# Terakki (React Native / Expo SDK 54)

Terakki, kişisel gelişimi tek çatı altında toplayan modüler bir mobil uygulamadır: kariyer ve mülakat pratiği, diksiyon, belagat, nefes & beden kontrolü, zihin egzersizleri, günlük alışkanlıklar ve bunların ölçümü.

Uygulama savunma sanayii mülakat simülatörü olarak doğdu; mülakat modülü hâlâ güçlü bir sütun olarak yerini korumakla birlikte artık yedi temel gelişim sütunundan biridir.

Yol haritası için [YAPILACAKLAR.md](YAPILACAKLAR.md), verilmiş mimari kararlar için [KARARLAR.md](KARARLAR.md).

---

## 🏛 Mimari ve Gelişim Sütunları

Uygulama 7 ana gelişim sütunu etrafında şekillenmiştir:

1. **Kariyer & Mülakat:** Şirket (ASELSAN, BAYKAR, TUSAŞ vb.) ve departman odaklı özelleştirilmiş mülakatlar, zaman baskılı kriz/stres simülasyonu, yapay zekâ performans analizi ve sektör haber akışı.
2. **Konuşma & Diksiyon:** Artikülasyon, tekerlemeler, vurgu-tonlama, konuşma temposu ve dolgu kelime avı egzersizleri.
3. **Dil & İfade (Belagat):** Meânî, Beyân ve Bedî' klasik müfredatı; *öğren → tanı → üret* akışıyla edebi sanatlar ve fesahat egzersizleri.
4. **Nefes & Beden:** Diyafram nefes teknikleri ve kontrollü veriş süresi (dayanıklılık) testleri.
5. **Zihin & Zekâ:** Odaklanma, hafıza ve pratik düşünmeye yönelik interaktif bilişsel egzersizler.
6. **Alışkanlık & Rutin:** Aralıklı hatırlatıcılar, günlük pratik sayaçları ve bildirim eşleme.
7. **Ölçüm & Karne:** Tüm sütunların test eğilimleri, seri takibi ve gelişim grafikleri.

---

## 📱 Gezinme Yapısı (4 Ana Sekme)

Arayüz "Island" (Adacık) tarzı modern alt menüye ve açık/koyu tema desteğine sahiptir:

```
┌────────┬─────────┬──────────┬────────┐
│ Bugün  │ Gelişim │ İlerleme │ Profil │
└────────┴─────────┴──────────┴────────┘
```

- **Bugün (`TodayScreen`):** "Bugün ne yapmalıyım?" sorusunun tek ekranlık cevabı. Günlük pratik listesi (Günlük metin, Nefes, Diksiyon, Belagat), günün duası/sözü ve seri sayacı.
- **Gelişim (`GrowthScreen`):** 7 gelişim sütununun ana merkezi (Hub). Tüm modüllere ve alt ekranlara doğrudan erişim sağlar.
- **İlerleme (`ProgressScreen`):** Tüm sütunların ölçümleri: modül serileri, test eğilimleri (`TestTrend`), mülakat ve egzersiz geçmişi.
- **Profil (`ProfileScreen`):** Kullanıcı kimliği, profil ikon seçicisi, uygulama ayarları ve backend API yapılandırması.

---

## 🤖 Yapay Zekâ & Backend Mimarisi

- **İsteğe Bağlı Katman (Graceful Degradation):** Yapay zekâ özelliği kullanıcıya hiçbir kurulum yükü getirmeksizin çalışır ve **isteğe bağlıdır**. Sunucu kapalıyken veya ağ yokken uygulama %100 işlevsel kalır; yapay zekâsız da soru sorar, süre tutar ve günlük pratikleri yürütür. Analiz ekranı ve kartları teknik hata mesajı yerine sade durum uyarıları gösterir.
- **Express API Proxy (`server/server.ts`):** Google Gemini API (`@google/genai`) entegrasyonu sunucu tarafında çalışır. API anahtarı istemciye açık edilmez. Uygulama içi Ayarlar sekmesinden sunucu IP/Port adresi dinamik olarak değiştirilebilir.

---

## ⚙️ Gereksinimler & Geliştirme Ortamı

- **Node.js:** v18+
- **JDK 17:** Android derlemeleri için şarttır (Sistemde JDK 26 varsa brew üzerinden `openjdk@17` ayarlanmalıdır).
- **Expo SDK:** SDK 54 (`react-native` 0.81.5, NativeWind v4).
- **Expo Go:** Gerçek cihazda kablosuz test için.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleme
```bash
npm install
```
*Not: `npm install` sonrasında NativeWind yaması için `npx patch-package` otomatik olarak uygulanır.*

### 2. API Sunucusunu (Backend) Başlatma (İsteğe Bağlı)
Yapay zekâ mülakat analizi için root dizinde `.env` dosyası oluşturup anahtarınızı ekleyin:
```env
GEMINI_API_KEY=sizin_gemini_api_anahtariniz
```
Sunucuyu başlatın:
```bash
npm run server
```
*Express sunucusu `http://localhost:3000` portunda çalışacaktır.*

### 3. Mobil Uygulamayı (Expo) Başlatma
```bash
npm start
```
Bu komut ekranda bir **QR Kod** ve Metro Bundler konsolunu açar.

---

## 🧪 Test ve Hata Ayıklama (Debug)

### Yöntem 1: Gerçek Cihazda Kablosuz Test (Expo Go)
1. Telefonunuza **Expo Go** uygulamasını indirin.
2. Bilgisayarınız ve telefonunuz aynı Wi-Fi ağına bağlıyken `npm start` ile çıkan QR kodu taratın.

### Yöntem 2: Simülatör / Emülatör
- **iOS Simülatörü:** Terminalde `i` tuşuna basın veya `npm run ios`.
- **Android Emülatörü:** Terminalde `a` tuşuna basın veya `npm run android`.

### Yöntem 3: Kablolu Debug & Port Yönlendirme
Cihaz USB ile bağlıyken Metro Bundler portunu yönlendirmek için:
```bash
adb reverse tcp:8081 tcp:8081
```
veya `npx expo start --localhost` komutunu kullanabilirsiniz.

---

## 📦 Derleme (Build)

Native Android/iOS derleme yapılandırması:
```bash
# Clean prebuild ile native klasörleri yeniden üretme
npx expo prebuild --platform android --clean

# Local derleme çalıştırma
npm run android
```

EAS Build ile canlı çıktı (.apk/.ipa) alma:
```bash
eas build -p android --profile preview
```
