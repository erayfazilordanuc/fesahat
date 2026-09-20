# Marka

Terakki'nin logo kaynağı. `assets/` kökündeki uygulama ikonları buradan türetilir;
elle düzenlenmez.

## Marka

**Kademe** — sabit adımla yükselen dört eşit modül; sonuncusu boş.

| İstenen anlam | Şekilde karşılığı |
| --- | --- |
| Düzen | Modüller birebir aynı boyda, aralık sabit |
| Sistem | Yerleşim serbest değil, tek bir adım kuralına uyuyor |
| Yükselme | Dizi çapraz çıkıyor |
| Gelişme | Son modül boş — şekil "bitti" demiyor, sıradakini gösteriyor |

Boş modül dolu olanlarla aynı kutuda; yani "eksik" değil, **sıradaki**.
Marka bu yüzden bir durumu değil bir gidişi anlatıyor.

### Elenen fikirler

Denemeler `adaylar/` altında ve `tools/icon-forge/marks.py` geçmişinde.

| Fikir | Neden elendi |
| --- | --- |
| Kollarını kaldırmış kişi | Genel geçer bir "başarı" ikonu; anlam taşımıyordu |
| Doğan güneş | Yarım daire + ufuk çizgisi kaçınılmaz olarak şapka gibi okundu |
| Açık kitap | İki çizgi hâlinde aşağı bakan V; hacim verilince papyona döndü |
| Eşik (kemerli kapı) | At nalı / mıknatıs okunuyor |
| Kitap yığını | Eşit çubuklar tabak yığını, koyu temada hamburger menü |
| Piramit (Yapı) | Simetrik olduğu için düzeni anlatıp yükselmeyi anlatmıyor; ödül kürsüsü |
| Büyüyen kademe | Modüller büyüyünce ritim bozuluyor, en küçüğü kalıntı gibi duruyor |
| Ağ (düğümler) | Doğru okunuyor ama standart "trend grafiği" ikonundan ayrışmıyor |

## Renkler

Kaynak `src/components/AppUI.tsx` ve `src/components/ScreenBackground.tsx`;
buradaki değerler onların kopyası, değişirse birlikte değişmeli.

| Kullanım | Açık tema | Koyu tema |
| --- | --- | --- |
| Figür | `#059669` | `#34d399` |
| Ekran zemini | `#f6fdf9` | `#121214` |

Uygulama ikonu degradesi `ikon/terakki-icon-master.svg`'den gelir — yukarıdan
aşağı üç duraklı: `#05B179` → `#029568` → `#007B59` (2026-09-19 kararı; eski
iki duraklı `#10B981` → `#04614A` ve ara sürüm `#0EA876 → #0A8D65 → #077456`
`arsiv/` altında). Orta durak `#029568`; Android `adaptiveIcon.backgroundColor`,
native splash zemini ve `SplashOverlay` bu değeri kullanıyor.

## Dosyalar

| Dosya | Ne |
| --- | --- |
| `ikon/terakki-icon-master.svg` | Uygulama ikonunun kaynağı: degrade zemin + beyaz figür. **Degrade renkleri buradan okunur.** |
| `ikon/terakki-icon-mark.svg` | Şeffaf zeminde yalnız figür. **Figür geometrisi buradan okunur.** |
| `ikon/terakki-icon-white.svg` | Beyaz zeminli varyant |
| `ikon/terakki-1024.png` · `512` · `192` | Master'ın rasterları (figür tam boy) |
| `app-icon.png` | `assets/icon.png`'nin kopyası (figür %52) |
| `adaylar/` | Elenen adaylar |

## Yeniden üretmek

```bash
python3 tools/icon-forge/build_from_brand.py
```

`assets/icon.png`, `android-icon-background.png`, `android-icon-foreground.png`,
`android-icon-monochrome.png`, `splash-icon.png` ve `brand/app-icon.png` üretilir.
İkon figür boyutu betikteki `MARK_SCALE` (şu an `0.52`); splash görseli tam boy
figür taşır (`SPLASH_SCALE`). Native tarafa işlemek için ardından
`npx expo prebuild` — önce `DEVAM.md` "Ortam tuzakları"nı oku.

`notification-icon.png` bu betikle üretilmiyor.

## Açılış ekranı (splash)

İki katman:

1. **Native splash** — `app.json` → `expo-splash-screen`: düz `#029568` zemin,
   ortada `splash-icon.png` 170 dp genişlikte. Android 12+ native splash degrade
   ve yazı desteklemediği için bu kadar.
2. **`src/components/SplashOverlay.tsx`** — native splash'in birebir aynısıyla
   başlar, onu kapatır; degradeyi (`#05B179` → `#029568` → `#007B59`) ve altındaki
   kaligrafik "Terakki" yazısını açar, sonra uygulamaya solar.

Yazı fontu **Italianno** (`assets/fonts/`, SIL Open Font License —
`Italianno-OFL.txt`). Zemin rengi ve `imageWidth` iki yerde birden geçiyor;
biri değişirse diğeri de değişmeli.
