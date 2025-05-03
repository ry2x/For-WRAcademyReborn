import { LANES, RANK_RANGES } from '@/constants/game.js';
import { getEmoji } from '@/data/emoji.js';
import type { Lane, LaneKey, PositionSet, RankRange, RankRangeKey } from '@/types/game.js';

/**
 * Gets the rank range configuration from a value
 * @param rankValue - The rank value to find
 * @returns The rank configuration if found, undefined otherwise
 */
export function getRankRange(rankValue: string):
  | (PositionSet<RankRangeKey> & {
      apiParam: RankRange;
    })
  | undefined {
  return Object.values(RANK_RANGES).find((rank) => rank.value === rankValue);
}

/**
 * Gets the emoji for a specific lane
 * @param lane - The lane to get the emoji for
 * @returns The emoji string for the lane
 */
export function getLaneEmoji(lane: LaneKey): string {
  return getEmoji(LANES[lane]?.emoji);
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
