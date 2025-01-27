import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import logger from '../logger.js';
import type { commandModule } from '../types/interface.js';
import type SubCommand from './SubCommand.js';

/**
 * Represents an Slash Command
 */
export default class ApplicationCommand {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  hasSubCommands: boolean;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;

  /**
   * @param {{
   *      data: SlashCommandBuilder  | SlashCommandSubcommandsOnlyBuilder
   *      hasSubCommands?: boolean
   *      execute?: (interaction: ChatInputCommandInteraction) => Promise<void> | void
   *  }} options - The options for the slash command
   */
  constructor(options: {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
    hasSubCommands?: boolean;
    execute?: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
  }) {
    if (options.hasSubCommands) {
      this.execute = async (interaction: ChatInputCommandInteraction) => {
        const subCommandGroup = interaction.options.getSubcommandGroup();
        const commandName = interaction.options.getSubcommand();

        if (!commandName) {
          await interaction.reply({
            content: "I couldn't understand that command!",
            ephemeral: true,
          });
        } else {
          try {
            const module = (await import(
              `../subCommands/${this.data.name}/${subCommandGroup ? `${subCommandGroup}/` : ''}${commandName}.js`
            )) as commandModule<SubCommand>;
            const command: SubCommand = module.default;
            await command.execute(interaction);
          } catch (error) {
            logger.error(error);
            await interaction.reply({
              content: 'An error occurred when attempting to execute that command!',
              ephemeral: true,
            });
          }
        }
      };
    } else if (options.execute) {
      this.execute = options.execute;
    } else {
      throw new Error('No execute function provided');
    }

    this.data = options.data;
    this.hasSubCommands = options.hasSubCommands ?? false;
  }
}
