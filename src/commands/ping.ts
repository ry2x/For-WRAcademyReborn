import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { pingEmbed } from '../embeds/pingEmbed.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('現在のサーバー間(Discord⇔BOT)の遅延を表示します。'),
  async execute(interaction): Promise<void> {
    await interaction.reply({
      embeds: [pingEmbed(client.ws.ping.toString())],
      flags: MessageFlags.Ephemeral,
    });
  },
});
