'use client';

import { useEffect } from 'react';

/** Registra el service worker para habilitar capacidades PWA */
export function PWAInitializer(): null {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if ('serviceWorker' in navigator) {
      const register = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(() => {
            console.info('[PWA] Service Worker registrado con éxito.');
          })
          .catch((error) => {
            console.error('[PWA] Error registrando Service Worker', error);
          });
      };

      if (document.readyState === 'complete') {
        register();
      } else {
        window.addEventListener('load', register, { once: true });
      }
    }
  }, []);

  return null;
}
