import { getUserFromCookies } from '$lib/server/auth.js';
import { processUser } from '$lib/server/cron.js';
import eventBus from '$lib/server/event-bus';
import { ircManager } from '$lib/server/irc.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	console.log('[SSE] New user connecting to SSE');
	const user = await getUserFromCookies(cookies);
	if (!user) {
		console.log('[SSE] User is not connected, aborting');
		throw error(401, 'Non autorisé');
	}

	const channel = `event:${user.id}`;
	let interval: NodeJS.Timeout; 
	let handler: (message: unknown) => void;

	const stream = new ReadableStream({
		async start(controller) {
			handler = (message: unknown) => {
				const sseMessage = `data: ${JSON.stringify(message)}\n\n`;
				controller.enqueue(sseMessage);
			};
			interval = setInterval(() => {
            controller.enqueue(': keepalive\n\n');
        }, 30000);

			eventBus.on(channel, handler);

			await ircManager.joinChannel(user.id, user.userLogin);
			await processUser(user);

			console.log(`[SSE] User ${user.id} connected`);
			controller.enqueue(`event: connected\ndata: {"message": "SSE Ready"}\n\n`);
		},
		async cancel() {
			console.log(`[SSE] User ${user.id} disconnected`);
			eventBus.off(channel, handler);
			await ircManager.partChannel(user.id, user.userLogin);
			clearInterval(interval);
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
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
