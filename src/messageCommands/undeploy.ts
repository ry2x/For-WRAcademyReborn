import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import logger from '../logger.js';
import MessageCommand from '../templates/MessageCommand.js';
import { type Config } from '../types/type.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, '../config.json'), 'utf8')) as Config;

export default new MessageCommand({
  name: 'undeploy',
  description: 'Undeploy the slash commands',
  async execute(message, args): Promise<void> {
    if (message.author.id !== client.application?.owner?.id) return;

    if (!args[0]) {
      await message.reply(
        `Incorrect number of arguments! The correct format is \`${config.prefix}undeploy <guild/global>\``,
      );
      return;
    }

    logger.info(`${message.author.tag} is un-deploying the commands`);

    if (args[0].toLowerCase() === 'global') {
      // global un-deployment

      // undeploy the commands
      await client.application?.commands.set([]);

      await message.reply('Underlying!');
    } else if (args[0].toLowerCase() === 'guild') {
      // guild deployment

      // undeploy the commands
      await message.guild?.commands.set([]);

      await message.reply('Underlying!');
    }
  },
});
