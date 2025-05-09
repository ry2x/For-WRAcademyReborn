import type {
  Lane,
  LaneKey,
  PositionSet,
  RankRange,
  RankRangeKey,
  RoleKey,
} from '@/types/game.js';

/**
 * Lane position configurations with API parameters
 */
export const LANES: Record<LaneKey, PositionSet<LaneKey> & { apiParam: Lane }> =
  {
    all: {
      name: 'lane.all',
      value: 'all',
      emoji: 'Lane_All',
      apiParam: '0',
    },
    top: {
      name: 'lane.top',
      value: 'top',
      emoji: 'Lane_Top',
      apiParam: '2',
    },
    jungle: {
      name: 'lane.jungle',
      value: 'jungle',
      emoji: 'Lane_Jungle',
      apiParam: '5',
    },
    mid: {
      name: 'lane.mid',
      value: 'mid',
      emoji: 'Lane_Mid',
      apiParam: '1',
    },
    ad: {
      name: 'lane.ad',
      value: 'ad',
      emoji: 'Lane_Bot',
      apiParam: '3',
    },
    support: {
      name: 'lane.support',
      value: 'support',
      emoji: 'Lane_Support',
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
    emoji: 'Rank_Challenger',
    apiParam: '0',
  },
  diamondPlus: {
    name: 'rank.diamondPlus',
    value: 'diamondPlus',
    emoji: 'Rank_Diamond',
    apiParam: '1',
  },
  masterPlus: {
    name: 'rank.masterPlus',
    value: 'masterPlus',
    emoji: 'Rank_Master',
    apiParam: '2',
  },
  challengerPlus: {
    name: 'rank.challengerPlus',
    value: 'challengerPlus',
    emoji: 'Rank_Challenger',
    apiParam: '3',
  },
  superServer: {
    name: 'rank.superServer',
    value: 'superServer',
    emoji: 'LRank_Legend',
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
    emoji: 'fighter',
  },
  mage: {
    name: 'role.mage',
    value: 'mage',
    emoji: 'mage',
  },
  assassin: {
    name: 'role.assassin',
    value: 'assassin',
    emoji: 'assassin',
  },
  marksman: {
    name: 'role.marksman',
    value: 'marksman',
    emoji: 'marksman',
  },
  support: {
    name: 'role.support',
    value: 'support',
    emoji: 'support',
  },
  tank: {
    name: 'role.tank',
    value: 'tank',
    emoji: 'tank',
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
