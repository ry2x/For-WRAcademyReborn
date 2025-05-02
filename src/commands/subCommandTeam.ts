import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { emptyCommand } from '@/utils/emptyCommand.js';
import { t } from '@/utils/i18n.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

const { ENABLE_SUBCOMMAND_TEAM } = process.env;

const teamCommand = new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('team')
    .setDescription(t('other:command.team.description'))
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('random')
        .setDescription(t('other:command.team.random.description'))
        .addNumberOption((option) =>
          option
            .setName('team_count')
            .setDescription(t('other:command.team.random.team_count'))
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(5),
        )
        .addChannelOption((option) =>
          option
            .setName('vc_channel')
            .setDescription(t('other:command.team.random.vc_channel'))
            .setRequired(false),
        )
        .addBooleanOption((option) =>
          option
            .setName('is_bot')
            .setDescription(t('other:command.team.random.is_bot'))
            .setRequired(false),
        )
        .addUserOption((option) =>
          option
            .setName('exclude')
            .setDescription(t('other:command.team.random.exclude'))
            .setRequired(false),
        ),
    ),
  hasSubCommands: true,
});

const command = ENABLE_SUBCOMMAND_TEAM?.toLowerCase() === 'true' ? teamCommand : emptyCommand;

export default command;
