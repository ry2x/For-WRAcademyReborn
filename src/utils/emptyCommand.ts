import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { SlashCommandBuilder } from 'discord.js';

/**
 * Creates an empty command instance that does nothing when executed.
 * Used as a placeholder for disabled commands or during development.
 *
 * @returns {ApplicationCommand} An ApplicationCommand instance with empty functionality
 *
 * @example
 * // Using empty command as a fallback
 * const command = isEnabled ? realCommand : emptyCommand();
 */
export const emptyCommand = new ApplicationCommand({
  data: new SlashCommandBuilder().setName('empty').setDescription('empty command'),
  hasSubCommands: false,
  execute: async () => {
    // empty execute-function
  },
});
