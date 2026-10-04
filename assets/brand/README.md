# Marka: Fesahat

Fesahat'ın logo kaynağı. `assets/` kökündeki uygulama ikonları buradan türetilir.
**Elle düzenlenmez — `python3 tools/icon-forge/build_from_brand.py` ile yeniden üretilir.**

---

## 🗣 Marka Tanımı

**Geçici İşaret:** Zümrüt renk degrade zemin üzerinde beyaz konuşma balonu. Balon içinde yeşil **"F"** harfi.

**Anlam:** Dil / Söz / Konuşma / İletişim. Balonu seçmek, dikte etme / dinleme dinamiğini işaret eder.

⚠️ **Nihai Logo Kararı Açık**

Bu işaret geçici bir çözümdür. Logo tasarımı karar beklemeye alındı. İcon-forge araçlarına
kaynakların dosya adları uyarlanmıştır (Terakki → Fesahat); tasarım değişirse `build_brand_svg.py` yeniden çalıştırılacak.

### Terakki'den Devralınan Elenen Fikirler

Aynı tuzaklara düşülmesin diye Terakki'nin elenen logo adayları:

- **Açık kitap:** Hacim verilince papyon gibi okunuyor
- **Eşik (kemerli kapı):** At nalı / mıknatıs okunuyor
- **Kitap yığını:** Hamburger menü benzediği için
- **Piramit:** Yükselişi, ritmi anlatmıyor; ödül kürsüsü gibi
- **Ağ (düğümler):** Standart trend grafiği ikonundan ayrışmıyor

## 🎨 Renkler

| Adı | Hex | Kullanım |
| --- | --- | --- |
| Zümrüt | `#059669` | Tema rengi, icon aktivasyon (Bugün sekme), figür (açık tema) |
| Zümrüt Açık | `#34d399` | Figür (koyu tema) |
| Sıcak Kâğıt | `#fcfbf7` | Metin & ikon (koyu zemin) |
| Derin Gece | `#121214` | Zemin (koyu tema) |

**Uygulama Ikonu Degradesi:** `ikon/fesahat-icon-master.svg`'den okunur — yukarıdan aşağı 3 durak:

```
#05B179 (0%) → #029568 (50%) → #007B59 (100%)
```

Orta durak `#029568` şu yerlerde kullanılır:
- `app.json` → `android.adaptiveIcon.backgroundColor`
- Native splash zemini
- `SplashOverlay.tsx` arka planı
- iOS `SplashScreenBackground.colorset`

## 📄 Dosyalar

| Dosya | Amaç |
| --- | --- |
| `ikon/fesahat-icon-master.svg` | **Kaynağı.** Degrade zemin (`stop-color` 3 durak) + beyaz figür. Degrade renkleri buradan okunur. |
| `ikon/fesahat-icon-mark.svg` | **Figür kaynağı.** Şeffaf zemin, yalnız figür (M/L/Z komutları, evenodd doldurma). `build_from_brand.py` geometri ve kontur bilgisini buradan çıkarır. |
| `ikon/fesahat-icon-white.svg` | Beyaz zemin + şeffaf figür (varsa tasarımda işe yarayabilir) |
| `app-icon.png` | Master'ın PNG kopyası; tasarım amaçları için |
| `arsiv/` | Terakki'nin eski ikon dosyaları (referans / geri dönüş) |
| `adaylar/` | Elenen tasarım adayları (varsa) |

## 🔄 İkonları Yeniden Üretmek

**Şu zaman yeniden üret:**
- Degrade renkleri değişti (master.svg `stop-color`)
- Figür biçimi değişti (mark.svg path veya scale)
- MARK_SCALE / SPLASH_SCALE ayarları değişti

### Adım 1: SVG kaynakları hazırla
Tasarımcı `fesahat-icon-master.svg` ve `fesahat-icon-mark.svg`'yi güncellediyse:

```bash
python3 tools/icon-forge/build_brand_svg.py
```
(SVG'leri oluşturup normalize eder; gerekirse çalıştır.)

### Adım 2: PNG ikonlarını türet
```bash
python3 tools/icon-forge/build_from_brand.py
```

Çıktılar:
- `assets/icon.png` (1024×1024, degrade + figür)
- `assets/brand/app-icon.png` (icon.png'ye aynı)
- `assets/android-icon-background.png` (zemin)
- `assets/android-icon-foreground.png` (figür)
- `assets/android-icon-monochrome.png` (figür)
- `assets/splash-icon.png` (tam boy figür)
- `assets/favicon.png` (48×48, web)
- `assets/notification-icon.png` (96×96, bildirim)

### Adım 3: Native'e işle
```bash
npx expo prebuild --platform android --clean
# veya
npx expo prebuild --platform ios --clean
```

*⚠️ Prebuild'den önce [DEVAM.md](../../DEVAM.md) → "Ortam tuzakları" oku.*

## 🌅 Açılış Ekranı (Splash)

İki katman:

1. **Native splash** — `app.json` → `expo-splash-screen`: düz `#029568` zemin, ortada `splash-icon.png` 170 dp. Android 12+ degrade desteklemez.
2. **`src/components/SplashOverlay.tsx`** — native splash'in üzerine: degrade zemin + kaligrafik "Fesahat" yazısı. Yazı fontu **Italianno** (`assets/fonts/`, SIL OFL).

**Dikkat:** Zemin rengi `#029568` ve `imageWidth: 170` iki yerde duruyor:
- `app.json` → `expo-splash-screen`
- `SplashOverlay.tsx`

Biri değişirse diğeri de değişmeli.
