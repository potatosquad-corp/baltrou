import tmi from 'tmi.js';
import eventBus from './event-bus'; // Utilise le chemin de l'utilisateur

// Map<channelName, Set<userId>>
const channelListeners: Map<string, Set<string>> = new Map();

/**
 * Le gestionnaire TMI.js (Singleton)
 * Maintient une seule connexion bot pour tous les canaux.
 */
class IrcManager {
	public client: tmi.Client;

	// Propriétés pour gérer l'état de la connexion TMI
	private connectionPromise: Promise<void>;
	private resolveConnection: (() => void) | null = null;

	constructor() {
		// Initialiser la promesse : elle ne se résoudra qu'à la connexion réussie
		this.connectionPromise = new Promise((resolve) => {
			this.resolveConnection = resolve;
		});

		this.client = new tmi.Client({
			options: { debug: false }, // Mettez à true pour le debug TMI
			// Le bot est anonyme, il ne fait qu'écouter
			channels: [] // Canaux rejoints dynamiquement
		});

		this.setupListeners();
	}

	/**
	 * Configure l'écouteur de messages TMI
	 */
	setupListeners() {
		this.client.on(
			'message',
			(channel: string, tags: tmi.ChatUserstate, message: string, self: boolean) => {
				if (self) return;

				const channelName = channel.slice(1);

				// 1. Trouver QUELS utilisateurs de notre app écoutent ce canal
				const userIds = channelListeners.get(channelName);
				if (!userIds || userIds.size === 0) {
					return; // Personne n'écoute, on ne fait rien
				}

				// 2. Préparer le message de chat
				const chatMessage = {
					type: 'irc_message', // Pour le filtrage côté client
					data: {
						id: tags.id,
						user: tags['display-name'],
						color: tags.color,
						badges: tags.badges,
						message // Utilise 'message' comme dans la version de l'utilisateur
					}
				};

				// 3. Émettre le message sur l'eventBus pour CHAQUE utilisateur
				for (const userId of userIds) {
					const eventBusChannel = `event:${userId}`;
					eventBus.emit(eventBusChannel, chatMessage);
				}
			}
		);

		this.client.on('connected', (addr: string, port: number) => {
			console.log(`[TMI] Bot connecté à ${addr}:${port}`);

			// Résoudre la promesse DÈS la connexion TMI est confirmée
			if (this.resolveConnection) {
				this.resolveConnection();
				this.resolveConnection = null; // Nettoyer la référence
			}
		});
	}

	/**
	 * Connexion initiale du bot au serveur TMI
	 */
	connect() {
		// Le handler 'on(connected)' s'occupera de résoudre la promise
		return this.client.connect().catch(console.error);
	}

	/**
	 * Un utilisateur de notre app COMMENCE à écouter un canal
	 * @param {string} userId - L'ID de l'utilisateur de notre app
	 * @param {string} twitchChannelName - Le canal Twitch à rejoindre
	 */
	async joinChannel(userId: string, twitchChannelName: string) {
		// BLOQUE TOUTE EXÉCUTION JUSQU'À CE QUE LA PROMESSE SOIT RÉSOLUE
		await this.connectionPromise;

		// Le reste de la logique de canal n'est exécuté qu'après la connexion TMI.
		const channel = twitchChannelName.toLowerCase();

		if (!channelListeners.has(channel)) {
			channelListeners.set(channel, new Set());
		}
		const listeners = channelListeners.get(channel)!; // '!' car on vient de le créer

		// Si c'est la première personne à écouter ce canal
		if (listeners.size === 0) {
			try {
				await this.client.join(channel);
				console.log(`[TMI] Le bot a rejoint le canal : ${channel}`);
			} catch (err) {
				console.error(`[TMI] Échec de connexion au canal ${channel}`, err);
				return; // Ne pas ajouter l'auditeur si le 'join' échoue
			}
		}

		listeners.add(userId);
		console.log(`[TMI] Utilisateur ${userId} écoute ${channel}. Total: ${listeners.size}`);
	}

	/**
	 * Un utilisateur de notre app ARRÊTE d'écouter un canal
	 * @param {string} userId - L'ID de l'utilisateur de notre app
	 * @param {string} twitchChannelName - Le canal Twitch à quitter
	 */
	async partChannel(userId: string, twitchChannelName: string) {
		// On attend toujours la connexion avant de faire une opération
		await this.connectionPromise;

		const channel = twitchChannelName.toLowerCase();

		const listeners = channelListeners.get(channel);
		if (!listeners || !listeners.has(userId)) {
			return; // L'utilisateur n'était pas dans la liste
		}

		listeners.delete(userId);
		console.log(`[TMI] Utilisateur ${userId} a quitté ${channel}. Restant: ${listeners.size}`);

		// Si c'était la dernière personne...
		if (listeners.size === 0) {
			try {
				await this.client.part(channel);
				console.log(`[TMI] Le bot a quitté le canal : ${channel}`);
			} catch (err) {
				console.error(`[TMI] Échec pour quitter le canal ${channel}`, err);
			}
		}
	}
}

// Exporter une instance UNIQUE (singleton)
export const ircManager = new IrcManager();
