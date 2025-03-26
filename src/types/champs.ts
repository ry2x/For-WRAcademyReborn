// Champion data from Champion API//
export type Champion = {
  id: string;
  key: number;
  name: string;
  title: string;
  describe: string;
  is_fighter: boolean;
  is_mage: boolean;
  is_assassin: boolean;
  is_marksman: boolean;
  is_support: boolean;
  is_tank: boolean;
  type: string;
  is_wr: boolean;
  is_mid: boolean;
  is_top: boolean;
  is_jg: boolean;
  is_sup: boolean;
  is_ad: boolean;
  is_free: boolean;
  difficult: number;
  damage: number;
  survive: number;
  utility: number;
  hero_id: number;
};

// Data from Champion API
export type Champions = {
  [key: string]: Champion;
};

// lane set//
export type LaneKey = 'all' | 'top' | 'jg' | 'mid' | 'ad' | 'sup';

// role set Fighter, Assassin, Marksman, Support, Tank
export type RoleKey = 'F' | 'M' | 'A' | 'MM' | 'S' | 'T';

export type PositionSet<T> = {
  name: string;
  value: T;
  emoji: string;
};
