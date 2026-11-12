<script lang="ts">
  import {
    readLocalStorage,
    writeLocalStorage,
  } from "#lib/client/localStorage.ts";
  import { goto } from "$app/navigation";

  let playerName = $state("");

  function getSearchHistory(count: number) {
    const searchHistory =
      readLocalStorage<Array<string>>("searchHistory") || [];
    const start = Math.max(searchHistory.length - 1 - count, 0);
    return searchHistory.slice(start).reverse();
  }

  function getBookmarks(count: number) {
    const bookmarks = readLocalStorage<Array<string>>("bookmarks") || [];
    const start = Math.max(bookmarks.length - 1 - count, 0);
    return bookmarks.slice(start).reverse();
  }

  function searchPlayer(event: SubmitEvent) {
    event.preventDefault();

    const name = playerName.trim();
    if (!name) return;

    // const searchHistory = getSearchHistory();

    // writeLocalStorage<Array<string>>("searchHistory", [...searchHistory, name]);

    goto(`/player/search/${encodeURIComponent(name)}`);
  }
</script>

<div class="flex flex-col items-center justify-center h-[95vh] space-y-2">
  <form onsubmit={searchPlayer} class="flex items-center gap-2 w-[50vh]">
    <input
      required
      type="text"
      maxlength="12"
      placeholder="Search players..."
      class="min-w-0 flex-1 rounded-md border border-gold
        px-4 py-2 outline-none focus:border-gray-800"
      bind:value={playerName}
    />

    <button
      type="submit"
      class="rounded-md bg-gold px-4 py-2
        hover:bg-yellow-600 font-bold"
    >
      Search
    </button>
  </form>
  <div class="grid grid-cols-2 w-[50vh] text-center text-gold">
    <div class="flex flex-col">
      <h1 class="font-bold border-b-2">History</h1>
      {#each getSearchHistory(5) as searchedPlayer}
        <a
          class="hover:font-bold"
          href={`/player/search/${encodeURIComponent(searchedPlayer)}`}
          >{searchedPlayer}</a
        >
      {/each}
    </div>
    <div class="flex flex-col">
      <h1 class="font-bold border-b-2">Bookmarks</h1>
      {#each getBookmarks(5) as bookmark}
        <a
          class="hover:font-bold"
          href={`/player/search/${encodeURIComponent(bookmark)}`}
          >{bookmark}</a
        >
      {/each}
    </div>
  </div>
</div>
