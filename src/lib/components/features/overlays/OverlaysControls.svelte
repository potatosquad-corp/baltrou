<script lang="ts">
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
	import { lightApiUrl } from '$lib/stores/fiak-store';

	let overlayStates = $state({
		main: 'center',
		secondary: 'center',
		bottom: 'reset',
		right: 'reset',
		left: 'reset',
		top: 'reset'
	});

	const configs: {
		id: string;
		label: string;
		options: { value: string; label: string; icon?: typeof Icon }[];
	}[] = [
		{
			id: 'main',
			label: 'Main',
			options: [
				{ label: 'Center', value: 'center' },
				{ label: 'Left', value: 'left' },
				{ label: 'Right', value: 'right' },
				{ label: 'Wireless', value: 'wl' }
			]
		},
		{
			id: 'secondary',
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
				{ label: 'Hide', value: 'reset', icon: EyeOff },
				{ label: 'Stats', value: 'stats', icon: ChartArea },
				{ label: 'Pin', value: 'pin', icon: Pin }
			]
		},
		{
			id: 'right',
			label: 'Right',
			options: [
				{ label: 'Hide', value: 'reset', icon: EyeOff },
				{ label: 'Ad', value: 'ad', icon: BadgeDollarSign },
				{ label: 'Commands', value: 'commands', icon: Terminal },
				{ label: 'Activity', value: 'activity', icon: PartyPopper }
			]
		},
		{
			id: 'left',
			label: 'Left',
			options: [
				{ label: 'Hide', value: 'reset', icon: EyeOff },
				{ label: 'Chat', value: 'tchat', icon: MessageSquareText }
			]
		},
		{
			id: 'top',
			label: 'Top',
			options: [
				{ label: 'Hide', value: 'reset', icon: EyeOff },
				{ label: 'Countdown', value: 'countdown', icon: Timer }
			]
		}
	];

	function callAPI(configId: string, value: string) {
		let url = $lightApiUrl;
		if(['main','secondary'].includes(configId)){
			url += `/camera/${configId}/${value}`;
		} else {
			url += `/overlay/${configId}/${value}`;
		}
		fetch(url);
	}
</script>

<div class="card">
	<h2>Overlays</h2>
	<div class="grid">
		{#each configs as config}
			<div class="control-card">
				<span class="control-label">{config.label}</span>

				<SegmentedToggle
					options={config.options}
					value={overlayStates[config.id as keyof typeof overlayStates]}
					onChange={(value) => {
						callAPI(config.id, value);
					}}
				/>
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
