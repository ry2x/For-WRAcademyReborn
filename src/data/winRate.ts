import config from '@/constants/config.js';
import { type LANES, type RANK_RANGES } from '@/constants/game.js';
import { type HeroStats, type WinRates } from '@/types/winRate.js';
import logger from '@/utils/logger.js';
import axios, { type AxiosResponse } from 'axios';

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
  return (
    laneData?.find(
      (hero) => hero.hero_id.toString() === championId.toString(),
    ) || null
  );
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
    .sort(
      (a, b) => parseFloat(b.win_rate_percent) - parseFloat(a.win_rate_percent),
    )
    .slice(0, limit);
}

/**
 * Gets the top champions by strength in a specific lane and rank range
 * @param lane - Lane position (1:mid, 2:top, 3:adc, 4:sup, 5:jg)
 * @param rankRange - Rank range (0:ALL, 1:Dia+, 2:Mas+, 3:Ch+, 4:super server)
 * @param limit - Maximum number of champions to return (default: 10)
 * @returns Array of champion statistics sorted by strength
 */
export function getTopChampionsByStrength(
  lane: (typeof LANES)[keyof typeof LANES]['apiParam'],
  rankRange: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'],
  limit = 10,
): HeroStats[] {
  const laneData = getLaneStats(lane, rankRange);
  return laneData
    .sort((a, b) => parseFloat(b.strength) - parseFloat(a.strength))
    .slice(0, limit);
}

/**
 * Gets the top champions by pick rate in a specific lane and rank range
 * @param lane - Lane position (1:mid, 2:top, 3:adc, 4:sup, 5:jg)
 * @param rankRange - Rank range (0:ALL, 1:Dia+, 2:Mas+, 3:Ch+, 4:super server)
 * @param limit - Maximum number of champions to return (default: 10)
 * @param considerBanRate - Whether to consider ban rate in the calculation (default: false)
 * @returns Array of champion statistics sorted by pick rate (and ban rate if considerBanRate is true)
 */
export function getTopChampionsByPickRate(
  lane: (typeof LANES)[keyof typeof LANES]['apiParam'],
  rankRange: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'],
  limit = 10,
  considerBanRate = false,
): HeroStats[] {
  const laneData = getLaneStats(lane, rankRange);
  return laneData
    .sort((a, b) => {
      if (!considerBanRate) {
        return (
          parseFloat(b.appear_rate_percent) - parseFloat(a.appear_rate_percent)
        );
      }

      // Weighted calculation considering both pick rate and ban rate
      // Using ban rate benchmark (forbid_bzc) to adjust the impact of ban rate
      const calculateWeightedValue = (hero: HeroStats) => {
        const pickRate = parseFloat(hero.appear_rate_percent);
        const banRate = parseFloat(hero.forbid_rate_percent);
        const banBenchmark = parseFloat(hero.forbid_bzc);

        // Higher ban benchmark value increases the impact of ban rate
        const banWeight = 1 + banBenchmark / 100; // Normalize benchmark value to 0-1 range
        return pickRate + banRate * banWeight;
      };

      return calculateWeightedValue(b) - calculateWeightedValue(a);
    })
    .slice(0, limit);
}
