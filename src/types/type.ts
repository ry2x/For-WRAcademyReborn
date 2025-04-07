/**
 * Type definition for Discord command modules
 * @template T - The type of the command module
 */
export type CommandModule<T> = {
  default: T;
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
};
