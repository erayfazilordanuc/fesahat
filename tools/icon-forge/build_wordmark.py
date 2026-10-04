"""Splash ekranındaki "Fesahat" yazısını fontun eğrilerinden PNG olarak üretir.

NEDEN GÖRSEL, NEDEN CANLI YAZI DEĞİL:
Italianno'da bazı glifler (ör. 'i'nin noktası) ilerleme genişliğinin DIŞINA
taşıyor (glif 77: gövde x=32..247, nokta x=218..278, ilerleme 192). Kelimenin son
harfi böyle bir glifse Android metin kutusu son ilerleme genişliğinde bitiyor ve
taşan kısım kırpılıyordu (önceki marka yazısında 'i'nin noktası kayboluyordu).
NBSP eklemek, harfi ayrı `Text`e almak ve ZWNJ denendi; hiçbiri çözmedi (ayrıntı
KARARLAR.md). "Fesahat" 't' ile bitiyor; yine de aynı yolu kullanıyoruz — sabit bir
marka varlığı olarak font yüklenmesini beklemiyor, kuyruk/sap taşmaları kırpılmıyor.

Yazıyı burada kendimiz çizince Android'in metin motoru devreden çıkıyor: nokta
garanti çiziliyor. Ek kazanç — splash artık font yüklenmesini beklemiyor.

Şekillendirme (shaping) yok: harfler ilerleme genişliklerine göre yan yana
diziliyor. Kerning uygulanmıyor; bu yazı artık sabit bir marka varlığı.

Kullanım:
    python3 tools/icon-forge/build_wordmark.py
"""
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from draw import _fill, SS
from png import write_png

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
FONT = os.path.join(ROOT, 'assets/fonts/Italianno-Regular.ttf')
OUT = os.path.join(ROOT, 'assets/brand/wordmark-fesahat.png')

WORD = 'Fesahat'
#: Bir em'in kaç piksele karşılık geleceği. Ekranda yazı ~60pt; 4 katı
#: çözünürlükte üretip küçültmek kenarları temiz bırakıyor.
EM_PX = 240
PAD = 8  # kenarlarda birkaç piksel boşluk (kuyruklar kırpılmasın)
WHITE = (255, 255, 255)


# ---------------------------------------------------------------- font okuma

class Font:
    def __init__(self, path):
        self.d = open(path, 'rb').read()
        n = self.u16(4)
        self.t = {}
        for i in range(n):
            o = 12 + i * 16
            tag = self.d[o:o + 4].decode('latin1')
            self.t[tag] = struct.unpack('>II', self.d[o + 8:o + 16])[0]
        self.upem = self.u16(self.t['head'] + 18)
        self.loc_fmt = self.s16(self.t['head'] + 50)
        self.num_h = self.u16(self.t['hhea'] + 34)
        self._cmap = self._best_cmap()

    def u16(self, o):
        return struct.unpack('>H', self.d[o:o + 2])[0]

    def s16(self, o):
        return struct.unpack('>h', self.d[o:o + 2])[0]

    def _best_cmap(self):
        c = self.t['cmap']
        for i in range(self.u16(c + 2)):
            pid, eid, off = struct.unpack('>HHI', self.d[c + 4 + i * 8:c + 12 + i * 8])
            if (pid, eid) in ((3, 1), (0, 3), (0, 4)) and self.u16(c + off) == 4:
                return c + off
        raise SystemExit('format 4 cmap bulunamadı')

    def gid(self, ch):
        cp = ord(ch)
        b = self._cmap
        seg2 = self.u16(b + 6)
        seg = seg2 // 2
        ends = struct.unpack('>%dH' % seg, self.d[b + 14:b + 14 + seg2])
        sb = b + 14 + seg2 + 2
        starts = struct.unpack('>%dH' % seg, self.d[sb:sb + seg2])
        db = sb + seg2
        deltas = struct.unpack('>%dh' % seg, self.d[db:db + seg2])
        rb = db + seg2
        ranges = struct.unpack('>%dH' % seg, self.d[rb:rb + seg2])
        for i in range(seg):
            if starts[i] <= cp <= ends[i]:
                if ranges[i] == 0:
                    return (cp + deltas[i]) & 0xFFFF
                o = rb + i * 2 + ranges[i] + (cp - starts[i]) * 2
                g = self.u16(o)
                return 0 if g == 0 else (g + deltas[i]) & 0xFFFF
        raise SystemExit('%r fontta yok' % ch)

    def advance(self, g):
        i = min(g, self.num_h - 1)
        return self.u16(self.t['hmtx'] + i * 4)

    def _glyph_range(self, g):
        lo = self.t['loca']
        if self.loc_fmt == 0:
            return self.u16(lo + g * 2) * 2, self.u16(lo + g * 2 + 2) * 2
        return (struct.unpack('>I', self.d[lo + g * 4:lo + g * 4 + 4])[0],
                struct.unpack('>I', self.d[lo + g * 4 + 4:lo + g * 4 + 8])[0])

    def contours(self, g):
        """Glifin konturları: [[(x, y), ...], ...] — font birimlerinde, y yukarı."""
        s, e = self._glyph_range(g)
        if s == e:
            return []
        p = self.t['glyf'] + s
        nc = self.s16(p)
        if nc < 0:
            raise SystemExit('bileşik glif (%d) desteklenmiyor' % g)
        ends = [self.u16(p + 10 + i * 2) for i in range(nc)]
        npts = ends[-1] + 1
        q = p + 10 + nc * 2
        q += 2 + self.u16(q)  # instructions

        flags = []
        while len(flags) < npts:
            f = self.d[q]; q += 1
            flags.append(f)
            if f & 8:
                r = self.d[q]; q += 1
                flags += [f] * r
        flags = flags[:npts]

        xs, v = [], 0
        for f in flags:
            if f & 2:
                dx = self.d[q]; q += 1
                v += dx if (f & 16) else -dx
            elif not (f & 16):
                v += self.s16(q); q += 2
            xs.append(v)
        ys, v = [], 0
        for f in flags:
            if f & 4:
                dy = self.d[q]; q += 1
                v += dy if (f & 32) else -dy
            elif not (f & 32):
                v += self.s16(q); q += 2
            ys.append(v)

        out, start = [], 0
        for end in ends:
            pts = [(xs[i], ys[i], bool(flags[i] & 1)) for i in range(start, end + 1)]
            if pts:
                out.append(_flatten(pts))
            start = end + 1
        return out


def _flatten(pts, seg=12):
    """TrueType konturunu (on/off eğri noktaları) poligona çevirir.

    Ardışık iki off-curve nokta arasında örtük bir on-curve nokta var — TrueType
    quadratic B-spline kuralı.
    """
    # Başlangıcı bir on-curve noktaya kaydır; yoksa örtük orta noktayı üret.
    first_on = next((i for i, p in enumerate(pts) if p[2]), None)
    if first_on is None:
        x0, y0, _ = pts[0]
        x1, y1, _ = pts[-1]
        pts = [((x0 + x1) / 2, (y0 + y1) / 2, True)] + pts
        first_on = 0
    pts = pts[first_on:] + pts[:first_on]

    poly = [(pts[0][0], pts[0][1])]
    i = 1
    n = len(pts)
    cur = (pts[0][0], pts[0][1])
    while i <= n:
        x, y, on = pts[i % n]
        if on:
            poly.append((x, y))
            cur = (x, y)
            i += 1
            continue
        # off-curve: kontrol noktası. Bitiş ya sonraki on-curve ya örtük orta nokta.
        nx, ny, non = pts[(i + 1) % n]
        if not non:
            nx, ny = (x + nx) / 2, (y + ny) / 2
            step = 1
        else:
            step = 2
        for k in range(1, seg + 1):
            tt = k / seg
            a = (1 - tt) ** 2
            b = 2 * (1 - tt) * tt
            c = tt ** 2
            poly.append((a * cur[0] + b * x + c * nx, a * cur[1] + b * y + c * ny))
        cur = (nx, ny)
        i += step
    return poly


def signed_area(poly):
    return sum(poly[i][0] * poly[(i + 1) % len(poly)][1]
               - poly[(i + 1) % len(poly)][0] * poly[i][1]
               for i in range(len(poly))) / 2


def rasterize_rect(w, h, polys, holes):
    """draw.rasterize'ın dikdörtgen sürümü — orijinali yalnızca kare üretiyor."""
    W, H = w * SS, h * SS
    cov = _fill(W, H, [[(x * SS, y * SS) for x, y in p] for p in polys])
    if holes:
        neg = _fill(W, H, [[(x * SS, y * SS) for x, y in p] for p in holes])
        for i in range(W * H):
            if neg[i]:
                cov[i] = 0
    alpha = bytearray(w * h)
    area = SS * SS
    for y in range(h):
        for x in range(w):
            s = 0
            for dy in range(SS):
                row = (y * SS + dy) * W + x * SS
                for dx in range(SS):
                    s += cov[row + dx]
            alpha[y * w + x] = (s * 255) // area
    return alpha


def main():
    f = Font(FONT)
    scale = EM_PX / f.upem

    # Harfleri ilerleme genişliklerine göre diz; y ekranda aşağı doğru artsın.
    shapes = []  # (poligon, işaretli alan)
    pen = 0
    for ch in WORD:
        g = f.gid(ch)
        for c in f.contours(g):
            poly = [((pen + x) * scale, -y * scale) for x, y in c]
            shapes.append((poly, signed_area(c)))
        pen += f.advance(g)
    advance_w = pen

    xs = [p[0] for poly, _ in shapes for p in poly]
    ys = [p[1] for poly, _ in shapes for p in poly]
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)
    w = int(round(maxx - minx)) + PAD * 2
    h = int(round(maxy - miny)) + PAD * 2

    # Dış konturlar ile iç konturları (gözler) sarım yönüne göre ayır: draw._fill
    # her poligonun yönünü tekdüzeleştirdiği için delikler ayrı geçişte çıkarılmalı.
    outer = [[(x - minx + PAD, y - miny + PAD) for x, y in poly]
             for poly, a in shapes if a <= 0]
    inner = [[(x - minx + PAD, y - miny + PAD) for x, y in poly]
             for poly, a in shapes if a > 0]

    print('glif sayısı: %d kontur (%d dış, %d iç)' % (len(shapes), len(outer), len(inner)))
    print('tuval: %dx%d px' % (w, h))

    alpha = rasterize_rect(w, h, outer, inner)
    px = bytearray(w * h * 4)
    for i in range(w * h):
        px[i * 4:i * 4 + 3] = bytes(WHITE)
        px[i * 4 + 3] = alpha[i]

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    write_png(OUT, w, h, px)
    print('yazıldı: assets/brand/wordmark-fesahat.png')

    # SplashOverlay'in kullanacağı ölçüler — yazı eskisiyle aynı boyda dursun.
    ink_units = (maxx - minx) / scale
    print()
    print('--- SplashOverlay için ---')
    print('ink genişliği : %.1f font birimi (%.3f em)' % (ink_units, ink_units / f.upem))
    print('ilerleme      : %d birim (%.3f em)' % (advance_w, advance_w / f.upem))
    print('en/boy oranı  : %.4f' % (w / h))
    print('fontSize 60 karşılığı genişlik: %.1f px' % (ink_units / f.upem * 60))


if __name__ == '__main__':
    main()
