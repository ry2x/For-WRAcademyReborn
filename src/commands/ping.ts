import { pingEmbed } from '@/embeds/pingEmbed.js';
import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { MessageFlags, SlashCommandBuilder } from 'discord.js';

const { ENABLE_SUBCOMMAND_PING } = process.env;

const command = ENABLE_SUBCOMMAND_PING?.toLowerCase() === 'true' ? new ApplicationCommand({  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('現在のサーバー間(Discord⇔BOT)の遅延を表示します。'),
  async execute(interaction): Promise<void> {
    await interaction.reply({
      embeds: [pingEmbed(client.ws.ping.toString())],
      flags: MessageFlags.Ephemeral,
    });
  },
}) : new ApplicationCommand({
  data: new SlashCommandBuilder().setName('empty').setDescription('empty command'),
  hasSubCommands: false,
  execute: async () => {
    // empty execute-function
  },
});

export default command;
