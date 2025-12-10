<script lang="ts">
	import SegmentedToggle from '$lib/components/ui/SegmentedToggle.svelte';
	import { obs } from '$lib/stores/obs';
	import AudioMixer from '$lib/components/features/audio/AudioMixer.svelte';
	import OverlaysControls from '$lib/components/features/overlays/OverlaysControls.svelte';
	const isConnected = obs.client.isConnected;
	const activeScene = obs.activeScene;
	const sceneList = obs.sceneList;
</script>

<h1>Contrôles du Stream</h1>
{#if $isConnected}
	<div class="card">
		<h2>Scènes</h2>
		<div class="scenes-grid" id="scenes-grid">
			{#if $sceneList.length == 0}
				<div class="card center">
					<h2>Aucune scène</h2>
					<p>Ajoutez des scènes dans OBS et vous les retrouverez ici !</p>
				</div>
			{/if}
			{#each $sceneList as scene}
				<div
					class="scene-card {$activeScene?.uuid == scene.uuid ? 'active' : ''}"
					role="button"
					tabindex="0"
					onkeydown={() => {}}
					onclick={() => activeScene.switchScene(scene.uuid)}
				>
					<img src={scene.previewImage} class="scene-image" alt={scene.name} />
					<div class="active-dot"></div>
					<div class="scene-label">{scene.name}</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="divider">
		<AudioMixer/>
		<OverlaysControls/>
	</div>
{:else}
	<div class="content-box">
		<p>OBS non connecté. Rendez vous dans les <a href="/settings">réglages</a></p>
	</div>
{/if}

<style>
	.card {
		padding: 1em;
		width: 100%;
		box-sizing: border-box;
	}

	.divider {
		display: flex;
		justify-content: space-around;
	}

	.scenes-grid {
		display: flex;
		overflow-x: auto;
		gap: 1rem;
		padding-bottom: 0.5rem;
		border-radius: 10px;

		scrollbar-width: thin;
		scrollbar-color: var(--accent-primary) rgba(0, 0, 0, 0.3);
	}

	.scenes-grid::-webkit-scrollbar {
		height: 8px;
	}
	.scenes-grid::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	}
	.scenes-grid::-webkit-scrollbar-thumb {
		background: var(--accent-primary);
		border-radius: 4px;
	}
	.scenes-grid::-webkit-scrollbar-thumb:hover {
		background: var(--accent-primary);
	}


	.scene-card {
		position: relative;
		aspect-ratio: 16/9;
		min-width: 280px;
		flex-shrink: 0;
		background: #000;
		border-radius: 8px;
		overflow: hidden;
		cursor: pointer;
		border: 2px solid transparent;
		transition: all 0.2s;
	}

	.scene-card.active {
		border-color: var(--accent-success);
		box-shadow: 0 0 15px rgba(46, 204, 113, 0.3);
	}

	.scene-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.9;
		transition: opacity 0.2s;
	}
	.scene-card:hover .scene-image,
	.scene-card.active .scene-image {
		opacity: 1;
	}

	.scene-label {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 0.5rem;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
		font-family: var(--font-heading);
		font-size: 1.2rem;
		text-shadow: 0 1px 2px black;
	}

	.active-dot {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 12px;
		height: 12px;
		background: var(--accent-success);
		border-radius: 50%;
		box-shadow: 0 0 8px var(--accent-success);
		display: none;
	}
	.scene-card.active .active-dot {
		display: block;
	}
</style>
