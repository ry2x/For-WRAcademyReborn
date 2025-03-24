import { Events, type Message } from 'discord.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import logger from '../logger.js';
import Event from '../templates/Event.js';
import type MessageCommand from '../templates/MessageCommand.js';
import { grantXP } from '../utils/grantXp.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, '../config.json'), 'utf8')) as Config;

export default new Event({
  name: Events.MessageCreate,
  async execute(message: Message): Promise<void> {
    if (message.author.bot) return;

    if (message.member) {
      await grantXP(message.member);
    }

    if (!message.content.startsWith(config.prefix)) return;

    // fetches the application owner for the bot
    if (!client.application?.owner) await client.application?.fetch();

    // get the arguments and the actual command name for the inputted command
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = (<string>args.shift()).toLowerCase();

    const command =
      (client.msgCommands.get(commandName) as MessageCommand) ||
      (client.msgCommands.find(
        (cmd: MessageCommand): boolean => cmd.aliases && cmd.aliases.includes(commandName),
      ) as MessageCommand);

    // dynamic command handling
    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      logger.error(error);
    }
  },
});
