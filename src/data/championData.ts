import config from '@/constants/config.js';
import { LANES } from '@/constants/game.js';
import type { Champion, Champions } from '@/types/champs.js';
import type { Lane, LaneKey, PositionSet } from '@/types/game.js';
import logger from '@/utils/logger.js';
import axios, { type AxiosResponse } from 'axios';

// Cache for champion data
let champions: Champions = {};

/**
 * Fetches champion data from the API and updates the local cache
 * @throws Error if API request fails
 */
export async function fetchChampionData(): Promise<void> {
  try {
    const res: AxiosResponse<Champions> = await axios.get(config.urlChampions);
    champions = res.data;
    logger.info('Champion data updated successfully');
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
  return Object.values(champions).find((champ: Champion) =>
    champ.name.toLowerCase().includes(name.toLowerCase()),
  );
}

/**
 * Finds a champion by ID (case-insensitive)
 * @param id - ID of the champion to find
 * @returns The champion if found, undefined otherwise
 */
export function getChampById(id: string): Champion | undefined {
  return Object.values(champions).find((champ: Champion) =>
    champ.id.toLowerCase().includes(id.toLowerCase()),
  );
}

/**
 * Finds a champion by HeroID
 * @param heroId - hero_id of the champion to find
 * @returns The champion if found, undefined otherwise
 */
export function getChampByHeroId(heroId: number): Champion | undefined {
  return Object.values(champions).find(
    (champ: Champion) => champ.hero_id.toString() === heroId.toString(),
  );
}

/**
 * Gets an array of all champion names
 * @returns Array of champion names
 */
export function getChampionNames(): string[] {
  return Object.values(champions).map((champ: Champion) => champ.name);
}

/**
 * Gets an array of all champion IDs
 * @returns Array of champion IDs
 */
export function getChampionIds(): string[] {
  return Object.values(champions).map((champ: Champion) => champ.id);
}

/**
 * Gets all champions that can be played in a specific lane
 * @param lane - The lane to filter champions by
 * @returns Array of champions that can be played in the specified lane
 */
export function getChampionsByLane(lane: keyof typeof LANES): Champion[] {
  if (lane === LANES.all.value) {
    return Object.values(champions);
  }

  const laneKey = `is_${lane}` as keyof Champion;
  return Object.values(champions).filter((champ) => champ[laneKey] === true);
}

/**
 * Gets the emoji for a specific lane
 * @param lane - The lane to get the emoji for
 * @returns The emoji string for the lane
 */
export function getLaneEmoji(lane: string): string {
  return LANES[lane as keyof typeof LANES]?.emoji ?? '';
}

/**
 * Gets all lanes that a champion can be played in
 * @param champ - The champion to get lanes for
 * @returns Array of lane configurations that the champion can be played in
 */
export function getChampionLanes(champ: Champion): (typeof LANES)[keyof typeof LANES][] {
  return Object.entries(LANES)
    .filter(([key]) => {
      const laneKey = `is_${key}` as keyof Champion;
      return champ[laneKey] === true;
    })
    .map(([key]) => LANES[key as keyof typeof LANES]);
}

/**
 * Gets an array of PositionSet corresponding to the LaneKey
 * @param laneKey - The key of the lane to get
 * @returns Array of PositionSet
 */
export function getLanePositionSets(
  laneKey: LaneKey,
): (PositionSet<LaneKey> & { apiParam: Lane })[] {
  if (laneKey === 'all') {
    return Object.values(LANES);
  }
  return [LANES[laneKey]];
}
