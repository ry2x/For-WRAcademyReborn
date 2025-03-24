// Set default to Discord command
export type commandModule<T> = {
  default: T;
};

// Champion data from Champion API
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

// News from RSS API
export type RssWildRiftItem = {
  title: string;
  contents: string;
  link: string;
  retrieved: string;
};

// Data from RSS API
export type RssWildRift = {
  title: string;
  favicon: string;
  elements: RssWildRiftItem[];
};

// lane set
type LaneKey = 'all' | 'top' | 'jg' | 'mid' | 'ad' | 'sup';

// lane constant
type Lane = {
  name: string;
  value: LaneKey;
  emoji: string;
};

// type of config type
export type Config = {
  prefix: string;
  urlChampions: string;
  urlRssWildRift: string;
  urlWinRate: string;
};
