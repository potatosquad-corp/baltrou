<!--
  Composant de débogage pour afficher le
  contenu en temps réel des stores Svelte.
-->
<script lang="ts">
	// 1. Importer les stores que nous voulons surveiller
	import { events } from '$lib/stores/event-store';
	import { chat } from '$lib/stores/chat-store';
	import { stats } from '$lib/stores/stats-store';
	import { obs } from '$lib/stores/obs';
	import { jsonReplacer } from '$lib/utils';
	import { statusNameMap } from '$lib/types/status';
	import { soundboardStore } from '$lib/stores/soundboard-store';
	import { appMode, auth } from '$lib/stores/global-store';
	const status = obs.client.status;
	const sceneList = obs.sceneList;
	const activeScene = obs.activeScene;
	const audioSources = obs.audioSources;
</script>

<div class="debug-store-tab">
	<!-- Store: Global store -->
	<div class="store-display">
		<h3>Auth (Global store)</h3>
		<pre>{JSON.stringify($auth, jsonReplacer, 2)}</pre>
		<h3>Mode (Global store)</h3>
		<pre>{JSON.stringify($appMode, jsonReplacer, 2)}</pre>
	</div>

	<!-- Store: OBS store -->
	<div class="store-display">
		<h3>Status (OBS store)</h3>
		<pre>{statusNameMap[$status]}</pre>
		<h3>SceneList (OBS store)</h3>
		<pre>{JSON.stringify($sceneList, jsonReplacer, 2)}</pre>
		<h3>ActiveScene (OBS store)</h3>
		<pre>{JSON.stringify($activeScene, jsonReplacer, 2)}</pre>
		<h3>AudioSources (OBS store)</h3>
		<pre>{JSON.stringify($audioSources, jsonReplacer, 2)}</pre>
	</div>

	<!-- Store: stats store -->
	<div class="store-display">
		<h3>sounds (soundboard store)</h3>
		<pre>{JSON.stringify($soundboardStore, jsonReplacer, 2)}</pre>
	</div>

	<!-- Store: stats store -->
	<div class="store-display">
		<h3>stats (Stats store)</h3>
		<pre>{JSON.stringify($stats, jsonReplacer, 2)}</pre>
	</div>

	<!-- Store: chat store -->
	<div class="store-display">
		<h3>chat (Chat Store)</h3>
		<pre>{JSON.stringify($chat, jsonReplacer, 2)}</pre>
	</div>

	<!-- Store: eventStore -->
	<div class="store-display">
		<h3>events (Last SSE Event)</h3>
		<pre>{JSON.stringify($events, jsonReplacer, 2)}</pre>
	</div>
</div>

<style>
	.debug-store-tab {
		font-family: 'Inter', sans-serif;
		color: white;
		padding: 0.5rem;
		overflow-y: auto;
		height: 100%;
	}

	.store-display {
		margin-bottom: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.store-display h3 {
		font-family: 'Inter', sans-serif;
		font-size: 1rem;
		font-weight: 700;
		margin: 0;
		padding: 0.5rem 0.75rem;
		background-color: rgba(0, 0, 0, 0.2);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.store-display pre {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
		font-size: 0.8rem;
		overflow-x: auto;
		color: white;
		padding: 0.75rem;
		margin: 0;
	}
</style>
