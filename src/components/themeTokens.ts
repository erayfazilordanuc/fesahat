import React from 'react';

import { useAppTheme } from '../utils/ThemeContext';

// Tüm ekranların paylaştığı tema sınıfları.
// Açık/koyu ayrımı uygulamanın her yerinde bu kanca üzerinden yapılır.
//
// Koyu tema NÖTR: açık tema beyaz + gri tonlarıyla kuruluyorsa koyu tema da
// siyah + gri tonlarıyla kurulur. Eskiden yüzeyler lacivert tonlarındaydı
// (#11182e, #1d2946) ve uygulama koyu temada mavi görünüyordu. Renk yalnızca
// vurgu (mavi/mor/yeşil) ve sekme zemininde var; yüzeylerde yok.
//
// Not: bir sınıf koyu temada kenarlık ekliyorsa açık temada da (şeffaf olarak)
// eklemeli — yoksa tema değişince eleman 2px büyüyüp sayfa kayıyor.

export function useThemeTokens() {
  const { isLight } = useAppTheme();
  return React.useMemo(
    () => ({
      isLight,
      //                açık                koyu (nötr karşılığı)
      screenBg: isLight ? 'bg-slate-50' : 'bg-[#121214]',
      cardBg: isLight ? 'bg-white' : 'bg-[#1c1c1f]',
      cardBorder: isLight ? 'border-slate-200' : 'border-[#2e2e33]',
      title: isLight ? 'text-slate-900' : 'text-white',
      body: isLight ? 'text-slate-700' : 'text-zinc-300',
      muted: isLight ? 'text-slate-500' : 'text-zinc-400',
      accent: isLight ? 'text-blue-600' : 'text-blue-400',
      accentBg: isLight ? 'bg-blue-600' : 'bg-blue-500',
      dividerColor: isLight ? 'border-slate-200' : 'border-[#2e2e33]',
      iconColor: isLight ? '#334155' : '#a1a1aa',
      // `cardBg`'nin ham karşılığı. Sınıf veremediğimiz yerler için:
      // animasyonlu bileşenlerde (`Animated.View`) className kullanılmıyor,
      // çünkü projede `react-native-css-interop` yamalı.
      surfaceColor: isLight ? '#ffffff' : '#1c1c1f',
    }),
    [isLight],
  );
}
