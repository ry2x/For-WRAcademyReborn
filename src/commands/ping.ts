import { pingEmbed } from '@/embeds/pingEmbed.js';
import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { emptyCommand } from '@/utils/emptyCommand.js';
import { t } from '@/utils/i18n.js';
import {
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';

const { ENABLE_SUBCOMMAND_PING } = process.env;

const pingCommand = new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(t('other:command.ping.description')),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [pingEmbed(client.ws.ping.toString())],
      flags: MessageFlags.Ephemeral,
    });
  },
});

const command =
  ENABLE_SUBCOMMAND_PING?.toLowerCase() === 'true' ? pingCommand : emptyCommand;

export default command;
