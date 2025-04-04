import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('level commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('leaderboard')
        .setDescription('XPランキングを表示します。'),
    ),
  hasSubCommands: true,
});
