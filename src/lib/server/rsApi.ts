import {
  readCache,
  writeCache,
  PLAYER_EVENTS_PATH,
  PLAYER_HISCORE_PATH,
  PLAYER_QUESTS_PATH,
} from "#lib/server/cache.ts";
import { error } from "@sveltejs/kit";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiErrorResponse {
  error: string;
}

interface ActivityEvent {
  date: string;
  details: string;
  text: string;
  type: string;
}

export interface PlayerEvents {
  name: string;
  events: ActivityEvent[];
}

interface PlayerHiscoreDeath {
  timeStamp: number;
  worldID: string;
  location: number;
  npcKiller: number;
  playerKiller: number;
  deathReason: number;
  language: string;
  locationDescription: string;
  deathDescription: string;
}

export interface PlayerHiscoreSkill {
  id: number;
  name: string;
  rank: number;
  level: number;
  xp: number;
  death?: PlayerHiscoreDeath;
}

interface PlayerHiscoreActivity {
  id: number;
  name: string;
  rank: number;
  score: number;
}

export interface PlayerHiscore {
  name: string;
  skills: PlayerHiscoreSkill[];
  activities: PlayerHiscoreActivity[];
}

interface GameQuest {
  title: string;
  difficulty: number;
  members: boolean;
  qp: number;
  eligible: boolean;
  status: string;
}

export interface PlayerQuests {
  name: string;
  qp: number;
  qp_max: number;
  quests: Record<string, GameQuest>;
}

export class RsPlatformApi {
  private readonly baseUrl = "https://secure.runescape.com";
  private readonly userAgent: string;
  private readonly fetcher: typeof fetch;

  constructor(userAgent: string, fetcher: typeof fetch = fetch) {
    this.userAgent = userAgent;
    this.fetcher = fetcher;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);

    const headers = new Headers(options.headers);
    headers.set("User-Agent", this.userAgent);
    headers.set("Accept", "application/json");

    const response = await this.fetcher(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let message = response.statusText || "API request failed";

      try {
        const data = (await response.json()) as ApiErrorResponse;
        message = data?.error ?? message;
      } catch {
        // Response wasn't valid JSON
      }

      console.log(message);

      throw new ApiError(message, response.status);
      // throw new Error(
      //   // `API request failed: ${response.status} ${response.statusText}`
      //   error
      // );
    }

    return (await response.json()) as T;
  }

  // Generic request methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async getPlayerEvents(username: string): Promise<PlayerEvents> {
    const cachedData = await readCache<PlayerEvents>(
      PLAYER_EVENTS_PATH,
      username
    );

    if (!!!cachedData) {
      console.log("Return playerEvents from API");
      try {
        const data = this.get<PlayerEvents>(
          `/m=adventurers-log/api/v1/playerEvents/${encodeURIComponent(
            username
          )}`
        );

        await writeCache<PlayerEvents>(
          PLAYER_EVENTS_PATH,
          username,
          await data
        );

        return data;
      } catch (error) {
        await writeCache<PlayerEvents>(
          PLAYER_EVENTS_PATH,
          username,
          <PlayerEvents>{}
        );

        throw error;
        // return <PlayerEvents>{};
      }
    } else {
      console.log("Return cached playerEvents");

      return cachedData;
    }
  }

  async getPlayerHiscore(username: string, instance: string = "hiscore") {
    const cachedData = await readCache<PlayerHiscore>(
      PLAYER_HISCORE_PATH,
      username
    );

    if (!!!cachedData) {
      console.log("Return playerHiscore from API");
      try {
        const data = this.get<PlayerHiscore>(
          `/m=${instance}/index_lite.json?player=${encodeURIComponent(
            username
          )}`
        );
        console.log(await data);

        await writeCache<PlayerHiscore>(
          PLAYER_HISCORE_PATH,
          username,
          await data
        );

        return data;
      } catch (error) {
        await writeCache<PlayerHiscore>(
          PLAYER_HISCORE_PATH,
          username,
          <PlayerHiscore>{}
        );

        throw error;
        // return <PlayerHiscore>{};
      }
    } else {
      console.log("Return cached playerHiscore");

      return cachedData;
    }
  }

  async getPlayerQuests(username: string) {
    const cachedData = await readCache<PlayerQuests>(
      PLAYER_QUESTS_PATH,
      username
    );

    if (!!!cachedData) {
      console.log("Return playerQuests from API");
      try {
        const data = this.get<PlayerQuests>(
          `/m=adventurers-log/api/v1/playerQuests/${encodeURIComponent(
            username
          )}`
        );
        await writeCache<PlayerQuests>(
          PLAYER_QUESTS_PATH,
          username,
          await data
        );

        return data;
      } catch (error) {
        await writeCache<PlayerQuests>(
          PLAYER_QUESTS_PATH,
          username,
          <PlayerQuests>{}
        );

        throw error;
        // return <PlayerQuests>{};
      }
    } else {
      console.log("Return cached playerQuests");

      return cachedData;
    }
  }
}
