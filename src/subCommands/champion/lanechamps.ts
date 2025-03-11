import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  MessageFlags,
  type ChatInputCommandInteraction,
} from 'discord.js';
import { getChampionsByLane, getLaneEmoji } from '../../data/championData.js';
import { interactionErrorEmbed } from '../../embed/errorEmbed.js';
import SubCommand from '../../templates/SubCommand.js';

export const CHAMP_PER_PAGE = 15;

export function createPageEmbed(
  page: number,
  championNames: string[],
  lane: string,
  totalPages: number,
  perPage: number,
): EmbedBuilder {
  const start = page * perPage;
  const currentChamps = championNames.slice(start, start + perPage);
  return new EmbedBuilder()
    .setTitle(`${getLaneEmoji(lane)}${lane.toUpperCase()}のチャンピオン一覧`)
    .setDescription(currentChamps.map((name) => `・**${name}**`).join('\n'))
    .setFooter({ text: `${page + 1} / ${totalPages} (${championNames.length})` })
    .setColor(Colors.Orange);
}

export function createPageButton(page: number, lane: string, totalPages: number) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`champLane-${lane}-${page - 1}`)
      .setLabel('⬅️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 0),
    new ButtonBuilder()
      .setCustomId(`champLane-${lane}-${page + 1}`)
      .setLabel('➡️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === totalPages - 1),
  );
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const lane = interaction.options.getString('lane', true);
    const champions = getChampionsByLane(lane);
    if (champions.length === 0) {
      await interaction.reply({
        embeds: [interactionErrorEmbed('❌該当するチャンピオンがいません。')],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const championNames = champions.map(
      (champ) =>
        '<:SR:1343276485942841485>' +
        (champ.is_wr ? ' <:WR:1343276543945740298>' : ' ❌ ') +
        champ.name,
    );
    const totalPages = Math.ceil(championNames.length / CHAMP_PER_PAGE);

    await interaction.reply({
      embeds: [createPageEmbed(0, championNames, lane, totalPages, CHAMP_PER_PAGE)],
      components: [createPageButton(0, lane, totalPages)],
    });
  },
});
