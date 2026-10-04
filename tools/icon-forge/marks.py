"""Fesahat logo adayları — geçici işaret (nihai logo kararı açık).

Fesahat = dil, söz, konuşma, anlama. İşaret bu yüzden bir konuşma balonu
çevresinde kuruluyor.

Ortak kısıtlar:
  · Figür 512'lik tuvalin orta ~%78-80'ine sığar (adaptive icon güvenli alanı).
  · Tek renk (beyaz) siluet. Hiçbir çizgi/boşluk tuvalin 1/12'sinden ince değil;
    48px bildirim ikonunda ve monochrome Android ikonunda okunmalı.
  · Her aday TEK dış kontur + delikler döndürür: `(polys, holes)`. Böylece SVG'ye
    `fill-rule="evenodd"` ile birebir yazılabiliyor (bkz. build_brand_svg.py).

Aşağıda eski "Kademe" adayları arşiv olarak duruyor (ARSIV_MARKS); build_app_assets.py
onları kullanıyor, güncel ikon hattı kullanmıyor.
"""
import math

from draw import circle, rrect, thick_line


# ---------------------------------------------------------------- yardımcılar

def fillet(pts, radii):
    """Çokgenin köşelerini yuvarlar. radii[i] == 0 → köşe keskin kalır.

    Köşe açısı ne olursa olsun çalışır: teğet noktaları köşeden `r / tan(yarım
    açı)` uzakta, yay merkezi açıortay üzerinde. Dışbükey ve içbükey köşeler aynı
    formülle yuvarlanıyor.
    """
    n = len(pts)
    out = []
    for i in range(n):
        r = radii[i]
        p = pts[i]
        if not r:
            out.append(p)
            continue
        a, b = pts[i - 1], pts[(i + 1) % n]
        u1 = (p[0] - a[0], p[1] - a[1])
        u2 = (b[0] - p[0], b[1] - p[1])
        l1, l2 = math.hypot(*u1), math.hypot(*u2)
        u1 = (u1[0] / l1, u1[1] / l1)
        u2 = (u2[0] / l2, u2[1] / l2)
        v1 = (-u1[0], -u1[1])                    # köşeden önceki noktaya
        cosphi = max(-1.0, min(1.0, v1[0] * u2[0] + v1[1] * u2[1]))
        half = math.acos(cosphi) / 2
        d = r / math.tan(half)
        t1 = (p[0] - u1[0] * d, p[1] - u1[1] * d)
        t2 = (p[0] + u2[0] * d, p[1] + u2[1] * d)
        bis = (v1[0] + u2[0], v1[1] + u2[1])
        bl = math.hypot(*bis)
        c = (p[0] + bis[0] / bl * r / math.sin(half),
             p[1] + bis[1] / bl * r / math.sin(half))
        a1 = math.atan2(t1[1] - c[1], t1[0] - c[0])
        a2 = math.atan2(t2[1] - c[1], t2[0] - c[0])
        da = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
        steps = max(6, int(abs(da) / (math.pi / 2) * 10))
        for k in range(steps + 1):
            a = a1 + da * k / steps
            out.append((c[0] + r * math.cos(a), c[1] + r * math.sin(a)))
    return out


def _scaled(pts, u):
    return [(x * u, y * u) for x, y in pts]


def _bubble(x0, y0, x1, y1, r, tail, tail_r=(14, 24, 24)):
    """Tek konturlu konuşma balonu (512'lik birimlerde).

    tail = 'bl' (sol-alt), 'br' (sağ-alt), 'tr' (sağ-üst), 'tl' (sol-üst):
    kuyruğun çıktığı köşe. Kuyruk kenarın bir bölümünü kaplar, ucu dışarı bakar.
    """
    # Kuyruk her zaman yatay kenarda (alt ya da üst). Gövde saat yönünde:
    # sol-üst → sağ-üst → sağ-alt → sol-alt.
    w = x1 - x0
    tw = 96           # kuyruk tabanı genişliği
    th = 80            # kuyruk çıkıntısı
    sh = 14            # ucun tabanın dışına kayması
    body = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
    rad = [r, r, r, r]
    if tail == 'bl':
        bx = x0 + r + 24
        ins = [(bx + tw, y1), (bx - sh, y1 + th), (bx, y1)]
        i = 3
    elif tail == 'br':
        bx = x1 - r - 24 - tw
        ins = [(bx + tw, y1), (bx + tw + sh, y1 + th), (bx, y1)]
        i = 3
    elif tail == 'tr':
        bx = x1 - r - 24 - tw
        ins = [(bx, y0), (bx + tw + sh, y0 - th), (bx + tw, y0)]
        i = 1
    else:  # 'tl'
        bx = x0 + r + 24
        ins = [(bx, y0), (bx - sh, y0 - th), (bx + tw, y0)]
        i = 1
    # alt kenara (y1) giren noktalar sağdan sola gider: (3) köşesinden önce eklenir.
    if tail in ('bl', 'br'):
        pts = body[:3] + ins + body[3:]
        radii = rad[:3] + [tail_r[1], tail_r[0], tail_r[2]] + rad[3:]
    else:
        pts = body[:1] + ins + body[1:]
        radii = rad[:1] + [tail_r[1], tail_r[0], tail_r[2]] + rad[1:]
    return fillet(pts, radii)


def _letter_f(x, y, w, h, t, mid_w, mid_y, r):
    """Tek konturlu "F" (köşe yarıçapları r). Sol-üst (x, y), kalınlık t."""
    mt = mid_y            # orta çubuğun üst kenarı (y'den itibaren)
    pts = [(x, y), (x + w, y), (x + w, y + t), (x + t, y + t),
           (x + t, y + mt), (x + mid_w, y + mt), (x + mid_w, y + mt + t),
           (x + t, y + mt + t), (x + t, y + h), (x, y + h)]
    radii = [r, r, r, 0, 0, r, r, 0, r, r]
    return fillet(pts, radii)


# ---------------------------------------------------------------- adaylar

def balon_f(S):
    """A — Balon + F.

    Konuşma balonunun içinde, boşluk olarak kesilmiş büyük "F". Balon = söz,
    F = Fesahat. Tek bakışta okunur; 48px'te F'nin üç kolu hâlâ ayrışıyor.
    Tuzak kontrolü: kuyruk yalnızca bir yöne bakıyor, simetrik değil → papyon /
    nal gibi başka bir nesneye kaçmıyor.
    """
    u = S / 512.0
    body = _bubble(48, 60, 464, 372, 100, 'bl')
    f = _letter_f(184, 124, 150, 176, 48, 110, 70, 14)
    return [_scaled(body, u)], [_scaled(f, u)]


def iki_balon(S):
    """B — İki balon.

    Söz ve karşılık: biri solda-üstte dolu, diğeri sağda-altta; kuyrukları
    birbirine dönük. Alttakinde iki satır "söz" çizgisi kesik. Dolu balon
    çevresi boşluklu (çakışma yok) — yarım saydam bindirme gerekmesin diye.
    """
    u = S / 512.0
    a = _bubble(36, 40, 316, 220, 60, 'bl')
    b = _bubble(196, 300, 476, 460, 60, 'tr')
    lines = [thick_line((250, 360), (426, 360), 28),
             thick_line((250, 408), (358, 408), 28)]
    return [_scaled(a, u), _scaled(b, u)], [_scaled(l, u) for l in lines]


def balon_cizgi(S):
    """C — Balon + üç söz çizgisi.

    Aynı balon, içinde üç yatay çizgi (uzun, uzun, kısa) — "söz" doğrudan
    çizgiyle anlatılıyor. Harf yok, dil bağımsız; ama genel "sohbet" ikonuna en
    yakın aday: ayrışmıyor.
    """
    u = S / 512.0
    body = _bubble(48, 60, 464, 372, 100, 'bl')
    lines = [thick_line((140, 146), (372, 146), 38),
             thick_line((140, 216), (372, 216), 38),
             thick_line((140, 286), (276, 286), 38)]
    return [_scaled(body, u)], [_scaled(l, u) for l in lines]


# ---------------------------------------------------------------- arşiv (Kademe)

def _module(x, y, size, r, u):
    return rrect(x * u, y * u, size * u, size * u, r * u)


def _outline(x, y, size, r, u, wall=22):
    """Dolu değil, çerçeve modül: dış kare eksi iç kare."""
    return (_module(x, y, size, r, u),
            _module(x + wall, y + wall, size - 2 * wall, max(r - wall, 6), u))


def kademe(S):
    """A — Kademe.

    Eşit modüller sabit adımla yükseliyor; sonuncusu boş.

    Düzen  → modüller birebir aynı, aralık sabit.
    Sistem → yerleşim serbest değil, tek bir adım kuralına uyuyor.
    Yükselme → çapraz.
    Gelişme → dizinin açık ucu; şekil "bitti" demiyor.
    """
    u = S / 512.0
    m, dx, dy, x0, y0 = 96, 104, 84, 48, 344
    filled = [_module(x0 + dx * i, y0 - dy * i, m, 26, u) for i in range(3)]
    outer, inner = _outline(x0 + dx * 3, y0 - dy * 3, m, 26, u)
    return filled + [outer], [inner]


def kademe_buyuyen(S):
    """B — Kademe (büyüyen).

    Aynı ritim, ama modüller yükseldikçe büyüyor. Düzenden bir miktar feragat
    edip gelişmeyi öne alıyor: yalnızca ilerlemiyorsun, kapasiten de artıyor.
    """
    u = S / 512.0
    spec = [(104, 380, 72), (196, 296, 84), (292, 208, 96)]
    filled = [_module(cx - s / 2, cy - s / 2, s, s * 0.27, u) for cx, cy, s in spec]
    ox, oy, os_ = 388, 116, 108
    outer, inner = _outline(ox - os_ / 2, oy - os_ / 2, os_, os_ * 0.27, u, wall=24)
    return filled + [outer], [inner]


def ag(S):
    """C — Ağ.

    Birbirine bağlı düğümler yükselen bir hat üzerinde. Sistem en yalın hâliyle
    budur: düğümler ve aralarındaki bağ. Düğümler büyüyerek gidiyor — ilerledikçe
    kapasite artıyor.
    """
    u = S / 512.0
    nodes = [(106, 386, 38), (256, 268, 50), (406, 140, 62)]
    links = [thick_line((nodes[i][0] * u, nodes[i][1] * u),
                        (nodes[i + 1][0] * u, nodes[i + 1][1] * u), 30 * u)
             for i in range(len(nodes) - 1)]
    return links + [circle(cx * u, cy * u, r * u) for cx, cy, r in nodes], []


MARKS = [
    ('A', 'Balon F', balon_f),
    ('B', 'İki balon', iki_balon),
    ('C', 'Balon çizgi', balon_cizgi),
]

ARSIV_MARKS = [
    ('A', 'Kademe', kademe),
    ('B', 'Kademe büyüyen', kademe_buyuyen),
    ('C', 'Ağ', ag),
]

# — Kimlik renkleri (YAPILACAKLAR_FESAHAT Bölüm 5) —
EMERALD_LIGHT = (0x05, 0x96, 0x69)   # Zümrüt #059669
EMERALD_DARK = (0x34, 0xd3, 0x99)    # koyu temada figür
# Uygulama ikonu degradesi: yukarıdan aşağı üç duraklı (master.svg ile aynı).
ICON_GRADIENT = [(0x05, 0xb1, 0x79), (0x02, 0x95, 0x68), (0x00, 0x7b, 0x59)]
SCREEN_LIGHT = (0xfc, 0xfb, 0xf7)    # Sıcak Kâğıt #fcfbf7
SCREEN_DARK = (0x12, 0x12, 0x14)     # Derin Gece #121214
