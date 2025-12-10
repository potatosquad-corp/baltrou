<script lang="ts">
	import { type Icon } from '@lucide/svelte';
	import { type Component } from 'svelte';

	type ToggleOption = {
		value: string;
		label: string;
		icon?: Icon;
	};

	let {
		options = [],
		value = $bindable()
	}: {
		options: ToggleOption[];
		value: string;
	} = $props();

	function select(val: string) {
		value = val;
	}
</script>

<div class="toggle-container">
	{#each options as option}
		<button
			class="toggle-item"
			class:active={value === option.value}
			onclick={() => select(option.value)}
			aria-selected={value === option.value}
			role="option"
		>
			{#if option.icon}
				{@const Icon = option.icon as Component}
				<Icon size={14} strokeWidth={3} />
			{/if}

			<span class="label">{option.label}</span>
		</button>
	{/each}
</div>

<style>
	.toggle-container {
		display: inline-flex;
		background-color: var(--surface-color);
		padding: 4px;
		border-radius: var(--radius-full);
		box-shadow: var(--shadow-md);
		gap: 4px;
		width: 100%;
		max-width: 600px;
	}

	.toggle-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 24px;
		margin: 2px 4px;
		border: none;
		border-radius: var(--radius-full);
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		font-family: sans-serif;
		font-weight: 700;
		font-size: 1rem;
		text-transform: uppercase;
		transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
		outline: none;
		white-space: nowrap;
	}

	.toggle-item:hover:not(.active) {
		color: #e0e0e0;
		background-color: rgba(255, 255, 255, 0.05);
	}

	.toggle-item.active {
		background-color: var(--accent-primary);
		color: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
		transform: scale(1.02);
	}
</style>
