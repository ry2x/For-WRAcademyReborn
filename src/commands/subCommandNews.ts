import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { emptyCommand } from '@/utils/emptyCommand.js';
import { t } from '@/utils/i18n.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

const { ENABLE_SUBCOMMAND_NEWS } = process.env;

const newsCommand = new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('news')
    .setDescription(t('other:command.news.description'))
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('wildrift')
        .setDescription(t('other:command.news.wildrift.description'))
        .addNumberOption((option) =>
          option
            .setName('count')
            .setDescription(t('other:command.news.wildrift.count'))
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(10),
        ),
    ),
  hasSubCommands: true,
});

const command =
  ENABLE_SUBCOMMAND_NEWS?.toLowerCase() === 'true' ? newsCommand : emptyCommand;

export default command;
