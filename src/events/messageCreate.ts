import config from '@/constants/config.js';
import { grantXP } from '@/services/leveling/grantXp.js';
import Event from '@/templates/Event.js';
import type MessageCommand from '@/templates/MessageCommand.js';
import logger from '@/utils/logger.js';
import { Events, type Message } from 'discord.js';

const { DEFAULT_GUILD_ID } = process.env;

// Constants
const COMMAND_PREFIX = config.prefix;

export default new Event({
  name: Events.MessageCreate,
  async execute(message: Message): Promise<void> {
    try {
      // Ignore bot messages
      if (message.author.bot) return;

      // Grant XP for messages in the default guild
      if (message.member && message.guildId === DEFAULT_GUILD_ID) {
        await grantXP(message.member);
      }

      // Check if message starts with command prefix
      if (!message.content.startsWith(COMMAND_PREFIX)) return;

      // Fetch application owner if not available
      if (!client.application?.owner) {
        await client.application?.fetch();
      }

      // Parse command and arguments
      const args = message.content.slice(COMMAND_PREFIX.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();

      if (!commandName) return;

      // Find command by name or alias
      const command =
        client.msgCommands.get(commandName) ||
        client.msgCommands.find((cmd: MessageCommand): boolean =>
          cmd.aliases?.includes(commandName),
        );

      if (!command) return;

      // Execute command
      await command.execute(message, args);
    } catch (error) {
      logger.error('Error in messageCreate event:', error);
    }
  },
});
