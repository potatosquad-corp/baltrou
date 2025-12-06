<script lang="ts">
	import type { Sound } from '$lib/stores/soundboard-store';
	import PlayIcon from './icons/PlayIcon.svelte';
	import CloseIcon from './icons/CloseIcon.svelte';

	// Props
	interface Props {
		sound: Sound;
		onplay?: (id: string) => void;
		onrename?: (id: string, newName: string) => void;
		ondelete?: (id: string) => void;
	}

	let { sound, onplay, onrename, ondelete }: Props = $props();

	// État local
	let isEditing = $state(false);
	let editName = $state(sound.name);

	// Handlers
	function handleSave() {
		if (editName.trim()) {
			onrename?.(sound.id, editName);
			isEditing = false;
		}
	}

	function handleCancel() {
		editName = sound.name;
		isEditing = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') handleSave();
		if (e.key === 'Escape') handleCancel();
	}
</script>

<div class="card sound-item">
	<button class="play-btn" onclick={() => onplay?.(sound.id)} title="Jouer le son">
		<div class="icon-wrapper">
			<PlayIcon />
		</div>
	</button>

	<div class="info">
		{#if isEditing}
			<input type="text" class="edit-input" bind:value={editName} onkeydown={handleKeydown} />
		{:else}
			<span class="name" title={sound.name}>{sound.name}</span>
			<span class="id-badge">ID: {sound.id.substring(0, 6)}...</span>
		{/if}
	</div>

	<div class="actions">
		{#if isEditing}
			<button class="action-btn save" onclick={handleSave} title="Valider">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg
				>
			</button>
			<button class="action-btn cancel" onclick={handleCancel} title="Annuler">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="currentColor"
					><path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
					/></svg
				>
			</button>
		{:else}
			<button class="action-btn edit" onclick={() => (isEditing = true)} title="Renommer">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="currentColor"
					><path
						d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
					/></svg
				>
			</button>
			<button class="action-btn delete" onclick={() => ondelete?.(sound.id)} title="Supprimer">
				<CloseIcon />
			</button>
		{/if}
	</div>
</div>

<style>
	.sound-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		margin: 0; /* Override le margin du .card global si besoin */
		transition:
			transform 0.2s,
			background-color 0.2s;
	}

	.sound-item:hover {
		background-color: var(--surface-hover);
		transform: translateY(-2px);
	}

	/* --- Play Button --- */
	.play-btn {
		background: var(--accent-primary);
		border: none;
		border-radius: 50%;
		width: 42px;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		flex-shrink: 0;
		color: white;
		transition:
			filter 0.2s,
			transform 0.1s;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
	}

	.play-btn:hover {
		filter: brightness(1.2);
		transform: scale(1.05);
	}

	.play-btn:active {
		transform: scale(0.95);
	}

	/* --- Info --- */
	.info {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
	}

	.name {
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 1.1rem;
	}

	.id-badge {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-family: monospace;
	}

	.edit-input {
		width: 100%;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		border: 1px solid var(--accent-info);
		background: rgba(0, 0, 0, 0.3);
		color: white;
		font-family: inherit;
	}

	/* --- Actions --- */
	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		background: transparent;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0.4rem;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}

	.action-btn:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.action-btn.delete:hover {
		background-color: rgba(239, 68, 68, 0.2);
		color: var(--accent-danger);
	}

	.action-btn.save {
		color: var(--accent-success);
	}

	.action-btn.edit:hover {
		color: var(--accent-info);
	}
</style>
