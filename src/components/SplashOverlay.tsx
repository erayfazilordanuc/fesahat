import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

// Açılış ekranı.
//
// Native splash (app.json → expo-splash-screen) yalnızca düz renk + ortada görsel
// gösterebiliyor; Android 12+ degrade desteklemiyor. Bu katman native splash'in
// birebir aynısıyla başlıyor — aynı zemin rengi, aynı görsel aynı genişlikte
// ortada — native splash kapanınca degradeyi ve yazıyı açıyor, sonra uygulamaya
// soluyor. Böylece geçişte figür kıpırdamıyor.
//
// Aşağıdaki ilk iki değer app.json ile eşleşmeli; biri değişirse diğeri de.

/** app.json → expo-splash-screen `backgroundColor` */
const NATIVE_BACKGROUND = '#029568';
/** app.json → expo-splash-screen `imageWidth` */
const IMAGE_WIDTH = 170;
/** assets/brand/ikon/terakki-icon-master.svg degradesi */
const GRADIENT = ['#05B179', '#029568', '#007B59'] as const;
/** splash-icon.png içinde figürün alt kenarı (858 / 1024) */
const MARK_BOTTOM = 0.838;

/**
 * "Terakki" yazısı CANLI METİN DEĞİL, hazır bir görsel
 * (`tools/icon-forge/build_wordmark.py` üretiyor, kaynak yine Italianno).
 *
 * NEDEN: Italianno'da 'i'nin noktası, harfin ilerleme genişliğinin DIŞINDA
 * duruyor (glif 77: gövde x=32..247, nokta x=218..278, ilerleme 192). "Terakki"de
 * 'i' son harf olduğu için Android'in metin kutusu son ilerleme genişliğinde
 * bitiyor ve nokta kırpılıyordu — ekranda "Terakkı" görünüyordu.
 *
 * Denenip ELENEN yollar (bir daha kazılmasın): iki yana NBSP koymak, son harfi
 * ayrı bir `Text`'e almak, araya ZWNJ (U+200C) koymak. Üçü de cihazda çözmedi.
 * Fontun `ccmp`/`locl` kuralları da sanık değil; ayrıntı KARARLAR.md.
 *
 * Yazıyı kendimiz çizince Android'in metin motoru devreden çıkıyor: nokta
 * garanti. Ek kazanç — splash artık font yüklenmesini beklemiyor, native
 * ekrandan JS katmanına geçiş erkene alınıyor.
 */
const WORDMARK = require('../../assets/brand/wordmark-terakki.png');
/** Görselin en/boy oranı 535/172; genişlik eski 60pt yazıyla aynı boyu veriyor. */
const WORDMARK_WIDTH = 134;
const WORDMARK_HEIGHT = 43;

/**
 * Figürün altı ile yazının üstü arası. Canlı metinde kutunun üstü ile harfin
 * üstü arasında ~11pt boşluk vardı (font yüksekliği); görselde o boşluk yok,
 * bu yüzden değer 12'den 21'e çıkarıldı — görünen aralık aynı kalsın.
 */
const TITLE_GAP = 21;
const TITLE_RISE = 6;

const TIMING = { gradient: 450, titleDelay: 150, title: 650, exitDelay: 1300, exit: 350 };
const REDUCED_TIMING = { gradient: 0, titleDelay: 0, title: 200, exitDelay: 900, exit: 200 };

const easing = Easing.out(Easing.cubic);

export function SplashOverlay() {
  const [laidOut, setLaidOut] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const reduceMotion = useReducedMotion();

  const gradient = useSharedValue(0);
  const title = useSharedValue(0);
  const veil = useSharedValue(1);

  // İlk kare çizilmeden native splash kapanırsa arada boş ekran görünür.
  // Font beklentisi kalmadığı için tek koşul bu.
  const ready = laidOut;

  React.useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync().catch(() => {
      /* zaten kapalı */
    });
    const t = reduceMotion ? REDUCED_TIMING : TIMING;
    gradient.value = withTiming(1, { duration: t.gradient, easing });
    title.value = withDelay(t.titleDelay, withTiming(1, { duration: t.title, easing }));
    veil.value = withDelay(t.exitDelay, withTiming(0, { duration: t.exit, easing }));
    const timeout = setTimeout(() => setDone(true), t.exitDelay + t.exit);
    return () => clearTimeout(timeout);
  }, [ready]);

  const gradientStyle = useAnimatedStyle(() => ({ opacity: gradient.value }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: title.value,
    transform: [{ translateY: (1 - title.value) * TITLE_RISE }],
  }));
  const veilStyle = useAnimatedStyle(() => ({ opacity: veil.value }));

  if (done) return null;

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.root, veilStyle]}
      onLayout={() => setLaidOut(true)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <StatusBar style="light" />
      <Animated.View style={[StyleSheet.absoluteFill, gradientStyle]}>
        <LinearGradient colors={GRADIENT} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <View style={styles.center}>
        <Image source={require('../../assets/splash-icon.png')} style={styles.mark} />
      </View>
      <View style={styles.titleRow}>
        <Animated.Image source={WORDMARK} style={[styles.title, titleStyle]} resizeMode="contain" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: NATIVE_BACKGROUND,
    zIndex: 1000,
    elevation: 1000,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
  },
  titleRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: IMAGE_WIDTH * (MARK_BOTTOM - 0.5) + TITLE_GAP,
    alignItems: 'center',
  },
  title: {
    width: WORDMARK_WIDTH,
    height: WORDMARK_HEIGHT,
    // Görsel beyaz; canlı metindeki 0.95 opaklığın karşılığı.
    opacity: 0.95,
  },
});
