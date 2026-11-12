import { browser } from "$app/env";

export function writeLocalStorage<T>(key: string, value: T) {
  if (!browser) return;

  localStorage.setItem(key, JSON.stringify(value));
}

export function readLocalStorage<T>(key: string) {
  if (!browser) return null;

  const data = localStorage.getItem(key);

  if (!!!data) return null;

  return <T>JSON.parse(data);
}
