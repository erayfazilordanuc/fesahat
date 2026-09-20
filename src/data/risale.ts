import { pickForDay } from '../utils/dateUtils';

// Günün Risale-i Nur vecizesi — YAPILACAKLAR Bölüm 9 (kişisel içerik).
//
// ⚠️ KİŞİSEL İÇERİK — BU MODÜL DİĞER UYGULAMALARA TAŞINMAZ.
// Terakki'nin sahibine özel. Fesahat'a **belki** uyarlanabilir (oradaki karar
// YAPILACAKLAR_FESAHAT.md'de açık bırakıldı), İrtifa'ya **eklenmeyecek** —
// İrtifa savunma sanayii mülakat odaklı, dinî içerik kapsamı dışında.
//
// ⚠️ METİN DOĞRULAMASI: Aşağıdakiler yaygın olarak dolaşan, bilinen
// vecizelerdir; ancak **birebir lafız ve kaynak künyesi asıl metinden
// doğrulanmalıdır**. Eksik/yanlış atıf riski var (bkz. YAPILACAKLAR →
// "Risale-i Nur vecizesi"). Doğrulanana kadar liste kısa tutuldu; sayıyı
// artırmak yerine doğruluğu korumak tercih edildi.
//
// Yalnızca `religiousMode` açıkken gösterilir (`dailyPracticeSettings.ts`).

export type Vecize = {
  id: string;
  text: string;
  /** Eser adı — künye doğrulanmalı. */
  source: string;
  /** Ağır dilli vecizelerin sade karşılığı; gerekmiyorsa boş bırakılır. */
  plain?: string;
};

export const VECIZELER: Vecize[] = [
  {
    id: 'bismillah',
    text: 'Bismillâh her hayrın başıdır.',
    source: 'Sözler · Birinci Söz',
  },
  {
    id: 'guzel-goren',
    text: 'Güzel gören güzel düşünür, güzel düşünen hayatından lezzet alır.',
    source: 'Risale-i Nur (vecizeler)',
  },
  {
    id: 'vicdan-ziyasi',
    text:
      'Vicdanın ziyası ulûm-u dîniyedir. Aklın nuru fünûn-u medeniyedir. İkisinin imtizacıyla hakikat tecellî eder.',
    source: 'Münazarat',
    plain:
      'Vicdanı aydınlatan dinî ilimler, aklı aydınlatan müspet bilimlerdir; ikisi birleşince hakikat ortaya çıkar.',
  },
  {
    id: 'iman-kuvvet',
    text: 'İman hem nurdur, hem kuvvettir. Hakikî imanı elde eden adam kâinata meydan okuyabilir.',
    source: 'Sözler · Yirmi Üçüncü Söz',
  },
  {
    id: 'sukur-kanaat',
    text: 'Şükrün mikyası kanaattir.',
    source: 'Sözler · Yirmi Sekizinci Söz',
    plain: 'Şükrün ölçüsü kanaattir.',
  },
  {
    id: 'tevekkul',
    text: 'Tevekkül, esbabı bütün bütün reddetmek değildir.',
    source: 'Sözler · Yirmi Üçüncü Söz',
    plain: 'Tevekkül, sebeplere hiç başvurmamak demek değildir.',
  },
  {
    id: 'umitvar',
    text: 'Ümitvar olunuz; şu istikbal inkılâbı içinde en yüksek gür sadâ İslâm’ın sadâsı olacaktır.',
    source: 'Hutbe-i Şâmiye',
  },
  {
    id: 'zaman-ihtiyarlandikca',
    text: 'Zaman ihtiyarlandıkça Kur’ân gençleşiyor.',
    source: 'Risale-i Nur (vecizeler)',
  },
  {
    id: 'musibet-tasaffi',
    text: 'Hayat, musibetlerle ve hastalıklarla tasaffi eder, kemâl bulur.',
    source: 'Lem’alar · Hastalar Risalesi',
    plain: 'Hayat, sıkıntı ve hastalıklarla arınır ve olgunlaşır.',
  },
  {
    id: 'dunya-misafirhane',
    text: 'Bu dünya bir misafirhanedir. İnsan ise onda az duracaktır.',
    source: 'Risale-i Nur (vecizeler)',
  },
];

/**
 * Günün vecizesi — `pickForDay` ile deterministik. Salt 9: aynı gün günün duası
 * (salt 4) ile aynı sıraya düşmesin.
 */
export function pickDailyVecize(date: Date = new Date()): Vecize {
  return pickForDay(VECIZELER, date, 9);
}
