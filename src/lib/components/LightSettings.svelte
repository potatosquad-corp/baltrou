<script lang="ts">
	import { lightApiUrl, lightApiStatus, pingLightApi } from '$lib/stores/lights-store';

	// Classe CSS réactive pour le statut
	$: statusClass = {
		UNKNOWN: 'status-unknown',
		CONNECTING: 'status-connecting',
		CONNECTED: 'status-connected',
		ERROR: 'status-error'
	}[$lightApiStatus];
</script>

<div class=" card light-settings-container">
	<h1>Connexion API Lumières</h1>

	<div class="status-box">
		Statut <span class="status-text {statusClass}">{$lightApiStatus}</span>
	</div>

	<div class="form-group">
		<label for="lights-url">URL de l'API</label>
		<input
			id="lights-url"
			type="text"
			bind:value={$lightApiUrl}
			placeholder="http://192.168.1.10"
		/>
	</div>
	<p>Format: http(s)://[domaine](:port)</p>

	<div class="button-group">
		<button
			class="btn btn-primary"
			on:click={pingLightApi}
			disabled={$lightApiStatus === 'CONNECTING'}
		>
			Connecter
		</button>
	</div>
</div>

<style>
	.light-settings-container {
		padding: 2rem;
		margin: 2rem auto;
		max-width: 42rem;
	}

	.button-group button {
		border: none;
		padding: 0.75rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 700;
	}
</style>
