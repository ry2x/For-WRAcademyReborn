import config from '@/constants/config.js';
import { RANK_EMOJIS, WIN_RATE_DEFAULTS, type LANES, type RANK_RANGES } from '@/constants/game.js';
import { getChampByHeroId, getLanePositionSets } from '@/data/championData.js';
import { getTopChampionsByStrength } from '@/data/winRate.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import type { LaneKey } from '@/types/game.js';
import type { HeroStats } from '@/types/winRate.js';
import { getRankRange } from '@/utils/rankUtils.js';
import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';

function getRankEmojiByStrengthLevel(strLevel: string | null): string {
  if (strLevel === null) return '';
  const level = parseInt(strLevel);
  if (level === 5) return '🚀';
  if (level === 4) return '✈️';
  if (level === 3) return '🚗';
  return '';
}

function formatChampionStats(stat: HeroStats, index: number): string {
  const champion = getChampByHeroId(stat.hero_id);
  const rankEmoji = RANK_EMOJIS[index];

  return (
    `${rankEmoji}:**${champion?.name}**\n` +
    `┗ ⚔️:${stat.strength ?? '-'}ポイント ${getRankEmojiByStrengthLevel(stat?.strength_level ?? null)}`
  );
}

function createStrengthField(
  lane: { apiParam: (typeof LANES)[keyof typeof LANES]['apiParam'] },
  rank: { apiParam: (typeof RANK_RANGES)[keyof typeof RANK_RANGES]['apiParam'] },
): string {
  const stats = getTopChampionsByStrength(lane.apiParam, rank.apiParam, 5);
  return stats.map((stat, index) => formatChampionStats(stat, index)).join('\n');
}

function createLaneStrengthEmbed(
  targetLanes: (typeof LANES)[keyof typeof LANES][],
  rank: (typeof RANK_RANGES)[keyof typeof RANK_RANGES],
): EmbedBuilder {
  const fields = targetLanes
    .filter((lane) => lane.value !== 'all')
    .map((lane) => {
      const fieldValue = createStrengthField(lane, rank).toString();
      return {
        name: `${lane.name}でのシステムの評価${lane.emoji}`,
        value: fieldValue.length > 0 ? fieldValue : '❌データがありません。',
      };
    });
  return new EmbedBuilder()
    .setTitle(`各レーンでの評価トップ:${rank.emoji}${rank.name}`)
    .setDescription('システム的に計算されたチャンピオンの評価 by RIOT')
    .setColor(Colors.Aqua)
    .addFields(fields);
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
    const embed = createLaneStrengthEmbed(targetLanes, rank);

    await interaction.editReply({ embeds: [embed] });
  },
});
