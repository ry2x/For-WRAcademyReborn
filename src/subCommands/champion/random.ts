import { getChampionsByLane } from '@/data/championData.js';
import { getEmoji } from '@/data/emoji.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import type { LaneKey } from '@/types/game.js';
import { getLaneEmoji } from '@/utils/constantsUtils.js';
import { t } from '@/utils/i18n.js';
import { Colors, EmbedBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const lane = interaction.options.getString('lane', true) as LaneKey;
    let count = interaction.options.getInteger('count', false) ?? 1;
    const wrOnly = interaction.options.getBoolean('wr_only') ?? true;

    let champions = getChampionsByLane(lane);
    if (wrOnly) {
      champions = champions.filter((champ) => champ.is_wr);
    }

    if (champions.length === 0) {
      await interaction.deleteReply();
      await interaction.followUp({
        embeds: [interactionErrorEmbed(t('champion:body.random.not_found'))],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    count = Math.min(count, champions.length);
    const randomChampions = champions.sort(() => 0.5 - Math.random()).slice(0, count);

    const embed = new EmbedBuilder()
      .setTitle(
        `${t('champion:body.random.title')}${wrOnly ? getEmoji('WR') : getEmoji('SR')}：` +
          `${count}${t('champion:body.random.champion_count')}` +
          ` (${lane === 'all' ? t('champion:body.random.allLane') : lane.toUpperCase()}${getLaneEmoji(lane)})`,
      )
      .setDescription(
        randomChampions.map((champ) => `**・${champ.name}** - *${champ.title}*`).join('\n'),
      )
      .setThumbnail(
        `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${randomChampions[0].id}.png`,
      )
      .setFooter({ text: `${t('champion:body.random.selected_count')}: ${count}` })
      .setColor(Colors.Orange);

    await interaction.editReply({ embeds: [embed] });
  },
});
