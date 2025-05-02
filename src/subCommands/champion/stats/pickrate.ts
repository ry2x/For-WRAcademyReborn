import { LANES, RANK_EMOJIS, type RANK_RANGES, WIN_RATE_DEFAULTS } from '@/constants/game.js';
import { getChampByHeroId } from '@/data/championData.js';
import { getTopChampionsByPickRate } from '@/data/winRate.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import type { Lane, LaneKey, PositionSet, RankRange, RankRangeKey } from '@/types/game.js';
import type { HeroStats } from '@/types/winRate.js';
import { getLanePositionSets, getRankRange } from '@/utils/constantsUtils.js';
import { getIsFloating } from '@/utils/formatUtils.js';
import { t } from '@/utils/i18n.js';
import { type ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js';

function formatChampionStats(stat: HeroStats, index: number): string {
  const champion = getChampByHeroId(stat.hero_id);
  const rankEmoji = RANK_EMOJIS[index];

  return (
    `${rankEmoji}:**${champion?.name}**\n` +
    `┗ ⚒️:${stat.appear_rate_percent ?? '-'}% ${getIsFloating(stat?.appear_rate_float ?? null)}` +
    `  ❌:${stat.forbid_rate_percent ?? '-'}% ${getIsFloating(stat?.forbid_rate_float ?? null)}`
  );
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
  targetLanes: (PositionSet<LaneKey> & {
    apiParam: Lane;
  })[],
  rank: PositionSet<RankRangeKey> & {
    apiParam: RankRange;
  },
  isBanRate: boolean,
): EmbedBuilder {
  const fields = targetLanes
    .filter((lane) => lane.value !== LANES.all.value)
    .map((lane) => {
      const fieldValue = createPickRateField(lane, rank, isBanRate).toString();
      return {
        name: t('champion:body.stats.pickrate.field', {
          lane: t(`constants:${lane.name}`),
          emoji: lane.emoji,
        }),
        value: fieldValue.length > 0 ? fieldValue : t('champion:body.stats.no_data'),
      };
    });
  return new EmbedBuilder()
    .setTitle(
      `${t('champion:body.stats.pickrate.title')}${rank.emoji}${t(`constants:${rank.name}`)}`,
    )
    .setDescription(t('champion:body.stats.pickrate.description'))
    .setColor(Colors.Aqua)
    .addFields(fields);
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
        embeds: [interactionErrorEmbed(t('champion:body.stats.pickrate.invalid_rank'))],
      });
      return;
    }

    const targetLanes = getLanePositionSets(laneValue as LaneKey);
    const embed = createLanePickRateEmbed(targetLanes, rank, isBanRate);

    await interaction.editReply({ embeds: [embed] });
  },
});
