<script lang="ts">
  import type { PlayerEvents } from "#lib/server/rsApi.ts";
  import Spinner from "../spinner.svelte";

  let { events }: { events: Promise<PlayerEvents | null> } = $props();
</script>

<section
  class="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-md border border-gold/20 bg-dark/70"
>
  <div
    class="flex shrink-0 items-center justify-between border-b border-gold/20 px-4 py-3"
  >
    <h2 class="text-lg font-semibold text-gold">Recent Activity</h2>

    {#await events}
      <Spinner size={5} />
    {:then value}
      {#if value}
        <span class="text-xs text-white/40">{value.events.length} Events</span>
      {/if}
    {/await}
  </div>

  {#await events}
    <div class="flex min-h-0 flex-1 items-center justify-center p-6">
      <Spinner size={8} />
    </div>
  {:then value}
    {#if value}
      <div
        class="max-h-[38rem] min-h-0 space-y-3 overflow-y-auto scrollbar-modern p-4 lg:max-h-none lg:flex-1"
      >
        {#each value.events as event}
          <div
            class="rounded-md border border-gold/10 bg-grayish/70 p-4 transition-colors hover:border-gold/30"
          >
            <div class="mb-2 flex items-center gap-2">
              <div class="size-1.5 rounded-full bg-gold"></div>
              <p class="text-xs font-medium text-gold/80">
                {new Date(event.date).toLocaleString()}
              </p>
            </div>
            <p class="text-sm leading-relaxed text-white/80">
              {event.details}
            </p>
          </div>
        {/each}

        {#if value.events.length === 0}
          <p class="py-8 text-center text-sm text-white/50">
            No recent activity
          </p>
        {/if}
      </div>
    {:else}
      <div class="flex min-h-0 flex-1 items-center justify-center p-6">
        <p class="text-sm text-white/50">No activity data available</p>
      </div>
    {/if}
  {:catch}
    <div class="flex min-h-0 flex-1 items-center justify-center p-6">
      <p class="text-sm text-red-500">Failed to load activity</p>
    </div>
  {/await}
</section>
