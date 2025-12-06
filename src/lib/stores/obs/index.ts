import { createAudioModule } from './audio';
import { createObsClient } from './client';
import { createSceneModule } from './scene';

const client = createObsClient();
client._client.removeAllListeners();
const { sceneModule, hydrateScenes } = createSceneModule(client);
const { audioModule, hydrateAudioSources } = createAudioModule(client);

async function init() {
	await client.connect();
	await hydrateScenes();
	await hydrateAudioSources();
}
export const obs = {
	client,
	...sceneModule,
	...audioModule,
	init
};
