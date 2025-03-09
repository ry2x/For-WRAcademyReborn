import { Colors, EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import { getChampionsByLane, lanes, getLaneEmoji } from '../utils/championData.js';
import { interactionErrorEmbed } from '../utils/errorEmbed.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('randomchamp')
    .setDescription(
      '指定したレーンまたは全レーンからチャンピオンをランダムに表示します。(1体~10体:デフォルト1体)',
    )
    .addStringOption((option) =>
      option
        .setName('lane')
        .setDescription('レーンを指定')
        .setRequired(true)
        .addChoices(
          { name: 'All (全レーン)', value: lanes[0] },
          { name: 'Top', value: lanes[1] },
          { name: 'Jungle', value: lanes[2] },
          { name: 'Mid', value: lanes[3] },
          { name: 'ADC', value: lanes[4] },
          { name: 'Support', value: lanes[5] },
        ),
    )
    .addIntegerOption((option) =>
      option
        .setName('count')
        .setDescription('ランダムに選ぶチャンピオンの数（1〜10）')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(10),
    )
    .addBooleanOption((option) =>
      option
        .setName('wr_only')
        .setDescription('Wild Riftに実装されているチャンピオン限定にする (デフォルト: true)')
        .setRequired(false),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const lane = interaction.options.getString('lane', true);
    let count = interaction.options.getInteger('count', false) ?? 1;
    const wrOnly = interaction.options.getBoolean('wr_only') ?? true;

    let champions = getChampionsByLane(lane);
    if (wrOnly) {
      champions = champions.filter((champ) => champ.is_wr);
    }

    if (champions.length === 0) {
      await interaction.deleteReply();
      await interaction.followUp({
        embeds: [interactionErrorEmbed('❌ 該当するチャンピオンが見つかりません')],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    count = Math.min(count, champions.length);
    const randomChampions = champions.sort(() => 0.5 - Math.random()).slice(0, count);

    const embed = new EmbedBuilder()
      .setTitle(
        `🎲 ランダムチャンピオン${wrOnly ? '<:WR:1343276543945740298>' : '<:SR:1343276485942841485>'}：${count}体 (${lane === 'all' ? '全レーン' : lane.toUpperCase()}${getLaneEmoji(lane)})`,
      )
      .setDescription(
        randomChampions.map((champ) => `**・${champ.name}** - *${champ.title}*`).join('\n'),
      )
      .setThumbnail(
        `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${randomChampions[0].id}.png`,
      )
      .setFooter({ text: `選択数: ${count}` })
      .setColor(Colors.Orange);

    await interaction.editReply({ embeds: [embed] });
  },
});
