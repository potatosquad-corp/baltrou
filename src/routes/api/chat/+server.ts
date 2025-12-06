import { TwitchApiWrapper } from '$lib/server/twitch';
import { getUser } from '$lib/server/user';
import { error, json, type RequestEvent } from '@sveltejs/kit';

/**
 * Gère l'envoi d'un message de chat via l'API Helix.
 */
export async function POST({ request, cookies }: RequestEvent) {
	// 1. Vérifier l'authentification de l'utilisateur (cookie interne)
	const userId = cookies.get('user_id');
	if (!userId) {
		throw error(401, 'Non autorisé (cookie manquant)');
	}

	// 2. Récupérer le message du corps de la requête
	let messageData: { message: string };
	try {
		messageData = await request.json();
		if (!messageData.message || typeof messageData.message !== 'string') {
			throw new Error('Message invalide');
		}
	} catch {
		throw error(400, 'Corps de la requête invalide');
	}

	// 3. Récupérer les infos complètes de l'utilisateur (et ses tokens)
	const userData = await getUser(userId);
	if (!userData) {
		throw error(404, 'Utilisateur ou configuration Twitch non trouvés');
	}

	// 4. Créer une instance du Wrapper API pour cet utilisateur
	// L'instance reçoit les credentials (qui incluent le refresh token)
	const api = new TwitchApiWrapper(userData.credentials, userData.id);

	// 5. Envoyer le message
	try {
		const apiResponse = await api.sendChatMessage(messageData.message);

		if (!apiResponse.ok) {
			// Si l'API renvoie une erreur (ex: 403 'Vous êtes banni')
			const errorData = await apiResponse.json();
			throw error(apiResponse.status, `Erreur API Twitch: ${errorData.message}`);
		}

		// Les données de TMI (lente) n'ont pas encore été envoyées.
		// Votre composant Chat.svelte devrait ajouter le message
		// "optimistiquement" (côté client) dès que l'utilisateur
		// appuie sur "Envoyer".
	} catch (err: any) {
		console.error('[API Chat POST] Erreur:', err);
		if (err.status) throw err; // Transférer les erreurs 'error()'
		throw error(500, "Erreur interne lors de l'envoi du message");
	}

	return json({ success: true });
}
