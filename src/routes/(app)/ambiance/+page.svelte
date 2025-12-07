<script lang="ts">
	import LightbulbIcon from '$lib/components/icons/LightbulbIcon.svelte';
	import MusicIcon from '$lib/components/icons/MusicIcon.svelte';
	import ShortcutButton from '$lib/components/icons/ShortcutButton.svelte';
	import VolumeUpIcon from '$lib/components/icons/VolumeIcon.svelte';
	import { lightApiUrl } from '$lib/stores/lights-store';
	import { soundboardStore, type Sound } from '$lib/stores/soundboard-store';

	type Ambiance = {
		name: string;
		selected: boolean;
		color: string;
		sound: string;
	};

	let ambiances: Ambiance[] = $state([
		{ name: 'Doux', selected: true, color: '#FFFFFF', sound: 'Lofi' },
		{ name: 'Vif', selected: false, color: '#FF0000', sound: 'Rock' },
		{ name: 'Coloré', selected: false, color: '#0000FF', sound: 'Pop' },
		{ name: 'Sombre', selected: false, color: '#000000', sound: 'Jazz' },
		{ name: 'Chaleureux', selected: false, color: '#00FF00', sound: 'Acoustic' }
	]);

	function playSound(sound: Sound) {
		fetch('/api/events', {
			body: JSON.stringify({
				data: {
					id: sound.id
				},
				type: 'play_sound'
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		});
	}

	async function selectAmbiance(ambiance: Ambiance) {
		ambiances.forEach((a) => (a.selected = false));
		ambiance.selected = true;
		const rgb = hexToRgb(ambiance.color);
		$lightApiUrl
		await fetch(`${$lightApiUrl}/color/${rgb[0]}/${rgb[1]}/${rgb[2]}/1`);
	}

	let selectedAmbiance: Ambiance = $derived(ambiances.find((a) => a.selected)!);

	export function hexToRgb(hex: string): [number, number, number] {
		// 1. Nettoyer le '#' au début
		const hexString = hex.startsWith('#') ? hex.slice(1) : hex;

		// 2. Gérer le format court (ex: #F00 -> #FF0000)
		let fullHex = hexString;
		if (fullHex.length === 3) {
			fullHex = fullHex
				.split('')
				.map((char) => char + char)
				.join('');
		}

		// 3. Vérifier la longueur finale (doit être RRGGBB)
		if (fullHex.length !== 6) {
			console.warn(`Format hexadécimal invalide: ${hex}`);
			return [0, 0, 0];
		}

		// 4. Parser les valeurs R, G, B
		const r = parseInt(fullHex.substring(0, 2), 16);
		const g = parseInt(fullHex.substring(2, 4), 16);
		const b = parseInt(fullHex.substring(4, 6), 16);

		// 5. Vérifier si le parsing a réussi (au cas où la chaîne contient des non-hex)
		if (isNaN(r) || isNaN(g) || isNaN(b)) {
			console.warn(`Impossible de parser la chaîne hexadécimale: ${hex}`);
			return [0, 0, 0];
		}

		return [r, g, b];
	}
</script>

<h1>Ambiance Lumineuse & Sonore</h1>

<div class="ambiance-banner" style="background-color: {selectedAmbiance.color}">
	<h2>{selectedAmbiance.name}</h2>
</div>

<div class="buttons-grid">
	{#each ambiances as ambiance}
		<ShortcutButton
			name={ambiance.name}
			selected={ambiance.selected}
			color={ambiance.color}
			on:click={() => selectAmbiance(ambiance)}
		>
			<div slot="icon" class="icon-group">
				<LightbulbIcon />
				<MusicIcon />
			</div>
		</ShortcutButton>
	{/each}
</div>

<div class="soundboard-section">
	<h2>Soundboard</h2>
	<div class="buttons-grid">
		{#each $soundboardStore as sound (sound.id)}
			<ShortcutButton on:click={() => playSound(sound)} name={sound.name}>
				<VolumeUpIcon slot="icon" />
			</ShortcutButton>
		{/each}
		{#if $soundboardStore.length == 0}
			<div class="card center">
				<h2>Aucun son pour l'instant</h2>
				<p>Ajoute des son <a href="/soundboard">ici</a></p>
			</div>
		{/if}
	</div>
</div>

<style>
	.ambiance-banner {
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
		text-align: center;
	}

	.ambiance-banner h2 {
		margin: 0;
		text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
	}

	.buttons-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 1rem;
	}

	.icon-group {
		display: flex;
		gap: 0.5rem;
	}

	.soundboard-section {
		margin-top: 2rem;
	}

	.soundboard-section h2 {
		margin-bottom: 1rem;
	}
</style>
