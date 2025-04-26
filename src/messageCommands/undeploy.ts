import config from '@/constants/config.js';
import MessageCommand from '@/templates/MessageCommand.js';
import logger from '@/utils/logger.js';

export default new MessageCommand({
  name: 'undeploy',
  description: 'Undeploy the slash commands',
  async execute(message, args): Promise<void> {
    try {
      // Check if the user has permission to undeploy commands
      if (message.author.id !== client.application?.owner?.id) {
        logger.warn(`Unauthorized undeploy attempt by ${message.author.tag}`, message.author);
        await message.reply('⚠️ Sorry, only the bot owner can undeploy commands!');
        return;
      }

      // Validate arguments
      if (!args[0]) {
        await message.reply(
          `⚠️ Incorrect usage! The correct format is \`${config.prefix}undeploy <guild/global>\``,
        );
        return;
      }

      const scope = args[0].toLowerCase();

      // Validate scope argument
      if (!['global', 'guild'].includes(scope)) {
        await message.reply('⚠️ Invalid scope! Please use either `guild` or `global`');
        return;
      }

      logger.info(`${message.author.tag} is un-deploying ${scope} commands`, message.author);

      // Handle command undeploy based on scope
      if (scope === 'global') {
        await client.application?.commands.set([]);
        await message.reply('✅ Global commands have been un-deployed successfully!');
      } else {
        await message.guild?.commands.set([]);
        await message.reply('✅ Guild commands have been un-deployed successfully!');
      }

      logger.info(`Successfully un-deployed ${scope} commands`);
    } catch (error) {
      logger.error('Failed to undeploy commands:', error);
      await message.reply('❌ Failed to undeploy commands. Check logs for details.');
    }
  },
});
