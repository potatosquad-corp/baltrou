<script lang="ts">
	import { events, type SseEvent } from '$lib/stores/event-store.js';
	import type { ConnexionState } from '$lib/types/status';
	import { jsonReplacer } from '$lib/utils';
	import { onMount } from 'svelte';

	let messages: SseEvent[] = [];
	let status: ConnexionState = 'connecting';

	onMount(() => {
		return events.subscribe((event) => {
			if (status === 'connecting' && event.type != 'empty') {
				status = 'connected';
			}
			if (event.type == 'error') {
				status = 'error';
			}

			const logEntry: SseEvent = {
				type: event.type || 'data',
				timestamp: new Date(),
				data: event.data
			};
			messages = [logEntry, ...messages];
		});
	});

	$: statusClass = (
		{
			connecting: 'status-connecting',
			connected: 'status-connected',
			error: 'status-error'
		} as const
	)[status];
</script>

<div class="debug-sse-tab">
	<p class="status-header">
		Statut:
		<span class="status-text {statusClass}">
			{status}
		</span>
	</p>

	<div class="log-window">
		{#if messages.length === 0}
			<p class="placeholder">En attente de messages...</p>
		{/if}

		{#each messages as msg, i (i)}
			<div class="log-entry">
				<div class="meta">
					<span>{msg.timestamp.toLocaleTimeString()}</span>
					<span class="type-badge">
						type: {msg.type}
					</span>
				</div>
				<pre>{JSON.stringify(msg.data, jsonReplacer, 2)}</pre>
			</div>
		{/each}
	</div>
</div>

<style>
	/* * Style simplifié pour s'adapter à l'intérieur
   * d'un onglet.
   */
	.debug-sse-tab {
		font-family: 'Inter', sans-serif;
		color: white;
	}

	.status-header {
		padding: 0.5rem 1rem;
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.status-text {
		font-weight: 700;
	}
	.status-connecting {
		color: #eab308;
	}
	.status-connected {
		color: #22c55e;
	}
	.status-error {
		color: #ef4444;
	}

	.log-window {
		height: calc(100vh - 120px); /* Hauteur restante */
		overflow-y: auto;
		padding: 0.5rem;
	}

	.log-window .placeholder {
		color: rgba(255, 255, 255, 0.5);
		font-style: italic;
		padding: 1rem;
	}

	.log-entry {
		margin-bottom: 1rem;
		padding: 0.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.meta {
		font-family: 'Inter', sans-serif;
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 0.5rem;
	}

	.type-badge {
		margin-left: 0.5rem;
		padding: 0.125rem 0.5rem;
		border-radius: 0.25rem;
		background-color: #02177a;
		color: #e0e7ff;
		font-size: 0.75rem;
	}

	.log-entry pre {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
		font-size: 0.875rem;
		overflow-x: auto;
		color: white;
	}
</style>
