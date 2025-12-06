<script lang="ts">
	import { appMode } from '$lib/stores/global-store';

	function setMode(mode: 'CONFIG' | 'STREAM') {
		$appMode = mode;
	}
</script>

<div class="toggle-container">
	<!-- Le fond glissant (slider) -->
	<div class="slider" class:stream-mode={$appMode === 'STREAM'}></div>

	<!-- Bouton Config -->
	<button class="toggle-btn" class:active={$appMode === 'CONFIG'} onclick={() => setMode('CONFIG')}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			width="18"
			height="18"
		>
			<path
				d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
			/>
		</svg>
		<span>Config</span>
	</button>

	<!-- Bouton Stream -->
	<button class="toggle-btn" class:active={$appMode === 'STREAM'} onclick={() => setMode('STREAM')}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			width="18"
			height="18"
		>
			<path
				d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
			/>
		</svg>
		<span>Stream</span>
	</button>
</div>

<style>
	.toggle-container {
		position: relative;
		display: inline-flex;
		background-color: rgba(0, 0, 0, 0.3); /* Plus sombre que le fond */
		border-radius: var(--radius-full);
		padding: 4px;
		border: 1px solid var(--surface-border);
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toggle-btn {
		position: relative;
		z-index: 2; /* Au-dessus du slider */
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1.25rem;
		background: transparent;
		border: none;
		color: var(--text-muted);
		font-family: var(--font-heading);
		font-size: 1rem;
		cursor: pointer;
		transition: color 0.3s ease;
		outline: none;
		min-width: 110px;
		justify-content: center;
	}

	.toggle-btn.active {
		color: white;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	/* Animation du fond (Pillule) */
	.slider {
		position: absolute;
		top: 4px;
		bottom: 4px;
		left: 4px;
		width: calc(50% - 4px); /* Moitié moins le padding */
		background: var(--accent-primary);
		border-radius: var(--radius-full);
		z-index: 1;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	/* Quand on passe en mode Stream, on décale le slider */
	.slider.stream-mode {
		transform: translateX(100%);
		background: var(--accent-success); /* Vert pour le live/stream */
	}

	/* Petit effet de survol sur les boutons inactifs */
	.toggle-btn:not(.active):hover {
		color: var(--text-secondary);
	}
</style>
