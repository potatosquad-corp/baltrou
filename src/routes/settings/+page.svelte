<script lang="ts">
	import AppModeToggle from '$lib/components/AppModeToggle.svelte';
	import LightSettings from '$lib/components/LightSettings.svelte';
	import ObsSettings from '$lib/components/ObsSettings.svelte';
</script>

<svelte:head>
	<title>Paramètres - Baltrou</title>
</svelte:head>

<div class="card">
	<h1>Réglages généraux</h1>
	<AppModeToggle />
</div>
<ObsSettings />
<LightSettings />

<style>
	.card {
		max-width: 42rem;
		margin: 0 auto 2rem auto;
	}
</style>
