"""Seçilen işaretten `assets/brand/ikon/` SVG'lerini üretir.

`marks.py` içindeki CHOSEN adayı 1024 tuvalde çizer ve üç dosya yazar:
  fesahat-icon-mark.svg    şeffaf zeminde yalnız figür, tam boy (Zümrüt)
  fesahat-icon-master.svg  degrade zemin + beyaz figür (MARK_SCALE ile ortalı)
  fesahat-icon-white.svg   beyaz zemin + Zümrüt figür

Figür tek dış kontur + delikten oluşur; `fill-rule="evenodd"` ile yazılır.
`build_from_brand.py` PNG'leri bu SVG'lerden okur — ikon ya da figür değişecekse
önce bu betik, sonra o çalıştırılır.

Kullanım:
    python3 tools/icon-forge/build_brand_svg.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from marks import MARKS, ICON_GRADIENT
from build_from_brand import MARK_SCALE

CHOSEN = 'A'  # Balon F
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
OUT = os.path.join(ROOT, 'assets/brand/ikon')
SIZE = 1024
EMERALD = '#059669'


def _hex(c):
    return '#%02X%02X%02X' % tuple(c)


def path_d(polys, holes):
    def sub(p):
        return 'M ' + ' L '.join('%.1f %.1f' % pt for pt in p) + ' Z'
    return ' '.join(sub(p) for p in list(polys) + list(holes))


def svg(body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
            'width="%d" height="%d">%s</svg>\n' % (SIZE, SIZE, SIZE, SIZE, body))


def main():
    fn = next(f for k, _, f in MARKS if k == CHOSEN)
    name = next(n for k, n, _ in MARKS if k == CHOSEN)
    polys, holes = fn(SIZE)
    d = path_d(polys, holes)
    k = MARK_SCALE
    t = 'translate(%.2f,%.2f) scale(%.5f)' % (SIZE / 2 * (1 - k), SIZE / 2 * (1 - k), k)
    stops = ''.join('<stop offset="%s" stop-color="%s"/>' % (o, _hex(c))
                    for o, c in zip(('0', '0.5', '1'), ICON_GRADIENT))

    files = {
        'fesahat-icon-mark.svg': svg(
            '<path transform="translate(0,0) scale(1)" d="%s" fill="%s" fill-rule="evenodd"/>'
            % (d, EMERALD)),
        'fesahat-icon-master.svg': svg(
            '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">%s</linearGradient></defs>'
            '<rect width="%d" height="%d" fill="url(#g)"/>'
            '<path transform="%s" d="%s" fill="#FFFFFF" fill-rule="evenodd"/>'
            % (stops, SIZE, SIZE, t, d)),
        'fesahat-icon-white.svg': svg(
            '<rect width="%d" height="%d" fill="#FFFFFF"/>'
            '<path transform="%s" d="%s" fill="%s" fill-rule="evenodd"/>'
            % (SIZE, SIZE, t, d, EMERALD)),
    }
    os.makedirs(OUT, exist_ok=True)
    for fname, content in files.items():
        with open(os.path.join(OUT, fname), 'w', encoding='utf-8') as f:
            f.write(content)
        print('  yazıldı: assets/brand/ikon/' + fname)
    print('seçilen: %s — %s (MARK_SCALE %.2f)' % (CHOSEN, name, MARK_SCALE))


if __name__ == '__main__':
    main()
