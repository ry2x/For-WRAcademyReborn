import { getChampionByName, getChampionLanes, rankRanges } from '@/data/championData.js';
import { getChampionStats } from '@/data/winRate.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import type { lane, rankRange } from '@/types/winRate.js';
import { Colors, EmbedBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';

const ERROR_MESSAGES = {
  INVALID_RANK: '❌ランクが正しく指定されていません。',
  INVALID_CHAMPION: '❌チャンピオンの名前が指定されていません。',
  NOT_AVAILABLE: '❌チャンピオンはワイルドリフトで使用可能ではありません。',
} as const;

const getRankRange = (
  rankValue: string,
): (typeof rankRanges)[keyof typeof rankRanges] | undefined => {
  return Object.values(rankRanges).find((v) => v.value === rankValue);
};

const createChampionStatsField = (
  championId: number,
  lane: { apiParam: lane },
  rank: { apiParam: rankRange },
) => {
  const stats = getChampionStats(championId, lane.apiParam, rank.apiParam);

  return (
    `⚔️勝率: ${stats?.win_rate_percent ?? '-'}%\n` +
    `⚒️ピック率: ${stats?.appear_rate_percent ?? '-'}%\n` +
    `❌バン率: ${stats?.forbid_rate_percent ?? '-'}%`
  );
};

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
      content: '処理中...',
      flags: MessageFlags.Ephemeral,
    });

    const champName = interaction.options.getString('champion_name', true);
    const rankValue = interaction.options.getString('rank', false) ?? rankRanges.masterPlus.value;

    const rank = getRankRange(rankValue);
    if (!rank) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(ERROR_MESSAGES.INVALID_RANK)],
      });
      return;
    }

    const champ = getChampionByName(champName);
    if (!champ) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(ERROR_MESSAGES.INVALID_CHAMPION)],
      });
      return;
    }

    if (!champ.is_wr) {
      await interaction.editReply({
        content: '',
        embeds: [interactionErrorEmbed(ERROR_MESSAGES.NOT_AVAILABLE)],
      });
      return;
    }

    const targetLanes = getChampionLanes(champ);

    const embed = new EmbedBuilder()
      .setColor(Colors.Aqua)
      .setTitle(`${champ.name}の勝率${rank.emoji}`)
      .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${champ.id}.png`)
      .addFields(
        Object.entries(targetLanes).map(([, lane]) => ({
          name: `${lane.name} ${lane.emoji}`,
          value: createChampionStatsField(champ.hero_id, lane, rank),
        })),
      );

    await interaction.followUp({ embeds: [embed] });
  },
});
