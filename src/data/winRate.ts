import config from '@/config.js';
import logger from '@/logger.js';
import { LANES, RANK_RANGES } from '@/types/common.js';
import { type HeroStats, type WinRates } from '@/types/winRate.js';
import axios, { type AxiosResponse } from 'axios';

// Constants
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Cache for win rate data
let WinRates: WinRates = {
  result: 0,
  data: {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
  },
};

/**
 * Fetches win rate data from the API and updates the local cache
 * @throws Error if API request fails
 */
export async function fetchWinRateData(): Promise<void> {
  try {
    const res: AxiosResponse<WinRates> = await axios.get(config.urlWinRate);
    WinRates = res.data;
    logger.info('WinRate data updated successfully');
  } catch (error) {
    logger.error('Failed to fetch winRate data:', error);
    throw error;
  }
}

/**
 * Gets statistics for a specific champion in a specific lane and rank range
 * @param championId - ID of the champion
 * @param lane - Lane position (1:mid, 2:top, 3:adc, 4:sup, 5:jg)
 * @param rankRange - Rank range (0:ALL, 1:Dia+, 2:Mas+, 3:Ch+, 4:super server)
 * @returns Champion statistics if found, null otherwise
 */
export function getChampionStats(
  championId: number,
  lane: (typeof LANES)[keyof typeof LANES]['apiParam'],
  rankRange: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'],
): HeroStats | null {
  const laneData = WinRates.data[rankRange]?.[lane];
  return laneData?.find((hero) => hero.hero_id.toString() === championId.toString()) || null;
}

/**
 * Gets statistics for all champions in a specific lane and rank range
 * @param lane - Lane position (1:mid, 2:top, 3:adc, 4:sup, 5:jg)
 * @param rankRange - Rank range (0:ALL, 1:Dia+, 2:Mas+, 3:Ch+, 4:super server)
 * @returns Array of champion statistics for the specified lane
 */
export function getLaneStats(
  lane: (typeof LANES)[keyof typeof LANES]['apiParam'],
  rankRange: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'],
): HeroStats[] {
  const laneData = WinRates.data[rankRange][lane];
  return laneData ? laneData : [];
}

/**
 * Gets the top champions by win rate in a specific lane and rank range
 * @param lane - Lane position (1:mid, 2:top, 3:adc, 4:sup, 5:jg)
 * @param rankRange - Rank range (0:ALL, 1:Dia+, 2:Mas+, 3:Ch+, 4:super server)
 * @param limit - Maximum number of champions to return (default: 10)
 * @returns Array of champion statistics sorted by win rate
 */
export function getTopChampionsByWinRate(
  lane: (typeof LANES)[keyof typeof LANES]['apiParam'],
  rankRange: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'],
  limit = 10,
): HeroStats[] {
  const laneData = getLaneStats(lane, rankRange);
  return laneData
    .sort((a, b) => parseFloat(b.win_rate_float) - parseFloat(a.win_rate_float))
    .slice(0, limit);
}

// Schedule regular updates
setInterval(() => void fetchWinRateData(), UPDATE_INTERVAL);

// Export constants
export { LANES, RANK_RANGES };
