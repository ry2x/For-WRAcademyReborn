import config from '@/config.js';
import { getChampionByName, getChampionLanes, getLanePositionSets } from '@/data/championData.js';
import { getChampionStats } from '@/data/winRate.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import { RANK_RANGES, WIN_RATE_DEFAULTS, type LaneKey, type LANES } from '@/types/common.js';
import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';

/**
 * Gets the rank range configuration from a value
 * @param rankValue - The rank value to find
 * @returns The rank configuration if found, undefined otherwise
 */
export function getRankRange(
  rankValue: string,
): (typeof RANK_RANGES)[keyof typeof RANK_RANGES] | undefined {
  return Object.values(RANK_RANGES).find((rank) => rank.value === rankValue);
}

/**
 * Creates a formatted string for a champion's statistics
 * @param stats - The champion's statistics
 * @returns Formatted string with win rate, pick rate, and ban rate
 */
function formatChampionStats(stats: ReturnType<typeof getChampionStats>): string {
  return (
    `⚔️:${stats?.win_rate_percent ?? '-'}%\n` +
    `⚒️:${stats?.appear_rate_percent ?? '-'}%\n` +
    `❌:${stats?.forbid_rate_percent ?? '-'}%`
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
  lane: { apiParam: (typeof LANES)[keyof typeof LANES]['apiParam'] },
  rank: { apiParam: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'] },
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
  targetLanes: (typeof LANES)[keyof typeof LANES][],
  rank: (typeof RANK_RANGES)[keyof typeof RANK_RANGES],
): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.Aqua)
    .setTitle(`${champion.name}の勝率:${rank.name}${rank.emoji}`)
    .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${champion.id}.png`)
    .setDescription('⚔️:勝率 ⚒️:ピック率 ❌:バン率')
    .addFields(
      targetLanes
        .filter((lane) => lane.value !== 'all')
        .map((lane) => ({
          name: `${lane.name} ${lane.emoji}`,
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

    const embed = createChampionWinRateEmbed(champ, targetLanes, rank);
    await interaction.editReply({ embeds: [embed] });
  },
});
