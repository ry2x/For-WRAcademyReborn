import deployGlobalCommands from '@/deployGlobalCommands.js';
import MessageCommand from '@/templates/MessageCommand.js';
import logger from '@/utils/logger.js';

export default new MessageCommand({
  name: 'deploy',
  description: 'Deploys the slash commands',
  async execute(message): Promise<void> {
    try {
      // Check if the user has permission to deploy commands
      if (message.author.id !== client.application?.owner?.id) {
        logger.warn(`Unauthorized deployment attempt by ${message.author.tag}`, message.author);
        await message.reply('⚠️ Sorry, only the bot owner can deploy commands!');
        return;
      }

      // Log the deployment start
      logger.info(`Starting command deployment initiated by ${message.author.tag}`, message.author);

      // Deploy the commands
      await deployGlobalCommands();

      // Notify success
      await message.reply('✅ Commands deployed successfully!');
      logger.info('Command deployment completed successfully');
    } catch (error) {
      // Handle any errors during deployment
      logger.error('Command deployment failed:', error);
      await message.reply('❌ Failed to deploy commands. Check logs for details.');
    }
  },
});
