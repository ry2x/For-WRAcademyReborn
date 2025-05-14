import config from '@/constants/config.js';
import { grantXP } from '@/services/leveling/grantXp.js';
import Event from '@/templates/Event.js';
import type MessageCommand from '@/templates/MessageCommand.js';
import { handleError } from '@/utils/errorHandler.js';
import { DiscordError } from '@/utils/errors/errors.js';
import { t } from '@/utils/i18n.js';
import { Events, type Message } from 'discord.js';

const { DEFAULT_GUILD_ID, ENABLE_SUBCOMMAND_LEVEL } = process.env;

// Constants
const COMMAND_PREFIX = config.prefix;

export default new Event({
  name: Events.MessageCreate,
  async execute(message: Message): Promise<void> {
    let commandName: string | undefined;
    let args: string[] = [];

    try {
      // Ignore bot messages
      if (message.author.bot) return;

      // Grant XP for messages in the default guild
      if (
        ENABLE_SUBCOMMAND_LEVEL &&
        message.member &&
        message.guildId === DEFAULT_GUILD_ID
      ) {
        await grantXP(message.member);
      }

      // Check if message starts with command prefix
      if (!message.content.startsWith(COMMAND_PREFIX)) return;

      // Fetch application owner if not available
      if (!client.application?.owner) {
        await client.application?.fetch();
      }

      // Parse command and arguments
      args = message.content.slice(COMMAND_PREFIX.length).trim().split(/ +/);
      commandName = args.shift()?.toLowerCase();

      if (!commandName) return;

      // Find command by name or alias
      const command =
        client.msgCommands.get(commandName) ||
        client.msgCommands.find((cmd: MessageCommand): boolean =>
          cmd.aliases?.includes(commandName || ''),
        );

      if (!command) {
        throw new DiscordError(
          t('messageCommand.notFound', { command: commandName }),
          {
            timestamp: new Date(),
            userId: message.author.id,
            guildId: message.guildId ?? undefined,
            command: commandName,
          },
        );
      }

      // Execute command
      await command.execute(message, args);
    } catch (error) {
      const errorContext = {
        timestamp: new Date(),
        userId: message.author.id,
        guildId: message.guildId ?? undefined,
        command: commandName ?? 'unknown',
        metadata: {
          channelId: message.channelId,
          messageContent: message.content,
          args: args,
        },
      };

      handleError(
        'messageCommand.failed.error',
        error instanceof DiscordError
          ? error
          : new DiscordError(
              error instanceof Error
                ? error.message
                : t('messageCommand.failed.error'),
              errorContext,
              error instanceof Error ? error : undefined,
            ),
      );
    }
  },
});
