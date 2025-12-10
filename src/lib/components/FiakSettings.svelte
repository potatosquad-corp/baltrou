<script lang="ts">
	import { lightApiUrl, lightApiStatus, pingFiakAPI } from '$lib/stores/fiak-store';

	// Classe CSS réactive pour le statut
	$: statusClass = {
		UNKNOWN: 'status-unknown',
		CONNECTING: 'status-connecting',
		CONNECTED: 'status-connected',
		ERROR: 'status-error'
	}[$lightApiStatus];
</script>

<div class=" card light-settings-container">
	<h1>Connexion API F.I.A.K</h1>

	<div class="status-box">
		Statut <span class="status-text {statusClass}">{$lightApiStatus}</span>
	</div>

	<div class="form-group">
		<label for="lights-url">Hôte</label>
		<input
			id="lights-url"
			type="text"
			bind:value={$lightApiUrl}
			placeholder="http://192.168.1.10"
		/>
	</div>

	<div class="button-group">
		<button
			class="btn btn-primary"
			on:click={pingFiakAPI}
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
