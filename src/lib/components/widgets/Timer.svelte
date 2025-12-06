<script lang="ts">
	import { onMount } from 'svelte';
	import { appMode, timer } from '$lib/stores/global-store';

	let now = $state(new Date());
	let inputHours = $state('');
	let inputMinutes = $state('');

	onMount(() => {
		const interval = setInterval(() => {
			now = new Date();

			if ($timer && now >= $timer) {
				const nextTarget = new Date($timer);
				nextTarget.setDate(nextTarget.getDate() + 1);
				timer.set(nextTarget);
			}
		}, 100);
		return () => clearInterval(interval);
	});

	function handleInputHours(e: Event) {
		const target = e.target as HTMLInputElement;
		let val = target.value.replace(/[^0-9]/g, '');
		if (val.length > 2) val = val.slice(0, 2);
		if (parseInt(val) > 23) val = '23';
		inputHours = val;
		target.value = val;
	}

	function handleInputMinutes(e: Event) {
		const target = e.target as HTMLInputElement;
		let val = target.value.replace(/[^0-9]/g, '');
		if (val.length > 2) val = val.slice(0, 2);
		if (parseInt(val) > 59) val = '59';
		inputMinutes = val;
		target.value = val;
	}

	function setTarget() {
		if (!inputHours || !inputMinutes) return;
		const hours = parseInt(inputHours);
		const minutes = parseInt(inputMinutes);
		const target = new Date();
		target.setHours(hours, minutes, 0, 0);
		if (target < new Date()) target.setDate(target.getDate() + 1);

		timer.set(target);
		inputHours = '';
		inputMinutes = '';
	}

	function formatCountdown(current: Date, target: Date) {
		const diff = target.getTime() - current.getTime() + 1000;
		if (diff <= 0) return '00:00:00';
		const h = Math.floor(diff / 3600000);
		const m = Math.floor((diff % 3600000) / 60000);
		const s = Math.floor((diff % 60000) / 1000);
		return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	}
</script>

<div class="card no-margin timer-card">
	<div class="xl-label">TEMPS RESTANT</div>
	{#if $timer}
		<!-- Mode ACTIF : Affichage du décompte -->
		<div class="display-container">
			<div class="xl-text time" class:finished={$timer < now}>
				{formatCountdown(now, $timer)}
			</div>

			{#if $appMode === 'CONFIG'}
				<button onclick={timer.remove} class="btn-floating reset" title="Arrêter">
					<!-- Croix -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						width="24"
						height="24"
					>
						<path
							d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
						/>
					</svg>
				</button>
			{/if}
		</div>
	{:else}
		<!-- Mode CONFIGURATION : Inputs géants -->
		<div class="display-container input-mode">
			<div class="time-inputs">
				<input
					type="text"
					value={inputHours}
					oninput={handleInputHours}
					placeholder="HH"
					class="big-input"
					inputmode="numeric"
					disabled={$appMode !== 'CONFIG'}
				/>
				<span class="separator">:</span>
				<input
					type="text"
					value={inputMinutes}
					oninput={handleInputMinutes}
					placeholder="MM"
					class="big-input"
					inputmode="numeric"
					disabled={$appMode !== 'CONFIG'}
					onkeydown={(e) => e.key === 'Enter' && setTarget()}
				/>
			</div>

			{#if $appMode === 'CONFIG' && inputHours != '' && inputMinutes != ''}
				<button onclick={setTarget} class="btn-floating set" title="Démarrer">
					<!-- Play / Check -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						width="24"
						height="24"
					>
						<path d="M8 5v14l11-7z" />
					</svg>
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.card {
		min-width: 300px;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	/* Conteneur principal pour aligner temps et boutons */
	.display-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.time.finished {
		color: #ef4444;
		animation: blink 1s infinite;
	}

	/* --- Inputs Géants --- */
	.time-inputs {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.big-input {
		background: transparent;
		border: none;
		border-bottom: 2px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.7); /* Légèrement grisé pour indiquer "à remplir" */
		font-family: 'Bebas Neue', sans-serif;
		font-size: 4rem; /* Même taille que le timer */
		width: 3ch;
		text-align: center;
		outline: none;
		padding: 0;
		line-height: 1;
		transition:
			border-color 0.2s,
			color 0.2s;
	}

	.big-input:focus {
		border-bottom-color: var(--accent-success, #22c55e);
		color: white;
	}

	.big-input::placeholder {
		color: rgba(255, 255, 255, 0.2);
	}

	.big-input:disabled {
		border-bottom-color: transparent;
		opacity: 0.5;
	}

	.separator {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 4rem;
		margin: 0 0.1rem;
		line-height: 0.9;
		opacity: 0.7;
	}

	/* --- Boutons Flottants --- */
	.btn-floating {
		position: absolute;
		right: -50px; /* Décale le bouton sur le côté droit */
		top: 50%;
		transform: translateY(-50%);
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		transition:
			transform 0.2s,
			filter 0.2s;
	}

	.btn-floating:hover {
		filter: brightness(1.1);
		transform: translateY(-50%) scale(1.1);
	}

	.set {
		background-color: var(--accent-success, #22c55e);
	}

	.reset {
		background-color: var(--accent-danger, #ef4444);
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
