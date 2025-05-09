import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { SlashCommandBuilder } from 'discord.js';

/**
 * This is an empty command that does nothing.
 * It is used to test the command handler.
 * @type {ApplicationCommand}
 */
export const emptyCommand = new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('empty')
    .setDescription('empty command'),
  hasSubCommands: false,
  execute: async () => {
    // empty execute-function
  },
});
