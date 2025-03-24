export type commandModule<T> = {
  default: T;
};

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

export type Champions = {
  [key: string]: Champion;
};

export type RssWildRiftItem = {
  title: string;
  contents: string;
  link: string;
  retrieved: string;
};

export type RssWildRift = {
  title: string;
  favicon: string;
  elements: RssWildRiftItem[];
};

export type Config = {
  prefix: string;
  urlChampions: string;
  urlRssWildRift: string;
  urlWinRate: string;
};
