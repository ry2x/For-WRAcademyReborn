/**
 * Type definition for Discord command modules
 * @template T - The type of the command module
 */
export type CommandModule<T> = {
  default: T;
};

/**
 * Configuration Champion Errors
 */
export type ChampionError = {
  notFound: string;
  notAvailable: string;
  invalidRank: string;
  invalidChampion: string;
};

/**
 * Configuration Button Errors
 */
export type ButtonError = {
  timeOut: string;
  invalidUser: string;
};

/**
 * Configuration LeaderBoard Errors
 */
export type LeaderBoardError = {
  invalidServer: string;
  noData: string;
};

/**
 * Configuration type for the application
 * Contains all necessary URLs and settings
 */
export type Config = {
  /** Command prefix for message commands */
  prefix: string;
  /** URL for champions data */
  urlChampions: string;
  /** URL for Wild Rift RSS feed */
  urlRssWildRift: string;
  /** URL for win rate data */
  urlWinRate: string;
  /** Error of champion commands */
  championError: ChampionError;
  /** Error of button */
  ButtonError: ButtonError;
  /** Error of leaderBoard */
  LeaderBoardError: LeaderBoardError;
};
