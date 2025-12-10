import { writable, get, type Readable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import OBSWebSocket from 'obs-websocket-js';
import { ConnectionStatus } from '$lib/types/status';

const obsClient = new OBSWebSocket();

export interface ObsSettings {
	host: string;
	room: string;
	password?: string;
}

const LOCAL_STORAGE_KEY = 'baltrou_obs_settings';

// Store d'état de connexion
const status = writable<ConnectionStatus>(ConnectionStatus.DISCONNECTED);

// Fonctions utilitaires pour les paramètres
function loadSettings(): ObsSettings | null {
	if (!browser) return null;
	const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
	return stored ? JSON.parse(stored) : null;
}

function saveSettings(settings: ObsSettings) {
	if (browser) localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
}

async function connect() {
	const settings = loadSettings();
	const timeout = new Promise((_, reject) => {
		setTimeout(() => reject({ code: 1000, message: 'Connexion timeout' }), 1000 * 20);
	});
	if (!settings || settings.host == '' || settings.room == '') {
		status.set(ConnectionStatus.ERROR);
		return;
	}

	if (get(status) === ConnectionStatus.CONNECTED || get(status) === ConnectionStatus.CONNECTING)
		return;

	status.set(ConnectionStatus.CONNECTING);
	try {
		listenToConnexionChanges();
		await Promise.race([
			obsClient.connect(`wss://${settings.host}/ws?room=${settings.room}`, settings.password),
			timeout
		]);
	} catch (err) {
		console.error(`[OBS] Erreur de connexion:`, err);
		status.set(ConnectionStatus.ERROR);
	}
}

function listenToConnexionChanges() {
	obsClient.once('Identified', () => {
		status.set(ConnectionStatus.CONNECTED);
	});
	obsClient.once('ConnectionClosed', () => {
		status.set(ConnectionStatus.DISCONNECTED);
	});
	obsClient.once('ConnectionError', () => {
		status.set(ConnectionStatus.ERROR);
	});
}

async function disconnect() {
	await obsClient.disconnect();
	status.set(ConnectionStatus.DISCONNECTED);
}

export type ObsClient = {
	_client: OBSWebSocket;
	status: {
		subscribe: Readable<ConnectionStatus>['subscribe'];
	};
	isConnected: Readable<boolean>;
	loadSettings: () => ObsSettings | null;
	saveSettings: (settings: ObsSettings) => void;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
};

export function createObsClient(): ObsClient {
	return {
		_client: obsClient,
		status: {
			subscribe: status.subscribe
		},
		isConnected: derived(status, ($s) => $s == ConnectionStatus.CONNECTED),
		loadSettings,
		saveSettings,
		connect,
		disconnect,
	};
}
