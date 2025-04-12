import config from '@/constants/config.js';
import { RANK_EMOJIS, WIN_RATE_DEFAULTS } from '@/constants/game.js';
import {
  getChampByHeroId,
  getLanePositionSets,
  type LANES,
  type RANK_RANGES,
} from '@/data/championData.js';
import { getTopChampionsByPickRate } from '@/data/winRate.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import { getRankRange } from '@/subCommands/champion/stats/winrate.js';
import SubCommand from '@/templates/SubCommand.js';
import type { LaneKey } from '@/types/game.js';
import type { HeroStats } from '@/types/winRate.js';
import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';

function formatChampionStats(stat: HeroStats, index: number): string {
  const champion = getChampByHeroId(stat.hero_id);
  const rankEmoji = RANK_EMOJIS[index];
  const banRate = stat.forbid_rate_percent ?? '-';
  const pickRate = stat.appear_rate_percent ?? '-';

  return `${rankEmoji}:**${champion?.name}**\n┗ ⚒️:${pickRate}%  ❌:${banRate}%`;
}

function createPickRateField(
  lane: { apiParam: (typeof LANES)[keyof typeof LANES]['apiParam'] },
  rank: { apiParam: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'] },
  isBanRate: boolean,
): string {
  const stats = getTopChampionsByPickRate(lane.apiParam, rank.apiParam, 5, isBanRate);
  return stats.map((stat, index) => formatChampionStats(stat, index)).join('\n');
}

function createLanePickRateEmbed(
  targetLanes: (typeof LANES)[keyof typeof LANES][],
  rank: (typeof RANK_RANGES)[keyof typeof RANK_RANGES],
  isBanRate: boolean,
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`各レーンでのピック率トップ:${rank.emoji}${rank.name}`)
    .setDescription('⚒️:ピック率 ❌:バン率')
    .setColor(Colors.Aqua)
    .addFields(
      targetLanes
        .filter((lane) => lane.value !== 'all')
        .map((lane) => ({
          name: `${lane.name}でのピック率${lane.emoji}`,
          value: createPickRateField(lane, rank, isBanRate).toString(),
        })),
    );
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const rankValue = interaction.options.getString('rank', false) ?? WIN_RATE_DEFAULTS.RANK;
    const laneValue = interaction.options.getString('lane', false) ?? WIN_RATE_DEFAULTS.LANE;
    const isBanRate = interaction.options.getBoolean('banrate', false) ?? false;

    const rank = getRankRange(rankValue);
    if (!rank) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(config.championError.invalidRank)],
      });
      return;
    }

    const targetLanes = getLanePositionSets(laneValue as LaneKey);
    const embed = createLanePickRateEmbed(targetLanes, rank, isBanRate);

    await interaction.editReply({ embeds: [embed] });
  },
});
