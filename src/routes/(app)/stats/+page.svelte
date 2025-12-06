<script>
	import LiveStatus from '$lib/components/LiveStatus.svelte';
	import ViewerGraph from '$lib/components/ViewerGraph.svelte';
	import { chat } from '$lib/stores/chat-store';
	import { stats } from '$lib/stores/stats-store';
</script>

<svelte:head>
	<title>Stats - Baltrou</title>
</svelte:head>
<h1>Statistiques du Stream</h1>

<div class="stats-grid">
	<div class="card">
		<h2>Status du Stream</h2>
		<LiveStatus />
	</div>

	<div class="card">
		<h2>Viewers</h2>
		<p>{$stats.viewerCount}</p>
	</div>

	<div class="card">
		<h2>Commentaires</h2>
		<p>{$chat.messages.length}</p>
	</div>

	<div class="card">
		<h2>Followers</h2>
		<p>{$stats.followerCount}</p>
	</div>

	<div class="card">
		<h2>Abonnés</h2>
		<p>{$stats.subscriberCount}</p>
	</div>

	<div class="card full-width">
		<h2>Viewers au cours du temps</h2>
		<!-- Le graphique sera inséré ici -->
		<ViewerGraph></ViewerGraph>
	</div>
</div>

<style>
	.card {
		margin: 0;
		padding: 1rem;
	}
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.card p {
		margin: 0;
	}

	.full-width {
		grid-column: 1 / -1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
