import React from 'react';
import * as Notifications from 'expo-notifications';

import { useDailyPracticeSettings } from './dailyPracticeSettings';
import { syncReminders, type ReminderPayload } from './dailyNotifications';
import { useAppSettings } from './appSettings';

/**
 * Ayarları planlanmış bildirimlerle eşitler.
 * Uygulama açılışında bir kez ve her ayar değişikliğinde çalışır.
 * Saat ayarlarken her dokunuşta yeniden planlamamak için kısa bir gecikme uygulanır.
 */
export function useReminderSync(delayMs = 500): void {
  const { settings } = useDailyPracticeSettings();
  const { reminderFrequency } = useAppSettings();

  React.useEffect(() => {
    const id = setTimeout(() => {
      syncReminders(settings, {
        everyOtherDay: reminderFrequency === 'everyOtherDay',
      }).catch((e) => console.warn('[bildirim] eşitleme başarısız.', e));
    }, delayMs);
    return () => clearTimeout(id);
  }, [settings, reminderFrequency, delayMs]);
}

/**
 * Bildirime dokunulduğunda ilgili ekrana yönlendirir.
 * Çağıran taraf, navigation nesnesini saran bir navigate fonksiyonu geçirir.
 */
export function useReminderNavigation(navigate?: (screen: string) => void): void {
  React.useEffect(() => {
    if (!navigate) return;

    const handle = (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as
        | Partial<ReminderPayload>
        | undefined;
      if (data?.kind !== 'daily-practice' || !data.screen) return;
      navigate(data.screen);
    };

    // Uygulama bildirime dokunularak açıldıysa son yanıtı da işle.
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) handle(response);
      })
      .catch(() => {
        /* yok sayılabilir */
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(handle);
    return () => subscription.remove();
  }, [navigate]);
}
