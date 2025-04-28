import type { LaneKey, RoleKey } from '@/types/game.js';

/**
 * Champion data structure from Champion API
 */
export interface Champion {
  /** Unique identifier for the champion */
  id: string;
  /** Numeric key for the champion */
  key: number;
  /** Name of the champion */
  name: string;
  /** Title of the champion */
  title: string;
  /** Description of the champion */
  describe: string;
  /** Roles the champion is */
  roles: RoleKey[];
  /** Type of the champion */
  type: string;
  /** Whether the champion is available in Wild Rift */
  is_wr: boolean;
  /** Lanes the champion can be played in */
  lanes: LaneKey[];
  /** Whether the champion is currently free to play */
  is_free: boolean;
  /** Difficulty rating of the champion (1-10) */
  difficult: number;
  /** Damage rating of the champion (1-10) */
  damage: number;
  /** Survivability rating of the champion (1-10) */
  survive: number;
  /** Utility rating of the champion (1-10) */
  utility: number;
  /** Hero ID for API calls */
  hero_id: number;
}

/**
 * Collection of champions indexed by their ID
 */
export type Champions = Champion[];
