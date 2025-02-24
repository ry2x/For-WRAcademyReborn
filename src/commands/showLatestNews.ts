import { Colors, SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import { getTipsFromContent, getWildriftFaivcon, getWildriftNews } from '../utils/wildriftRss.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('showLatestNews')
    .setDescription('ワイルドリフト公式ページから最新のニュースを表示します。'),
  async execute(interaction) {
    await interaction.deferReply();
    const news = getWildriftNews(1);
    const embed = {
      title: 'ワイルドリフト公式ニュース',
      color: Colors.Green,
      fields: news.map((item) => ({
        name: item.title,
        value: `[リンク](${item.link})\n${getTipsFromContent(item.content)}`,
      })),
      thumbnail: { url: getWildriftFaivcon() },
    };
    await interaction.editReply({ embeds: [embed] });
  },
});
