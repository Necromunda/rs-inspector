import { writeFile, readFile, readdir, rm } from "node:fs/promises";
import { createHash } from "node:crypto";

export const PLAYER_EVENTS_PATH = "./cache/playerEvents/";
export const PLAYER_HISCORE_PATH = "./cache/playerHiscore/";
export const PLAYER_QUESTS_PATH = "./cache/playerQuests/";

function _normalizeName(playerName: string): string {
  // return playerName.toLowerCase().trim().replace(" ", "_");
  return playerName.trim();
}

function _getNameHash(playerName: string) {
  return createHash("sha256").update(_normalizeName(playerName)).digest("hex");
}

export async function readCache<T>(
  path: string,
  playerName: string,
  maxLifeMs: number = 15 * 60 * 1000
) {
  try {
    const hash = _getNameHash(playerName);
    const files = await readdir(path);
    for (const file of files) {
      // if (file.startsWith(playerName.toLowerCase().trim())) {
      if (file.startsWith(hash)) {
        const parts = file.replace(".json", "").split("_");
        const now = Date.now();
        const cachedTime = Number(parts[1]);
        if (now - cachedTime > maxLifeMs) {
          console.log("Cache is stale");
          rm(`${path}${file}`);
          return;
        } else {
          console.log("Cache hit");
          const data = JSON.parse(await readFile(`${path}${file}`, "utf-8"));
          return <T>data;
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export async function writeCache<T>(path: string, playerName: string, data: T) {
  console.log("Writing cache");
  
  try {
    // const safeName = encodeURIComponent(playerName);
    const hash = _getNameHash(playerName);
    const filename = `${hash}_${Date.now()}.json`;
    await writeFile(
      `${path}${filename}`,
      JSON.stringify(data, null, 0),
      "utf-8"
    );
  } catch (err) {
    console.error(err);
  }
}
