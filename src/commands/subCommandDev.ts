import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { emptyCommand } from '@/utils/emptyCommand.js';
import { t } from '@/utils/i18n.js';
import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
const { ENABLE_SUBCOMMAND_DEV } = process.env;

const devCommand = new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('dev')
    .setDescription(t('other:command.dev.description'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('pingserver')
        .setDescription(t('other:command.ping.description')),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('messagedel')
        .setDescription(t('other:command.dev.message_del.description'))
        .addIntegerOption((option) =>
          option
            .setName('count')
            .setDescription(t('other:command.dev.message_del.count'))
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('fetchdata')
        .setDescription(t('other:command.dev.fetch.description')),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('emoji')
        .setDescription(t('other:command.dev.emoji.description'))
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription(t('other:command.dev.emoji.name'))
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('action')
            .setDescription(t('other:command.dev.emoji.action'))
            .setRequired(false)
            .addChoices(
              { name: t('other:command.dev.emoji.create'), value: 'create' },
              { name: t('other:command.dev.emoji.update'), value: 'update' },
              { name: t('other:command.dev.emoji.delete'), value: 'delete' },
            ),
        )
        .addStringOption((option) =>
          option.setName('url').setDescription(t('other:command.dev.emoji.url')).setRequired(false),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder().setName('testemoji').setDescription('test subcommand'),
    ),
  hasSubCommands: true,
});

const command = ENABLE_SUBCOMMAND_DEV?.toLowerCase() === 'true' ? devCommand : emptyCommand;
export default command;
