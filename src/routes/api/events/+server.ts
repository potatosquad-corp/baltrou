import { processUser } from '$lib/server/cron.js';
import eventBus from '$lib/server/event-bus';
import { ircManager } from '$lib/server/irc.js';
import { getUser } from '$lib/server/user.js';
import { error, json } from '@sveltejs/kit';

/**
 * Ce handler GET gère la connexion Server-Sent Events (SSE).
 * Il maintient une connexion ouverte avec le client.
 */
export async function GET({ cookies }) {
	console.log('[SSE] User is attempting connexion...');
	const userId = cookies.get('user_id');

	// Si aucun cookie, l'utilisateur n'est pas autorisé.
	if (!userId) {
		console.log('[SSE] User is not connected, aborting...');
		throw error(401, 'Non autorisé');
	}

	const user = await getUser(userId);
	if (!user) {
		console.log('[SSE] User not found, aborting...');
		throw error(404, 'User id not found');
	}

	const channel = `event:${userId}`;
	let handler: (message: unknown) => void;

	const stream = new ReadableStream({
		async start(controller) {
			handler = (message: unknown) => {
				const sseMessage = `data: ${JSON.stringify(message)}\n\n`;
				controller.enqueue(sseMessage);
			};

			eventBus.on(channel, handler);

			await ircManager.joinChannel(userId, user.user_login);
			await processUser(user);

			console.log(`[SSE] Client ${userId} connected`);
			controller.enqueue(`event: connected\ndata: {"message": "Connexion SSE établie"}\n\n`);
		},
		async cancel() {
			console.log(`[SSE] Client ${userId} disconnected`);
			eventBus.off(channel, handler);
			await ircManager.partChannel(userId, user.user_login);
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache', // Empêche le proxy de mettre en cache
			Connection: 'keep-alive' // Maintient la connexion
		}
	});
}

export async function POST({ request, cookies }) {
	const userId = cookies.get('user_id');

	// Si aucun cookie, l'utilisateur n'est pas autorisé.
	if (!userId) {
		throw error(401, 'Non autorisé');
	}
	const channel = `event:${userId}`;
	const payload = await request.json();
	eventBus.emit(channel, payload);

	return json({});
}
