<script>
	import { stats } from '$lib/stores/stats-store';
	import { obs } from '$lib/stores/obs';
	import { statusNameMap } from '$lib/types/status';
	const status = obs.client.status;
</script>

{#if $stats.isLive}
	<div class="live-status-container live">
		<span>OBS: {statusNameMap[$status]}</span>
		<span>Twitch: En direct</span>
		<div class="live-dot"></div>
	</div>
{:else}
	<div class="live-status-container offline">
		<span>OBS: {statusNameMap[$status]}</span>
		<span>Twitch: Hors ligne</span>
		<div class="offline-dot"></div>
	</div>
{/if}

<style>
	.live-status-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.live-dot,
	.offline-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.live-dot {
		background-color: #00ff00;
		animation: ping 2s infinite;
	}

	.offline-dot {
		background-color: #808080; /* Grey */
	}

	@keyframes ping {
		0% {
			box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
		}
		70% {
			box-shadow: 0 0 0 10px rgba(0, 255, 0, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(0, 255, 0, 0);
		}
	}
</style>
