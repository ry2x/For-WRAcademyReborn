/**
 * Champion data structure from Champion API
 */
export type Champion = {
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
  /** Whether the champion is a fighter */
  is_fighter: boolean;
  /** Whether the champion is a mage */
  is_mage: boolean;
  /** Whether the champion is an assassin */
  is_assassin: boolean;
  /** Whether the champion is a marksman */
  is_marksman: boolean;
  /** Whether the champion is a support */
  is_support: boolean;
  /** Whether the champion is a tank */
  is_tank: boolean;
  /** Type of the champion */
  type: string;
  /** Whether the champion is available in Wild Rift */
  is_wr: boolean;
  /** Whether the champion can be played in mid lane */
  is_mid: boolean;
  /** Whether the champion can be played in top lane */
  is_top: boolean;
  /** Whether the champion can be played in jungle */
  is_jg: boolean;
  /** Whether the champion can be played as support */
  is_sup: boolean;
  /** Whether the champion can be played as ADC */
  is_ad: boolean;
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
};

/**
 * Collection of champions indexed by their ID
 */
export type Champions = {
  [key: string]: Champion;
};
