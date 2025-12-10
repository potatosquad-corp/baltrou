import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

// --- Types ---
export type LightApiStatus = 'UNKNOWN' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

// --- Clé de Sauvegarde ---
const LOCAL_STORAGE_KEY = 'baltrou_lights_api_url';

// --- État Initial ---
// Charge l'URL depuis le localStorage au démarrage (côté client)
const initialState = browser ? localStorage.getItem(LOCAL_STORAGE_KEY) || '' : '';

// --- Stores Exportés ---

/**
 * Stocke l'URL de l'API de vos lumières.
 * Se synchronise automatiquement avec le localStorage.
 */
export const lightApiUrl = writable<string>(initialState);

/**
 * Stocke le statut de la connexion à l'API.
 */
export const lightApiStatus = writable<LightApiStatus>('UNKNOWN');

// --- Logique de Sauvegarde Automatique ---
if (browser) {
	// À chaque fois que l'URL change dans le store, on la sauvegarde
	lightApiUrl.subscribe((url) => {
		try {
			localStorage.setItem(LOCAL_STORAGE_KEY, url);
		} catch (e) {
			console.error("Impossible de sauvegarder l'URL de l'API Lights:", e);
		}

		// Si l'URL change, on réinitialise le statut de connexion
		lightApiStatus.set('UNKNOWN');
		if(url != '')
		pingFiakAPI();
	});
}

// --- Fonctions Exportées ---

/**
 * Teste la connexion à l'API en appelant [url]/api/ping
 */
export async function pingFiakAPI() {
	const url = get(lightApiUrl);

	if (!url || url.trim() === '') {
		console.error('[Lights API] URL non configurée.');
		lightApiStatus.set('ERROR');
		return;
	}

	lightApiStatus.set('CONNECTING');
	console.log(`[Lights API] Ping vers ${url}/ping...`);
	const controller = new AbortController();
	const timeoutId = setTimeout(() => {
		console.log('[Lights API] Ping timeout.');
		controller.abort(); // Annule la requête fetch
	}, 5000); // Timeout de 5 secondes (5000 ms)

	try {
		const response = await fetch(`${url}/ping`, {
			method: 'GET',
			headers: { Accept: 'application/json' },
			signal: controller.signal
		});

		if (!response.ok) {
			throw new Error(`Le serveur a répondu ${response.status}`);
		}

		const data = await response.json();

		// Vérifie la réponse attendue
		if (data.pong === true) {
			console.log('[Lights API] Pong reçu ! Connexion réussie.');
			lightApiStatus.set('CONNECTED');
		} else {
			throw new Error(`Réponse inattendue: ${JSON.stringify(data)}`);
		}
	} catch (err: any) {
		console.error(`[Lights API] Échec du ping: ${err.message}`);
		lightApiStatus.set('ERROR');
	} finally {
		clearTimeout(timeoutId);
	}
}
