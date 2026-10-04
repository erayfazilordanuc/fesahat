# Fesahat — Claude çalışma kılavuzu

React Native (Expo SDK 54, RN 0.81, NativeWind v4) **dil, konuşma, anlayış,
kavrayış ve iletişim** uygulaması. Arayüz Türkçe, açık + koyu tema.

Yapay zekâ katmanı **isteğe bağlı**: BYOK — kullanıcı kendi Google Gemini
anahtarını girer, anahtar cihazın kasasında durur, çağrılar doğrudan Google'a
gider. Ayakta tutulan bir sunucu **yok**. Uygulama anahtarsız ve ağsız %100
çalışmalı.

## Beş ayak (+ ikincil belagat)

| Ayak | Kapsam | Ekran |
| --- | --- | --- |
| **Dil** *(ana eksen)* | Kelime hazinesi, anlam, köken, doğru Türkçe, deyim/atasözü | `LanguageScreen` |
| **Konuşma** | Diksiyon, artikülasyon, tonlama, dolgu kelime avı, hitabet nefesi | `SpeechExerciseScreen`, `DiaphragmExerciseScreen` |
| **Anlayış** | Okuduğunu/dinlediğini anlama, özetleme, okuma hızı | `ComprehensionScreen`, `QuizScreen`, `SummaryScreen`, `DailyTextScreen` |
| **Kavrayış** | Sözel muhakeme, analoji, çıkarım, bağlamdan anlam | `QuizScreen` (sözel setler), `BrainExercisesScreen` |
| **İletişim** | Etkin dinleme, empati, ikna, geri bildirim, zor konuşmalar | `CommunicationScreen`, `CommScenarioScreen`, `ListeningSkillScreen` |
| **Belagat** *(ileri düzey, ikincil)* | Meânî, Beyân, Bedîʿ | `BelagatExerciseScreen` |

Sekmeler: **Bugün** · **Atölye** · **Karne** · **Profil**.

## Önce oku

| Belge | Ne zaman |
| --- | --- |
| `YAPILACAKLAR.md` | Her iş öncesi — yol haritası ve açık işler |
| `KARARLAR.md` | Verilmiş kararlar ve gerekçeleri; buradaki kararı yeniden tartışma |
| `assets/brand/README.md` | Logo, ikon, marka renkleri |
| `YAPILACAKLAR_TERAKKI.md` | **Yalnızca referans.** Koddaki `YAPILACAKLAR Bölüm X` yorumları bu dosyanın numaralandırmasına bakıyor; `YAPILACAKLAR_ARSIV.md` ile birlikte silinmez |

## Kurallar

- Doğrulama: `npx tsc --noEmit` — şu an **0 hata**, sıfırda kalmalı.
- Renkler `src/components/themeTokens.ts` ve `AppUI` yardımcılarından (`toneColor`, `toneSoft`, `toneText`) gelir; ekrana sabit renk gömülmez.
- Yeni `Pressable`'lara `accessibilityRole` + etiket; seçili/kapalı durumlarda `accessibilityState`.
- Yapay zekâ çağrıları `src/utils/aiAvailability.ts` kontrolünden geçer; kapalıyken teknik hata mesajı gösterilmez. Yapay zekâ **değerlendirir ve üretir, kapıda durmaz** — hiçbir içeriğe erişmek için anahtar gerekmez.
- Yeni durum `createPersistentStore` deseniyle eklenir; ikinci bir state kütüphanesi eklenmez.
- Türkçe büyük harf: CSS `uppercase` sınıfı 'i'yi 'I' yapar. Metni doğrudan büyük yaz ya da `src/utils/text.ts` → `trUpper` kullan.
- Tek doğru yazımı olmayan soruya `accept` yazılmaz; orada öz-değerlendirme kullanılır (bkz. KARARLAR).
- Ölçümde norm uydurulmaz; kayıt yokken yüzde gösterilmez. İletişim senaryoları **doğruluk değil tamamlanma** sayılır.
- `assets/` kökündeki ikonlar elle düzenlenmez: `python3 tools/icon-forge/build_from_brand.py`.
- `npm install` sonrası `npx patch-package` **elle** çalıştırılır (postinstall çalışmıyor). `patches/react-native-css-interop` yaması kritik; yoksa tema değiştirirken gezinme bağlamı hatası geliyor.
- Commit yalnızca kullanıcı isteyince. Biçim: `feat: …`, `fix: …`, `chore(assets): …`.
- Kalıcı bilgi: karar → `KARARLAR.md`, plan/durum → `YAPILACAKLAR.md`.

## Ortam tuzakları — build almadan önce oku

1. **JDK 17 şart.** `export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home`.
   ⚠️ `$(/usr/libexec/java_home -v 17)` **kullanma** — brew'in openjdk@17'si `/Library/Java/JavaVirtualMachines/` altında kayıtlı olmadığı için sessizce JDK 26 dönüyor. Belirti: `Error resolving plugin [id: 'com.facebook.react.settings'] > 26.0.1`. Editörden açılan kabuk `~/.zshrc`'yi okumayabilir; Gradle çalıştıran her komutta açıkça dışa aktar.
2. **`npm install` sonrası yama.** `npx patch-package` + doğrulama:
   `grep -c "Getter Error" node_modules/react-native-css-interop/dist/runtime/native/render-component.js` → `1` dönmeli. Sonra `npx expo start --clear`.
3. **Telefon USB'den çıkıp girdiyse** `adb reverse tcp:8081 tcp:8081`.
4. **`android/` klasörü varken prebuild tekrar çalışmaz.** Kimlik ya da eklenti değişince `npx expo prebuild --clean` gerekir.
5. **`expo-av` deprecated** — SDK 54'te çalışıyor; `expo-audio`'ya geçiş yol haritasında.

## Triyaj — pahalı modeli boşuna harcama

Her **yeni istekte** önce zorluğu ölç, sonra kimin yapacağına karar ver.

| | Kim yapar | Örnek |
| --- | --- | --- |
| **Kolay** | `triyaj` (haiku) yapar, ana oturum diff'i ve `tsc`'yi kontrol eder | Yazım/etiket düzeltmesi, sabit değer değişimi, belge güncellemesi, mevcut listeye aynı şekilde yeni kayıt |
| **Soru** | `kasif` (haiku) | "X nerede tanımlı", "Y akışı nasıl işliyor" |
| **Zor** | Ana oturum planlar; gerekirse `uygulayici` / `denetci` dağıtır | Çok dosyalı değişiklik, yeni ekran/veri modeli, bildirim & zamanlama, native taraf, sebebi bilinmeyen hata, tasarım/ürün kararı |

Ölçüt `.claude/agents/triyaj.md` içinde. Özet: tek dosya + ~20 satır altı +
istekten birebir anlaşılıyor + mevcut bir deseni tekrarlıyor → kolay.

> **Şüphedeysen zor say.** Yanlış "kolay" kararı kullanıcıya bozuk iş döndürür;
> yanlış "zor" kararı yalnızca biraz token harcar.

## Çalışma sırası

- Kullanıcı "devam" der ya da yeni bir iş belirtmezse `YAPILACAKLAR.md`'deki ilk tamamlanmamış işe geçilir.
- Kullanıcının bir mesajındaki **her madde** ele alınır. Bu turda yapılamayan madde sessizce atlanmaz; nedeniyle birlikte `YAPILACAKLAR.md`'ye yazılır.
- Yapılan ama cihazda görülmemiş iş ✅ değil ⏳ olarak işaretlenir ve "Cihazda doğrulanacaklar" listesine eklenir.

## Orkestrasyon

Ana oturum **planlar, böler, dağıtır, doğrular**. Uygulamayı alt ajanlar yapar.
Ajan tanımları `.claude/agents/` altında.

| Ajan | Model | İş | Yazar mı |
| --- | --- | --- | --- |
| `triyaj` | haiku | İsteği kolay/zor ayırır; kolaysa kendisi yapar | Evet (dar kapsam) |
| `kasif` | haiku | Kod tabanında keşif | Hayır |
| `uygulayici` | sonnet | Net tanımlı tek bir iş paketini uygular | Evet |
| `denetci` | sonnet | Değişikliği plana ve kurallara göre inceler | Hayır |
| `belgeci` | haiku | `YAPILACAKLAR` / `KARARLAR` / README günceller | Yalnız `.md` |

### Akış

1. **Anla** — Bilinmeyen alanlar için `kasif`'lere dar sorular sor; bağımsızsa paralel.
2. **Planla** — İşi bağımsız paketlere böl. Çok dosyalı ya da kullanıcı kararı gerektiren işlerde planı önce kullanıcıya göster.
3. **Dağıt** — Her paket bir `uygulayici`. Aynı dosyalara dokunmayan paketler paralel; aynı dosyaya dokunanlar sıralı. Brif tek başına yetmeli — alt ajan bu konuşmayı görmez.
4. **Doğrula** — `denetci` diff'i inceler. Ana oturum bulguları ve `tsc` sonucunu kendisi kontrol eder.
5. **Kaydet** — `belgeci` durum belgelerini günceller. Kullanıcıya kısa rapor: ne yapıldı, ne doğrulandı, ne açık kaldı.

### Ne zaman devredilmez

- Birkaç satırlık tek dosya değişikliği ya da tek `grep` ile bulunacak şey → ana oturum kendisi yapar.
- Tasarım / ürün kararı gerektiren sorular → ajana değil kullanıcıya.

### İş paketi şablonu

```
Amaç: <tek cümle — ne ve neden>
Bağlam: <ilgili KARARLAR / YAPILACAKLAR bölümü, bilinen tuzaklar>
Dosyalar: <dokunulacaklar; açıkça dokunulmayacaklar>
Yapılacak: <adımlar>
Kabul kriterleri: <gözlenebilir koşullar>
Doğrulama: npx tsc --noEmit (+ varsa ek komut)
Rapor: değişen dosyalar, yapılmayanlar, şüpheli noktalar
```
