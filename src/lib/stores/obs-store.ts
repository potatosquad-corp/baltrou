import { writable, get } from 'svelte/store';
import OBSWebSocket, { EventSubscription } from 'obs-websocket-js';
import { events } from './event-store'; // Pour le "pont" SSE
import { browser } from '$app/environment';

// --- Types ---
export type ObsConnectionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';
export type ObsSettings = {
	host: string;
	port: number;
	password?: string;
};
export type ObsScene = string;
export type ObsAudioSource = {
	name: string;
	value: number;
	muted: boolean;
	inCurrentScene: boolean;
};
export type ObsSceneState = {
	list: ObsScene[];
	active: ObsScene | null;
	audioSources: ObsAudioSource[];
	status: ObsConnectionStatus;
};

// --- Store d'état ---
/**
 * @deprecated Use obsState.status directly
 */
export const obsConnectionStatus = writable<ObsConnectionStatus>('DISCONNECTED');
export const obsState = writable<ObsSceneState>({
	list: [],
	active: null,
	audioSources: [],
	status: 'DISCONNECTED'
});

// --- Instance et Clé de Sauvegarde ---
const obs = new OBSWebSocket();
const LOCAL_STORAGE_KEY = 'baltrou_obs_settings';

// --- Fonctions de base (Sauvegarde/Chargement) ---

/**
 * Charge les paramètres OBS depuis le LocalStorage
 */
export function loadObsSettings(): ObsSettings | null {
	if (typeof window === 'undefined') return null;

	const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (stored) {
		return JSON.parse(stored) as ObsSettings;
	}
	return null;
}

/**
 * Sauvegarde les paramètres OBS dans le LocalStorage
 */
export function saveObsSettings(settings: ObsSettings) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
}

// --- Fonctions de Connexion ---

/**
 * Tente de se connecter à OBS WebSocket
 */
export async function connectObs() {
	const settings = loadObsSettings();
	if (!settings) {
		obsConnectionStatus.set('ERROR');
		console.error('[OBS] Paramètres de connexion non trouvés.');
		return;
	}

	obsConnectionStatus.set('CONNECTING');
	console.log(`[OBS] Tentative de connexion à ws://${settings.host}:${settings.port}...`);

	try {
		const { host, port, password } = settings;
		return await obs.connect(`ws://${host}:${port}`, password, {
			eventSubscriptions: EventSubscription.General 
			/* | EventSubscription.InputVolumeMeters DISABLED*/ 
		});
	} catch (err: any) {
		console.error('[OBS] Échec de la connexion:', err.message);
		obsConnectionStatus.set('ERROR');
		return Promise.reject(err);
	}
}

/**
 * Se déconnecte d'OBS WebSocket
 */
export async function disconnectObs() {
	await obs.disconnect();
	obsState.set({ list: [], active: null, audioSources: [], status: 'DISCONNECTED' });
}

export async function updateObsState() {
	await getScenes();
	await updateAudioSources();
}

/**
 * Récupère les données initiales après la connexion
 */
async function onConnected() {
	console.log('[OBS] Connected');
	obsConnectionStatus.set('CONNECTED');
	obsState.update((s) => ({ ...s, status: 'CONNECTED' }));
	updateObsState();
}

/**
 * Envoie la commande à OBS pour changer de scène.
 */
export async function switchScene(sceneName: string) {
	const isObsConnected = get(obsConnectionStatus) === 'CONNECTED';
	if (!isObsConnected) {
		console.error('[OBS] Impossible de changer de scène: non connecté.');
		return;
	}

	try {
		// Envoie la commande à OBS
		await obs.call('SetCurrentProgramScene', { sceneName });
	} catch (err) {
		console.error(`[OBS] Échec de la commande SetCurrentProgramScene pour ${sceneName}:`, err);
	}
}

export async function toggleInputMute(audioInputName: string) {
	const { inputMuted } = await obs.call('ToggleInputMute', { inputName: audioInputName });
	obsState.update((s) => ({
		...s,
		audioSources: s.audioSources.map((i) => {
			if (i.name == audioInputName) {
				i.muted = inputMuted;
			}
			return i;
		})
	}));
}

export async function setInputVolume(audioInputName: string, inputVolumePercentage: number) {
	const volumeToDb = inputVolumePercentage - 100;
	await obs.call('SetInputVolume', { inputName: audioInputName, inputVolumeDb: volumeToDb });
}

export async function getScenes() {
	try {
		const { scenes } = await obs.call('GetSceneList');
		console.log(
			'[OBS] Scènes récupérées:',
			scenes.map((s: any) => s.sceneName)
		);

		const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
		console.log('[OBS] Scène active récupérée: ' + currentProgramSceneName);
		obsState.update((current) => ({
			...current,
			list: scenes.map((s: any) => s.sceneName),
			active: currentProgramSceneName
		}));
	} catch (err) {
		console.error('[OBS] Erreur lors de la récupération des scènes:', err);
		obsConnectionStatus.set('ERROR');
	}
}

async function updateAudioSources() {
	if (get(obsState).status !== 'CONNECTED') {
		return; // Ne peut pas s'exécuter si non connecté
	}

	try {
		const { inputs } = await obs.call('GetInputList');
		let audioInputs: ObsAudioSource[] = inputs
			.filter(
				(input: any) =>
					input.inputKind &&
					(input.inputKind.includes('input_capture') || // Micros
						input.inputKind.includes('output_capture')) // Audio du bureau
			)
			.map((input: any) => ({
				inCurrentScene: false,
				muted: false,
				name: input.inputName,
				value: 50,
				volumeMeter: 0
			}));

		const activeScene = get(obsState).active;
		if (activeScene) {
			const { sceneItems } = await obs.call('GetSceneItemList', { sceneName: activeScene });
			for (const sceneItem of sceneItems) {
				const i = sceneItem as any;
				if (i.isGroup == true) {
					const group = await obs.call('GetGroupSceneItemList', { sceneName: i.sourceName });
					for (const groupSceneItem of group.sceneItems) {
						const j = groupSceneItem as any;
						audioInputs = audioInputs.map((i) => {
							if (i.name == j.sourceName) {
								i.inCurrentScene = true;
							}
							return i;
						});
					}
				} else {
					audioInputs = audioInputs.map((k) => {
						if (k.name == i.sourceName) {
							k.inCurrentScene = true;
						}
						return k;
					});
				}
			}
		}

		for (const audioInput of audioInputs) {
			const { inputVolumeDb } = await obs.call('GetInputVolume', { inputName: audioInput.name });
			const { inputMuted } = await obs.call('GetInputMute', { inputName: audioInput.name });
			audioInputs = audioInputs.map((i) => {
				if (i.name == audioInput.name) {
					i.value = inputVolumeDb + 100;
					i.muted = inputMuted;
				}
				return i;
			});
		}

		obsState.update((current) => ({
			...current,
			audioSources: audioInputs
		}));
		console.log(`[OBS] Sources audio pour mises à jour:`, audioInputs);
	} catch (err) {
		console.error(`[OBS] Échec de la récupération des sources audio:`, err);
	}
}

// --- Écouteurs d'Événements OBS ---
if (browser) {
	obs.removeAllListeners();
	obs.on('Identified', onConnected);
	obs.on('ConnectionClosed', () => obsConnectionStatus.set('DISCONNECTED'));
	obs.on('ConnectionError', (err) => {
		console.error('[OBS] Erreur de connexion:', err);
		obsConnectionStatus.set('ERROR');
	});

	// Mettre à jour nos stores Svelte quand OBS change
	obs.on('CurrentProgramSceneChanged', (data) => {
		console.log('[OBS] Événement "CurrentProgramSceneChanged":', data.sceneName);
		obsState.update((state) => ({
			...state,
			active: data.sceneName
		}));
		updateAudioSources();
	});

	obs.on('SceneListChanged', (data) => {
		console.log('[OBS] Événement "CurrentProgramSceneChanged":', data.scenes);
		obsState.update((state) => ({
			...state,
			list: data.scenes.map((s: any) => s.sceneName)
		}));
	});

	obs.on('InputMuteStateChanged', (data) => {
		console.log(`[OBS] ${data.inputName} changed mute state: ${data.inputMuted}`);
		obsState.update((s) => ({
			...s,
			audioSources: s.audioSources.map((i) => {
				if (i.name == data.inputName) {
					i.muted = data.inputMuted;
				}
				return i;
			})
		}));
	});

	// --- PONT SSE (Serveur -> Client -> OBS) ---
	// S'abonne à notre 'eventStore' global
	events.subscribe(async (event) => {
		const status = await obs.call('GetVersion'); // Vérifie si on est connecté
		if (event && event.type === 'obs_command' && status.obsWebSocketVersion) {
			console.log('[OBS Bridge] Commande reçue du serveur:', event.data);
			//TODO changer au besoin
		}
	});
}
