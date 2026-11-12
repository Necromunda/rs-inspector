import type { PageServerLoad, Actions } from "./$types";

// import { read, writeCachedPlayer } from "#lib/server/cache.ts";
import { RsPlatformApi } from "#lib/server/rsApi.ts";

export const load: PageServerLoad = async ({ fetch }) => {
  // const api = new RsPlatformApi(
  //   "RsInspector/1.0 (contact: jr2000@windowslive.com)",
  //   fetch
  // );
  // // writeCachedPlayer("puuma997", {})
  // const data = await readCachedPlayer("Im_Jumala", 15 * 1000);
  // if (!!!data) {
  //   console.log("No data, fetching from api");
  //   try {
  //     const response = await api.getPlayerEvents("Im_Jumala");
  //     await writeCachedPlayer("Im_Jumala", response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // } else {
  //   console.log("Found data");
  // }
};

export const actions: Actions = {
  // getPlayerData: async ({ request, fetch }) => {
  //   const api = new RsPlatformApi(
  //     "RsInspector/1.0 (contact: jr2000@windowslive.com)",
  //     fetch
  //   );

  //   // writeCachedPlayer("puuma997", {})
  //   const data = await readCachedPlayer("Im_Jumala", 15 * 60 * 1000);
  //   if (!!!data) {
  //     console.log("No data, fetching from api");
  //     try {
  //       const response = await api.getPlayerEvents("Im_Jumala");
  //       await writeCachedPlayer("Im_Jumala", response);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     console.log("Found data");
  //   }
  // },
};
