<!--
  Composant de débogage pour afficher le
  contenu en temps réel des stores Svelte.
-->
<script lang="ts">
	// 1. Importer les stores que nous voulons surveiller
	import { events } from '$lib/stores/event-store';
	import { chat } from '$lib/stores/chat-store';
	import { stats } from '$lib/stores/stats-store';
	import { obsConnectionStatus,obsState } from '$lib/stores/obs-store';
	import { obs } from '$lib/stores/obs';
	import { replacer } from '$lib/utils';

	
</script>

<div class="debug-store-tab">
	<!-- Store: OBS store -->
	<div class="store-display">
		<h3>OBS (OBS store)</h3>
		<pre>{obs.stringify()}</pre>
	</div>

	<!-- Store: OBS store -->
	<div class="store-display">
		<h3>obsConnectionStatus (OBS store)</h3>
		<pre>{JSON.stringify($obsConnectionStatus, replacer, 2)}</pre>
		<h3>obsScene (OBS store)</h3>
		<pre>{JSON.stringify($obsState, replacer, 2)}</pre>
	</div>

	<!-- Store: stats store -->
	<div class="store-display">
		<h3>stats (Stats store)</h3>
		<pre>{JSON.stringify($stats, replacer, 2)}</pre>
	</div>

	<!-- Store: chat store -->
	<div class="store-display">
		<h3>chat (Chat Store)</h3>
		<pre>{JSON.stringify($chat, replacer, 2)}</pre>
	</div>

	<!-- Store: eventStore -->
	<div class="store-display">
		<h3>events (Last SSE Event)</h3>
		<pre>{JSON.stringify($events, replacer, 2)}</pre>
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
