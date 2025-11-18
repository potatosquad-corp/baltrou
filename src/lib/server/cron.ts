import { getAllUsers, type User } from '$lib/server/user';
import { TwitchApiWrapper } from '$lib/server/twitch';
import eventBus from '$lib/server/event-bus';
import { addViewerRecord } from './db';

/**
 * Exécute la tâche de mise à jour des statistiques Twitch
 * pour tous les utilisateurs enregistrés.
 */
export async function runTwitchUpdateCron() {
	console.log('[CRON] Lancement de la tâche de mise à jour Twitch...');

	const users = await getAllUsers();
	if (!users || users.length === 0) {
		console.log('[CRON] Aucun utilisateur à mettre à jour.');
		return;
	}

	// Traiter chaque utilisateur en parallèle
	await Promise.allSettled(users.map((user) => processUser(user)));

	console.log('[CRON] Tâche terminée.');
}

/**
 * Récupère les statistiques pour un seul utilisateur
 * et publie les résultats sur l'eventBus.
 */
export async function processUser(user: User) {
	// Remplacez 'any' par votre type 'User'
	const { id, credentials, user_login } = user;

	if (!id || !credentials.refresh_token || !user_login) {
		console.warn(`[CRON] Utilisateur ${id} incomplet. Sauté.`);
		return;
	}

	console.log(`[CRON] Traitement de l'utilisateur: ${user_login}`);

	try {
		const api = new TwitchApiWrapper(credentials, id);

		// Exécuter toutes les requêtes API en parallèle
		const [streamInfo, followerCount, subscriberCount, totalBits] = await Promise.all([
			api.getStreamInfo(),
			api.getFollowerCount(),
			api.getSubscriberCount(),
			api.getBitsTotal()
		]);

		// Préparer le payload
		const payload = {
			type: 'twitch_stats_update',
			data: {
				isLive: streamInfo !== null,
				viewerCount: streamInfo?.viewer_count || 0,
				followerCount: followerCount,
				subscriberCount: subscriberCount,
				totalBits: totalBits
			}
		};
		
		addViewerRecord({
			count: streamInfo?.viewer_count || 0,
			timestamp: Date.now()
		});

		// Publier sur l'eventBus de l'utilisateur
		const eventBusChannel = `event:${id}`;
		eventBus.emit(eventBusChannel, payload);
	} catch (err: any) {
		// Si le refresh token est invalide ou l'utilisateur a révoqué l'accès
		console.error(`[CRON] Échec du traitement de ${user_login}: ${err.message}`);
		// Le 'try...catch' ici est crucial pour que l'échec d'un
		// utilisateur ne bloque pas les autres.
	}
}
