<script lang="ts">
	import { asset } from '$app/paths';
	import { chat } from '$lib/stores/chat-store';
	import { events } from '$lib/stores/event-store';
	import { toasts } from '$lib/stores/toast-store';
	import ColorPicker from '../ColorPicker.svelte';

	// La clé doit être identique à celle utilisée dans chatStore.ts
	const LOCAL_STORAGE_KEY = 'baltrou_chat_history';

	function clearChatHistory() {
		// 1. Mettre à jour l'état actuel du store en mémoire
		// (Nous réinitialisons les messages, mais gardons
		//  le message épinglé s'il existe)
		chat.update((currentState) => {
			return {
				messages: [],
				pinnedMessage: currentState.pinnedMessage
			};
		});

		// 2. Vider également le stockage persistant (LocalStorage)
		//    pour que l'historique ne revienne pas au rechargement.
		if (typeof window !== 'undefined') {
			try {
				// Nous pourrions sauvegarder l'état vide, mais
				// supprimer la clé est tout aussi efficace.
				localStorage.removeItem(LOCAL_STORAGE_KEY);
			} catch (e) {
				console.error("Erreur lors du nettoyage de l'historique du chat (localStorage):", e);
			}
		}
	}

	function sendDebugSound() {
		fetch('/api/events', {
			body: JSON.stringify({
				data: {
					url: asset('/debug-sound.mp3')
				},
				type: 'play_sound'
			}),
			headers: {
				'Content-Type': 'application/json'
			},
      method: 'POST',
		});
	}

  function testToast(){
    toasts.add("Test info",'info');
    toasts.add("Test success",'success');
    toasts.add("Test warning",'warning');
    toasts.add("Test error",'error');
  }
</script>

<div class="debug-controls">
	<h4>Contrôles de Debug</h4>
	<button class="danger-btn" on:click={clearChatHistory}> Vider l'historique du Chat </button>
	<button class="danger-btn" on:click={sendDebugSound}>Envoyer le son de débug</button>
	<button class="danger-btn" on:click={testToast}>Tester les toasts</button>
</div>

<style>
	.debug-controls {
		font-family: 'Inter', sans-serif;
		color: white;
		padding: 1rem;
	}

	.debug-controls h4 {
		margin-top: 0;
		font-size: 1rem;
		font-weight: 700;
	}

	.danger-btn {
		background-color: #ef4444; /* Rouge */
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.danger-btn:hover {
		background-color: #dc2626; /* Rouge plus sombre */
	}
</style>
