import { LANES, ROLES } from '@/constants/game.js';
import { getChampionByName } from '@/data/championData.js';
import { getEmoji } from '@/data/emoji.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import { type Champion } from '@/types/champs.js';
import { t } from '@/utils/i18n.js';
import { Colors, EmbedBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';

/**
 * Champion level display configuration
 */
const CHAMPION_LEVEL_DISPLAY = {
  0: '⬜⬜⬜',
  1: '🟦⬜⬜',
  2: '🟨🟨⬜',
  3: '🟧🟧🟧',
} as const;

/**
 * Gets the lanes a champion can play in
 * @param champion - The champion to get lanes for
 * @returns Formatted string of lanes
 */
export function getLanes(champion: Champion): string {
  return Object.entries(LANES)
    .filter(([, lane]) => champion.lanes.includes(lane.value))
    .map(([, lane]) => `${getEmoji(lane.emoji)}: ${t(`constants:${lane.name}`)}`)
    .join('\n');
}

/**
 * Gets the tags/classes of a champion
 * @param champion - The champion to get tags for
 * @returns Formatted string of tags
 */
export function getTags(champion: Champion): string {
  return Object.entries(ROLES)
    .filter(([, tag]) => champion.roles.includes(tag.value))
    .map(([, tag]) => `${t(`constants:${tag.name}`)}: ${getEmoji(tag.emoji)}`)
    .join('\n');
}

/**
 * Creates a champion info embed
 * @param champion - The champion to create the embed for
 * @returns Champion info embed
 */
export function createChampionEmbed(champion: Champion): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(Colors.Orange)
    .setTitle(champion.name)
    .setDescription(
      champion.is_free ? `${champion.title}   ${t('champion:body.info.free')}✅` : champion.title,
    )
    .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${champion.id}.png`);

  const levelDisplay = (level: number) =>
    CHAMPION_LEVEL_DISPLAY[level as keyof typeof CHAMPION_LEVEL_DISPLAY];

  return embed.addFields(
    {
      name: champion.is_wr
        ? `${getEmoji("WR")} ${getEmoji("SR")}`
        : getEmoji("SR"),
      value: `${t('champion:body.info.type')} : ${champion.type}`,
    },
    { name: `${t('champion:body.info.lane')}`, value: getLanes(champion), inline: true },
    { name: `${t('champion:body.info.role')}`, value: getTags(champion), inline: true },
    {
      name: `${t('champion:body.info.difficulty')}`,
      value: levelDisplay(champion.difficult),
      inline: true,
    },
    {
      name: `${t('champion:body.info.damage')}`,
      value: levelDisplay(champion.damage),
      inline: true,
    },
    {
      name: `${t('champion:body.info.survivability')}`,
      value: levelDisplay(champion.survive),
      inline: true,
    },
    {
      name: `${t('champion:body.info.utility')}`,
      value: levelDisplay(champion.utility),
      inline: true,
    },
    {
      name: `${t('champion:body.info.description')}`,
      value: champion.describe.length > 1024 ? champion.describe.slice(0, 1024) : champion.describe,
    },
  );
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const championName = interaction.options.getString('champion_name');

    if (!championName) {
      await interaction.reply({
        embeds: [interactionErrorEmbed(t('champion:body.info.not_specified'))],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const champion = getChampionByName(championName);
    if (!champion) {
      await interaction.reply({
        embeds: [interactionErrorEmbed(t('champion:body.info.not_found', { name: championName }))],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({ embeds: [createChampionEmbed(champion)] });
  },
});
