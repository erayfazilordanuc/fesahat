# icon-forge

Fesahat'ın ikon dosyalarını üreten araç takımı. Bağımlılığı yok — saf Python 3 (yalnızca `zlib` + `math`). Pillow/ImageMagick yerine yazıldı.

| Dosya | İş |
| --- | --- |
| `png.py` | PNG oku/yaz (8-bit, interlace yok). Alfa korunur. |
| `draw.py` | Anti-aliased poligon rasterleyici + şekil üreticileri (`rrect`, `circle`, `thick_line`, `chevron`, `arrow_head`) |
| `build_brand_svg.py` | SVG kaynakları (fesahat-icon-master.svg, mark.svg) oluşturup normalize eder. İçeri degrade durağı tanımları ve figür geometrisi girer. |
| `build_from_brand.py` | **Güncel.** PNG ikonlarını `assets/brand/ikon/` SVG'lerinden türet; uygulama ikonları ve bildirim ikonu. |
| `brand.py` | Degrade ve SVG yardımcı fonksiyonları |

## Günlük Kullanım

**PNG ikonlarını yeniden üret:**
```bash
python3 tools/icon-forge/build_from_brand.py
```

**SVG kaynakları güncelle** (tasarım değişirse):
```bash
python3 tools/icon-forge/build_brand_svg.py
```

Ayrıntılar: [assets/brand/README.md](../../assets/brand/README.md).

## Dikkat

`draw.py` içindeki dolgu **nonzero winding** kullanıyor ve poligonların sarım
yönünü doldurmadan önce tekdüze hâle getiriyor. Bu satır kaldırılırsa çakışan
iki şeklin ortak alanı delik olarak çıkar — ok gövdesi ok başının içinde delik
açıyordu, hata buradan geliyordu.

## Uygulama İkonları Türetimi

**Komut:**
```bash
python3 tools/icon-forge/build_from_brand.py
```

**Kaynaklar:**
- Degrade: `fesahat-icon-master.svg` → `<stop offset=... stop-color=...>`
- Figür: `fesahat-icon-mark.svg` → SVG path (M/L/Z komutları, evenodd doldurma)

Renk/boyut koda gömülü değil:
- `MARK_SCALE = 0.62` — uygulama ikonu figür boyutu (Android güvenli alan %66)
- `SPLASH_SCALE = 1.0` — splash figür boyutu (tam tuval)
- `NOTIFICATION_SCALE = 1.08` — bildirim ikonu (96×96 doğrudan)

**Çıktılar:**
| Dosya | Boyut | Amaç |
| --- | --- | --- |
| `assets/icon.png` | 1024×1024 | Uygulama ikonu (degrade + figür) |
| `assets/brand/app-icon.png` | 1024×1024 | icon.png'ye aynı |
| `assets/android-icon-background.png` | 1024×1024 | Adaptive zemin |
| `assets/android-icon-foreground.png` | 1024×1024 | Adaptive figür |
| `assets/android-icon-monochrome.png` | 1024×1024 | Adaptive monokrom |
| `assets/splash-icon.png` | 1024×1024 | Açılış ekranı figürü |
| `assets/notification-icon.png` | 96×96 | Bildirim ikonu |
| `assets/favicon.png` | 48×48 | Web simgesi |

**Degrade (güncel):** `#05B179` (0%) → `#029568` (50%) → `#007B59` (100%)

Orta durak (`#029568`) bu yerlerde de kullanılır:
- `app.json` → `android.adaptiveIcon.backgroundColor`
- Native splash zemin
- `SplashOverlay.tsx` arka planı
- iOS `SplashScreenBackground.colorset`
