import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { updateCredentials, type Credentials } from './user';

/**
 * Un wrapper pour l'API Twitch Helix qui gère
 * automatiquement le rafraîchissement des tokens.
 */
export class TwitchApiWrapper {
	private credentials: Credentials;
	private userId: string; // L'ID *interne* de l'utilisateur

	constructor(credentials: Credentials, userId: string) {
		this.credentials = credentials;
		this.userId = userId;
	}

	/**
	 * Récupère les infos du stream (live/viewers)
	 */
	public async getStreamInfo() {
		const url = `https://api.twitch.tv/helix/streams?user_id=${this.userId}`;
		const response = await this.fetchWithRefresh(url, { method: 'GET' });
		if (!response.ok) return null;
		const data = await response.json();
		return data.data[0] || null; // Retourne le stream ou null si offline
	}

	/**
	 * Récupère le nombre total de followers
	 */
	public async getFollowerCount() {
		const url = `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${this.userId}`;
		const response = await this.fetchWithRefresh(url, { method: 'GET' });
		if (!response.ok) return null;
		const data = await response.json();
		return data.total as number;
	}

	/**
	 * Récupère le nombre total d'abonnés
	 * NÉCESSITE LE SCOPE: channel:read:subscriptions
	 */
	public async getSubscriberCount() {
		const url = `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${this.userId}`;
		const response = await this.fetchWithRefresh(url, { method: 'GET' });
		if (!response.ok) return null;
		const data = await response.json();
		return data.total as number;
	}

	/**
	 * Récupère le total des bits (via le leaderboard)
	 * NÉCESSITE LE SCOPE: bits:read
	 */
	public async getBitsTotal() {
		// Récupère le leaderboard 'alltime'
		const url = `https://api.twitch.tv/helix/bits/leaderboard?count=100`;
		const response = await this.fetchWithRefresh(url, { method: 'GET' });
		if (!response.ok) return null;
		const data = await response.json();

		// Calcule le total des bits
		const totalBits = data.data.reduce((sum: number, entry: any) => sum + entry.score, 0);
		return totalBits as number;
	}

	/**
	 * Envoie un message au chat en tant que l'utilisateur.
	 * C'est l'utilisateur (diffuseur) qui parle dans son propre canal.
	 */
	public async sendChatMessage(message: string) {
		// En tant que diffuseur, broadcaster_id et sender_id
		// sont votre propre ID Twitch.
		const broadcaster_id = this.userId;
		const sender_id = this.userId;

		return this.fetchWithRefresh('https://api.twitch.tv/helix/chat/messages', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				broadcaster_id,
				sender_id,
				message
			})
		});
	}

	// --- LOGIQUE DE TOKEN ---

	/**
	 * Un 'fetch' privé qui intercepte les 401 (Unauthorized)
	 * et tente de rafraîchir le token avant de réessayer.
	 */
	private async fetchWithRefresh(url: string, options: RequestInit) {
		// 1. Essayer avec le token actuel
		let response = await this.makeApiRequest(url, options);
		// 2. Si 401 (token expiré), rafraîchir et réessayer
		if (response.status === 401) {
			console.log('[TwitchWrapper] Token expiré, tentative de rafraîchissement...');
			try {
				await this.refresh();
			} catch (refreshError) {
				console.error('[TwitchWrapper] Échec du rafraîchissement du token', refreshError);
				// Ne pas réessayer, jeter l'erreur
				throw error(401, 'Impossible de rafraîchir la session Twitch. Veuillez vous reconnecter.');
			}

			// 3. Réessayer la requête avec le nouveau token
			console.log('[TwitchWrapper] Réessai de la requête API avec le nouveau token...');
			response = await this.makeApiRequest(url, options);
		}

		return response;
	}

	/**
	 * Effectue la requête 'fetch' en injectant l'en-tête d'autorisation.
	 */
	private async makeApiRequest(url: string, options: RequestInit) {
		// Assure que les en-têtes existent
		if (!options.headers) {
			options.headers = {};
		}

		// Injecte le token et le Client-ID
		(options.headers as Record<string, string>)['Authorization'] =
			`Bearer ${this.credentials.access_token}`;
		(options.headers as Record<string, string>)['Client-Id'] = env.TWITCH_CLIENT_ID;

		return fetch(url, options);
	}

	/**
	 * Appelle l'API OAuth de Twitch pour obtenir de nouveaux tokens.
	 */
	private async refresh() {
		const response = await fetch('https://id.twitch.tv/oauth2/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: this.credentials.refresh_token,
				client_id: env.TWITCH_CLIENT_ID,
				client_secret: env.TWITCH_CLIENT_SECRET
			})
		});

		if (!response.ok) {
			throw new Error('Échec du POST de rafraîchissement');
		}

		const data = await response.json();

		// Préparer les nouveaux credentials pour la DB
		const newCredentials = {
			access_token: data.access_token,
			expires_in: new Date(Date.now() + data.expires_in * 1000),
			refresh_token: data.refresh_token // Twitch peut renvoyer un nouveau refresh_token
		};

		// 1. Mettre à jour nos tokens en DB
		await updateCredentials(this.userId, newCredentials);

		// 2. Mettre à jour l'état interne de cette classe
		this.credentials = newCredentials;
	}
}
