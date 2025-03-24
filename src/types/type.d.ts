// Set default to Discord command//
type commandModule<T> = {
  default: T;
};

// Champion data from Champion API//
type Champion = {
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
type Champions = {
  [key: string]: Champion;
};

// hero stats from CN winRateAPI//
type HeroStats = {
  id: number;
  position: string;
  hero_id: string;
  strength: string;
  weight: string;
  appear_rate: string;
  appear_bzc: string;
  forbid_rate: string;
  forbid_bzc: string;
  win_rate: string;
  win_bzc: string;
  dtstatdate: string;
  strength_level: string;
  appear_rate_float: string;
  forbid_rate_float: string;
  win_rate_float: string;
  appear_rate_percent: string;
  forbid_rate_percent: string;
  win_rate_percent: string;
};

// lane stats from CN winRateAPI
type PositionStats = {
  [key: string]: HeroStats[];
};

// rank stats from CN winRateAPI
type RankStats = {
  [key: string]: PositionStats;
};

// data from CN winRateAPI
type WinRates = {
  result: number;
  data: RankStats;
};

// News from RSS API//
type RssWildRiftItem = {
  title: string;
  contents: string;
  link: string;
  retrieved: string;
};

// Data from RSS API
type RssWildRift = {
  title: string;
  favicon: string;
  elements: RssWildRiftItem[];
};

// lane set//
type LaneKey = 'all' | 'top' | 'jg' | 'mid' | 'ad' | 'sup';

// role set Fighter, Assassin, Marksman, Support, Tank
type RoleKey = 'F' | 'M' | 'A' | 'MM' | 'S' | 'T';

type PositionSet<T> = {
  name: string;
  value: T;
  emoji: string;
};

// type of config type//
type Config = {
  prefix: string;
  urlChampions: string;
  urlRssWildRift: string;
  urlWinRate: string;
};
