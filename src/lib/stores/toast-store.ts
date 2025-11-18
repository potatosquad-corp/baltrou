import { writable } from 'svelte/store';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  return {
    subscribe,
    /**
     * Ajoute une notification
     * @param message Le texte à afficher
     * @param type Le style ('info', 'success', 'warning', 'error')
     * @param duration Durée en ms (défaut: 3000ms, sauf erreur: 5000ms)
     */
    add: (message: string, type: ToastType = 'info', duration?: number) => {
      const id = crypto.randomUUID();
      
      // Durée par défaut : 5s pour les erreurs, 3s pour le reste
      const effectiveDuration = duration ?? (type === 'error' ? 5000 : 3000);

      update((toasts) => [...toasts, { id, message, type, duration: effectiveDuration }]);

      if (effectiveDuration > 0) {
        setTimeout(() => {
          update((toasts) => toasts.filter((t) => t.id !== id));
        }, effectiveDuration);
      }
    },
    /**
     * Supprime manuellement une notification
     */
    remove: (id: string) => {
      update((toasts) => toasts.filter((t) => t.id !== id));
    }
  };
}

export const toasts = createToastStore();