<script lang="ts">
	import AppModeToggle from '$lib/components/AppModeToggle.svelte';
	import FiakSettings from '$lib/components/FiakSettings.svelte';
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
<FiakSettings />

<style>
	.card {
		max-width: 42rem;
		margin: 0 auto 2rem auto;
	}
</style>
