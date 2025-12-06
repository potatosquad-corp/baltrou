import { building } from '$app/environment';
import { runTwitchUpdateCron } from '$lib/server/cron';
import { ircManager } from '$lib/server/irc';
import { initSoundboardFolder } from '$lib/server/soundboard';
import cron from 'node-cron';

console.log('[HOOKS] Configuration des services...');
initSoundboardFolder();
console.log('[HOOKS] Soundboard configuré');

console.log('[HOOKS] Démarrage des services de fond...');

ircManager.connect();
console.log('[HOOKS] Bot TMI démarré et en attente...');

cron.schedule('*/1 * * * *', runTwitchUpdateCron);
console.log('[HOOKS] Tâche CRON planifiée (toutes les minutes)');

console.log('[HOOKS] Services de fond démarrés');

export async function handle({ event, resolve }) {
	return await resolve(event);
}

if (!building) {
	function shutdownGracefully(signal: string) {
		console.log(`Received ${signal}. Starting graceful shutdown...`);
		process.exit(0);
	}

	// SIGINT is sent when you press Ctrl+C locally
	process.on('SIGINT', () => shutdownGracefully('SIGINT'));

	// SIGTERM is sent by Systemd when you run 'systemctl stop'
	process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
}
