<script>
	import { chat } from '$lib/stores/chat-store';
	import CloseIcon from './icons/CloseIcon.svelte';

	function unpinMessage() {
		$chat.pinnedMessage = null;
	}
</script>

{#if $chat.pinnedMessage != null}
	<div class="card pinned-message">
		<button class="close-button" onclick={unpinMessage}>
			<CloseIcon />
		</button>
		<h2>Message Épinglé</h2>
		<div class="message">
			<strong style="color: {$chat.pinnedMessage.color}">{$chat.pinnedMessage.user}:</strong>
			<span>{$chat.pinnedMessage.message}</span>
		</div>
	</div>
{/if}

<style>
	.pinned-message {
		position: relative;
		padding: 1rem;
		margin: 0;
		max-width: 1000px;
	}
	.close-button {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		color: white;
		cursor: pointer;
	}

	.pinned-message h2 {
		margin-top: 0;
		font-size: 1.2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
	}

	.pinned-message .message {
		font-family: 'Inter', sans-serif;
		word-wrap: break-word;
	}
</style>
