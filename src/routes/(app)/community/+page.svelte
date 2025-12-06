<script>
	import Chat from '$lib/components/Chat.svelte';
	import PinnedMessage from '$lib/components/PinnedMessage.svelte';
</script>

<h1>Communauté</h1>

<div class="community-grid">
	<div class="chat-wrapper">
		<Chat></Chat>
	</div>
	<div class="right-column">
		<PinnedMessage></PinnedMessage>
	</div>
</div>

<style>
	.community-grid {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 2rem;
	}

	.right-column {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (max-width: 900px) {
		.community-grid {
			grid-template-columns: 1fr;
		}

		.right-column {
			grid-row: 1;
		}

		.chat-wrapper {
			grid-row: 2;
		}
	}
</style>
