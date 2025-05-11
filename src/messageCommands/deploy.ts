import deployGlobalCommands from '@/deployGlobalCommands.js';
import MessageCommand from '@/templates/MessageCommand.js';
import { t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';

export default new MessageCommand({
  name: 'deploy',
  description: 'Deploys the slash commands',
  async execute(message): Promise<void> {
    try {
      // Check if the user has permission to deploy commands
      if (message.author.id !== client.application?.owner?.id) {
        logger.warn(
          t('deploy.unhandled', { name: message.author.tag }),
          message.author,
        );
        await message.reply(t('deploy.for_owner'));
        return;
      }

      // Log the deployment start
      logger.info(
        t('deploy.starting', { name: message.author.tag }),
        message.author,
      );

      // Deploy the commands
      await deployGlobalCommands();

      // Notify success
      await message.reply(t('deploy.success'));
      logger.info(t('deploy.success'));
    } catch (error) {
      // Handle any errors during deployment
      logger.error(t('deploy.error'), error);
      await message.reply(t('deploy.error') + t('deploy.check'));
    }
  },
});
