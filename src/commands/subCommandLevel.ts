import ApplicationCommand from '@/templates/ApplicationCommand.js';
import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('level commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('leaderboard')
        .setDescription('XPランキングを表示します。'),
    ),
  hasSubCommands: true,
});
