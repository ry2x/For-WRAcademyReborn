import config from '@/constants/config.js';
import { LANES } from '@/constants/game.js';
import {
  CACHE_KEYS,
  getCachedData,
  setCachedData,
} from '@/services/cache/cacheService.js';
import type { Champion, Champions } from '@/types/champs.js';
import type { Lane, LaneKey, PositionSet } from '@/types/game.js';
import logger from '@/utils/logger.js';
import axios, { type AxiosResponse } from 'axios';

// Champion data will be cached instead of using a global variable
/**
 * Gets cached champion data
 * @returns Champion data from cache or empty array if not found
 */
function getChampionData(): Champions {
  return getCachedData<Champions>(CACHE_KEYS.CHAMPION_DATA) || [];
}

/**
 * Fetches champion data from the API and updates the cache
 * @throws Error if API request fails
 */
export async function fetchChampionData(): Promise<void> {
  try {
    const res: AxiosResponse<Champions> = await axios.get(
      config.urlChampions.replace(
        '{{locale}}',
        process.env.DEFAULT_LOCALE ?? 'en_US',
      ),
    );
    setCachedData(CACHE_KEYS.CHAMPION_DATA, res.data);
    logger.info(
      'Champion data updated successfully:',
      process.env.DEFAULT_LOCALE ?? 'en_US',
    );
  } catch (error) {
    logger.error('Failed to fetch champion data:', error);
    throw error;
  }
}

/**
 * Finds a champion by name (case-insensitive)
 * @param name - Name of the champion to find
 * @returns The champion if found, undefined otherwise
 */
export function getChampionByName(name: string): Champion | undefined {
  const champions = getChampionData();
  return champions.find((champ: Champion) =>
    champ.name.toLowerCase().includes(name.toLowerCase()),
  );
}

/**
 * Finds a champion by ID (case-insensitive)
 * @param id - ID of the champion to find
 * @returns The champion if found, undefined otherwise
 */
export function getChampById(id: string): Champion | undefined {
  const champions = getChampionData();
  return champions.find(
    (champ: Champion) => champ.id.toLowerCase() === id.toLowerCase(),
  );
}

/**
 * Finds a champion by HeroID
 * @param heroId - hero_id of the champion to find
 * @returns The champion if found, undefined otherwise
 */
export function getChampByHeroId(heroId: number): Champion | undefined {
  const champions = getChampionData();
  return champions.find(
    (champ: Champion) => champ.hero_id.toString() === heroId.toString(),
  );
}

/**
 * Gets an array of all champion names
 * @returns Array of champion names
 */
export function getChampionNames(): string[] {
  const champions = getChampionData();
  return champions.map((champ: Champion) => champ.name);
}

/**
 * Gets an array of all champion IDs
 * @returns Array of champion IDs
 */
export function getChampionIds(): string[] {
  const champions = getChampionData();
  return champions.map((champ: Champion) => champ.id);
}

/**
 * Gets all champions that can be played in a specific lane
 * @param lane - The lane to filter champions by
 * @returns Array of champions that can be played in the specified lane
 */
export function getChampionsByLane(lane: LaneKey): Champion[] {
  const champions = getChampionData();
  if (lane === LANES.all.value) {
    return champions;
  }

  return champions.filter((champ) => champ.lanes.includes(lane));
}

/**
 * Gets all lanes that a champion can be played in
 * @param champ - The champion to get lanes for
 * @returns Array of lane configurations that the champion can be played in
 */
export function getChampionLanes(
  champ: Champion,
): (PositionSet<LaneKey> & { apiParam: Lane })[] {
  return champ.lanes.map((lane) => ({
    ...LANES[lane],
  }));
}
