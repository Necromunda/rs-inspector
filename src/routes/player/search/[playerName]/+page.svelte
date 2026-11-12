<script lang="ts">
  import { onMount } from "svelte";
  import type { PlayerHiscore, PlayerQuests } from "#lib/server/rsApi.ts";
  import type { PageProps } from "./$types";
  import SkillsTab from "../../../../components/skills_tab/skills_tab.svelte";
  import BookmarkButton from "../../../../components/skills_tab/bookmark_button.svelte";
  import {
    readLocalStorage,
    writeLocalStorage,
  } from "#lib/client/localStorage.ts";

  let { data }: PageProps = $props();

  let isBookmarked = $state(false);
  let rsName = $derived(data.playerHiscore.name);

  onMount(() => {
    const searchHistory = getSearchHistory();
    const searchedPlayerIndex = searchHistory.lastIndexOf(rsName);

    if (
      searchedPlayerIndex === -1 ||
      searchedPlayerIndex !== searchHistory.length - 1
    ) {
      searchHistory.push(rsName);
      writeLocalStorage<Array<string>>("searchHistory", searchHistory);
    }

    isBookmarked = getBookmarks().includes(rsName);
  });

  function getSearchHistory() {
    return readLocalStorage<Array<string>>("searchHistory") || [];
  }

  function getBookmarks() {
    return readLocalStorage<Array<string>>("bookmarks") || [];
  }

  function toggleBookmark() {
    const bookmarks = getBookmarks();
    const index = bookmarks.indexOf(rsName);

    if (index === -1) bookmarks.push(rsName);
    else bookmarks.splice(index, 1);

    writeLocalStorage<Array<string>>("bookmarks", bookmarks);

    isBookmarked = !isBookmarked;
  }

  function getCompletedQuestsCount(playerQuests: PlayerQuests): number {
    return Object.values(playerQuests.quests).filter(
      (quest) => quest.status === "COMPLETED"
    ).length;
  }

  function getQuestsCount(playerQuests: PlayerQuests): number {
    return Object.values(playerQuests.quests).filter(
      (quest) => quest.difficulty !== 250
    ).length;
  }

  function getQuestTitleColor(status: string) {
    switch (status) {
      case "COMPLETED":
        return "text-green-500";
      case "STARTED":
        return "text-yellow-400";
      default:
        return "text-white";
    }
  }

  function getRunescore(playerHiscore: PlayerHiscore): number {
    let score = 0;

    playerHiscore.activities.forEach((e) => {
      if (e.name.toLowerCase() == "runescore") score = e.score;
    });

    return score;
  }

  function getTotalLevel(playerHiscore: PlayerHiscore): number {
    let level = 0;

    playerHiscore.skills.forEach((e) => {
      if (e.name.toLowerCase() == "overall") level = e.level;
    });

    return level;
  }

  function getMaxedSkills(playerHiscore: PlayerHiscore): number {
    let count = 0;

    playerHiscore.skills.forEach((e) => {
      if (e.level >= 99) count++;
    });

    return count;
  }

  function getQuestsCompletedPct(playerQuests: PlayerQuests): string {
    const completed = getCompletedQuestsCount(playerQuests);
    const pct = (completed / Object.values(playerQuests.quests).length) * 100;

    return pct.toFixed(0);
  }
</script>

<div class="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 lg:h-[95dvh]">
  <!-- Player profile -->
  <header class="shrink-0 rounded-md border border-gold/20 bg-dark/70 p-5">
    <div
      class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
    >
      <!-- Player name and status -->
      <div class="flex items-center gap-3">
        <enhanced:img
          class="size-12 object-contain"
          alt="Membership status"
          src={"/icons/misc/P2P_icon.png"}
        />

        <div>
          <div class="flex space-x-2">
            <h1 class="text-3xl font-bold text-gold">
              {rsName}
            </h1>
            <BookmarkButton {isBookmarked} onclick={toggleBookmark} />
          </div>
          <div class="flex items-center space-x-2">
            <enhanced:img
              class="size-5 object-contain"
              alt="Gamemode status"
              src={"/icons/misc/Ironman_badge.png"}
            />
            <p class="text-sm text-white/50">Ironman</p>
          </div>
        </div>
      </div>

      <!-- Player statistics -->
      <div class="flex gap-3">
        <div
          class="flex items-center gap-3 rounded-md
                 border border-gold/10 bg-grayish px-4 py-3"
        >
          <enhanced:img
            class="size-8 object-contain"
            alt="Total level"
            src={"/icons/skills/Overall_detail.png"}
          />

          <div>
            <p class="text-xs text-white/50">Total level</p>
            <p class="text-xl font-bold text-gold">
              {getTotalLevel(data.playerHiscore).toLocaleString()}
            </p>
          </div>
        </div>

        <div
          class="flex items-center gap-3 rounded-md
                 border border-gold/10 bg-grayish px-4 py-3"
        >
          <enhanced:img
            class="size-8 object-contain"
            alt="RuneScore"
            src={"/icons/misc/RuneScore.png"}
          />

          <div>
            <p class="text-xs text-white/50">RuneScore</p>
            <p class="text-xl font-bold text-gold">
              {getRunescore(data.playerHiscore).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main dashboard -->
  <div
    class="grid min-h-0 flex-1 gap-4
           lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
  >
    <!-- Left column -->
    <div class="flex min-h-0 min-w-0 flex-col gap-4">
      <!-- Skills panel -->
      <section
        class="flex min-h-0 flex-col overflow-hidden rounded-md
               border border-gold/20 bg-dark/70 lg:flex-1"
      >
        <div
          class="flex shrink-0 items-center justify-between
                 border-b border-gold/20 px-4 py-3"
        >
          <h2 class="text-lg font-semibold text-gold">Skills</h2>

          <span class="text-xs text-white/40">
            {getMaxedSkills(data.playerHiscore)} / {data.playerHiscore.skills
              .length - 1} skills at 99
            <!-- {data.playerHiscore.skills.length - 1} Skills -->
          </span>
        </div>

        <div
          class="max-h-[28rem] min-h-0 overflow-y-auto
                 scrollbar-modern p-4 lg:max-h-none lg:flex-1"
        >
          <SkillsTab skills={data.playerHiscore.skills} />
        </div>
      </section>

      <!-- Quests panel -->
      <section
        class="flex min-h-0 flex-col overflow-hidden rounded-md
       border border-gold/20 bg-dark/70 lg:flex-1"
      >
        <!-- Header stays visible -->
        <div
          class="flex shrink-0 items-center justify-between
         border-b border-gold/20 px-4 py-3"
        >
          <h2 class="text-lg font-semibold text-gold">Quests</h2>

          {#await data.playerQuests}
            <span class="text-xs text-white/40">Loading...</span>
          {:then playerQuests}
            {#if playerQuests?.name}
              <span class="text-xs text-white/40">
                {getCompletedQuestsCount(playerQuests)}
                /
                {Object.values(playerQuests.quests).length}
                Completed
              </span>
            {/if}
          {/await}
        </div>

        {#await data.playerQuests}
          <!-- Loading state -->
          <div class="flex min-h-0 flex-1 items-center justify-center p-6">
            <div
              class="size-8 animate-spin rounded-full
             border-4 border-gold/20 border-t-gold"
            ></div>
          </div>
        {:then playerQuests}
          {#if playerQuests?.name}
            <!-- Scrollable quest list -->
            <div
              class="max-h-[28rem] min-h-0 space-y-2
             overflow-y-auto scrollbar-modern
             p-4 lg:max-h-none lg:flex-1"
            >
              {#each Object.entries(playerQuests.quests) as [id, quest]}
                <div
                  class="flex items-center gap-3 rounded-md
                 border border-gold/10 bg-grayish/70
                 px-3 py-2 transition-colors
                 hover:border-gold/30"
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

            <!-- Quest statistics footer -->
            <div
              class="shrink-0 border-t border-gold/20
             bg-grayish/40 px-4 py-3"
            >
              <div class="mb-3 flex items-center justify-between">
                <span class="text-xs text-white/50"> Quest completion </span>

                <span class="text-xs font-medium text-gold">
                  {getQuestsCompletedPct(playerQuests)}%
                </span>
              </div>

              <!-- Completion progress -->
              <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  class="h-full rounded-full bg-gold transition-all"
                  style:width={`${getQuestsCompletedPct(playerQuests)}%`}
                ></div>
              </div>

              <div class="mt-3 flex justify-between">
                <span class="text-xs text-white/50"> Quest points </span>

                <span class="text-xs font-semibold text-gold">
                  {playerQuests.qp} / {playerQuests.qp_max}
                </span>
              </div>
            </div>
          {:else}
            <div class="flex flex-1 items-center justify-center p-6">
              <p class="text-sm text-white/50">No quest data available</p>
            </div>
          {/if}
        {:catch err}
          <div class="flex flex-1 items-center justify-center p-6">
            <p class="text-sm text-red-500">Failed to load quests</p>
          </div>
        {/await}
      </section>
    </div>

    <!-- Right column: Events -->
    <section
      class="flex min-h-0 min-w-0 flex-col overflow-hidden
         rounded-md border border-gold/20 bg-dark/70"
    >
      <!-- Header -->
      <div
        class="flex shrink-0 items-center justify-between
           border-b border-gold/20 px-4 py-3"
      >
        <h2 class="text-lg font-semibold text-gold">Recent Activity</h2>

        {#await data.playerEvents}
          <span class="text-xs text-white/40">Loading...</span>
        {:then playerEvents}
          {#if playerEvents}
            <span class="text-xs text-white/40">
              {playerEvents.events.length} Events
            </span>
          {/if}
        {/await}
      </div>

      <!-- Events content -->
      {#await data.playerEvents}
        <!-- Loading state -->
        <div class="flex min-h-0 flex-1 items-center justify-center p-6">
          <div
            class="size-8 animate-spin rounded-full
               border-4 border-gold/20 border-t-gold"
          ></div>
        </div>
      {:then playerEvents}
        {#if playerEvents}
          <!-- Scrollable events -->
          <div
            class="max-h-[38rem] min-h-0 space-y-3
               overflow-y-auto scrollbar-modern
               p-4 lg:max-h-none lg:flex-1"
          >
            {#each playerEvents.events as event}
              <div
                class="rounded-md border border-gold/10 bg-grayish/70
                   p-4 transition-colors hover:border-gold/30"
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

            {#if playerEvents.events.length === 0}
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
      {:catch err}
        <div class="flex min-h-0 flex-1 items-center justify-center p-6">
          <p class="text-sm text-red-500">Failed to load activity</p>
        </div>
      {/await}
    </section>
  </div>
</div>
