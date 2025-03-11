import { Colors, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';
import {
  getTipsFromContent,
  getWildriftFaivcon,
  getWildriftNews,
  unixMsToYMD,
} from '../../data/wildriftRss.js';
import { interactionErrorEmbed } from '../../embeds/errorEmbed.js';
import SubCommand from '../../templates/SubCommand.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const count = interaction.options.getNumber('count', false) ?? 6;

    const news = getWildriftNews(count);
    if (news.length === 0) {
      await interaction.followUp({
        embeds: [interactionErrorEmbed('❌ニュースの取得に失敗しました。')],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const embed = {
      title: 'ワイルドリフト公式ニュース',
      color: Colors.Green,
      fields: news.map((item) => ({
        name: `★${unixMsToYMD(item.retrieved)} : ${item.title}`,
        value: `[ここから確認する](${item.link})\n概要 : ${getTipsFromContent(item.contents)}`,
      })),
      thumbnail: { url: getWildriftFaivcon() },
    };
    await interaction.editReply({ embeds: [embed] });
  },
});
