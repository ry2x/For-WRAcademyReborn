import type SubCommand from '@/templates/SubCommand.js';
import type { CommandModule } from '@/types/type.js';
import { handleError } from '@/utils/errorHandler.js';
import { DiscordError } from '@/utils/errors/errors.js';
import { sendErrorToInteraction } from '@/utils/errors/helpers.js';
import { t } from '@/utils/i18n.js';
import {
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

/**
 * Represents an Slash Command
 */
export default class ApplicationCommand {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder;
  hasSubCommands: boolean;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;

  /**
   * @param {{
   *      data: SlashCommandBuilder  | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder
   *      hasSubCommands?: boolean
   *      execute?: (interaction: ChatInputCommandInteraction) => Promise<void> | void
   *  }} options - The options for the slash command
   */
  constructor(options: {
    data:
      | SlashCommandBuilder
      | SlashCommandSubcommandsOnlyBuilder
      | SlashCommandOptionsOnlyBuilder;
    hasSubCommands?: boolean;
    execute?: (
      interaction: ChatInputCommandInteraction,
    ) => Promise<void> | void;
  }) {
    this.data = options.data;
    this.hasSubCommands = options.hasSubCommands ?? false;

    if (options.hasSubCommands) {
      this.execute = async (interaction: ChatInputCommandInteraction) => {
        const subCommandGroup = interaction.options.getSubcommandGroup();
        const commandName = interaction.options.getSubcommand();

        if (!commandName) {
          throw new DiscordError(t('template.failed.notFound'), {
            timestamp: new Date(),
            userId: interaction.user.id,
            guildId: interaction.guildId ?? undefined,
            command: this.data.name,
          });
        }

        try {
          const module = (await import(
            `../subCommands/${this.data.name}/${subCommandGroup ? `${subCommandGroup}/` : ''}${commandName}.js`
          )) as CommandModule<SubCommand>;
          const command: SubCommand = module.default;
          await command.execute(interaction);
        } catch (error) {
          const errorContext = {
            timestamp: new Date(),
            userId: interaction.user.id,
            guildId: interaction.guildId ?? undefined,
            command: `${this.data.name}/${subCommandGroup ? `${subCommandGroup}/` : ''}${commandName}`,
            metadata: {
              options: interaction.options.data,
            },
          };

          handleError(
            'command.subcommand.error',
            error instanceof DiscordError
              ? error
              : new DiscordError(
                  error instanceof Error
                    ? error.message
                    : t('command.subcommand.error'),
                  errorContext,
                  error instanceof Error ? error : undefined,
                ),
          );

          await sendErrorToInteraction(interaction);
        }
      };
    } else if (options.execute) {
      this.execute = async (interaction: ChatInputCommandInteraction) => {
        try {
          await options.execute?.(interaction);
        } catch (error) {
          const errorContext = {
            timestamp: new Date(),
            userId: interaction.user.id,
            guildId: interaction.guildId ?? undefined,
            command: this.data.name,
            metadata: {
              options: interaction.options.data,
            },
          };

          handleError(
            'command.execution.error',
            error instanceof DiscordError
              ? error
              : new DiscordError(
                  error instanceof Error
                    ? error.message
                    : t('command.execution.error'),
                  errorContext,
                  error instanceof Error ? error : undefined,
                ),
          );

          await sendErrorToInteraction(interaction);
        }
      };
    } else {
      throw new DiscordError(t('template.failed.noExecute'), {
        timestamp: new Date(),
        command: this.data.name,
      });
    }
  }
}
