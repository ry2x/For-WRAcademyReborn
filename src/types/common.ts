/**
 * Common type definitions and constants for the application
 */

/**
 * Base position set with name, value, and emoji
 * @template T - Type of the position value
 */
export type PositionSet<T> = {
  /** Display name of the position */
  name: string;
  /** Value of the position */
  value: T;
  /** Emoji representation of the position */
  emoji: string;
};

/**
 * Available lane positions in the game
 */
export type LaneKey = 'all' | 'top' | 'jg' | 'mid' | 'ad' | 'sup';

/**
 * Available rank ranges for statistics
 */
export type RankRangeKey = 'all' | 'diamondPlus' | 'masterPlus' | 'challengerPlus' | 'superServer';

/**
 * Available champion roles
 */
export type RoleKey = 'F' | 'M' | 'A' | 'MM' | 'S' | 'T';

/**
 * Lane positions in the game (API format)
 * 1:mid 2:top 3:adc 4:sup 5:jg
 */
export type Lane = '1' | '2' | '3' | '4' | '5' | '0';

/**
 * Rank ranges for statistics (API format)
 * 0:ALL 1:Dia+ 2:Mas+ 3:Ch+ 4:super server
 */
export type RankRange = '0' | '1' | '2' | '3' | '4';

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
    name: 'ダイヤモンド',
    value: 'diamondPlus',
    emoji: '<:Rank_Master:1356509641562919032>',
    apiParam: '1',
  },
  masterPlus: {
    name: 'マスター',
    value: 'masterPlus',
    emoji: '<:Rank_Master:1356509641562919032>',
    apiParam: '2',
  },
  challengerPlus: {
    name: 'チャレンジャー以上',
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
