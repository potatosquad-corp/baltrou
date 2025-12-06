<script lang="ts">
	import { toasts } from '$lib/stores/toast-store';
	import { fade, fly } from 'svelte/transition';
	import CloseIcon from './icons/CloseIcon.svelte';

	// Icônes SVG minimalistes
	const icons = {
		info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
		success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
		warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
		error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`
	};
</script>

<div class="toast-container">
	{#each $toasts as toast (toast.id)}
		<div class="toast {toast.type}" in:fly={{ y: 20, duration: 300 }} out:fade={{ duration: 200 }}>
			<div class="icon-wrapper">
				{@html icons[toast.type]}
			</div>
			<span class="message">{toast.message}</span>
			<button class="close-btn" onclick={() => toasts.remove(toast.id)}>
				<CloseIcon />
			</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		bottom: 4rem; /* Au-dessus du footer */
		right: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		z-index: 10000;
		max-width: 400px;
		pointer-events: none; /* Clics traversent le conteneur vide */
	}

	.toast {
		pointer-events: auto;
		display: flex;
		align-items: flex-start; /* Aligner en haut pour les longs messages */
		gap: 0.75rem;
		padding: 1rem;

		/* Style de base "Glassmorphism" sombre */
		background-color: rgba(15, 15, 25, 0.9); /* Très sombre, légèrement transparent */
		backdrop-filter: blur(12px);
		border-radius: var(--radius-md, 8px);
		box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.3));

		/* Bordure gauche colorée pour indiquer le type */
		border-left: 4px solid transparent;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);

		color: var(--text-primary, white);
		font-family: var(--font-body, sans-serif);
		font-size: 0.95rem;
		line-height: 1.4;
		min-width: 280px;
	}

	.message {
		flex-grow: 1;
		word-break: break-word;
		padding-top: 2px; /* Ajustement fin pour aligner avec l'icône */
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-muted, rgba(255, 255, 255, 0.5));
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		transition: color 0.2s;
		margin-left: 0.5rem;
	}
	.close-btn:hover {
		color: var(--text-primary, white);
	}

	/* --- Variantes de couleurs (Bordure + Icône) --- */

	/* Info (Bleu) */
	.toast.info {
		border-left-color: var(--accent-info, #3b82f6);
	}
	.toast.info .icon-wrapper {
		color: var(--accent-info, #3b82f6);
	}

	/* Success (Vert) */
	.toast.success {
		border-left-color: var(--accent-success, #22c55e);
	}
	.toast.success .icon-wrapper {
		color: var(--accent-success, #22c55e);
	}

	/* Warning (Jaune) */
	.toast.warning {
		border-left-color: var(--accent-warning, #eab308);
	}
	.toast.warning .icon-wrapper {
		color: var(--accent-warning, #eab308);
	}

	/* Error (Rouge) */
	.toast.error {
		border-left-color: var(--accent-danger, #ef4444);
	}
	.toast.error .icon-wrapper {
		color: var(--accent-danger, #ef4444);
	}
</style>
