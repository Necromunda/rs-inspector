import { writeFile, readFile, mkdir, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

import { HiscoreInstances } from "#lib/shared.ts";

export const PLAYER_EVENTS_PATH = "./cache/playerEvents/";
export const PLAYER_QUESTS_PATH = "./cache/playerQuests/";
export const PLAYER_RS3_HISCORE_PATH = "./cache/playerHiscore/rs3/hiscore/";
export const PLAYER_RS3_HISCORE_IRONMAN_PATH =
  "./cache/playerHiscore/rs3/ironman/";
export const PLAYER_RS3_HISCORE_HARDCORE_IRONMAN_PATH =
  "./cache/playerHiscore/rs3/hardcoreIronman/";
export const PLAYER_RS3_HISCORE_LEAGUES_PATH =
  "./cache/playerHiscore/rs3/leagues/";
export const PLAYER_OSRS_HISCORE_PATH = "./cache/playerHiscore/osrs/";

function _normalizeName(playerName: string): string {
  // return playerName.toLowerCase().trim().replace(" ", "_");
  return playerName.trim();
}

// function _getNameHash(playerName: string) {
//   return createHash("sha256").update(_normalizeName(playerName)).digest("hex");
// }

export function getPlayerHiscoreCachePath(instance: HiscoreInstances) {
  switch (instance) {
    case HiscoreInstances.Rs3:
      return PLAYER_RS3_HISCORE_PATH;
    case HiscoreInstances.Rs3Ironman:
      return PLAYER_RS3_HISCORE_IRONMAN_PATH;
    case HiscoreInstances.Rs3HardcoreIronman:
      return PLAYER_RS3_HISCORE_HARDCORE_IRONMAN_PATH;
    case HiscoreInstances.Rs3Leagues:
      return PLAYER_RS3_HISCORE_LEAGUES_PATH;
    case HiscoreInstances.Osrs:
      return PLAYER_OSRS_HISCORE_PATH;
    default:
      throw Error("Not implemented");
  }
}

export type CacheEntry<T> =
  | {
      status: 200;
      data: T;
      expiresAt: number;
    }
  | {
      status: 404;
      expiresAt: number;
    };

function getCacheFilename(path: string, playerName: string): string {
  const normalized = playerName.trim().toLowerCase();

  const hash = createHash("sha256").update(normalized).digest("hex");

  return join(path, `${hash}.json`);
}

export async function readCache<T>(
  path: string,
  playerName: string
): Promise<CacheEntry<T> | undefined> {
  const filename = getCacheFilename(path, playerName);

  try {
    const entry = JSON.parse(
      await readFile(filename, "utf-8")
    ) as CacheEntry<T>;

    if (
      !entry ||
      (entry.status !== 200 && entry.status !== 404) ||
      typeof entry.expiresAt !== "number" ||
      (entry.status === 200 && !("data" in entry))
    ) {
      return undefined;
    }

    if (Date.now() >= entry.expiresAt) {
      await rm(filename, { force: true });
      return undefined;
    }

    return entry;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Cache read failed:", err);
    }

    return undefined;
  }
}

export async function writeCache<T>(
  path: string,
  playerName: string,
  entry: CacheEntry<T>
): Promise<void> {
  try {
    await mkdir(path, { recursive: true });

    const filename = getCacheFilename(path, playerName);

    await writeFile(filename, JSON.stringify(entry), "utf-8");
  } catch (err) {
    console.error("Cache write failed:", err);
  }
}
