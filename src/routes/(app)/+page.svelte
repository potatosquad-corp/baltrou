<script>
	import Clock from '$lib/components/widgets/Clock.svelte';
	import QuickLinks from '$lib/components/widgets/QuickLinks.svelte';
	import Timer from '$lib/components/widgets/Timer.svelte';
</script>

<svelte:head>
	<title>Baltrou - Dashboard</title>
</svelte:head>

<div class="dashboard-container">
	<!-- 1. En-tête : Bienvenue -->
	<div class="card no-margin welcome-banner">
		<h1>Welcome to B.A.L.T.R.O.U.</h1>
		<p class="subtitle">Broadcast Asset Live Tool for Real-time Overlay Utility</p>
	</div>

	<!-- 2. Grille Principale -->
	<div class="main-grid">
		<!-- COLONNE GAUCHE : En Cours (Placeholder) -->
		<div class="card no-margin placeholder-column">
			<h2 class="xl-label">EN COURS</h2>
			<div class="placeholder-content">
				<!-- Image Placeholder style Stream Preview -->
				<div class="stream-preview-mock">
					<div class="logo-mock">B</div>
				</div>
			</div>
		</div>

		<!-- COLONNE CENTRALE : Widgets (Timer, Clock, Links) -->
		<div class="center-column">
			<!-- Timer prend toute la largeur de la colonne centrale -->
			<div class="widget-wrapper">
				<Timer />
			</div>

			<!-- Clock prend toute la largeur -->
			<div class="widget-wrapper">
				<Clock />
			</div>

			<!-- QuickLinks prend toute la largeur -->
			<div class="widget-wrapper">
				<QuickLinks />
			</div>
		</div>

		<!-- COLONNE DROITE : Notifications (Placeholder) -->
		<div class="card no-margin placeholder-column">
			<h2 class="xl-label">NOTIFICATIONS</h2>
			<div class="notification-list-mock">
				{#each Array(5) as _, i}
					<div class="notif-item" style="opacity: {1 - i * 0.15}">
						<div class="notif-icon"></div>
						<div class="notif-text"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.dashboard-container {
		display: flex;
		flex-direction: column;
		max-width: 1600px;
		margin: 0 auto;
		width: 100%;
		gap: 1em;
	}

	/* --- BANNIÈRE --- */
	.welcome-banner {
		text-align: center;
	}

	.welcome-banner h1 {
		font-size: 3rem;
		margin-bottom: 0.5rem;
		letter-spacing: 0.1em;
	}

	.subtitle {
		color: var(--text-secondary);
		font-size: 1.5rem;
		margin: 0;
	}

	/* --- GRILLE PRINCIPALE --- */
	.main-grid {
		display: grid;
		/* 3 Colonnes : 1fr (25%), 1.5fr (50% large), 1fr (25%) */
		grid-template-columns: 1fr 1.5fr 1fr;
		gap: 1rem;
		align-items: start; /* Aligner en haut */
	}

	/* --- COLONNE CENTRALE (Empilement) --- */
	.center-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* On force les widgets enfants à remplir la largeur de la colonne */
	.widget-wrapper :global(.card) {
		width: 100%;
		box-sizing: border-box;
		min-width: 0; /* Empêche le dépassement flex */
	}

	/* --- PLACEHOLDERS & STYLE GÉNÉRAL --- */
	.xl-label {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.5rem;
		letter-spacing: 0.05em;
		margin-bottom: 1.5rem;
		text-transform: uppercase;
		opacity: 0.9;
		text-align: center;
		margin-top: 0;
	}

	.placeholder-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
		box-sizing: border-box;
		height: 100%;
	}

	/* --- Style du Mock "En Cours" --- */
	.placeholder-content {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		gap: 1rem;
	}

	.stream-preview-mock {
		width: 80%;
		aspect-ratio: 3/4;
		background: black;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
	}

	.logo-mock {
		font-size: 4rem;
		font-family: 'Bebas Neue';
		color: rgba(255, 255, 255, 0.2);
		border: 2px solid rgba(255, 255, 255, 0.2);
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	/* --- Style du Mock "Notifications" --- */
	.notification-list-mock {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.notif-item {
		height: 60px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		display: flex;
		align-items: center;
		padding: 0 1rem;
		gap: 1rem;
	}

	.notif-icon {
		width: 32px;
		height: 32px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
	}

	.notif-text {
		height: 10px;
		width: 60%;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
	}

	/* --- RESPONSIVE --- */
	@media (max-width: 1200px) {
		.main-grid {
			grid-template-columns: 1fr 1fr; /* 2 colonnes */
		}
		.center-column {
			grid-column: 1 / -1; /* Les widgets passent en haut ou en bas selon préférence */
			order: -1; /* Mettons les widgets importants en premier sur tablette */
		}
	}

	@media (max-width: 768px) {
		.main-grid {
			grid-template-columns: 1fr; /* 1 colonne mobile */
		}
	}
</style>
