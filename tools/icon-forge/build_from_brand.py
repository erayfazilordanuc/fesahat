"""Uygulama ikonlarını `assets/brand/ikon/` kaynağından üretir.

Kaynaklar:
  fesahat-icon-master.svg → zemin degradesi (stop-color'lar)
  fesahat-icon-mark.svg   → figür geometrisi (yalnızca M/L/Z; evenodd, delikli)

SVG'ler `build_brand_svg.py` ile üretilir; figür ya da MARK_SCALE değişirse önce
o çalıştırılır. Figür, mark.svg'deki tam tuval yerleşiminin MARK_SCALE katı
olarak ortalanır.
Degrade SVG ile birebir aynı: yukarıdan aşağı, piksel merkezinden örneklenir.

Kullanım:
    python3 tools/icon-forge/build_from_brand.py
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from draw import rasterize
from png import write_png

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
BRAND = os.path.join(ROOT, 'assets/brand/ikon')
ASSETS = os.path.join(ROOT, 'assets')

SIZE = 1024
MARK_SCALE = 0.62  # amblem boyutu (balon geniş bir figür; Android güvenli alanı %66)
# Splash görseli tam boy figür taşır; ekrandaki boyutu app.json → expo-splash-screen
# `imageWidth` belirler ve SplashOverlay aynı değeri kullanır.
SPLASH_SCALE = 1.0
# Bildirim ikonu (96×96, beyaz + şeffaf): küçük boyutta figür tuvali daha dolu
# doldursun. Android yalnızca alfa kanalını kullanır.
NOTIFICATION_SIZE = 96
NOTIFICATION_SCALE = 1.08
WHITE = (255, 255, 255)


def _svg(name):
    s = open(os.path.join(BRAND, name), encoding='utf-8').read()
    return re.sub(r'<metadata>.*?</metadata>', '', s, flags=re.S)


def gradient_stops():
    found = re.findall(r'<stop offset="([\d.]+)" stop-color="#([0-9A-Fa-f]{6})"',
                       _svg('fesahat-icon-master.svg'))
    assert len(found) >= 2, 'master.svg içinde degrade durakları bulunamadı'
    return [(float(o), tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))) for o, c in found]


def grad_at(y, size, stops):
    t = (y + 0.5) / size
    for (o0, c0), (o1, c1) in zip(stops, stops[1:]):
        if t <= o1:
            break
    f = min(max((t - o0) / (o1 - o0), 0.0), 1.0)
    return tuple(round(c0[i] + (c1[i] - c0[i]) * f) for i in range(3))


def _inside(pt, poly):
    x, y = pt
    c = False
    for i in range(len(poly)):
        (x0, y0), (x1, y1) = poly[i - 1], poly[i]
        if (y0 > y) != (y1 > y) and x < x0 + (y - y0) / (y1 - y0) * (x1 - x0):
            c = not c
    return c


def mark_shapes(size, scale):
    """(dış konturlar, delikler). Delik = tek sayıda başka konturun içindeki kontur."""
    s = _svg('fesahat-icon-mark.svg')
    tx, ty, k = map(float, re.search(
        r'translate\(([-\d.]+),([-\d.]+)\) scale\(([-\d.]+)\)', s).groups())
    d = re.search(r' d="([^"]+)"', s).group(1)
    assert set(re.findall(r'[A-Za-z]', d)) <= {'M', 'L', 'Z'}, 'yalnızca M/L/Z destekleniyor'
    u = size / 1024
    polys = []
    for sub in re.findall(r'M([^Z]+)Z', d):
        nums = list(map(float, re.findall(r'-?\d+(?:\.\d+)?', sub)))
        polys.append([((((x * k + tx) - 512) * scale + 512) * u,
                       (((y * k + ty) - 512) * scale + 512) * u)
                      for x, y in zip(nums[0::2], nums[1::2])])
    outer, holes = [], []
    for i, p in enumerate(polys):
        depth = sum(_inside(p[0], q) for j, q in enumerate(polys) if j != i)
        (holes if depth % 2 else outer).append(p)
    return outer, holes


def compose(mask, fg, stops=None, size=SIZE):
    """stops yoksa şeffaf zemin; varsa degrade zemin üzerine figür."""
    px = bytearray(size * size * 4)
    for y in range(size):
        row = grad_at(y, size, stops) if stops else None
        for x in range(size):
            a = mask[y * size + x]
            i = (y * size + x) * 4
            if row is None:
                px[i:i + 3] = bytes(fg)
                px[i + 3] = a
            else:
                al = a / 255
                for c in range(3):
                    px[i + c] = round(row[c] * (1 - al) + fg[c] * al)
                px[i + 3] = 255
    return px


FAVICON_SIZE = 48


def downscale(px, src, dst):
    """Alan ortalamasıyla küçültür: her hedef piksel, kapladığı kaynak
    piksellerin ortalamasıdır (bilinear küçültmede kenarlar tırtıklanır)."""
    out = bytearray(dst * dst * 4)
    edges = [round(i * src / dst) for i in range(dst + 1)]
    for y in range(dst):
        y0, y1 = edges[y], edges[y + 1]
        for x in range(dst):
            x0, x1 = edges[x], edges[x + 1]
            acc = [0, 0, 0, 0]
            for sy in range(y0, y1):
                row = sy * src
                for sx in range(x0, x1):
                    i = (row + sx) * 4
                    for c in range(4):
                        acc[c] += px[i + c]
            n = (y1 - y0) * (x1 - x0)
            out[(y * dst + x) * 4:(y * dst + x) * 4 + 4] = bytes(round(v / n) for v in acc)
    return out


def main():
    stops = gradient_stops()
    print('Degrade:', ' → '.join('#%02X%02X%02X' % c for _, c in stops))
    mask = rasterize(SIZE, *mark_shapes(SIZE, MARK_SCALE))
    icon = compose(mask, WHITE, stops)
    fg = compose(mask, WHITE)
    targets = [
        ('icon.png', icon),
        ('brand/app-icon.png', icon),
        ('android-icon-background.png', compose(bytes(SIZE * SIZE), WHITE, stops)),
        ('android-icon-foreground.png', fg),
        ('android-icon-monochrome.png', fg),
        ('splash-icon.png', compose(rasterize(SIZE, *mark_shapes(SIZE, SPLASH_SCALE)), WHITE)),
    ]
    for name, px in targets:
        write_png(os.path.join(ASSETS, name), SIZE, SIZE, px)
        print('  yazıldı: assets/' + name)

    # Bildirim ikonu (app.json → expo-notifications `icon`): doğrudan 96px'te
    # rasterize edilir — 1024'ten küçültmekten daha keskin.
    n = NOTIFICATION_SIZE
    write_png(os.path.join(ASSETS, 'notification-icon.png'), n, n,
              compose(rasterize(n, *mark_shapes(n, NOTIFICATION_SCALE)), WHITE, size=n))
    print('  yazıldı: assets/notification-icon.png')

    # Web simgesi (app.json → web.favicon): icon.png'nin küçültülmüşü.
    write_png(os.path.join(ASSETS, 'favicon.png'), FAVICON_SIZE, FAVICON_SIZE,
              downscale(icon, SIZE, FAVICON_SIZE))
    print('  yazıldı: assets/favicon.png')


if __name__ == '__main__':
    main()
