import { get, writable } from 'svelte/store';
import type { ObsClient } from './client';
import { browser } from '$app/environment';

export type Scene = {
	uuid: string;
	name: string;
	previewImage: string;
};

export function createSceneModule(client: ObsClient) {
	const sceneList = writable<Scene[]>([]);
	const activeScene = writable<Scene | undefined>(undefined);

	async function switchScene(sceneUuid: string) {
		if (!get(client.isConnected)) return;
		try {
			const scene = get(sceneList).find(s=>s.uuid == sceneUuid);
			activeScene.set(scene);
			await client._client.call('SetCurrentProgramScene', { sceneUuid });
		} catch (err) {
			console.error(`[OBS] Erreur SetCurrentProgramScene:`, err);
		}
	}

	async function hydrate() {
		if (!get(client.isConnected)) return;
		const { scenes, currentProgramSceneUuid } = await client._client.call('GetSceneList');
		const hydratedSceneList = scenes.map((scene: any) => ({
			name: scene.sceneName,
			uuid: scene.sceneUuid,
			previewImage: ''
		}));
		for (const scene of hydratedSceneList) {
			const {imageData} = await client._client.call('GetSourceScreenshot', {
				sourceUuid: scene.uuid,
				imageFormat: "png",
				imageCompressionQuality: 100,
				imageWidth: 300
			})
			scene.previewImage = imageData;
		}
		sceneList.set(hydratedSceneList);

		const currentScene =
			get(sceneList).find((scene) => scene.uuid == currentProgramSceneUuid) || undefined;
		activeScene.set(currentScene);
		console.info(
			`[OBS] Hydrated scenes, got ${get(sceneList).length} scene${get(sceneList).length > 1 ? 's' : ''}`
		);
	}

	if (browser) {
		client._client.on('CurrentProgramSceneChanged', (scene) => {
			activeScene.set({ name: scene.sceneName, uuid: scene.sceneUuid, previewImage: '' });
		});

		client._client.on('SceneListChanged', (data) => {
			sceneList.set(
				data.scenes.map((scene: any) => ({
					name: scene.sceneName,
					uuid: scene.sceneUuid,
					previewImage: ''
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
