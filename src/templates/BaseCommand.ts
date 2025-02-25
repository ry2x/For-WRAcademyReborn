import logger from '../logger.js';

export default class BaseCommand<T, K> {
  data: T;
  execute: (interaction: K) => Promise<void> | void;

  /**
   * @param {{
   *   data: T;
   *   execute: (interaction: K) => Promise<void> | void;
   * }} options
   */
  constructor(options: { data: T; execute: (interaction: K) => Promise<void> | void }) {
    if (options.execute) {
      this.execute = async (interaction: K) => {
        try {
          await options.execute?.(interaction);
        } catch (error) {
          logger.error(error);
          return;
        }
      };
    } else {
      throw new Error('No execute function provided');
    }

    this.data = options.data;
  }
}
