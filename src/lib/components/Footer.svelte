<script lang="ts">
	import EyeIcon from './icons/EyeIcon.svelte';
	import GemIcon from './icons/GemIcon.svelte';
	import StarIcon from './icons/StarIcon.svelte';
	import UserIcon from './icons/UserIcon.svelte';
	import LiveStatus from './LiveStatus.svelte';
	import { stats } from '$lib/stores/stats-store';
	import { version } from '$app/environment';
	export let isLoggedIn: Boolean;
</script>

<footer>
	<div class="footer-left">
		<span>b.a.l.t.r.o.u V{version}, powered by Potato corp ❤️</span>
	</div>
	{#if isLoggedIn}
		<div class="footer-center">
			<div class="stat-item">
				<EyeIcon />
				<span>{$stats.viewerCount}</span>
			</div>
			<div class="stat-item">
				<UserIcon />
				<span>{$stats.followerCount}</span>
			</div>
			<div class="stat-item">
				<StarIcon />
				<span>{$stats.subscriberCount}</span>
			</div>
			<div class="stat-item">
				<GemIcon />
				<span>{$stats.totalBits}</span>
			</div>
		</div>
		<div class="footer-right">
			<LiveStatus></LiveStatus>
		</div>
	{/if}
</footer>

<style>
	footer {
		background-color: var(--menu-bg);
		font-family: var(--font-heading);
		padding: 0.5rem 1rem;
		display: grid;
		grid-template-columns: 1fr auto 1fr;

		align-items: center;
		font-size: 0.9rem;
		position: fixed;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
	}

	.footer-center {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
	}

	.footer-right {
		display: flex;
		align-items: center;
		justify-self: end;
		gap: 0.5rem;
	}

	.stat-item {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.stat-item span {
		margin: 0 5px;
	}
</style>
