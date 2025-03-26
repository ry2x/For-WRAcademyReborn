// hero stats from CN winRateAPI//
export type HeroStats = {
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
export type PositionStats = {
  [key: string]: HeroStats[];
};

// rank stats from CN winRateAPI
export type RankStats = {
  [key: string]: PositionStats;
};

// data from CN winRateAPI
export type WinRates = {
  result: number;
  data: RankStats;
};
