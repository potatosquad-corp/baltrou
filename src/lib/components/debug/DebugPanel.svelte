<script lang="ts">
	import DebugSSE from './DebugSSE.svelte';
	import DebugConsole from './DebugConsole.svelte';
	import DebugStore from './DebugStore.svelte';
	import DebugControls from './DebugControls.svelte';

	let isOpen = false;
	let activeTab: 'sse' | 'console' | 'store' | 'controls' = 'sse';
</script>

<!-- 
  Le "déclencheur" pour ouvrir le panneau.
  Il est toujours visible.
-->
{#if !isOpen}
	<button class="open-trigger" on:click={() => (isOpen = true)} title="Ouvrir le panneau de debug">
		<!-- Icône de flèche (chevron) -->
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>
{/if}

<!-- 
  Le "tiroir" (drawer) du panneau de debug.
  Il s'affiche par-dessus le contenu.
-->
<div class="debug-panel-drawer" class:isOpen>
	<div class="drawer-header">
		<h3>Panneau de Débogage</h3>
		<button class="close-button" on:click={() => (isOpen = false)} title="Fermer le panneau">
			<!-- Icône 'X' (fermer) -->
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
				<path
					d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 001.06 1.06L10 11.06l3.72 3.72a.75.75 0 001.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
				/>
			</svg>
		</button>
	</div>

	<!-- Les onglets -->
	<nav class="tab-nav">
		<button class:active={activeTab === 'sse'} on:click={() => (activeTab = 'sse')}> SSE </button>
		<button class:active={activeTab === 'console'} on:click={() => (activeTab = 'console')}>
			Console
		</button>
		<button class:active={activeTab === 'store'} on:click={() => (activeTab = 'store')}>
			Store
		</button>
		<button class:active={activeTab === 'controls'} on:click={() => (activeTab = 'controls')}>
			Controls
		</button>
	</nav>

	<!-- Le contenu des onglets -->
	<div class="tab-content">
		<div class="tab-pane" class:visible={activeTab === 'sse'}>
			<DebugSSE />
		</div>

		<div class="tab-pane" class:visible={activeTab === 'console'}>
			<DebugConsole />
		</div>

		<div class="tab-pane" class:visible={activeTab === 'store'}>
			<DebugStore />
		</div>

		<div class="tab-pane" class:visible={activeTab === 'controls'}>
			<DebugControls />
		</div>
	</div>
</div>

<style>
	:root {
		--panel-width: 600px;
		--panel-bg: rgba(41, 0, 51, 0.9); /* Utilise votre --menu-bg avec transparence */
	}

	/* ... Styles .open-trigger et .debug-panel-drawer (inchangés) ... */
	.open-trigger {
		position: fixed;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		z-index: 9998;
		background: var(--panel-bg);
		backdrop-filter: blur(5px);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-right: none;
		border-radius: 8px 0 0 8px;
		padding: 1rem 0.2rem;
		cursor: pointer;
	}
	.open-trigger svg {
		width: 1.5rem;
		height: 1.5rem;
	}
	.debug-panel-drawer {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 9999;
		width: var(--panel-width);
		max-width: 90vw;
		height: 100vh;
		background: var(--panel-bg);
		backdrop-filter: blur(10px);
		border-left: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		transform: translateX(100%);
		transition: transform 0.3s ease-in-out;
	}
	.debug-panel-drawer.isOpen {
		transform: translateX(0);
	}
	.drawer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		font-family: 'Inter', sans-serif;
	}
	.drawer-header h3 {
		margin: 0;
		font-size: 1rem;
	}
	.close-button {
		background: none;
		border: none;
		color: white;
		padding: 0.5rem;
		cursor: pointer;
	}
	.close-button svg {
		width: 1.25rem;
		height: 1.25rem;
	}
	.tab-nav {
		display: flex;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}
	.tab-nav button {
		flex-grow: 1;
		background: none;
		border: none;
		border-bottom: 3px solid transparent;
		color: rgba(255, 255, 255, 0.7);
		padding: 0.75rem 1rem;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
	}
	.tab-nav button.active {
		color: white;
		border-bottom-color: #a855f7; /* Couleur violette pour l'accent */
	}

	/*
   * MODIFICATION :
   * Le .tab-content gère la hauteur et
   * les .tab-pane gèrent la visibilité.
   */
	.tab-content {
		flex-grow: 1;
		overflow: hidden; /* Les composants gèrent leur propre scroll */
	}

	.tab-pane {
		display: none; /* Caché par défaut */
		height: 100%;
		/* Le scroll est géré par le composant enfant 
      (ex: .log-window dans DebugSSE)
    */
	}

	.tab-pane.visible {
		display: block; /* Affiché si la classe 'visible' est présente */
	}
</style>
