<script lang="ts">
	import { onMount } from 'svelte';

	// État réactif pour l'heure actuelle
	let time = $state(new Date());

	onMount(() => {
		// Mise à jour chaque seconde
		const interval = setInterval(() => {
			time = new Date();
		}, 100);

		// Nettoyage à la destruction du composant
		return () => clearInterval(interval);
	});

	// Formatage HH:MM:SS
	// $derived n'est pas strictement nécessaire ici car time change, 
	// mais on peut le calculer directement dans le template ou via une fonction simple.
	function formatTime(date: Date) {
		return date.toLocaleTimeString('fr-FR', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}
</script>

<div class="card no-margin">
	<div class="xl-label">HEURE</div>
	<div class="xl-text">
		{formatTime(time)}
	</div>
</div>

<style>
	.card {
		text-align: center;
		
		/* Largeur min pour éviter que ça bouge quand les chiffres changent */
		min-width: 300px; 
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

</style>