import { writable } from 'svelte/store';
import { events, type SseEvent } from './event-store';

export type TwitchStats = {
	isLive: boolean;
	viewerCount: number;
	followerCount: number;
	subscriberCount: number;
	totalBits: number;
};

/**
 * L'état initial des statistiques.
 * C'est ce que l'utilisateur verra avant la première
 * mise à jour du CRON.
 */
const initialState: TwitchStats = {
	isLive: false,
	viewerCount: 0,
	followerCount: 0,
	subscriberCount: 0,
	totalBits: 0
};

// 1. Créer le store 'writable' interne
const store = writable<TwitchStats>(initialState);

// 2. S'abonner au diffuseur d'événements (eventStore)
events.subscribe((event: SseEvent | null) => {
	// 3. Filtrer pour le bon type d'événement
	if (event && event.type === 'twitch_stats_update') {
		const newStats = event.data as TwitchStats;

		// 4. Remplacer (set) l'état précédent
		//    par les nouvelles statistiques.
		store.set(newStats);
	}
});

/**
 * Exporter le store en lecture seule (uniquement 'subscribe')
 * pour que les composants ne puissent pas le modifier directement.
 */
export const stats = {
	subscribe: store.subscribe
};
