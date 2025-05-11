import { RANK_EMOJIS, WIN_RATE_DEFAULTS } from '@/constants/game.js';
import { getChampByHeroId } from '@/data/championData.js';
import { getEmoji } from '@/data/emoji.js';
import { getTopChampionsByWinRate, getWinRateDate } from '@/data/winRate.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import type {
  Lane,
  LaneKey,
  PositionSet,
  RankRange,
  RankRangeKey,
} from '@/types/game.js';
import { type HeroStats } from '@/types/winRate.js';
import { getLanePositionSets, getRankRange } from '@/utils/constantsUtils.js';
import { formatDateWithSlash, getIsFloating } from '@/utils/formatUtils.js';
import { t } from '@/utils/i18n.js';
import {
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
} from 'discord.js';

/**
 * Creates a formatted string for a champion's win rate statistics
 * @param stat - The champion's statistics
 * @param index - The rank index (0-4)
 * @returns Formatted string with rank, name, win rate, and pick rate
 */
function formatChampionStats(stat: HeroStats, index: number): string {
  const champion = getChampByHeroId(stat.hero_id);
  const rankEmoji = RANK_EMOJIS[index];

  return (
    `${rankEmoji}:**${champion?.name}**\n` +
    `┗ ⚔️:${stat.win_rate_percent ?? '-'}% ${getIsFloating(stat?.win_rate_float ?? null)}` +
    `  ⚒️:${stat.appear_rate_percent ?? '-'}% ${getIsFloating(stat?.appear_rate_float ?? null)}`
  );
}

/**
 * Creates a field for win rate statistics of a specific lane
 * @param lane - The lane configuration
 * @param rank - The rank configuration
 * @returns Formatted field value with top 5 champions
 */
function createWinRateField(
  lane: { apiParam: Lane },
  rank: { apiParam: RankRange },
): string {
  const stats = getTopChampionsByWinRate(lane.apiParam, rank.apiParam, 5);
  return stats
    .map((stat, index) => formatChampionStats(stat, index))
    .join('\n');
}

/**
 * Creates an embed for lane win rate statistics
 * @param targetLanes - Array of lane configurations
 * @param rank - The rank configuration
 * @returns Embed with lane win rate statistics
 */
function createLaneWinRateEmbed(
  targetLanes: (PositionSet<LaneKey> & {
    apiParam: Lane;
  })[],
  rank: PositionSet<RankRangeKey> & {
    apiParam: RankRange;
  },
): EmbedBuilder {
  const fields = targetLanes
    .filter((lane) => lane.value !== 'all')
    .map((lane) => {
      const fieldValue = createWinRateField(lane, rank).toString();
      return {
        name: t('champion:body.stats.lanewinrate.field', {
          lane: t(`constants:${lane.name}`),
          emoji: getEmoji(lane.emoji),
        }),
        value:
          fieldValue.length > 0
            ? fieldValue
            : t('champion:body.stats.lanewinrate.no_data'),
      };
    });
  return new EmbedBuilder()
    .setTitle(
      `${t('champion:body.stats.lanewinrate.title')}${getEmoji(rank.emoji)}${t(`constants:${rank.name}`)}`,
    )
    .setDescription(t('champion:body.stats.lanewinrate.description'))
    .setColor(Colors.Aqua)
    .addFields(fields)
    .setFooter({ text: formatDateWithSlash(getWinRateDate()) });
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const rankValue =
      interaction.options.getString('rank', false) ?? WIN_RATE_DEFAULTS.RANK;
    const laneValue =
      interaction.options.getString('lane', false) ?? WIN_RATE_DEFAULTS.LANE;

    const rank = getRankRange(rankValue);
    if (!rank) {
      await interaction.editReply({
        content: '',
        embeds: [
          interactionErrorEmbed(
            t('champion:body.stats.lanewinrate.invalid_rank'),
          ),
        ],
      });
      return;
    }

    const targetLanes = getLanePositionSets(laneValue as LaneKey);
    const embed = createLaneWinRateEmbed(targetLanes, rank);

    await interaction.editReply({ embeds: [embed] });
  },
});
