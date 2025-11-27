<script lang="ts">
	import { jsonReplacer } from '$lib/utils';
  import { onMount, onDestroy } from 'svelte';
  let consoleElement: HTMLElement;
  interface ConsoleLog {
    id: number;
    type: 'log' | 'warn' | 'error' | 'info';
    timestamp: Date;
    message: any[];
  }

  let logs: ConsoleLog[] = [];
  let logId = 0;

  // Stocker les anciennes fonctions console
  let oldConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  };

  function formatMessage(args: any[]): any[] {
    // Tente de cloner les objets pour éviter les problèmes de référence
    try {
      return JSON.parse(JSON.stringify(args));
    } catch (e) {
      return args.map(String); // Fallback
    }
  }

  onMount(() => {
    // Remplacer console.log
    console.log = (...args: any[]) => {
      oldConsole.log.apply(console, args); // Appelle l'original
      consoleElement.scrollTop = -consoleElement.scrollHeight;
      logs = [
        ...logs,
        { id: logId++, type: 'log', timestamp: new Date(), message: formatMessage(args) }
      ];
    };

    // Remplacer console.warn
    console.warn = (...args: any[]) => {
      oldConsole.warn.apply(console, args);
      consoleElement.scrollTop = -consoleElement.scrollHeight;
      logs = [
        ...logs,
        { id: logId++, type: 'warn', timestamp: new Date(), message: formatMessage(args) }
      ];
    };

    // Remplacer console.error
    console.error = (...args: any[]) => {
      oldConsole.error.apply(console, args);
      consoleElement.scrollTop = -consoleElement.scrollHeight;
      logs = [
        ...logs,
        { id: logId++, type: 'error', timestamp: new Date(), message: formatMessage(args) }
      ];
    };
    
    // Remplacer console.info
    console.info = (...args: any[]) => {
      oldConsole.info.apply(console, args);
      consoleElement.scrollTop = -consoleElement.scrollHeight;
      logs = [
        ...logs,
        { id: logId++, type: 'info', timestamp: new Date(), message: formatMessage(args) }
      ];
    };
  });

  // Restaurer les fonctions originales à la destruction
  onDestroy(() => {
    if (oldConsole.log) console.log = oldConsole.log;
    if (oldConsole.warn) console.warn = oldConsole.warn;
    if (oldConsole.error) console.error = oldConsole.error;
    if (oldConsole.info) console.info = oldConsole.info;
  });
</script>

<div class="console-log-window" bind:this={consoleElement} >
  {#if logs.length === 0}
    <p class="placeholder">En attente des logs de la console...</p>
  {/if}
  {#each logs as log (log.id)}
    <div class="log-entry log-{log.type}">
      <span class="timestamp">{log.timestamp.toLocaleTimeString()}</span>
      <div class="message">
        {#each log.message as item}
          <pre>{JSON.stringify(item, jsonReplacer, 2)}</pre>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .console-log-window {
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
      monospace;
    color: white;
    padding: 0.5rem;
    display: flex;
    flex-direction: column-reverse; /* Affiche les logs du bas vers le haut */
    max-height: 100%;
    overflow: auto;
    scroll-behavior: smooth;
  }
  .placeholder {
    font-family: 'Inter', sans-serif;
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
    padding: 1rem;
  }
  .log-entry {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.5rem 0.25rem;
    font-size: 0.8rem;
  }
  .timestamp {
    color: rgba(255, 255, 255, 0.5);
    margin-right: 0.5rem;
  }
  .message {
    display: inline;
  }
  .message pre {
    display: inline;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }
  /* Couleurs par type */
  .log-warn {
    background-color: rgba(234, 179, 8, 0.1);
    color: #fde047; /* yellow-300 */
  }
  .log-error {
    background-color: rgba(239, 68, 68, 0.1);
    color: #fca5a5; /* red-300 */
  }
  .log-info {
    color: #93c5fd; /* blue-300 */
  }
</style>