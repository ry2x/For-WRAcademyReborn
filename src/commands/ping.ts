import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('現在のサーバー間(Discord⇔BOT)の遅延を表示します。'),
  async execute(interaction): Promise<void> {
    const embed = (description: string): EmbedBuilder => {
      return new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle('Ping')
        .setDescription(`ping値は${description}msです`);
    };

    await interaction.reply({ embeds: [embed(client.ws.ping.toString())], ephemeral: true });
  },
});
