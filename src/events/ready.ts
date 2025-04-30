import Event from '@/templates/Event.js';
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
        throw new Error(t('ready.failed.noUserTag'));
      }
      logger.info(t('ready.success', { name: userTag }));
    } catch (error) {
      logger.error(t('ready.failed.error'), error);
    }
  },
});
