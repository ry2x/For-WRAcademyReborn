import config from '@/config.js';
import { getChampByHeroId, getLanePositionSets } from '@/data/championData';
import { getTopChampionsByWinRate } from '@/data/winRate';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import { getRankRange } from '@/subCommands/champion/winrate.js';
import SubCommand from '@/templates/SubCommand.js';
import { WIN_RATE_DEFAULTS, type LaneKey, type LANES, type RANK_RANGES } from '@/types/common.js';
import { type HeroStats } from '@/types/winRate';
import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';

/**
 * Rank emojis for win rate display
 */
export const WIN_RATE_RANK_EMOJIS = ['👑', '🥈', '🥉', '4️⃣', '5️⃣'] as const;

/**
 * Creates a formatted string for a champion's win rate statistics
 * @param stat - The champion's statistics
 * @param index - The rank index (0-4)
 * @returns Formatted string with rank, name, win rate, and pick rate
 */
function formatChampionStats(stat: HeroStats, index: number): string {
  const champion = getChampByHeroId(stat.hero_id);
  const rankEmoji = WIN_RATE_RANK_EMOJIS[index];
  const winRate = stat.win_rate_percent ?? '-';
  const pickRate = stat.appear_rate_percent ?? '-';

  return `${rankEmoji}:${champion?.name} ⚔️勝率: ${winRate}% ⚒️ピック率: ${pickRate}%`;
}

/**
 * Creates a field for win rate statistics of a specific lane
 * @param lane - The lane configuration
 * @param rank - The rank configuration
 * @returns Formatted field value with top 5 champions
 */
function createWinRateField(
  lane: { apiParam: (typeof LANES)[keyof typeof LANES]['apiParam'] },
  rank: { apiParam: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'] },
): string {
  const stats = getTopChampionsByWinRate(lane.apiParam, rank.apiParam, 5);
  return stats.map((stat, index) => formatChampionStats(stat, index)).join('\n');
}

/**
 * Creates an embed for lane win rate statistics
 * @param targetLanes - Array of lane configurations
 * @param rank - The rank configuration
 * @returns Embed with lane win rate statistics
 */
function createLaneWinRateEmbed(
  targetLanes: (typeof LANES)[keyof typeof LANES][],
  rank: (typeof RANK_RANGES)[keyof typeof RANK_RANGES],
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`各レーンでの勝率トップチャンピョン:${rank.emoji}${rank.name}`)
    .setColor(Colors.Aqua)
    .addFields(
      targetLanes.map((lane) => ({
        name: `${lane.name}での勝率${lane.emoji}`,
        value: createWinRateField(lane, rank),
      })),
    );
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const rankValue = interaction.options.getString('rank', false) ?? WIN_RATE_DEFAULTS.RANK;
    const laneValue = interaction.options.getString('lane', false) ?? WIN_RATE_DEFAULTS.LANE;

    const rank = getRankRange(rankValue);
    if (!rank) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(config.championError.invalidRank)],
      });
      return;
    }

    const targetLanes = getLanePositionSets(laneValue as LaneKey);
    const embed = createLaneWinRateEmbed(targetLanes, rank);

    await interaction.editReply({ embeds: [embed] });
  },
});
