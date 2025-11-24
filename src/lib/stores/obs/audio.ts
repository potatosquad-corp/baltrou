import { get, writable } from 'svelte/store';
import type { ObsClient } from './client';
import { updateStoreItem } from '$lib/utils';
import { obs } from '.';
import { browser } from '$app/environment';

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
		if (get(client.status) != 'CONNECTED') return;
		try {
			const { inputMuted } = await client._client.call('ToggleInputMute', { inputUuid: uuid });
			updateStoreItem(audioSources, uuid, (i) => ({ ...i, muted: inputMuted }));
		} catch (err) {
			console.error(`[OBS] Erreur ToggleInputMute:`, err);
		}
	}

	async function setVolume(uuid: string, volume: number) {
		if (get(client.status) != 'CONNECTED') return;
		try {
			const db = volume - 100;
			await client._client.call('SetInputVolume', { inputUuid: uuid, inputVolumeDb: db });
			updateStoreItem(audioSources, uuid, (i) => ({ ...i, volume }));
		} catch (err) {
			console.error(`[OBS] Erreur SetInputVolume:`, err);
		}
	}

	async function setActive(uuid: string, active: boolean) {
		if (get(client.status) != 'CONNECTED') return;
		try {
			updateStoreItem(audioSources, uuid, (i) => ({ ...i, active }));
		} catch (err) {
			console.error(`[OBS] Erreur SetInputVolume:`, err);
		}
	}

	async function hydrate() {
		if (get(client.status) != 'CONNECTED') return;
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

		const sourcesInScene = new Set<string>();
		if (activeScene) {
			const { sceneItems } = await client._client.call('GetSceneItemList', {
				sceneUuid: activeScene.uuid
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
		}
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
		console.info(`[OBS] Hydrated audio sources, got ${get(audioSources).length} sources`);
	}

	if (browser) {
		client._client.on('CurrentProgramSceneChanged', async (activeScene) => {
			const sourcesInScene = new Set<string>();
			const { sceneItems } = await client._client.call('GetSceneItemList', {
				sceneUuid: activeScene.sceneUuid
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
			audioSources.update((sources) =>
				sources.map((source) => ({ ...source, active: sourcesInScene.has(source.uuid) }))
			);
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
