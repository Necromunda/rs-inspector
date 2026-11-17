import {
  readLocalStorage,
  writeLocalStorage
} from "#lib/client/localStorage.ts";

const BOOKMARKS_KEY = "bookmarks";
const HISTORY_KEY = "searchHistory";

function readNames(key: string): string[] {
  return readLocalStorage<string[]>(key) ?? [];
}

export function isPlayerBookmarked(username: string): boolean {
  return readNames(BOOKMARKS_KEY).includes(username);
}

// Returns the new bookmark state for the calling component.
export function togglePlayerBookmark(username: string): boolean {
  const bookmarks = readNames(BOOKMARKS_KEY);
  const bookmarked = bookmarks.includes(username);
  const updated = bookmarked
    ? bookmarks.filter((name) => name !== username)
    : [...bookmarks, username];

  writeLocalStorage(BOOKMARKS_KEY, updated);
  return !bookmarked;
}

// Keep each name once, with the most recently visited player at the end.
export function recordPlayerSearch(username: string): void {
  const history = readNames(HISTORY_KEY);
  if (history.at(-1) === username) return;

  const updated = [
    ...history.filter((name) => name !== username),
    username
  ];
  writeLocalStorage(HISTORY_KEY, updated);
}
