import { Colors, SlashCommandBuilder } from 'discord.js';
import {
  getTipsFromContent,
  getWildriftFaivcon,
  getWildriftNews,
  unixMsToYMD,
} from '../data/wildriftRss.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('showlatestnews')
    .setDescription('ワイルドリフト公式ページから最新のニュースを表示します。'),
  async execute(interaction) {
    await interaction.deferReply();
    const news = getWildriftNews(1);
    const embed = {
      title: 'ワイルドリフト公式ニュース',
      color: Colors.Green,
      fields: news.map((item) => ({
        name: item.title,
        value: `[ここから確認する](${item.link})\n概要：${getTipsFromContent(item.contents)}`,
      })),
      thumbnail: { url: getWildriftFaivcon() },
      footer: { text: unixMsToYMD(news[0].retrieved) },
    };
    await interaction.editReply({ embeds: [embed] });
  },
});
