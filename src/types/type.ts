// Set default to Discord command//
export type commandModule<T> = {
  default: T;
};

// type of config type//
export type Config = {
  prefix: string;
  urlChampions: string;
  urlRssWildRift: string;
  urlWinRate: string;
};
