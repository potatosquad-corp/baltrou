<script lang="ts">
	import { chat, type ChatMessage } from '$lib/stores/chat-store';
	import { onMount } from 'svelte';
	import PinIcon from './icons/PinIcon.svelte';

	let messageToSend = '';
	let chatContainer: HTMLElement;

	function pinMessage(message: ChatMessage) {
		$chat.pinnedMessage = message;
		chat.set($chat);
	}

	onMount(() => {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});

	async function sendMessage() {
		if (messageToSend.trim() === '') return;
		try {
			await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message: messageToSend.trim() })
			});
		} catch (error) {
			console.error('Error sending message:', error);
		} finally {
			messageToSend = '';
		}
	}
</script>

<div class="card chat-container">
	<h2>Chat</h2>
	<div class="chat-messages" bind:this={chatContainer}>
		{#each $chat.messages as message (message.id)}
			<div class="message">
				<div class="message-content">
					<strong style="color: {message.color}">{message.user}:</strong>
					<span>{message.message}</span>
				</div>
				<button class="pin-button" onclick={() => pinMessage(message)}>
					<PinIcon />
				</button>
			</div>
		{/each}
	</div>
	<div class="chat-input">
		<input
			type="text"
			placeholder="Envoyer un message..."
			bind:value={messageToSend}
			onkeydown={(e) => {
				if (e.key === 'Enter') sendMessage();
			}}
		/>
		<button onclick={sendMessage} disabled={messageToSend.trim() === ''}> Envoyer </button>
	</div>
</div>

<!-- Le style reste le même -->
<style>
	.chat-container {
		padding: 1rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		height: 600px;
	}

	.chat-messages {
		flex-grow: 1;
		overflow-y: auto;
		margin-bottom: 1rem;
	}

	.message {
		margin-bottom: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.25rem;
		border-radius: 4px;
	}

	.message:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.message .pin-button {
		opacity: 1;
		transition: opacity 0.2s;
	}

	@media (hover: hover) {
		.message .pin-button {
			opacity: 0;
		}

		.message:hover .pin-button {
			opacity: 1;
		}
	}

	.pin-button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
	}

	.chat-input {
		display: flex;
	}

	.chat-input input {
		flex-grow: 1;
		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		padding: 0.5rem;
		border-radius: 4px 0 0 4px;
	}

	.chat-input button {
		background-color: #2196f3;
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 0 4px 4px 0;
		cursor: pointer;
	}
</style>
