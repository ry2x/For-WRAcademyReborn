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

// 1:mid 2:top 3:adc 4:sup 5:jg
type lane = '1' | '2' | '3' | '4' | '5';

// lane stats from CN winRateAPI
export type PositionStats = {
  [K in lane]: HeroStats[];
};

// 0:ALL 1:Dia+ 2:Mas+ 3:Ch+ 4:super server
type rankRange = '0' | '1' | '2' | '3' | '4';

// rank stats from CN winRateAPI
export type RankStats = {
  [K in rankRange]: PositionStats;
};

// data from CN winRateAPI
export type WinRates = {
  result: number;
  data: RankStats;
};
