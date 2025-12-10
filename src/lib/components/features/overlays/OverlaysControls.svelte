<script lang="ts">
	import type { Component } from 'svelte';
	import {
		EyeOff,
		ChartArea,
		Pin,
		BadgeDollarSign,
		Terminal,
		PartyPopper,
		MessageSquareText,
		Timer,
		type Icon
	} from '@lucide/svelte';
	import SegmentedToggle from '$lib/components/ui/SegmentedToggle.svelte';

	let overlayStates = $state({
		mainCam: 'center',
		secondaryCam: 'center',
		bottom: 'hide',
		right: 'hide',
		left: 'hide',
		top: 'hide'
	});

	const configs: {
		id: string;
		label: string;
		options: { value: string; label: string; icon?: Icon }[];
	}[] = [
		{
			id: 'mainCam',
			label: 'Main',
			options: [
				{ label: 'Center', value: 'center' },
				{ label: 'Left', value: 'left' },
				{ label: 'Right', value: 'right' },
				{ label: 'Wireless', value: 'wl' }
			]
		},
		{
			id: 'secondaryCam',
			label: 'Secondary',
			options: [
				{ label: 'Center', value: 'center' },
				{ label: 'Left', value: 'left' },
				{ label: 'Right', value: 'right' },
				{ label: 'Wireless', value: 'wl' }
			]
		},
		{
			id: 'bottom',
			label: 'Bottom',
			options: [
				{ label: 'Hide', value: 'hide', icon: EyeOff },
				{ label: 'Stats', value: 'stats', icon: ChartArea },
				{ label: 'Pin', value: 'pin', icon: Pin }
			]
		},
		{
			id: 'right',
			label: 'Right',
			options: [
				{ label: 'Hide', value: 'hide', icon: EyeOff },
				{ label: 'Ad', value: 'ad', icon: BadgeDollarSign },
				{ label: 'Commands', value: 'commands', icon: Terminal },
				{ label: 'Activity', value: 'activity', icon: PartyPopper }
			]
		},
		{
			id: 'left',
			label: 'Left',
			options: [
				{ label: 'Hide', value: 'hide', icon: EyeOff },
				{ label: 'Chat', value: 'chat', icon: MessageSquareText }
			]
		},
		{
			id: 'top',
			label: 'Top',
			options: [
				{ label: 'Hide', value: 'hide', icon: EyeOff },
				{ label: 'Countdown', value: 'countdown', icon: Timer }
			]
		}
	];
</script>

<div class="card">
	<h2>Overlays</h2>
	<div class="grid">
		{#each configs as config}
			{@const proxy = {
				get value() {
					return overlayStates[config.id as keyof typeof overlayStates];
				},
				set value(v) {
					overlayStates[config.id as keyof typeof overlayStates] = v;
				}
			}}

			<div class="control-card">
				<span class="control-label">{config.label}</span>

				<SegmentedToggle options={config.options} bind:value={proxy.value} />
			</div>
		{/each}
	</div>
</div>

<style>
  .card {
    width: 100%;
  }
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
		gap: 10px;
	}

	.control-card {
		background: rgba(255, 255, 255, 0.05);
		padding: 15px;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

  .control-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #a5a5b5;
    font-family: sans-serif;
    text-transform: uppercase;
  }
</style>
