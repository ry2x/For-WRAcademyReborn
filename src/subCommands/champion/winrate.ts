import { getChampionByName, getChampionLanes, rankRanges } from '@/data/championData';
import { getChampionStats } from '@/data/winRate';
import { interactionErrorEmbed } from '@/embeds/errorEmbed';
import SubCommand from '@/templates/SubCommand';
import type { RankRangeKey } from '@/types/champs';
import { Colors, EmbedBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const champName = interaction.options.getString('champion_name', true);
    const rankValue = interaction.options.getString('rank', false) ?? rankRanges.masterPlus.value;

    console.log(`champion: ${champName} rank: ${rankValue}`);

    const rank = Object.entries(rankRanges).find(
      ([, v]) => (v.value = rankValue as RankRangeKey),
    )?.[1];
    if (!rank) {
      await interaction.followUp({
        embeds: [interactionErrorEmbed('❌ランクが正しく指定されていません。')],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const champ = getChampionByName(champName);
    if (!champ) {
      await interaction.followUp({
        embeds: [interactionErrorEmbed('❌チャンピオンの名前が指定されていません。')],
        flags: MessageFlags.Ephemeral,
      });
      return;
    } else if (!champ.is_wr) {
      await interaction.followUp({
        embeds: [interactionErrorEmbed('❌チャンピオンはワイルドリフトで使用可能ではありません。')],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const targetLanes = getChampionLanes(champ);

    console.log(`target`, targetLanes);

    const embed = new EmbedBuilder()
      .setColor(Colors.Aqua)
      .setTitle(`${champ.name}の勝率等${rank.emoji}`)
      .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${champ.id}.png`)
      .addFields(
        Object.entries(targetLanes).map(([, v]) => ({
          name: `${v.name} ${v.emoji}`,
          value: `win rate: ${getChampionStats(champ.hero_id, v.apiParam, rank.apiParam)?.win_rate_percent}`,
        })),
      );

    await interaction.editReply({ embeds: [embed] });
  },
});
