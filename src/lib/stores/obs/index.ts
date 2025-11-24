import { replacer } from '$lib/utils';
import { createAudioModule } from './audio';
import { createObsClient } from './client';
import { createSceneModule } from './scene';

const client = createObsClient();
const { sceneModule, hydrateScenes } = createSceneModule(client);
const { audioModule, hydrateAudioSources } = createAudioModule(client);

async function init() {
  await client.connect();
  await hydrateScenes();
  await hydrateAudioSources();
}
function stringify() {
  return JSON.stringify({
    ...obs,
    client:{
      _client: undefined,
    }
  },replacer,2)
}
export const obs = {
	client,
	...sceneModule,
	...audioModule,
  init,stringify
};
