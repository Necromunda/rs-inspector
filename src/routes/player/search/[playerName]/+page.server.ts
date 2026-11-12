// import type { PageServerLoad } from "./$types";
// import { ApiError, RsPlatformApi } from "#lib/server/rsApi.ts";
// import { error } from "@sveltejs/kit";
// import type {
//   PlayerEvents,
//   PlayerHiscore,
//   PlayerQuests,
// } from "#lib/server/rsApi.ts";

// export const load: PageServerLoad = async ({ params }) => {
//   const api = new RsPlatformApi(
//     "RsInspector/1.0 (contact: jr2000@windowslive.com)",
//     fetch
//   );

//   let playerEvents = <PlayerEvents>{};
//   try {
//     playerEvents = await api.getPlayerEvents(params.playerName);
//   } catch (err) {
//     if (err instanceof ApiError) {
//       error(err.status, err.message);
//     }
//   }

//   let playerHiscore = <PlayerHiscore>{};
//   try {
//     playerHiscore = await api.getPlayerHiscore(params.playerName);
//   } catch (err) {
//     if (err instanceof ApiError) {
//       error(err.status, err.message);
//     }
//   }

//   let playerQuests = <PlayerQuests>{};
//   try {
//     playerQuests = await api.getPlayerQuests(params.playerName);
//   } catch (err) {
//     if (err instanceof ApiError) {
//       error(err.status, err.message);
//     }
//   }

//   // const playerQuests: Promise<PlayerQuests> = api
//   //   .getPlayerQuests(params.playerName)
//   //   .catch((err) => {
//   //     error(err.status, err.message);
//   //     // return <PlayerQuests>{};
//   //   });

//   return { playerEvents, playerHiscore, playerQuests };
// };

import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { RsPlatformApi, ApiError } from "#lib/server/rsApi.ts";

export const load: PageServerLoad = async ({ params, fetch }) => {
  const api = new RsPlatformApi(
    "RsInspector/1.0 (contact: jr2000@windowslive.com)",
    fetch
  );

  const username = params.playerName;

  // Start loading Events and Quests immediately
  const playerEvents = api.getPlayerEvents(username).catch((err) => {
    console.error("Failed to load player events:", err);
    return null;
  });

  const playerQuests = api.getPlayerQuests(username).catch((err) => {
    console.error("Failed to load player quests:", err);
    return null;
  });

  // Wait for Hiscore before rendering the page
  let playerHiscore;

  try {
    playerHiscore = await api.getPlayerHiscore(username);
  } catch (err) {
    if (err instanceof ApiError) {
      error(err.status, err.message);
    }

    throw err;
  }

  return {
    username,
    playerHiscore,
    playerEvents,
    playerQuests,
  };
};
