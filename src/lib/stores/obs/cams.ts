import { writable } from 'svelte/store';
import type { ObsClient } from './client';

export type Camera = {
	name: string;
	uuid: string;
};

export function createCamsModule(client: ObsClient) {
	const { subscribe, set } = writable(null);
	async function hydrate() {
		const { inputs } = await client._client.call('GetInputList');
		const camsList: Camera[] = inputs
			.filter((i: any) =>
				['dshow_input', 'av_capture_input', 'v4l2_input', 'decklink-input', 'ndi_source','macos-avcapture'].includes(
					i.inputKind
				)
			)
			.map((i: any) => ({
				name: i.inputName,
				uuid: i.inputUuid
			}));
    console.log(camsList);
	}

	return {
		camsModule: {
			camsList: {
				subscribe,
				set
			}
		},
		hydrateCamsModule: hydrate
	};
}
