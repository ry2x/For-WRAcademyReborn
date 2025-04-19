import deployGlobalCommands from '@/deployGlobalCommands.js';
import MessageCommand from '@/templates/MessageCommand.js';
import logger from '@/utils/logger.js';

export default new MessageCommand({
  name: 'deploy',
  description: 'Deploys the slash commands',
  async execute(message): Promise<void> {
    if (message.author.id !== client.application?.owner?.id) return;
    logger.info(`${message.author.tag} is deploying the commands`);
    await deployGlobalCommands();
    await message.reply('Deployed!');
  },
});
