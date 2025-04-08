import config from '@/config.js';
import { getChampionByName, getChampionLanes, getLanePositionSets } from '@/data/championData.js';
import { getChampionStats } from '@/data/winRate.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import { RANK_RANGES, WIN_RATE_DEFAULTS, type LaneKey, type LANES } from '@/types/common.js';
import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';

export function getRankRange(
  rankValue: string,
): (typeof RANK_RANGES)[keyof typeof RANK_RANGES] | undefined {
  return Object.values(RANK_RANGES).find((rank) => rank.value === rankValue);
}

function createChampionStatsField(
  championId: number,
  lane: { apiParam: (typeof LANES)[keyof typeof LANES]['apiParam'] },
  rank: { apiParam: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'] },
) {
  const stats = getChampionStats(championId, lane.apiParam, rank.apiParam);

  return (
    `⚔️勝率: ${stats?.win_rate_percent ?? '-'}%\n` +
    `⚒️ピック率: ${stats?.appear_rate_percent ?? '-'}%\n` +
    `❌バン率: ${stats?.forbid_rate_percent ?? '-'}%`
  );
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const champName = interaction.options.getString('champion_name', true);
    const rankValue = interaction.options.getString('rank', false) ?? WIN_RATE_DEFAULTS.RANK;
    const laneValue = interaction.options.getString('lane', false);

    const rank = getRankRange(rankValue);
    if (!rank) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(config.championError.invalidRank)],
      });
      return;
    }

    const champ = getChampionByName(champName);
    if (!champ) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(config.championError.invalidChampion)],
      });
      return;
    }

    if (!champ.is_wr) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(config.championError.notAvailable)],
      });
      return;
    }

    const targetLanes = laneValue
      ? getLanePositionSets(laneValue as LaneKey)
      : getChampionLanes(champ);

    const embed = new EmbedBuilder()
      .setColor(Colors.Aqua)
      .setTitle(`${champ.name}の勝率:${rank.name}${rank.emoji}`)
      .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${champ.id}.png`)
      .addFields(
        Object.entries(targetLanes).map(([, lane]) => ({
          name: `${lane.name} ${lane.emoji}`,
          value: createChampionStatsField(
            champ.hero_id,
            { apiParam: lane.apiParam },
            { apiParam: rank.apiParam },
          ),
        })),
      );

    await interaction.editReply({ embeds: [embed] });
  },
});
