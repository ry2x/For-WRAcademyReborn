import { handleError } from '@/utils/errors/errorManager.js';
import { DiscordError } from '@/utils/errors/errors.js';
import { t } from '@/utils/i18n.js';

export default class BaseCommand<T, K> {
  data: T;
  execute: (interaction: K) => Promise<void> | void;

  constructor(options: {
    data: T;
    execute: (interaction: K) => Promise<void> | void;
  }) {
    if (options.execute) {
      this.execute = async (interaction: K) => {
        try {
          await options.execute?.(interaction);
        } catch (error) {
          const errorContext = {
            timestamp: new Date(),
            userId: 'unknown', // BaseCommand is generic and might not have access to user info
            command: this.constructor.name,
            metadata: {
              data: this.data,
              error: error instanceof Error ? error.message : String(error),
            },
          };

          handleError(
            'command.execution.error',
            error instanceof DiscordError
              ? error
              : new DiscordError(
                  error instanceof Error
                    ? error.message
                    : t('command.execution.error'),
                  errorContext,
                  error instanceof Error ? error : undefined,
                ),
          );
          return;
        }
      };
    } else {
      throw new DiscordError(t('template.failed.noExecute'), {
        timestamp: new Date(),
        command: this.constructor.name,
      });
    }

    this.data = options.data;
  }
}
