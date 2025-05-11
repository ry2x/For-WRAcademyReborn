import { t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';

export default class BaseCommand<T, K> {
  data: T;
  execute: (interaction: K) => Promise<void> | void;

  /**
   * @param {{
   *   data: T;
   *   execute: (interaction: K) => Promise<void> | void;
   * }} options
   */
  constructor(options: {
    data: T;
    execute: (interaction: K) => Promise<void> | void;
  }) {
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
      throw new Error(t('template.failed.noExecute'));
    }

    this.data = options.data;
  }
}
