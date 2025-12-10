<script lang="ts">
	import { obs } from '$lib/stores/obs';
	import AudioInput from './AudioInput.svelte';

	const sources = obs.audioSources;

  function handleMuteToggle(uuid: string) {
    obs.audioSources.toggleMute(uuid);
  }
</script>

<div class="card">
	<h2>Audio</h2>
	<div class="list">
		{#each $sources as source (source.uuid)}
			<AudioInput name={source.name} muted={source.muted} onToggle={()=> handleMuteToggle(source.uuid)} />
		{/each}
	</div>
</div>

<style>
  .card {
    min-width: 300px;
		width: 100%;
  }
</style>
