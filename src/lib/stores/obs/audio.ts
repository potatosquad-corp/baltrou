import { get, writable } from 'svelte/store';
import type { ObsClient } from './client';
import { updateStoreItem } from '$lib/utils';
import { browser } from '$app/environment';
import { obs } from '.';

export type AudioSource = {
	uuid: string;
	name: string;
	volume: number;
	muted: boolean;
	active: boolean;
};

export function createAudioModule(client: ObsClient) {
	const audioSources = writable<AudioSource[]>([]);
	async function toggleMute(uuid: string) {
		if (!get(client.isConnected)) return;
		try {
			const { inputMuted } = await client._client.call('ToggleInputMute', { inputUuid: uuid });
			updateStoreItem(audioSources, uuid, (i) => ({ ...i, muted: inputMuted }));
		} catch (err) {
			console.error(`[OBS] Erreur ToggleInputMute:`, err);
		}
	}

	async function setVolume(uuid: string, volume: number) {
		if (!get(client.isConnected)) return;
		try {
			const db = volume - 100;
			await client._client.call('SetInputVolume', { inputUuid: uuid, inputVolumeDb: db });
			updateStoreItem(audioSources, uuid, (i) => ({ ...i, volume }));
		} catch (err) {
			console.error(`[OBS] Erreur SetInputVolume:`, err);
		}
	}

	async function setActive(uuid: string, active: boolean) {
		if (!get(client.isConnected)) return;
		try {
			updateStoreItem(audioSources, uuid, (i) => ({ ...i, active }));
		} catch (err) {
			console.error(`[OBS] Erreur SetInputVolume:`, err);
		}
	}

	async function hydrate() {
		if (!get(client.isConnected)) return;
		const { inputs } = await client._client.call('GetInputList');
		const audioInputs: AudioSource[] = inputs
			.filter(
				(input: any) =>
					input.inputKind &&
					(input.inputKind.includes('input_capture') || // Micros
						input.inputKind.includes('output_capture')) // Audio du bureau
			)
			.map((input: any) => ({
				active: false,
				muted: false,
				name: input.inputName,
				uuid: input.inputUuid,
				volume: 0
			}));
		const activeScene = get(obs.activeScene);
		let sourcesInScene = new Set<string>();
		if (activeScene) sourcesInScene = await getsourcesInScene(activeScene?.uuid);
		const volumeMap = new Map<string, [number, boolean]>();
		for (const audioInput of audioInputs) {
			const { inputVolumeDb } = await client._client.call('GetInputVolume', {
				inputUuid: audioInput.uuid
			});
			const { inputMuted } = await client._client.call('GetInputMute', {
				inputUuid: audioInput.uuid
			});
			volumeMap.set(audioInput.uuid, [inputVolumeDb + 100, inputMuted]);
		}
		audioSources.set(
			audioInputs.map((source) => ({
				...source,
				active: sourcesInScene.has(source.uuid),
				volume: volumeMap.get(source.uuid)?.[0] || 0,
				muted: volumeMap.get(source.uuid)?.[1] || false
			}))
		);
		console.info(`[OBS] Hydrated audio sources, got ${get(audioSources).length} source${get(audioSources).length > 1 ? 's': ''}`);
	}

	async function getsourcesInScene(sceneUuid: string): Promise<Set<string>> {
		const sourcesInScene = new Set<string>();
		const { sceneItems } = await client._client.call('GetSceneItemList', {
			sceneUuid: sceneUuid
		});
		const processSceneItems = async (items: any[]) => {
			for (const item of items) {
				if (item.isGroup) {
					const { sceneItems } = await client._client.call('GetGroupSceneItemList', {
						sceneName: item.sourceUuid
					});
					processSceneItems(sceneItems);
				} else {
					sourcesInScene.add(item.sourceUuid);
				}
			}
		};
		await processSceneItems(sceneItems);
		return sourcesInScene;
	}

	if (browser) {
		client._client.on('CurrentProgramSceneChanged', async (activeScene) => {
			const sourcesInScene = await getsourcesInScene(activeScene.sceneUuid);
			audioSources.update((sources) =>
				sources.map((source) => ({ ...source, active: sourcesInScene.has(source.uuid) }))
			);
		});

		client._client.on('InputVolumeChanged', (input) => {
			updateStoreItem(audioSources, input.inputUuid, (i) => ({
				...i,
				volume: input.inputVolumeDb + 100
			}));
		});

		client._client.on('InputMuteStateChanged', (input) => {
			updateStoreItem(audioSources, input.inputUuid, (i) => ({ ...i, muted: input.inputMuted }));
		});
	}

	return {
		audioModule: {
			audioSources: {
				subscribe: audioSources.subscribe,
				toggleMute,
				setVolume,
				setActive
			}
		},
		hydrateAudioSources: hydrate
	};
}
