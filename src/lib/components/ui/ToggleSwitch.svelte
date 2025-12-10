<script lang="ts">
	import { noop } from '$lib/utils';
	import type { Component } from 'svelte';

	let {
		checked = $bindable(false),
		onChange = noop,
		iconOn,
		iconOff
	}: {
		checked: boolean;
		onChange: (val: boolean) => void;
		iconOn?: Component;
		iconOff?: Component;
	} = $props();

	function handleClick() {
		checked = !checked;
		if (onChange) onChange(checked);
	}
</script>

<button class="switch" class:checked role="switch" aria-checked={checked} onclick={handleClick}>
	<div class="thumb">
		{#if checked && iconOn}
			{@const Icon = iconOn}
			<Icon size={14} strokeWidth={3} />
		{:else if !checked && iconOff}
			{@const Icon = iconOff}
			<Icon size={14} strokeWidth={3} />
		{/if}
	</div>
</button>

<style>
	.switch {
		--track-width: 50px;
		--thumb-size: 24px;
		--padding: 3px;

		position: relative;
		width: var(--track-width);
		height: calc(var(--thumb-size) + (var(--padding) * 2));
		border-radius: var(--radius-full);
		border: none;
		cursor: pointer;
		background-color: var(--surface-color);
		transition: background-color 0.3s ease;
		padding: var(--padding);
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.thumb {
		width: var(--thumb-size);
		height: var(--thumb-size);
		border-radius: 50%;
		background-color: var(--accent-danger);
		color: white;

		display: flex;
		align-items: center;
		justify-content: center;

		transition:
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			background-color 0.3s ease,
			color 0.3s ease;

		transform: translateX(0);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.switch.checked .thumb {
		transform: translateX(calc(var(--track-width) - var(--thumb-size) - (var(--padding) * 2)));
		background-color: var(--accent-success);
		color: #000;
	}
</style>
