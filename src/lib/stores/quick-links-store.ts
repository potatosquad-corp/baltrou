import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface QuickLink {
	id: string;
	title: string;
	url: string;
	color: string;
}

const STORAGE_KEY = 'baltrou_quick_links';

function createQuickLinksStore() {
	// Charger depuis le localStorage si disponible
	const stored = browser ? localStorage.getItem(STORAGE_KEY) : null;
	const initial: QuickLink[] = stored ? JSON.parse(stored) : [
        // Données par défaut pour l'exemple
        { id: '1', title: 'Twitch', url: 'https://twitch.tv', color: '#450e59' },
        { id: '2', title: 'YouTube', url: 'https://youtube.com', color: '#831100' }
    ];

	const { subscribe, update } = writable<QuickLink[]>(initial);

	return {
		subscribe,
		add: (link: Omit<QuickLink, 'id'>) => {
			update((links) => {
				if (links.length >= 5) return links;
				const newLink = { ...link, id: crypto.randomUUID() };
				const newLinks = [...links, newLink];
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newLinks));
				return newLinks;
			});
		},
		remove: (id: string) => {
			update((links) => {
				const newLinks = links.filter((l) => l.id !== id);
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newLinks));
				return newLinks;
			});
		},
		edit: (id: string, data: Partial<QuickLink>) => {
			update((links) => {
				const newLinks = links.map((l) => (l.id === id ? { ...l, ...data } : l));
				if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(newLinks));
				return newLinks;
			});
		}
	};
}

export const quickLinks = createQuickLinksStore();