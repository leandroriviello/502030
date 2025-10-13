/** Verifica si el navegador soporta notificaciones y permisos */
const canUseNotifications = (): boolean =>
  typeof window !== 'undefined' && 'Notification' in window;

/** Solicita permiso y programa un recordatorio simple mediante Service Worker */
export const requestAndScheduleNotification = async (
  title: string,
  options: NotificationOptions
): Promise<void> => {
  if (!canUseNotifications()) {
    console.warn(
      '[PWA] El navegador no soporta notificaciones push/locale en este entorno.'
    );
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.info('[PWA] Permiso de notificaciones rechazado por el usuario.');
    return;
  }

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, options).catch((error) => {
      console.error('[PWA] Error mostrando notificación', error);
    });
  });
};
