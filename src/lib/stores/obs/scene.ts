import { get, writable } from 'svelte/store';
import type { ObsClient } from './client';
import { browser } from '$app/environment';

export type Scene = {
	uuid: string;
	name: string;
};

export function createSceneModule(client: ObsClient) {
	const sceneList = writable<Scene[]>([]);
	const activeScene = writable<Scene | undefined>(undefined);

	async function switchScene(sceneUuid: string) {
		if (!get(client.isConnected)) return;
		try {
			await client._client.call('SetCurrentProgramScene', { sceneUuid });
		} catch (err) {
			console.error(`[OBS] Erreur SetCurrentProgramScene:`, err);
		}
	}

	async function hydrate() {
		if (!get(client.isConnected)) return;
		const { scenes, currentProgramSceneUuid } = await client._client.call('GetSceneList');
		sceneList.set(
			scenes.map((scene: any) => ({
				name: scene.sceneName,
				uuid: scene.sceneUuid
			}))
		);

		const currentScene =
			get(sceneList).find((scene) => scene.uuid == currentProgramSceneUuid) || undefined;
		activeScene.set(currentScene);
		console.info(
			`[OBS] Hydrated scenes, got ${get(sceneList).length} scene${get(sceneList).length > 1 ? 's' : ''}`
		);
	}

	if (browser) {
		client._client.on('CurrentProgramSceneChanged', (scene) => {
			activeScene.set({ name: scene.sceneName, uuid: scene.sceneUuid });
		});

		client._client.on('SceneListChanged', (data) => {
			sceneList.set(
				data.scenes.map((scene: any) => ({
					name: scene.sceneName,
					uuid: scene.sceneUuid
				}))
			);
		});
	}

	return {
		sceneModule: {
			sceneList: {
				subscribe: sceneList.subscribe
			},
			activeScene: {
				subscribe: activeScene.subscribe,
				switchScene
			}
		},
		hydrateScenes: hydrate
	};
}
