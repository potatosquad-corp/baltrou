<script lang="ts">
	import { events } from "$lib/stores/event-store";

  events.subscribe((event)=> {
    if(event.type == "play_sound") {
      const audio = new Audio(event.data.url);
      audio.play();
    }
  })
</script>