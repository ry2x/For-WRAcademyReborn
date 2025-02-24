import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import { getChampionsByLane, lanes } from '../utils/championData.js';
import { interactionErrorEmbed } from '../utils/errorEmbed.js';

export const CHAMP_PER_PAGE = 15;

export function createPageEmbed(
  page: number,
  championNames: string[],
  lane: string,
  totalPages: number,
  perPage: number,
): EmbedBuilder {
  let laneEmoji;
  switch (lane) {
    case lanes[0]:
      laneEmoji = '<:Lane_Top:1343276732194750485>';
      break;
    case lanes[1]:
      laneEmoji = '<:Lane_Jungle:1343276691853934647>';
      break;
    case lanes[2]:
      laneEmoji = '<:Lane_Mid:1343276706143932447>';
      break;
    case lanes[3]:
      laneEmoji = '<:Lane_Bot:1343276674044792974>';
      break;
    case lanes[4]:
      laneEmoji = '<:Lane_Support:1343276719049543803>';
      break;
    default:
      laneEmoji = '';
  }
  const start = page * perPage;
  const currentChamps = championNames.slice(start, start + perPage);
  return new EmbedBuilder()
    .setTitle(`${laneEmoji}${lane}のチャンピオン一覧`)
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

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('lanechamps')
    .setDescription('指定したレーンのチャンピオン一覧を表示します')
    .addStringOption((option) =>
      option.setName('lane').setDescription('レーンを選択').setRequired(true).setAutocomplete(true),
    ),
  async execute(interaction): Promise<void> {
    const lane = interaction.options.getString('lane', true);
    const champions = getChampionsByLane(lane);
    if (champions.length === 0) {
      await interaction.reply({
        embeds: [interactionErrorEmbed('❌該当するチャンピョンがいません。')],
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
