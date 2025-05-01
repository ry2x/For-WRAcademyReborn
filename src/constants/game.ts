import type { Lane, LaneKey, PositionSet, RankRange, RankRangeKey, RoleKey } from '@/types/game.js';

/**
 * Lane position configurations with API parameters
 */
export const LANES: Record<LaneKey, PositionSet<LaneKey> & { apiParam: Lane }> = {
  all: {
    name: 'lane.all',
    value: 'all',
    emoji: '<:Lane_All:1343842075464175616>',
    apiParam: '0',
  },
  top: {
    name: 'lane.top',
    value: 'top',
    emoji: '<:Lane_Top:1343276732194750485>',
    apiParam: '2',
  },
  jungle: {
    name: 'lane.jungle',
    value: 'jungle',
    emoji: '<:Lane_Jungle:1343276691853934647>',
    apiParam: '5',
  },
  mid: {
    name: 'lane.mid',
    value: 'mid',
    emoji: '<:Lane_Mid:1343276706143932447>',
    apiParam: '1',
  },
  ad: {
    name: 'lane.ad',
    value: 'ad',
    emoji: '<:Lane_Bot:1343276674044792974>',
    apiParam: '3',
  },
  support: {
    name: 'lane.support',
    value: 'support',
    emoji: '<:Lane_Support:1343276719049543803>',
    apiParam: '4',
  },
} as const;

/**
 * Rank range configurations with API parameters
 */
export const RANK_RANGES: Record<
  RankRangeKey,
  PositionSet<RankRangeKey> & { apiParam: RankRange }
> = {
  all: {
    name: 'rank.all',
    value: 'all',
    emoji: '<:Rank_Challenger:1356509666527416462>',
    apiParam: '0',
  },
  diamondPlus: {
    name: 'rank.diamondPlus',
    value: 'diamondPlus',
    emoji: '<:Rank_Diamond:1356509630251008103>',
    apiParam: '1',
  },
  masterPlus: {
    name: 'rank.masterPlus',
    value: 'masterPlus',
    emoji: '<:Rank_Master:1356509641562919032>',
    apiParam: '2',
  },
  challengerPlus: {
    name: 'rank.challengerPlus',
    value: 'challengerPlus',
    emoji: '<:Rank_Challenger:1356509666527416462>',
    apiParam: '3',
  },
  superServer: {
    name: 'rank.superServer',
    value: 'superServer',
    emoji: '<:LRank_Legend:1356510180057284719>',
    apiParam: '4',
  },
} as const;

/**
 * Role configurations
 */
export const ROLES: Record<RoleKey, PositionSet<RoleKey>> = {
  fighter: {
    name: 'role.fighter',
    value: 'fighter',
    emoji: '<:fighter:1343296794343247985>',
  },
  mage: {
    name: 'role.mage',
    value: 'mage',
    emoji: '<:mage:1343296818775326780>',
  },
  assassin: {
    name: 'role.assassin',
    value: 'assassin',
    emoji: '<:assassin:1343296727712530494>',
  },
  marksman: {
    name: 'role.marksman',
    value: 'marksman',
    emoji: '<:marksman:1343296831781605376>',
  },
  support: {
    name: 'role.support',
    value: 'support',
    emoji: '<:support:1343296844586946681>',
  },
  tank: {
    name: 'role.tank',
    value: 'tank',
    emoji: '<:tank:1343296805575589939>',
  },
} as const;

/**
 * Default values for lane win rate command
 */
export const WIN_RATE_DEFAULTS = {
  RANK: RANK_RANGES.masterPlus.value,
  LANE: LANES.all.value,
} as const;

/**
 * Rank emojis for win rate display
 */
export const RANK_EMOJIS = ['👑', '🥈', '🥉', '4️⃣', '5️⃣'] as const;
