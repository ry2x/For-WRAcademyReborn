import config from '@/constants/config.js';
import { getChampionsByLane, getLaneEmoji } from '@/data/championData.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import type { LaneKey } from '@/types/game.js';
import { Colors, EmbedBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const lane = interaction.options.getString('lane', true);
    let count = interaction.options.getInteger('count', false) ?? 1;
    const wrOnly = interaction.options.getBoolean('wr_only') ?? true;

    let champions = getChampionsByLane(lane as LaneKey);
    if (wrOnly) {
      champions = champions.filter((champ) => champ.is_wr);
    }

    if (champions.length === 0) {
      await interaction.deleteReply();
      await interaction.followUp({
        embeds: [interactionErrorEmbed(config.championError.notFound)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    count = Math.min(count, champions.length);
    const randomChampions = champions.sort(() => 0.5 - Math.random()).slice(0, count);

    const embed = new EmbedBuilder()
      .setTitle(
        `🎲 ランダムチャンピオン${wrOnly ? '<:WR:1343276543945740298>' : '<:SR:1343276485942841485>'}：` +
          `${count}体 (${lane === 'all' ? '全レーン' : lane.toUpperCase()}${getLaneEmoji(lane)})`,
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
