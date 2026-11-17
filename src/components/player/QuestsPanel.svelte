<script lang="ts">
  import type { PlayerQuests } from "#lib/server/rsApi.ts";
  import {
    getCompletedQuestsCount,
    getQuestsCompletedPct,
    getQuestTitleColor,
  } from "#lib/utils/playerStats.ts";
  import Spinner from "../spinner.svelte";

  let { quests }: { quests: Promise<PlayerQuests | null> } = $props();
</script>

<section
  class="flex min-h-0 flex-col overflow-hidden rounded-md border border-gold/20 bg-dark/70 lg:flex-1"
>
  <div
    class="flex shrink-0 items-center justify-between border-b border-gold/20 px-4 py-3"
  >
    <h2 class="text-lg font-semibold text-gold">Quests</h2>

    {#await quests}
      <Spinner size={5} />
    {:then value}
      {#if value?.name}
        <span class="text-xs text-white/40">
          {getCompletedQuestsCount(value)} / {Object.keys(value.quests).length} Completed
        </span>
      {/if}
    {/await}
  </div>

  {#await quests}
    <div class="flex min-h-0 flex-1 items-center justify-center p-6">
      <Spinner size={8} />
    </div>
  {:then value}
    {#if value?.name}
      <div
        class="max-h-[28rem] min-h-0 space-y-2 overflow-y-auto scrollbar-modern p-4 lg:max-h-none lg:flex-1"
      >
        {#each Object.entries(value.quests) as [id, quest] (id)}
          <div
            class="flex items-center gap-3 rounded-md border border-gold/10 bg-grayish/70 px-3 py-2 transition-colors hover:border-gold/30"
          >
            <enhanced:img
              class="size-6 shrink-0 object-contain"
              alt={quest.members ? "Members quest" : "Free-to-play quest"}
              src={`/icons/misc/${quest.members ? "P2P" : "F2P"}_icon.png`}
            />
            <p class={`text-sm ${getQuestTitleColor(quest.status)}`}>
              {quest.title}
            </p>
          </div>
        {/each}
      </div>

      <div class="shrink-0 border-t border-gold/20 bg-grayish/40 px-4 py-3">
        <div class="mb-3 flex items-center justify-between">
          <span class="text-xs text-white/50">Quest completion</span>
          <span class="text-xs font-medium text-gold">
            {getQuestsCompletedPct(value)}%
          </span>
        </div>

        <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            class="h-full rounded-full bg-gold transition-all"
            style:width={`${getQuestsCompletedPct(value)}%`}
          ></div>
        </div>

        <div class="mt-3 flex justify-between">
          <span class="text-xs text-white/50">Quest points</span>
          <span class="text-xs font-semibold text-gold">
            {value.qp} / {value.qp_max}
          </span>
        </div>
      </div>
    {:else}
      <div class="flex min-h-0 flex-1 items-center justify-center p-6">
        <p class="text-sm text-white/50">No quest data available</p>
      </div>
    {/if}
  {:catch}
    <div class="flex min-h-0 flex-1 items-center justify-center p-6">
      <p class="text-sm text-red-500">Failed to load quests</p>
    </div>
  {/await}
</section>
