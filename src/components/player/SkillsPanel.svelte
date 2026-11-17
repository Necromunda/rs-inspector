<script lang="ts">
  import type { PlayerHiscore } from "#lib/server/rsApi.ts";
  import { getMaxedSkills, getSkillCount } from "#lib/utils/playerStats.ts";
  import SkillsTab from "../skills_tab/skills_tab.svelte";
  import Spinner from "../spinner.svelte";

  let { hiscore }: { hiscore: Promise<PlayerHiscore | null> } = $props();
</script>

<section
  class="flex min-h-0 flex-col overflow-hidden rounded-md border border-gold/20 bg-dark/70 lg:flex-1"
>
  <div class="flex shrink-0 items-center justify-between border-b border-gold/20 px-4 py-3">
    <h2 class="text-lg font-semibold text-gold">Skills</h2>

    {#await hiscore}
      <Spinner size={5} />
    {:then value}
      {#if value}
        <span class="text-xs text-white/40">
          {getMaxedSkills(value)} / {getSkillCount(value)} skills at 99
        </span>
      {/if}
    {/await}
  </div>

  {#await hiscore}
    <div class="flex min-h-0 flex-1 items-center justify-center p-6">
      <Spinner size={8} />
    </div>
  {:then value}
    {#if value}
      <div class="max-h-[28rem] min-h-0 overflow-y-auto scrollbar-modern p-4 lg:max-h-none lg:flex-1">
        <SkillsTab skills={value.skills} />
      </div>
    {:else}
      <div class="flex min-h-0 flex-1 items-center justify-center p-6">
        <p class="text-sm text-white/50">No Hiscore data available</p>
      </div>
    {/if}
  {:catch}
    <div class="flex min-h-0 flex-1 items-center justify-center p-6">
      <p class="text-sm text-red-500">Failed to load Hiscore</p>
    </div>
  {/await}
</section>
