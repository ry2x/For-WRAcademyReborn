import type { Lane, LaneKey, PositionSet, RankRange, RankRangeKey, RoleKey } from '@/types/game.js';

/**
 * Lane position configurations with API parameters
 */
export const LANES: Record<LaneKey, PositionSet<LaneKey> & { apiParam: Lane }> = {
  all: {
    name: 'All (全レーン)',
    value: 'all',
    emoji: '<:Lane_All:1343842075464175616>',
    apiParam: '0',
  },
  top: {
    name: 'Top (トップ)',
    value: 'top',
    emoji: '<:Lane_Top:1343276732194750485>',
    apiParam: '2',
  },
  jg: {
    name: 'Jungle (ジャングル)',
    value: 'jg',
    emoji: '<:Lane_Jungle:1343276691853934647>',
    apiParam: '5',
  },
  mid: {
    name: 'Mid (ミッド)',
    value: 'mid',
    emoji: '<:Lane_Mid:1343276706143932447>',
    apiParam: '1',
  },
  ad: {
    name: 'ADC (ボット)',
    value: 'ad',
    emoji: '<:Lane_Bot:1343276674044792974>',
    apiParam: '3',
  },
  sup: {
    name: 'Support (サポート)',
    value: 'sup',
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
    name: '全ランク',
    value: 'all',
    emoji: '<:Rank_Challenger:1356509666527416462>',
    apiParam: '0',
  },
  diamondPlus: {
    name: 'ダイヤモンド+',
    value: 'diamondPlus',
    emoji: '<:Rank_Master:1356509641562919032>',
    apiParam: '1',
  },
  masterPlus: {
    name: 'マスター+',
    value: 'masterPlus',
    emoji: '<:Rank_Master:1356509641562919032>',
    apiParam: '2',
  },
  challengerPlus: {
    name: 'チャレンジャー+',
    value: 'challengerPlus',
    emoji: '<:Rank_Challenger:1356509666527416462>',
    apiParam: '3',
  },
  superServer: {
    name: 'スーパーサーバー',
    value: 'superServer',
    emoji: '<:LRank_Legend:1356510180057284719>',
    apiParam: '4',
  },
} as const;

/**
 * Role configurations
 */
export const ROLES: Record<RoleKey, PositionSet<RoleKey>> = {
  F: {
    name: 'ファイター',
    value: 'F',
    emoji: '<:fighter:1343296794343247985>',
  },
  M: {
    name: 'メイジ',
    value: 'M',
    emoji: '<:mage:1343296818775326780>',
  },
  A: {
    name: 'アサシン',
    value: 'A',
    emoji: '<:assassin:1343296727712530494>',
  },
  MM: {
    name: 'マークスマン',
    value: 'MM',
    emoji: '<:marksman:1343296831781605376>',
  },
  S: {
    name: 'サポート',
    value: 'S',
    emoji: '<:support:1343296844586946681>',
  },
  T: {
    name: 'タンク',
    value: 'T',
    emoji: '<:tank:1343296805575589939>',
  },
} as const;

/**
 * Champion role mapping for API properties
 */
export const CHAMPION_ROLE_MAPPING: Record<string, keyof typeof ROLES> = {
  is_fighter: 'F',
  is_mage: 'M',
  is_assassin: 'A',
  is_marksman: 'MM',
  is_support: 'S',
  is_tank: 'T',
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
