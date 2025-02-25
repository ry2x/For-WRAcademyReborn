export interface commandModule<T> {
  default: T;
}

export interface Champion {
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
}

export interface Champions {
  [key: string]: Champion;
}

export interface RssWildRiftItem {
  title: string;
  contents: string;
  link: string;
  retrieved: string;
}

export interface RssWildRift {
  title: string;
  favicon: string;
  elements: RssWildRiftItem[];
}
