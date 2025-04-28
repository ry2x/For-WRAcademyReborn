import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

const { DEFAULT_GUILD_ID, DEFAULT_CHANNEL_ID } = process.env;

const command = DEFAULT_GUILD_ID && DEFAULT_CHANNEL_ID ? new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('level commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('leaderboard')
        .setDescription('XPランキングを表示します。'),
    ),
  hasSubCommands: true,
}) : new ApplicationCommand({
  data: new SlashCommandBuilder().setName('empty').setDescription('empty command'),
  hasSubCommands: false,
  execute: async () => {
    // empty execute-function
  },
});

export default command;
