import { Colors, SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import {
  getTipsFromContent,
  getWildriftFaivcon,
  getWildriftNews,
  unixMsToYMD,
} from '../utils/wildriftRss.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('shownews')
    .setDescription('ワイルドリフト公式ページから最新のニュース6件を表示します。'),
  async execute(interaction) {
    await interaction.deferReply();
    const news = getWildriftNews(6);
    const embed = {
      title: 'ワイルドリフト公式ニュース',
      color: Colors.Green,
      fields: news.map((item) => ({
        name: `${unixMsToYMD(item.retrieved)} : ${item.title}`,
        value: `[ここから確認する](${item.link})\n概要 : ${getTipsFromContent(item.contents)}`,
      })),
      thumbnail: { url: getWildriftFaivcon() },
    };
    await interaction.editReply({ embeds: [embed] });
  },
});
