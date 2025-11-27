<script lang="ts">
	import FileDropzone from '$lib/components/FileDropzone.svelte';
	import SoundboardItem from '$lib/components/SoundboardItem.svelte';
	import { soundboardStore } from '$lib/stores/soundboard-store';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	onMount(async ()=> {
		const sounds = await fetch('/api/soundboard');
		soundboardStore.set(await sounds.json());
	})

	async function onfiles(files: File[]){
		for(let file of files) {
			console.log(file)
			const form = new FormData();
			form.append('file',file);
			const res = await fetch('/api/soundboard',{
				method: 'POST',
				body: form,
			})
			if(res.ok){
				const sound = await res.json()
				if(get(soundboardStore).find(s=>s.id == sound.id)) return;
				soundboardStore.update((soundList)=>{
					soundList.push(sound);
					return soundList;
				})
			}
		}
	}

	function playSound(id: string) {
		console.log('Lecture du son:', id);
		const audio = new Audio(`/api/soundboard/${id}`);
    audio.play();
	}

	function renameSound(id: string, newName: string) {
		console.log('Renommage:', id, '->', newName);
        // soundboardStore.update(...)
	}

	async function deleteSound(id: string) {
		if(confirm("Supprimer ce son ?")) {
			console.log('Suppression:', id);
				await fetch(`/api/soundboard/${id}`,{method:'DELETE'});
				soundboardStore.update((sounds)=>{
					return sounds.filter((s)=>s.id != id);
				})
		}
	}
</script>
<h1>Ajouter un son</h1>
<FileDropzone accept={['.mp3', '.ogg', '.wav']} label="Ajouter des fichiers audios" multiple {onfiles}></FileDropzone>

<h1>Soundboard</h1>
<div class="sound-grid">
	{#each $soundboardStore as sound (sound.id)}
		<SoundboardItem 
			{sound} 
			onplay={playSound}
			onrename={renameSound}
			ondelete={deleteSound}
		/>
	{/each}
</div>

<style>
	.sound-grid {
		display: grid;
		/* Grille responsive : s'adapte automatiquement à la largeur */
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}
</style>