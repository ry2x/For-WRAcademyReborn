import { WIN_RATE_DEFAULTS } from '@/constants/game.js';
import { getChampionByName, getChampionLanes } from '@/data/championData.js';
import { getEmoji } from '@/data/emoji.js';
import { getChampionStats } from '@/data/winRate.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import type { Lane, LaneKey, PositionSet, RankRange, RankRangeKey } from '@/types/game.js';
import { getLanePositionSets, getRankRange } from '@/utils/constantsUtils.js';
import { getIsFloating } from '@/utils/formatUtils.js';
import { t } from '@/utils/i18n.js';
import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';

/**
 * Creates a formatted string for a champion's statistics
 * @param stats - The champion's statistics
 * @returns Formatted string with win rate, pick rate, and ban rate
 */
function formatChampionStats(stats: ReturnType<typeof getChampionStats>): string {
  return (
    `⚔️:${stats?.win_rate_percent ?? '-'}% ${getIsFloating(stats?.win_rate_float ?? null)}\n` +
    `⚒️:${stats?.appear_rate_percent ?? '-'}% ${getIsFloating(stats?.appear_rate_float ?? null)}\n` +
    `❌:${stats?.forbid_rate_percent ?? '-'}% ${getIsFloating(stats?.forbid_rate_float ?? null)}`
  );
}

/**
 * Creates a field for champion statistics in a specific lane
 * @param championId - The champion's ID
 * @param lane - The lane configuration
 * @param rank - The rank configuration
 * @returns Formatted field value with champion statistics
 */
function createChampionStatsField(
  championId: number,
  lane: { apiParam: Lane },
  rank: { apiParam: RankRange },
): string {
  const stats = getChampionStats(championId, lane.apiParam, rank.apiParam);
  return formatChampionStats(stats);
}

/**
 * Creates an embed for champion win rate statistics
 * @param champion - The champion to create the embed for
 * @param targetLanes - Array of lane configurations
 * @param rank - The rank configuration
 * @returns Embed with champion win rate statistics
 */
function createChampionWinRateEmbed(
  champion: NonNullable<ReturnType<typeof getChampionByName>>,
  targetLanes: (PositionSet<LaneKey> & {
    apiParam: Lane;
  })[],
  rank: PositionSet<RankRangeKey> & {
    apiParam: RankRange;
  },
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.Aqua)
    .setTitle(
      t('champion:body.stats.winrate.title', {
        name: champion.name,
        rank: getEmoji(rank.emoji) + t(`constants:${rank.name}`),
      }),
    )
    .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${champion.id}.png`)
    .setDescription(t('champion:body.stats.winrate.description'))
    .addFields(
      targetLanes
        .filter((lane) => lane.value !== 'all')
        .map((lane) => ({
          name: `${t(`constants:${lane.name}`)} ${getEmoji(lane.emoji)}`,
          value: createChampionStatsField(
            champion.hero_id,
            { apiParam: lane.apiParam },
            { apiParam: rank.apiParam },
          ),
        })),
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
        embeds: [interactionErrorEmbed(t('champion:body.stats.invalidRank'))],
      });
      return;
    }

    const champ = getChampionByName(champName);
    if (!champ) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(t('champion:body.stats.invalid_champion'))],
      });
      return;
    }

    if (!champ.is_wr) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(t('champion:body.stats.not_available'))],
      });
      return;
    }

    const targetLanes = laneValue
      ? getLanePositionSets(laneValue as LaneKey)
      : getChampionLanes(champ);

    const embed = createChampionWinRateEmbed(champ, targetLanes, rank);
    await interaction.editReply({ embeds: [embed] });
  },
});
