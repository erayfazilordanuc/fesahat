# icon-forge

Terakki'nin logo ve ikon dosyalarını üreten küçük araç takımı. Bağımlılığı yok —
saf Python 3 (yalnızca `zlib` + `math`). Makinede Pillow/ImageMagick olmadığı
için yazıldı.

| Dosya | İş |
| --- | --- |
| `png.py` | PNG oku/yaz (8-bit, interlace yok). Alfa korunur. |
| `draw.py` | Anti-aliased poligon rasterleyici + şekil üreticileri (`rrect`, `circle`, `thick_line`, `chevron`, `arrow_head`) |
| `marks.py` | Logo adaylarının geometrisi |
| `sheet.py` | Dört adayı dört bağlamda gösteren tek kontak sayfası |
| `each.py` | Her adayı ayrı dosya olarak dışa aktarır |

## Kullanım

```bash
cd tools/icon-forge
python3 sheet.py . /tmp/adaylar.png          # toplu karşılaştırma
python3 each.py  . ~/Desktop/logo-adaylari   # tek tek
```

## Dikkat

`draw.py` içindeki dolgu **nonzero winding** kullanıyor ve poligonların sarım
yönünü doldurmadan önce tekdüze hâle getiriyor. Bu satır kaldırılırsa çakışan
iki şeklin ortak alanı delik olarak çıkar — ok gövdesi ok başının içinde delik
açıyordu, hata buradan geliyordu.

## Sırada ne var

Logo seçilince tek şeffaf kaynaktan altı hedefin türetilmesi gerekiyor; her
birinin kuralı `YAPILACAKLAR.md` Bölüm 8'deki tabloda:
`icon.png`, `splash-icon.png`, `favicon.png`, `android-icon-foreground.png`,
`android-icon-monochrome.png`, `notification-icon.png`.
