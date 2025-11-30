<script lang="ts">
	import { appMode } from '$lib/stores/global-store';
	import { quickLinks, type QuickLink } from '$lib/stores/quick-links-store';
	import { fade } from 'svelte/transition';
	import PlusIcon from '../icons/PlusIcon.svelte';
	import ColorPicker from '../ColorPicker.svelte';

	// --- État de la Modale ---
	let dialog: HTMLDialogElement;
	let isEditing = $state(false);

	// Formulaire
	let formId = $state('');
	let formTitle = $state('');
	let formUrl = $state('');
	let formColor = $state('#3b82f6'); // Bleu par défaut

	// --- Logique d'affichage ---

	// Helper pour le favicon Google (taille 64px)
	function getFavicon(url: string) {
		try {
			const domain = new URL(url).hostname;
			return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
		} catch {
			return '';
		}
	}

	// --- Actions ---

	function openAddModal() {
		isEditing = false;
		formId = '';
		formTitle = '';
		formUrl = 'https://';
		formColor = '#3b82f6';
		dialog.showModal();
	}

	function openEditModal(link: QuickLink) {
		if ($appMode !== 'CONFIG') return; // Sécurité clic

		isEditing = true;
		formId = link.id;
		formTitle = link.title;
		formUrl = link.url;
		formColor = link.color;
		dialog.showModal();
	}

	function saveLink() {
		if (!formTitle || !formUrl) return;

		if (isEditing && formId) {
			quickLinks.edit(formId, { title: formTitle, url: formUrl, color: formColor });
		} else {
			quickLinks.add({ title: formTitle, url: formUrl, color: formColor });
		}
		closeModal();
	}

	function deleteLink() {
		if (isEditing && formId) {
			if (confirm('Supprimer ce raccourci ?')) {
				quickLinks.remove(formId);
				closeModal();
			}
		}
	}

	function closeModal() {
		dialog.close();
	}

	// Gestion du clic sur le lien (Bloquer en mode config pour éditer)
	function handleLinkClick(e: MouseEvent, link: QuickLink) {
		if ($appMode === 'CONFIG') {
			e.preventDefault();
			openEditModal(link);
		}
	}
</script>

<div class="card no-margin quick-links-widget">
	<h2 class="xl-label">QUICK LINKS</h2>

	<div class="links-grid">
		<!-- Liste des liens existants -->
		{#each $quickLinks as link (link.id)}
			<a
				href={link.url}
				target="_blank"
				class="link-item"
				onclick={(e) => handleLinkClick(e, link)}
				class:editable={$appMode === 'CONFIG'}
			>
				<div class="icon-box" style="background-color: {link.color}">
					<img
						src={getFavicon(link.url)}
						alt={link.title}
						onerror={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/>
					{#if $appMode === 'CONFIG'}
						<div class="edit-overlay">
							<!-- Icône Crayon SVG inline -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								width="24"
								height="24"
							>
								<path
									d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
								/>
							</svg>
						</div>
					{/if}
				</div>
				<span class="link-title">{link.title}</span>
			</a>
		{/each}

		<!-- Bouton Ajouter (Visible uniquement en Config et si < 5 liens) -->
		{#if $appMode === 'CONFIG' && $quickLinks.length < 5}
			<button class="link-item add-btn" onclick={openAddModal}>
				<div class="icon-box add-placeholder">
					<PlusIcon />
				</div>
				<span class="link-title">Ajouter</span>
			</button>
		{/if}
	</div>
</div>

<!-- MODALE D'ÉDITION / AJOUT -->
<dialog bind:this={dialog} class="config-modal card" transition:fade>
	<div class="modal-content">
		<h3>{isEditing ? 'Modifier le lien' : 'Nouveau lien'}</h3>

		<div class="form-group">
			<label for="ql-title">Titre</label>
			<input id="ql-title" type="text" bind:value={formTitle} placeholder="Ex: Twitch" />
		</div>

		<div class="form-group">
			<label for="ql-url">URL</label>
			<input id="ql-url" type="url" bind:value={formUrl} placeholder="https://..." />
		</div>

		<div class="form-group">
			<label for="ql-color">Couleur du fond</label>
			<div class="color-input-wrapper">
				<ColorPicker bind:value={formColor} />
				<span>{formColor}</span>
			</div>
		</div>

		<div class="modal-actions">
			{#if isEditing}
				<button class="btn btn-danger" onclick={deleteLink}>Supprimer</button>
			{/if}
			<div class="spacer"></div>
			<button class="btn btn-secondary" onclick={closeModal}>Annuler</button>
			<button class="btn btn-primary" onclick={saveLink}>Enregistrer</button>
		</div>
	</div>
</dialog>

<style>
	.quick-links-widget {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
		min-width: 300px;
	}

	.links-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		justify-content: center;
	}

	/* --- Item Style (Safari-like) --- */
	.link-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		color: white;
		width: 70px; /* Largeur fixe pour l'alignement */
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		transition: transform 0.2s;
	}

	.link-item:hover {
		transform: translateY(-2px);
	}

	/* Animation tremblement en mode config (optionnel, style iOS) */
	.link-item.editable:hover .icon-box {
		filter: brightness(0.8);
	}

	.icon-box {
		width: 60px;
		height: 60px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
		margin-bottom: 0.5rem;
		position: relative;
		overflow: hidden;
	}

	.icon-box img {
		width: 32px;
		height: 32px;
		border-radius: 4px;
	}

	.link-title {
		font-family: 'Inter', sans-serif;
		font-size: 0.8rem;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		opacity: 0.8;
	}

	/* --- Bouton Ajouter --- */
	.add-placeholder {
		background-color: rgba(255, 255, 255, 0.1);
		border: 2px dashed rgba(255, 255, 255, 0.3);
		color: rgba(255, 255, 255, 0.5);
	}

	.add-btn:hover .add-placeholder {
		background-color: rgba(255, 255, 255, 0.2);
		color: white;
		border-color: white;
	}

	/* --- Overlay Edition --- */
	.edit-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.link-item.editable:hover .edit-overlay {
		opacity: 1;
	}

	/* --- Modale --- */
	dialog.config-modal.card {
		padding: 0;
		margin: auto !important;
		width: fit-content;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(2px);
	}

	dialog[open] {
		animation: zoomIn 0.2s ease-out;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0);
		transition: background 0.2s ease-out;
	}

	dialog[open]::backdrop {
		background: rgba(0, 0, 0, 0.6);
	}

	@keyframes zoomIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.modal-content {
		padding: 1.5rem;
		width: 300px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-content h3 {
		margin-top: 0;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.form-group label {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.form-group input[type='text'],
	.form-group input[type='url'] {
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(0, 0, 0, 0.3);
		color: white;
	}

	.color-input-wrapper {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.modal-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.spacer {
		flex-grow: 1;
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		font-weight: bold;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
	}
	.btn-secondary {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}
	.btn-danger {
		background: #ef4444;
		color: white;
	}
</style>
