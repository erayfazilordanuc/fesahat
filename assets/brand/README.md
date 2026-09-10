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

Uygulama ikonu degradesi profil ekranıyla **aynı yönde** — üstte açık, altta derin:
`#10b981` → `#059669` → `#047857`.

## Dosyalar

| Dosya | Ne |
| --- | --- |
| `mark.png` | 1024×1024, **şeffaf zemin**, kimlik yeşili. Bütün türetmelerin kaynağı. |
| `app-icon.png` | 1024×1024, degrade zemin + beyaz figür. `assets/icon.png`'nin olacağı hâl. |
| `contexts.png` | Dört bağlam tek karede: uygulama ikonu · açık tema · koyu tema · 96px beyaz siluet. |

## Yeniden üretmek

```bash
python3 tools/icon-forge/brand.py assets/brand
```

Geometri `tools/icon-forge/marks.py` içinde; başka aday seçilirse
`brand.py`'deki `CHOSEN` değiştirilir.

## Henüz yapılmadı

`assets/` kökündeki altı hedef (`icon.png`, `splash-icon.png`, `favicon.png`,
`android-icon-foreground.png`, `android-icon-monochrome.png`,
`notification-icon.png`) hâlâ eski kalkan logosunu taşıyor. Marka onaylanınca
buradan türetilecek — kuralları `YAPILACAKLAR.md` Bölüm 8'de.
