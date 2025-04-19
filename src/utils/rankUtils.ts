import { RANK_RANGES } from '@/constants/game.js';

/**
 * Gets the rank range configuration from a value
 * @param rankValue - The rank value to find
 * @returns The rank configuration if found, undefined otherwise
 */
export function getRankRange(
  rankValue: string,
): (typeof RANK_RANGES)[keyof typeof RANK_RANGES] | undefined {
  return Object.values(RANK_RANGES).find((rank) => rank.value === rankValue);
}
