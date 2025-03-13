import { Events, type Message } from 'discord.js';
import config from '../config.json' with { type: 'json' };
import logger from '../logger.js';
import Event from '../templates/Event.js';
import type MessageCommand from '../templates/MessageCommand.js';

export default new Event({
  name: Events.MessageCreate,
  async execute(message: Message): Promise<void> {
    if (!message.author.bot) return;
    const member = await message.guild?.members.fetch(message.author.id);
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
