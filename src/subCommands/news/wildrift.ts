import {
  getTipsFromContent,
  getWildriftFaivcon,
  getWildriftNews,
  unixMsToYMD,
} from '@/data/wildriftRss.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import { Colors, MessageFlags, type APIEmbed, type ChatInputCommandInteraction } from 'discord.js';

// Constants
const DEFAULT_NEWS_COUNT = 6;
const MAX_NEWS_COUNT = 10;

/**
 * Creates an embed for displaying WildRift news
 * @param news - Array of news items to display
 * @returns Embed data for Discord message
 */
function createNewsEmbed(news: ReturnType<typeof getWildriftNews>): APIEmbed {
  return {
    title: 'ワイルドリフト公式ニュース',
    color: Colors.Green,
    fields: news.map((item) => ({
      name: `★${unixMsToYMD(item.retrieved)} : ${item.title}`,
      value: `[ここから確認する](${item.link})\n概要 : ${getTipsFromContent(item.contents)}`,
    })),
    thumbnail: { url: getWildriftFaivcon() },
  };
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      // Get news count from options, default to 6, max 10
      const count = Math.min(
        interaction.options.getNumber('count', false) ?? DEFAULT_NEWS_COUNT,
        MAX_NEWS_COUNT,
      );

      const news = getWildriftNews(count);

      // Handle empty news array
      if (news.length === 0) {
        await interaction.followUp({
          embeds: [interactionErrorEmbed('❌ニュースの取得に失敗しました。')],
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Create and send embed
      const embed = createNewsEmbed(news);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      // Handle any unexpected errors
      await interaction.followUp({
        embeds: [interactionErrorEmbed('❌予期せぬエラーが発生しました。')],
        flags: MessageFlags.Ephemeral,
      });
      throw error;
    }
  },
});
