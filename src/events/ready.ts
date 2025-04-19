import Event from '@/templates/Event.js';
import logger from '@/utils/logger.js';
import { Events } from 'discord.js';

export default new Event({
  name: Events.ClientReady,
  once: true,
  execute(): void {
    try {
      const userTag = client.user?.tag;
      if (!userTag) {
        throw new Error('Client user is not available');
      }
      logger.info(`Logged in as ${userTag}!`);
    } catch (error) {
      logger.error('Error in ready event:', error);
    }
  },
});
