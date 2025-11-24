<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import DebugPanel from '$lib/components/debug/DebugPanel.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import { auth } from '$lib/stores/auth-store.js';
	import { chat } from '$lib/stores/chat-store.js';
	import { connectObs, obsState } from '$lib/stores/obs-store.js';
	import { stats } from '$lib/stores/stats-store.js';
	import { onMount } from 'svelte';
	import '../app.css';
	import { obs } from '$lib/stores/obs';

	let { data, children } = $props();
	const status = obs.client.status;
	onMount(async () => {
		$auth = data.isLoggedIn;
		$chat;
		$stats;
		obs.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ToastContainer/>
<header>
	<nav>
		<a href="/">Accueil</a>
		<div>
			{#if data.isLoggedIn}
				<a href="/community">Communauté</a>
				<a href="/stats">Statistiques</a>
				<a href="/ambiance">Ambiance</a>
				{#if $status == 'CONNECTED'}
					<a href="/controls">Contrôles</a>
				{/if}
				<a href="/settings">Réglages</a>
				<!-- 
				<a href="/annonces">Annonces</a>
				-->
			{:else}
				<a href="/login">Connexion</a>
			{/if}
		</div>
	</nav>
</header>

<DebugPanel></DebugPanel>
<main>
	{@render children?.()}
</main>

<Footer isLoggedIn={data.isLoggedIn}></Footer>

<style>
	header {
		background-color: var(--menu-bg);
		padding: 1rem;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	nav a {
		color: var(--text-primary);
		font-family: var(--font-heading), cursive;
		text-decoration: none;
		padding: 0 1rem;
		position: relative;
		font-size: 1.2rem;
	}

	main {
		padding: 2em 2rem 4em;
	}

	nav a::after {
		content: '';
		position: absolute;
		width: 100%;
		transform: scaleX(0);
		height: 2px;
		bottom: -5px;
		left: 0;
		background-color: var(--text-primary);
		transform-origin: bottom right;
		transition: transform 0.25s ease-out;
	}

	nav a:hover::after {
		transform: scaleX(1);
		transform-origin: bottom left;
	}
</style>
