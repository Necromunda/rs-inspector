<script lang="ts">
  import type { PlayerHiscore, PlayerQuests } from "#lib/server/rsApi.ts";
  import type { Rs3GameMode } from "#lib/utils/gameMode.ts";
  import { getRunescore, getTotalLevel } from "#lib/utils/playerStats.ts";
  import BookmarkButton from "../skills_tab/bookmark_button.svelte";
  import Spinner from "../spinner.svelte";

  let {
    username,
    quests,
    hiscore,
    gameMode,
    isBookmarked,
    onBookmarkToggle,
  }: {
    username: string;
    quests: Promise<PlayerQuests | null>;
    hiscore: Promise<PlayerHiscore | null>;
    gameMode: Promise<Rs3GameMode>;
    isBookmarked: boolean;
    onBookmarkToggle: () => void;
  } = $props();
</script>

<header class="shrink-0 rounded-md border border-gold/20 bg-dark/70 p-5">
  <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
    <div class="flex items-center gap-3">
      <!-- Kept from your original design. Membership isn't inferred by the API here. -->
      <enhanced:img
        class="size-12 object-contain"
        alt="Membership status"
        src={"/icons/misc/P2P_icon.png"}
      />

      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-3xl font-bold text-gold">
            {#await quests}
              {username}
            {:then playerQuests}
              {playerQuests?.name ?? username}
            {:catch}
              {username}
            {/await}
          </h1>
          <BookmarkButton {isBookmarked} onclick={onBookmarkToggle} />
        </div>

        <div class="flex items-center gap-2">
          {#await gameMode}
            <p class="text-sm text-white/50">Checking game mode...</p>
          {:then mode}
            <div class="flex items-center gap-2">
              {#if mode === "Hardcore Ironman"}
                <enhanced:img
                  class="size-5 object-contain"
                  alt="Hardcore Ironman"
                  src={"/icons/misc/Hardcore_ironman_badge.png"}
                />
              {:else if mode === "Ironman"}
                <enhanced:img
                  class="size-5 object-contain"
                  alt="Ironman"
                  src={"/icons/misc/Ironman_badge.png"}
                />
              {/if}
              <p class="text-sm text-white/70">{mode}</p>
            </div>
          {:catch}
            <p class="text-sm text-white/50">Game mode unavailable</p>
          {/await}
        </div>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-3">
      <div
        class="flex items-center gap-3 rounded-md border border-gold/10 bg-grayish px-4 py-3"
      >
        <enhanced:img
          class="size-8 object-contain"
          alt="Total level"
          src={"/icons/skills/Overall_detail.png"}
        />
        <div>
          <p class="text-xs text-white/50">Total level</p>
          {#await hiscore}
            <Spinner size={5} />
          {:then value}
            <p class="text-xl font-bold text-gold">
              {value ? getTotalLevel(value).toLocaleString() : "N/A"}
            </p>
          {:catch}
            <p class="text-xl font-bold text-white/40">N/A</p>
          {/await}
        </div>
      </div>

      <div
        class="flex items-center gap-3 rounded-md border border-gold/10 bg-grayish px-4 py-3"
      >
        <enhanced:img
          class="size-8 object-contain"
          alt="RuneScore"
          src={"/icons/misc/RuneScore.png"}
        />
        <div>
          <p class="text-xs text-white/50">RuneScore</p>
          {#await hiscore}
            <Spinner size={5} />
          {:then value}
            <p class="text-xl font-bold text-gold">
              {value ? getRunescore(value).toLocaleString() : "N/A"}
            </p>
          {:catch}
            <p class="text-xl font-bold text-white/40">N/A</p>
          {/await}
        </div>
      </div>
    </div>
  </div>
</header>
