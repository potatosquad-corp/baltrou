<script lang="ts">
	import { Volume2, VolumeOff } from '@lucide/svelte';
	import ToggleSwitch from '$lib/components/ui/ToggleSwitch.svelte';
	import type { AudioSource } from '$lib/stores/obs/audio';
	import { obs } from '$lib/stores/obs';

	let { 
		name, 
		muted, 
		onToggle
	}: { 
		name: string, 
		muted: boolean, 
		onToggle: (newVal: boolean) => void 
	} = $props();
	let statusColor = $derived(muted ? '#ef4444' : '#4ade80');
</script>

<div class="input">
	<div class="status-bar" style="background-color: {statusColor}"></div>
	<div class="content">
		<div class="info">
			<span class="name">{name}</span>
			<span class="status" style="color: {statusColor}">{muted ? 'MUTED' : 'ON AIR'}</span>
		</div>
		<ToggleSwitch
			checked={!muted}
			onChange={onToggle}
			iconOn={Volume2}
			iconOff={VolumeOff}
		/>
	</div>
</div>

<style>
	.input {
		display: flex;
		background-color: var(--surface-color);
		border-radius: 12px;
		overflow: hidden;
		height: 70px;
		border: 1px solid var(--surface-border);
		margin-bottom: 10px;
	}

	.status-bar {
		width: 6px;
		height: 100%;
		transition: background-color 0.3s ease;
	}

	.content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.name {
		color: white;
		font-weight: bold;
		font-size: 1.1rem;
	}

	.status {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 1px;
		transition: color 0.3s ease;
	}
</style>
