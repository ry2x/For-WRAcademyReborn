import { fetchChampionData } from '@/data/championData.js';
import { fetchWildRiftData } from '@/data/wildriftRss.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import { t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';
import {
  Colors,
  EmbedBuilder,
  type ChatInputCommandInteraction,
} from 'discord.js';

// Subcommand to fetch and update game data
export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      if (interaction.user.id !== client.application?.owner?.id) {
        await interaction.editReply({
          embeds: [
            interactionErrorEmbed(t('other:body.dev.fetch.not_available')),
          ],
        });
        return;
      }

      // Send initial status message
      const initialEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setDescription(t('other:body.dev.fetch.start'));
      await interaction.editReply({ embeds: [initialEmbed] });

      // Update champion data and show progress
      const championEmbed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setDescription(t('other:body.dev.fetch.champion'));
      await interaction.editReply({ embeds: [championEmbed] });
      await fetchChampionData();

      // Update Wild Rift data and show progress
      const wildRiftEmbed = new EmbedBuilder()
        .setColor(Colors.Purple)
        .setDescription(t('other:body.dev.fetch.wildrift'));
      await interaction.editReply({ embeds: [wildRiftEmbed] });
      await fetchWildRiftData();

      // Send completion message
      const successEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription(t('other:body.dev.fetch.complete'));
      await interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      // Handle and log any errors during the update process
      logger.error(t('other:body.dev.fetch.error'), error);
      await interaction.editReply({
        embeds: [
          interactionErrorEmbed(
            t('other:body.dev.fetch.error') +
              '\n' +
              t('other:body.dev.fetch.check'),
          ),
        ],
      });
    }
  },
});
