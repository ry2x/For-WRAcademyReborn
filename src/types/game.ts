/**
 * Common type definitions for the game
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
