<script lang="ts">
	import LightSettings from '$lib/components/LightSettings.svelte';
  import ObsSettings from '$lib/components/ObsSettings.svelte';
</script>

<svelte:head>
  <title>Paramètres - Baltrou</title>
</svelte:head>

<!--
  Le style 'content-box' est global, donc ce conteneur
  ne devrait pas être nécessaire, mais si vous voulez 
  centrer, utilisez ceci.
-->
<div class="page-container">
  <ObsSettings />
  <LightSettings/>
</div>

<style>
  .page-container {
    max-width: 900px;
    margin: 0 auto;
  }
</style>