<script lang="ts">
	import { obs } from '$lib/stores/obs';
	import AudioInput from './AudioInput.svelte';

	const sources = obs.audioSources;

  function handleMuteToggle(uuid: string) {
    obs.audioSources.toggleMute(uuid);
  }
</script>

<div class="card audio-mixer">
	<h2>Audio</h2>
	<div class="list">
		{#each $sources as source (source.uuid)}
			<AudioInput name={source.name} muted={source.muted} onToggle={()=> handleMuteToggle(source.uuid)} />
		{/each}
		{#if $sources.length == 0}
			<div class="card center">
				<h2>Aucune source audio</h2>
				<p>Configure OBS pour ajouter des sources !</p>
			</div>
		{/if}
	</div>
</div>

<style>
  .audio-mixer {
    min-width: 300px;
		width: 100%;
  }
</style>
