<script lang="ts">
	import AudioFader from '$lib/components/AudioFader.svelte';
	import PlayIcon from '$lib/components/icons/PlayIcon.svelte';
	import ShortcutButton from '$lib/components/icons/ShortcutButton.svelte';
	import { obs } from '$lib/stores/obs';
	const isConnected = obs.client.isConnected;
	const activeScene = obs.activeScene;
	const sceneList = obs.sceneList;
	const audioSources = obs.audioSources;
</script>

<h1>Contrôles du Stream</h1>
{#if $isConnected}
	<div class="controls-grid">
		<!-- Shortcut Buttons -->
		<div class="shortcuts">
			<h2>Scènes</h2>
			<div class="buttons-grid">
				{#each $sceneList as scene}
					<ShortcutButton
						name={scene.name}
						selected={$activeScene?.uuid == scene.uuid}
						on:click={() => activeScene.switchScene(scene.uuid)}
					>
						<PlayIcon slot="icon" />
					</ShortcutButton>
				{/each}
			</div>
		</div>
	</div>

	<div class="controls-grid">
		<!-- Shortcut Buttons -->
		<div class="shortcuts">
			<h2>Audio</h2>
			<div class="faders-grid">
				{#each $audioSources as audioSource}
					<AudioFader
						active={audioSource.active}
						muted={audioSource.muted}
						name={audioSource.name}
						volumePercentage={audioSource.volume}
						uuid={audioSource.uuid}
					></AudioFader>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="content-box">
		<p>OBS non connecté. Rendez vous dans les <a href="/settings">réglages</a></p>
	</div>
{/if}

<style>
	.controls-grid {
		display: grid;
		gap: 2rem;
	}

	.shortcuts h2 {
		margin-bottom: 1rem;
	}

	.buttons-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}
	.faders-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, 100px);
		gap: 1rem;
	}

	a {
		color: lightblue;
	}
</style>
