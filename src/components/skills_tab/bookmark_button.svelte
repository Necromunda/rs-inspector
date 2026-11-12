<script lang="ts">
  import { Bookmark, BookmarkCheck } from "@lucide/svelte";

  let {
    isBookmarked,
    onclick,
  }: {
    isBookmarked: boolean;
    onclick: () => void;
  } = $props();
</script>

<button
  type="button"
  {onclick}
  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark player"}
  aria-pressed={isBookmarked}
  title={isBookmarked ? "Remove bookmark" : "Bookmark player"}
  class="rounded-md border border-gold/20 bg-dark/70 p-2
    text-gold transition-colors
    hover:border-gold/50 hover:bg-gold/10"
>
  {#if isBookmarked}
    <BookmarkCheck size={20} fill="currentColor" />
  {:else}
    <Bookmark size={20} />
  {/if}
</button>
