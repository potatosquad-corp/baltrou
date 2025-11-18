import { writable } from 'svelte/store';

/**
 * Interface de base pour tous les événements transitant par notre SSE.
 * Le `type` est utilisé pour le filtrage (ex: 'irc_message', 'connected', 'cron_update').
 */
export type SseEvent = {
  type: string;
  data: any;
};

/**
 * Un Svelte Store 'readable' qui gère la connexion SSE globale
 * pour l'application.
 */
export const events = writable<SseEvent>({type:"",data:null}, (set) => {
  let eventSource: EventSource | null = null;

  /**
   * Initialise la connexion EventSource.
   */
  function connect() {
    // Ne pas s'exécuter côté serveur (SSR)
    if (typeof window === 'undefined') {
      return;
    }

    // Crée la connexion unique vers notre endpoint
    eventSource = new EventSource('/api/events');

    /**
     * Écouteur pour les messages "génériques"
     * (tous ceux qui n'ont pas de 'event: name' spécifique)
     * C'est ici que 'irc_message', 'cron_update', etc. arriveront.
     */
    eventSource.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        // Le 'data' est notre objet SseEvent complet
        // (ex: { type: 'irc_message', data: {...} })
        set(data);
      } catch {
        console.error('SSE: Échec de l\'analyse du message générique', event.data);
      }
    };

    /**
     * Écouteur pour l'événement 'connected'
     * (que nous envoyons depuis api/events/+server.ts)
     */
    eventSource.addEventListener('connected', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        // Nous le reformatons en notre type SseEvent standard
        set({
          type: 'connected',
          data: data
        });
      } catch {
        console.error('SSE: Échec de l\'analyse de l\'événement "connected"', event.data);
      }
    });

    /**
     * Gère les erreurs de connexion SSE
     */
    eventSource.onerror = (err: Event) => {
      console.error('SSE: Erreur de connexion', err);
      // On peut émettre un événement d'erreur si on veut
      set({
        type: 'error',
        data: { message: 'Erreur de connexion SSE' }
      });
      // Le navigateur tentera de se reconnecter automatiquement
    };
  }

  // Démarrer la connexion dès que le premier abonné arrive
  connect();

  // Fonction de "nettoyage"
  // S'exécute lorsque le dernier abonné se désinscrit
  return () => {
    if (eventSource) {
      eventSource.close();
      console.log('SSE: Connexion fermée (plus d\'abonnés)');
    }
  };
});