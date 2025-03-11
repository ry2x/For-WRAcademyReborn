import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';
import SubCommand from '../../templates/SubCommand.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = (description: string): EmbedBuilder => {
      return new EmbedBuilder()
        .setColor(Colors.Blue)
        .setTitle('Ping')
        .setDescription(`ping値は${description}msです`);
    };

    await interaction.reply({
      embeds: [embed(client.ws.ping.toString())],
    });
  },
});
