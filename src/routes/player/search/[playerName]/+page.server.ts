import type { PageServerLoad } from "./$types";
import { RsPlatformApi } from "#lib/server/rsApi.ts";
import { HiscoreInstances } from "#lib/shared.ts";

function streamed<T>(promise: Promise<T>): Promise<T> {
  // Log errors without converting them into null
  void promise.catch((err) => {
    console.error("Streamed API request failed:", err);
  });

  return promise;
}

export const load: PageServerLoad = ({ params, fetch }) => {
  const api = new RsPlatformApi(
    "RsInspector/1.0 (contact: jr2000@windowslive.com)",
    fetch
  );

  const username = params.playerName;

  const hiscore = (instance: HiscoreInstances) =>
    streamed(api.getPlayerHiscore(username, instance));

  return {
    searchedUsername: username,

    playerEvents: streamed(api.getPlayerEvents(username)),
    playerQuests: streamed(api.getPlayerQuests(username)),

    hiscoreRs3: hiscore(HiscoreInstances.Rs3),
    hiscoreRs3Ironman: hiscore(HiscoreInstances.Rs3Ironman),
    hiscoreRs3HardcoreIronman: hiscore(HiscoreInstances.Rs3HardcoreIronman),
    // hiscoreRs3Leagues: hiscore(HiscoreInstances.Rs3Leagues),
    playerHiscoreOsrs: hiscore(HiscoreInstances.Osrs),
  };
};
