<script lang="ts">
  import { 
    lightApiUrl, 
    lightApiStatus, 
    pingLightApi 
  } from '$lib/stores/lights-store';

  // Classe CSS réactive pour le statut
  $: statusClass = {
    'UNKNOWN': 'status-unknown',
    'CONNECTING': 'status-connecting',
    'CONNECTED': 'status-connected',
    'ERROR': 'status-error'
  }[$lightApiStatus];
</script>

<div class="lights-settings-container">
  <h2>Connexion API Lumières</h2>
  
  <div class="status-box">
    Statut: <span class="status-text {statusClass}">{$lightApiStatus}</span>
  </div>

  <div class="form-group">
    <label for="lights-url">URL de l'API</label>
    <!-- 
      L'input est lié (bind) directement au store.
      Grâce au 'subscribe' dans le store, tout changement
      ici est automatiquement sauvegardé dans le localStorage.
    -->
    <input 
      id="lights-url" 
      type="text" 
      bind:value={$lightApiUrl} 
      placeholder="http://192.168.1.10"
    />
  </div>
  
  <div class="button-group">
    <button 
      class="connect-btn" 
      on:click={pingLightApi}
      disabled={$lightApiStatus === 'CONNECTING'}
    >
      {$lightApiStatus === 'CONNECTING' ? 'Test...' : 'Tester la Connexion'}
    </button>
  </div>
</div>

<style>
  .lights-settings-container {
    /* Style global (blanc transparent) */
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 2rem;
    margin: 2rem auto;
    max-width: 42rem;
    font-family: 'Inter', sans-serif;
    color: white;
  }
  
  h2 {
    font-family: 'Bebas Neue', cursive;
    font-size: 2rem;
    margin-top: 0;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .form-group input {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    box-sizing: border-box; /* Important pour le padding */
  }
  
  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .button-group button {
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 700;
  }
  
  .connect-btn {
    background-color: #2196f3; /* Bleu */
    color: white;
  }
  .connect-btn:disabled {
    opacity: 0.5;
  }

  .status-box {
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
  .status-text {
    font-weight: 700;
  }
  .status-connecting { color: #eab308; }
  .status-connected { color: #22c55e; }
  .status-error { color: #ef4444; }
  .status-unknown { color: #9CA3AF; }
</style>