import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { emptyCommand } from '@/utils/emptyCommand.js';
import { PermissionFlagsBits, SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
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
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('emoji')
        .setDescription('Manage an emoji in the server')
        .addStringOption((option) =>
          option
            .setName('name')
            .setDescription('Name of the emoji')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('action')
            .setDescription('Action to perform on the emoji (default: Create)')
            .setRequired(false)
            .addChoices(
              { name: 'Create', value: 'create' },
              { name: 'Update', value: 'update' },
              { name: 'Delete', value: 'delete' },
            )
        )
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription('URL of the emoji image (required for Create/Update action)')
            .setRequired(false),
        ),
    ),
  hasSubCommands: true,
});

const command = ENABLE_SUBCOMMAND_DEV?.toLowerCase() === 'true' ? devCommand : emptyCommand;
export default command;
