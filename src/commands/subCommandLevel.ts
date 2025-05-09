import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { emptyCommand } from '@/utils/emptyCommand.js';
import { t } from '@/utils/i18n.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

const { ENABLE_SUBCOMMAND_LEVEL } = process.env;

const levelCommand = new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('level commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('leaderboard')
        .setDescription(t('other:command.level.leaderboard.description')),
    ),
  hasSubCommands: true,
});

const command =
  ENABLE_SUBCOMMAND_LEVEL?.toLowerCase() === 'true'
    ? levelCommand
    : emptyCommand;

export default command;
