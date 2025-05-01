import config from '@/constants/config.js';
import MessageCommand from '@/templates/MessageCommand.js';
import { t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';

export default new MessageCommand({
  name: 'undeploy',
  description: 'Undeploy the slash commands',
  async execute(message, args): Promise<void> {
    try {
      // Check if the user has permission to undeploy commands
      if (message.author.id !== client.application?.owner?.id) {
        logger.warn(t('undeploy.unhandled', { name: message.author.tag }), message.author);
        await message.reply(t('deploy.for_owner'));
        return;
      }

      // Validate arguments
      if (!args[0]) {
        await message.reply(
          t('undeploy.invalid_args', {
            prefix: config.prefix,
          }),
        );
        return;
      }

      const scope = args[0].toLowerCase();

      // Validate scope argument
      if (!['global', 'guild'].includes(scope)) {
        await message.reply(t('undeploy.invalid_target'));
        return;
      }

      logger.info(
        t('undeploy.starting', { target: scope, name: message.author.tag }),
        message.author,
      );

      // Handle command undeploy based on scope
      if (scope === 'global') {
        await client.application?.commands.set([]);
        await message.reply(t('undeploy.success', { target: 'Global' }));
        logger.info(t('undeploy.success', { target: 'Global' }));
      } else {
        await message.guild?.commands.set([]);
        await message.reply(t('undeploy.success', { target: 'Guild' }));
        logger.info(t('undeploy.success', { target: 'Guild' }));
      }
    } catch (error) {
      logger.error(t('undeploy.error'), error);
      await message.reply(t('deploy.error') + t('undeploy.check'));
    }
  },
});
