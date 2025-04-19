import { fetchChampionData } from '@/data/championData.js';
import { fetchWildRiftData } from '@/data/wildriftRss.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import logger from '@/utils/logger.js';
import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';

// Subcommand to fetch and update game data
export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      if (interaction.user.id !== client.application?.owner?.id) {
        await interaction.editReply({
          embeds: [interactionErrorEmbed('❌あなたはこのコマンドを利用できません。')],
        });
        return;
      }

      // Send initial status message
      const initialEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setDescription('データの更新を開始します...');
      await interaction.editReply({ embeds: [initialEmbed] });

      // Update champion data and show progress
      const championEmbed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setDescription('チャンピオンデータを更新中...');
      await interaction.editReply({ embeds: [championEmbed] });
      await fetchChampionData();

      // Update Wild Rift data and show progress
      const wildRiftEmbed = new EmbedBuilder()
        .setColor(Colors.Purple)
        .setDescription('WildRiftデータを更新中...');
      await interaction.editReply({ embeds: [wildRiftEmbed] });
      await fetchWildRiftData();

      // Send completion message
      const successEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription('✅ すべてのデータの更新が完了しました！');
      await interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      // Handle and log any errors during the update process
      logger.error('データ更新中にエラーが発生しました:', error);
      await interaction.editReply({
        embeds: [
          interactionErrorEmbed(
            '❌データの更新中にエラーが発生しました。\n詳細はログを確認してください。',
          ),
        ],
      });
    }
  },
});
