import {
  readCache,
  writeCache,
  PLAYER_EVENTS_PATH,
  PLAYER_QUESTS_PATH,
  getPlayerHiscoreCachePath,
} from "#lib/server/cache.ts";
import type { HiscoreInstances } from "#lib/shared.ts";
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

    const body = await response.text();

    if (!response.ok) {
      let message = response.statusText || "API request failed";

      try {
        const data = JSON.parse(body) as ApiErrorResponse;
        message = data?.error ?? message;
      } catch {
        // Error response wasn't JSON
      }

      throw new ApiError(message, response.status);
    }

    try {
      return JSON.parse(body) as T;
    } catch {
      console.error("Unexpected API response:", {
        url: url.toString(),
        finalUrl: response.url,
        status: response.status,
        contentType: response.headers.get("content-type"),
        preview: body.slice(0, 200),
      });

      throw new ApiError(
        "RuneScape API returned an invalid JSON response",
        502
      );
    }
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

  private async getCached<T>(
    cachePath: string,
    username: string,
    endpoint: string,
    validate?: (value: T) => boolean
  ): Promise<T | null> {
    const cached = await readCache<T>(cachePath, username);

    if (cached) {
      if (cached.status === 404) {
        return null;
      }

      if (!validate || validate(cached.data)) {
        return cached.data;
      }
    }

    try {
      const data = await this.get<T>(endpoint);

      if (validate && !validate(data)) {
        throw new Error("Unexpected API response format");
      }

      // Cache successful requests for 15 minutes
      await writeCache<T>(cachePath, username, {
        status: 200,
        data,
        expiresAt: Date.now() + 15 * 60_000,
      });

      return data;
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        // Cache 404 for 2 minutes
        await writeCache<T>(cachePath, username, {
          status: 404,
          expiresAt: Date.now() + 2 * 60_000,
        });

        return null;
      }

      // Never cache other errors
      throw err;
    }
  }

  async getPlayerEvents(username: string): Promise<PlayerEvents | null> {
    return this.getCached<PlayerEvents>(
      PLAYER_EVENTS_PATH,
      username,
      `/m=adventurers-log/api/v1/playerEvents/${encodeURIComponent(username)}`,
      (value) => typeof value?.name === "string" && Array.isArray(value.events)
    );
  }

  async getPlayerHiscore(
    username: string,
    instance: HiscoreInstances
  ): Promise<PlayerHiscore | null> {
    return this.getCached<PlayerHiscore>(
      getPlayerHiscoreCachePath(instance),
      username,
      `/m=${instance}/index_lite.json?player=${encodeURIComponent(username)}`,
      (value) =>
        Array.isArray(value?.skills) &&
        value.skills.length > 0 &&
        Array.isArray(value.activities)
    );
  }

  async getPlayerQuests(username: string): Promise<PlayerQuests | null> {
    return this.getCached<PlayerQuests>(
      PLAYER_QUESTS_PATH,
      username,
      `/m=adventurers-log/api/v1/playerQuests/${encodeURIComponent(username)}`,
      (value) =>
        typeof value?.name === "string" &&
        value.quests !== null &&
        typeof value.quests === "object" &&
        !Array.isArray(value.quests)
    );
  }
}
