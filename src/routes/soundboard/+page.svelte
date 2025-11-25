<script>
	import FileDropzone from '$lib/components/FileDropzone.svelte';
</script>
<h1>Ajouter un son</h1>
<FileDropzone accept={['.mp3', '.ogg', '.wav']}></FileDropzone>
