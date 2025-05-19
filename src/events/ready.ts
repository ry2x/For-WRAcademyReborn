import Event from '@/templates/Event.js';
import { handleError } from '@/utils/errors/errorManager.js';
import { DiscordError } from '@/utils/errors/errors.js';
import { t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';
import { Events } from 'discord.js';

export default new Event({
  name: Events.ClientReady,
  once: true,
  execute(): void {
    try {
      const userTag = client.user?.tag;
      if (!userTag) {
        throw new DiscordError(t('ready.failed.noUserTag'), {
          timestamp: new Date(),

          metadata: {
            clientId: client.user?.id,
            applicationId: client.application?.id,
          },
        });
      }

      logger.info(t('ready.success', { name: userTag }));
    } catch (error) {
      handleError(
        'ready.failed.error',
        error instanceof DiscordError
          ? error
          : new DiscordError(
              error instanceof Error ? error.message : t('ready.failed.error'),
              {
                timestamp: new Date(),
                metadata: {
                  clientId: client.user?.id,
                  applicationId: client.application?.id,
                },
              },
              error instanceof Error ? error : undefined,
            ),
      );
    }
  },
});
