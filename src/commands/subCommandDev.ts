import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { emptyCommand } from '@/utils/emptyCommand.js';
import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';

const { ENABLE_SUBCOMMAND_DEV } = process.env;

const devCommand = new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('dev')
    .setDescription('Dev commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('pingserver')
        .setDescription('A ping command for dev'),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('messagedel')
        .setDescription('You can delete message from channel where you use')
        .addIntegerOption((option) =>
          option
            .setName('count')
            .setDescription('Count of message to delete (MAX:100)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('fetchdata')
        .setDescription('Fetch data from API'),
    ),
  hasSubCommands: true,
});

const command = ENABLE_SUBCOMMAND_DEV?.toLowerCase() === 'true' ? devCommand : emptyCommand;

export default command;
