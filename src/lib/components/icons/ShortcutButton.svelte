<script lang="ts">
	export let name: string;
	export let selected: boolean = false;
	export let color: string | null = null;
</script>

<button class="shortcut-button" class:selected on:click>
	{#if color}
		<div class="color-bar" style="background-color: {color}"></div>
	{/if}
	<span class="name">{name}</span>
	<div class="icon-wrapper">
		<slot name="icon"></slot>
	</div>
</button>

<style>
	.shortcut-button {
		display: flex;
		position: relative;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 1rem;
		height: 100px;
		max-width: 300px;
		width: 100%;
		justify-self: center;
		cursor: pointer;
		transition: background-color 0.2s;
		border: 2px solid transparent;
		font-family: inherit;
		color: white;
		overflow: hidden;
	}

	.color-bar {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 5px;
	}

	.shortcut-button:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}

	.shortcut-button.selected {
		box-shadow: 0 0 15px 5px rgba(0, 255, 0, 0.5);
		border-color: rgba(0, 255, 0, 0.7);
	}

	.name {
		position: absolute;
		top: 10px;
		left: 10px;
		font-size: 1.5rem;
		text-align: left;
	}

	.icon-wrapper {
		position: absolute;
		bottom: 10px;
		right: 10px;
		width: auto;
		padding: 0 0.5rem;
		height: 40px;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
