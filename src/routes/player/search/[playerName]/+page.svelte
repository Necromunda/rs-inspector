<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import type { PageProps } from "./$types";
  import PlayerHeader from "../../../../components/player/PlayerHeader.svelte";
  import SkillsPanel from "../../../../components/player/SkillsPanel.svelte";
  import QuestsPanel from "../../../../components/player/QuestsPanel.svelte";
  import EventsPanel from "../../../../components/player/EventsPanel.svelte";
  import { getRs3GameMode } from "#lib/utils/gameMode.ts";
  import {
    isPlayerBookmarked,
    recordPlayerSearch,
    togglePlayerBookmark,
  } from "#lib/client/playerStorage.ts";

  let { data }: PageProps = $props();

  let canonicalUsername = $state<string | null>(null);
  let isBookmarked = $state(false);

  // Recomputes when the route data changes; still a Promise for the UI to await.
  let gameMode = $derived(
    Promise.all([
      data.hiscoreRs3,
      data.hiscoreRs3Ironman,
      data.hiscoreRs3HardcoreIronman,
    ]).then(([rs3, ironman, hardcore]) =>
      getRs3GameMode(rs3, ironman, hardcore)
    )
  );

  // // Runs after initial client navigation and when moving between player pages.
  // afterNavigate(() => {
  //   const username = data.searchedUsername;
  //   recordPlayerSearch(username);
  //   isBookmarked = isPlayerBookmarked(username);
  // });

  $effect(() => {
    const questsPromise = data.playerQuests;
    const searchedUsername = data.searchedUsername;
    let cancelled = false;

    canonicalUsername = null;
    isBookmarked = false;

    questsPromise
      .then((quests) => quests?.name || searchedUsername)
      .catch(() => searchedUsername)
      .then((username) => {
        if (cancelled) return;

        canonicalUsername = username;
        isBookmarked = isPlayerBookmarked(username);
        recordPlayerSearch(username);
      });

    return () => {
      cancelled = true;
    };
  });

  function toggleBookmark() {
    if (!canonicalUsername) return;

    isBookmarked = togglePlayerBookmark(canonicalUsername);
  }
</script>

<div class="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 lg:h-[95dvh]">
  <PlayerHeader
    username={canonicalUsername ?? data.searchedUsername}
    quests={data.playerQuests}
    hiscore={data.hiscoreRs3}
    {gameMode}
    {isBookmarked}
    onBookmarkToggle={toggleBookmark}
  />

  <div
    class="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
  >
    <div class="flex min-h-0 min-w-0 flex-col gap-4">
      <SkillsPanel hiscore={data.hiscoreRs3} />
      <QuestsPanel quests={data.playerQuests} />
    </div>

    <EventsPanel events={data.playerEvents} />
  </div>
</div>
