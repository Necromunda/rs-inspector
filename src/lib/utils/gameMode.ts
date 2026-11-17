import type { PlayerHiscore } from "#lib/server/rsApi.ts";

export type Rs3GameMode =
  | "Regular"
  | "Ironman"
  | "Hardcore Ironman"
  | "Former Hardcore Ironman"
  | "Unknown";

// A best-effort inference from public Hiscore data, not authoritative
// account-status information. Historical Hardcore entries may remain.
export function getRs3GameMode(
  rs3: PlayerHiscore | null,
  ironman: PlayerHiscore | null,
  hardcore: PlayerHiscore | null
): Rs3GameMode {
  if (hardcore) {
    const overall = hardcore.skills.find(
      (skill) => skill.name.toLowerCase() === "overall"
    );

    if (overall?.death) {
      return ironman ? "Ironman" : "Former Hardcore Ironman";
    }

    const currentXp = rs3?.skills.find(
      (skill) => skill.name.toLowerCase() === "overall"
    )?.xp;

    if (
      currentXp !== undefined &&
      overall?.xp !== undefined &&
      currentXp !== overall.xp
    ) {
      return ironman ? "Ironman" : "Former Hardcore Ironman";
    }

    return "Hardcore Ironman";
  }

  if (ironman) return "Ironman";
  if (rs3) return "Regular";
  return "Unknown";
}
