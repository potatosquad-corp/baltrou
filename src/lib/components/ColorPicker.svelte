<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  /**
   * La couleur actuelle au format hexadécimal
   * @default '#FFFFFF'
   */
  export let value = '#FFFFFF';

  const dispatch = createEventDispatcher<{
    change: string; // Se déclenche quand une nouvelle couleur est choisie
  }>();

  // Cette fonction est appelée à chaque fois que
  // l'utilisateur change la couleur dans le sélecteur natif.
  function onColorInput() {
    dispatch('change', value);
  }
</script>

<div class="color-picker-wrapper" title="Sélectionner une couleur">
  <!-- 
    1. L'aperçu : C'est ce que l'utilisateur voit.
       Il est stylisé pour correspondre à votre application.
  -->
  <div 
    class="color-preview" 
    style="background-color: {value}" 
  ></div>

  <!-- 
    2. L'input : Il est invisible (opacity: 0) mais
       positionné par-dessus l'aperçu. C'est ce que
       l'utilisateur clique *réellement*.
  -->
  <input
    type="color"
    class="color-input"
    bind:value
    on:input={onColorInput}
  />
</div>

<style>
  .color-picker-wrapper {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    /* Style cohérent : fond transparent au cas où la couleur a de l'alpha */
    background-color: rgba(255, 255, 255, 0.1);
    overflow: hidden; /* Assure que tout reste dans les coins arrondis */
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .color-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Bordure subtile pour délimiter */
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    /* N'intercepte pas les clics */
    pointer-events: none;
    box-sizing: border-box;
  }

  .color-input {
    /* Positionné exactement par-dessus l'aperçu */
    position: absolute;
    top: -10px; /* Surdimensionné pour couvrir toute la zone */
    left: -10px;
    width: 100px; /* Plus grand que le parent */
    height: 100px; /* Plus grand que le parent */
    
    /* Le 'hack' pour le cacher */
    opacity: 0;
    
    border: none;
    padding: 0;
    cursor: pointer;
  }
</style>