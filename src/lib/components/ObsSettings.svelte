<script lang="ts">
  import { onMount } from 'svelte';
	import { obs } from '$lib/stores/obs';
	import { writable } from 'svelte/store';
	import { classMap, ConnectionStatus, statusNameMap } from '$lib/types/status';
  
  let host = 'localhost';
  let port = 4455;
  let password = '';
  let isConnecting = writable<boolean>(false); 
  const status = obs.client.status;
  const isConnected = obs.client.isConnected;

  onMount(() => {
    const settings = obs.client.loadSettings();
    if (settings) {
      host = settings.host;
      port = settings.port;
      password = settings.password || '';
    }
  });

  async function connect() {
    obs.client.saveSettings({host,port,password});
    isConnecting.set(true);
    try {
      await obs.init();
    } finally {
      isConnecting.set(false);
    }
  }

  function disconnect() {
    obs.client.disconnect()
    obs.client.saveSettings({
      host: '',
      port: 4455,
      password: ''
    });
  }

  // Mapping du statut pour la couleur
  $: statusClass = classMap[$status] || 'status-disconnected';
</script>

<!-- Utilisation de la classe globale .card -->
<div class="card obs-settings-container">
  <h2>Connexion OBS WebSocket</h2>

  <div class="status-box">
    Statut <span class="status-text {statusClass}">{statusNameMap[$status] || 'Erreur ?'}</span>
  </div>

  <!-- Groupe Host / Port sur la même ligne -->
  <div class="row">
    <div class="form-group flex-grow">
      <label for="obs-host">Hôte (Host)</label>
      <input id="obs-host" type="text" bind:value={host} placeholder="localhost" />
    </div>

    <div class="form-group port-group">
      <label for="obs-port">Port</label>
      <input id="obs-port" type="number" bind:value={port} placeholder="4455" />
    </div>
  </div>

  <div class="form-group">
    <label for="obs-password">Mot de passe</label>
    <input id="obs-password" type="password" bind:value={password} placeholder="requis si activé" />
  </div>

  <div class="button-group">
    {#if $isConnected}
      <button class="btn btn-danger" on:click={disconnect}>Déconnecter</button>
    {:else}
      <button
        class="btn btn-success"
        on:click={connect}
        disabled={$isConnecting || $status === ConnectionStatus.CONNECTING}
      >
        {$isConnecting || $status === ConnectionStatus.CONNECTING ? 'Connexion...' : 'Connecter'}
      </button>
    {/if}
  </div>
</div>

<style>
  .obs-settings-container {
    max-width: 42rem;
    margin: 0 auto 2rem auto;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  /* Layout */
  .row {
    display: flex;
    gap: 1rem;
  }
  
  .flex-grow {
    flex-grow: 1;
  }

  .port-group {
    width: 120px; /* Largeur fixe pour le port, plus élégant */
  }
</style>