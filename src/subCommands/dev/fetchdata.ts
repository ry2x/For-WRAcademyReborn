import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { fetchChampionData } from '../../data/championData.js';
import { fetchWildRiftData } from '../../data/wildriftRss.js';
import SubCommand from '../../templates/SubCommand.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    await fetchChampionData();
    await fetchWildRiftData();

    await interaction.editReply({
      embeds: [
        new EmbedBuilder().setColor(Colors.Aqua).setDescription('各種データを更新しました。'),
      ],
    });
  },
});
