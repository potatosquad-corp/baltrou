<script lang="ts">
  import { toasts } from '$lib/stores/toast-store';
  import { fade, fly } from 'svelte/transition';
  import CloseIcon from './icons/CloseIcon.svelte';

  // Icônes simples pour chaque type (inline SVG pour éviter 4 fichiers)
  const icons = {
    info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`
  };
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div
      class="toast {toast.type}"
      in:fly={{ y: 20, duration: 300 }}
      out:fade={{ duration: 200 }}
    >
      <div class="icon">
        {@html icons[toast.type]}
      </div>
      <span class="message">{toast.message}</span>
      <button class="close-btn" on:click={() => toasts.remove(toast.id)}>
        <CloseIcon />
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 10000; /* Au-dessus de tout (même du DebugPanel) */
    max-width: 400px;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 250px;
  }

  .message {
    flex-grow: 1;
    word-break: break-word;
  }

  .close-btn {
    background: none;
    border: none;
    color: white;
    opacity: 0.7;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
  }
  .close-btn:hover { opacity: 1; }

  .icon {
    display: flex;
    align-items: center;
  }

  /* Thèmes */
  .info { background-color: rgba(33, 150, 243, 0.9); } /* Bleu */
  .success { background-color: rgba(34, 197, 94, 0.9); } /* Vert */
  .warning { background-color: rgba(234, 179, 8, 0.9); } /* Jaune/Orange */
  .error { background-color: rgba(239, 68, 68, 0.9); } /* Rouge */
</style>