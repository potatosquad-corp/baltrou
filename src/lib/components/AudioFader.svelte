<script lang="ts">
	import { obs } from '$lib/stores/obs';
	import VolumeIcon from './icons/VolumeIcon.svelte';
	import VolumeOffIcon from './icons/VolumeOffIcon.svelte';

	export let muted = false;
	export let volumePercentage = 0;
	export let name = 'Unnamed';
	export let uuid: string;
	export let active = false;
	function toggleMute() {
		muted = !muted;
		obs.audioSources.toggleMute(uuid);
	}
	function valueChange() {
		obs.audioSources.setVolume(uuid, volumePercentage);
	}
</script>

<div class="fader-container" class:active>
	<div class="fader">
		<label for={name}>{name}</label>
		<div class="range-wrapper">
			<input
				type="range"
				oninput={valueChange}
				bind:value={volumePercentage}
				style="--progress-percent: {volumePercentage}%"
			/>
		</div>
	</div>
	<button class="icon-wrapper" onclick={toggleMute} class:muted>
		{#if muted}
			<VolumeOffIcon />
		{:else}
			<VolumeIcon />
		{/if}
	</button>
</div>

<style>
	.icon-wrapper {
		width: auto;
		padding: 0 0.5rem;
		height: 40px;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		margin-top: 5px;
	}
	.fader-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		border-radius: 8px;
		background-color: rgba(255, 255, 255, 0.1);
		padding: 1rem;
		max-width: 100px;

		/* Par défaut, assombrir le composant */
		filter: brightness(50%);
		transition: filter 0.2s ease-in-out;
	}

	/* Quand il est actif, remettre la luminosité à la normale */
	.fader-container.active {
		filter: brightness(100%);
	}

	.fader {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 180px;
	}

	.range-wrapper {
		flex-grow: 1; /* Prend la hauteur restante */
		width: auto;
		display: flex; /* MODIFIÉ: Ajouté pour le centrage */
		justify-content: center;
		align-items: center; /* Centre le slider tourné */
	}

	button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
	}

	button.muted {
		color: #ff4d4d;
	}

	label {
		margin-bottom: 5px;
	}

	input[type='range'] {
		-webkit-appearance: none; /* Supprime le style natif */
		appearance: none;

		/* MODIFIÉ: On définit la LONGUEUR avec 'width' */
		width: 150px; /* Longueur du fader (ex: 150px) */
		height: 12px; /* Épaisseur du track */

		background: rgba(0, 0, 0, 0.3); /* Couleur du track (non rempli) */
		border-radius: 60px;
		outline: none;
		cursor: pointer;

		/* MODIFIÉ: On utilise 'transform' au lieu de 'appearance' */
		transform: rotate(-90deg);

		/* MODIFIÉ: Le gradient est 'to right' (horizontal) */
		/* 'right' deviendra 'top' après la rotation */
		background-image: linear-gradient(
			to right,
			#a855f7,
			#a855f7 var(--progress-percent),
			rgba(0, 0, 0, 0.3) var(--progress-percent)
		);
	}

	/* --- Style du "Pouce" (Thumb) pour Webkit (Chrome/Safari) --- */
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 28px; /* Style fader rectangulaire */
		/* background-color: white; */
		/* border: 1px solid #ccc; */
		border-radius: 3px;
		/* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3); */
	}

	/* --- Style du "Pouce" (Thumb) pour Firefox --- */
	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 28px;
		background-color: white;
		border: 1px solid #ccc;
		border-radius: 3px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}
</style>
