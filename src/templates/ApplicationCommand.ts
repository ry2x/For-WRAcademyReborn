import { interactionError } from '@/embeds/errorEmbed.js';
import type SubCommand from '@/templates/SubCommand.js';
import type { CommandModule } from '@/types/type.js';
import { t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';
import {
  MessageFlags,
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

/**
 * Represents an Slash Command
 */
export default class ApplicationCommand {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
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
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
    hasSubCommands?: boolean;
    execute?: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
  }) {
    if (options.hasSubCommands) {
      this.execute = async (interaction: ChatInputCommandInteraction) => {
        const subCommandGroup = interaction.options.getSubcommandGroup();
        const commandName = interaction.options.getSubcommand();

        if (!commandName) {
          await interaction.reply({
            content: t('template.failed.notFound'),
            flags: MessageFlags.Ephemeral,
          });
        } else {
          try {
            const module = (await import(
              `../subCommands/${this.data.name}/${subCommandGroup ? `${subCommandGroup}/` : ''}${commandName}.js`
            )) as CommandModule<SubCommand>;
            const command: SubCommand = module.default;
            await command.execute(interaction);
          } catch (error) {
            logger.error(error);
            if (interaction.deferred || interaction.replied) {
              await interaction.followUp(interactionError);
            } else {
              await interaction.reply(interactionError);
            }
          }
        }
      };
    } else if (options.execute) {
      this.execute = async (interaction: ChatInputCommandInteraction) => {
        try {
          await options.execute?.(interaction);
        } catch (error) {
          logger.error(error);
          if (interaction.deferred || interaction.replied) {
            await interaction.followUp(interactionError);
          } else {
            await interaction.reply(interactionError);
          }
        }
      };
    } else {
      throw new Error(t('template.failed.noExecute'));
    }

    this.data = options.data;
    this.hasSubCommands = options.hasSubCommands ?? false;
  }
}
