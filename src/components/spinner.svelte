<script lang="ts">
  let {
    size,
  }: {
    size: number;
  } = $props();
</script>

<div
  class="size-{size} animate-spin rounded-full
border-4 border-gold/20 border-t-gold"
></div>
