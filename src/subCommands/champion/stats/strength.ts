import { RANK_EMOJIS, WIN_RATE_DEFAULTS, type LANES, type RANK_RANGES } from '@/constants/game.js';
import { getChampByHeroId } from '@/data/championData.js';
import { getTopChampionsByStrength } from '@/data/winRate.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import type { LaneKey } from '@/types/game.js';
import type { HeroStats } from '@/types/winRate.js';
import { getLanePositionSets, getRankRange } from '@/utils/constantsUtils.js';
import { t } from '@/utils/i18n.js';
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
    `┗ ⚔️:${stat.strength ?? '-'}${t('champion:body.stats.strength.point')} ` +
    ` ${getRankEmojiByStrengthLevel(stat?.strength_level ?? null)}`
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
        name: t('champion:body.stats.strength.field', {
          lane: t(`constants:${lane.name}`),
          emoji: lane.emoji,
        }),
        value: fieldValue.length > 0 ? fieldValue : t('champion:body.stats.strength.no_data'),
      };
    });
  return new EmbedBuilder()
    .setTitle(
      `${t('champion:body.stats.strength.title')}${rank.emoji}${t(`constants:${rank.name}`)}`,
    )
    .setDescription(t('champion:body.stats.strength.description'))
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
        embeds: [interactionErrorEmbed(t('champion:body.stats.strength.invalid_rank'))],
      });
      return;
    }

    const targetLanes = getLanePositionSets(laneValue as LaneKey);
    const embed = createLaneStrengthEmbed(targetLanes, rank);

    await interaction.editReply({ embeds: [embed] });
  },
});
