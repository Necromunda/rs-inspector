<script lang="ts">
  import { page } from "$app/state";
</script>

<div class="flex flex-col h-[95vh] justify-center items-center">
  <!-- <h1>{page.status} {page.error?.message}</h1> -->
  <h1 class="text-gold text-5xl">{page.status}</h1>
  <a href="/" class="text-gold">Go back</a>
</div>
