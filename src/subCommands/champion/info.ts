import config from '@/config.js';
import { getChampionByName } from '@/data/championData.js';
import SubCommand from '@/templates/SubCommand.js';
import { type Champion } from '@/types/champs.js';
import { CHAMPION_ROLE_MAPPING, LANES, ROLES } from '@/types/common.js';
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
 * Champion information error messages
 */
const CHAMPION_ERROR_MESSAGES = {
  NO_NAME: config.championError.invalidChampion,
  NOT_FOUND: (name: string) => `❌チャンピオン「${name}」は見つかりませんでした。`,
} as const;

/**
 * Gets the roles a champion can play in
 * @param champion - The champion to get roles for
 * @returns Formatted string of roles
 */
export function getRoles(champion: Champion): string {
  return Object.values(LANES)
    .filter((lane) => champion[`is_${lane.value}` as keyof Champion])
    .map((lane) => `${lane.emoji}: ${lane.name}`)
    .join(', ');
}

/**
 * Gets the tags/classes of a champion
 * @param champion - The champion to get tags for
 * @returns Formatted string of tags
 */
export function getTags(champion: Champion): string {
  return Object.entries(CHAMPION_ROLE_MAPPING)
    .filter(([key]) => champion[key as keyof Champion])
    .map(([, roleKey]) => {
      const role = ROLES[roleKey];
      return `${role.emoji}: ${role.name}`;
    })
    .join(', ');
}

/**
 * Creates an error embed for interaction responses
 * @param message - The error message to display
 * @returns Error embed
 */
function createErrorEmbed(message: string): EmbedBuilder {
  return new EmbedBuilder().setColor(Colors.Red).setTitle(message);
}

/**
 * Creates a champion info embed
 * @param champion - The champion to create the embed for
 * @returns Champion info embed
 */
function createChampionEmbed(champion: Champion): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(Colors.Orange)
    .setTitle(champion.name)
    .setDescription(champion.is_free ? `${champion.title}   フリーチャンピオン✅` : champion.title)
    .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${champion.id}.png`);

  const levelDisplay = (level: number) =>
    CHAMPION_LEVEL_DISPLAY[level as keyof typeof CHAMPION_LEVEL_DISPLAY];

  return embed.addFields(
    {
      name: champion.is_wr
        ? '<:Icon_WR:1342960956036218942> <:Icon_LOL:1342961477224497232>'
        : '<:Icon_LOL:1342961477224497232>',
      value: `マナタイプ : ${champion.type}`,
    },
    { name: 'レーン', value: getRoles(champion), inline: true },
    { name: 'ロール', value: getTags(champion), inline: true },
    { name: '難易度', value: levelDisplay(champion.difficult), inline: true },
    { name: 'ダメージ', value: levelDisplay(champion.damage), inline: true },
    { name: '耐久性', value: levelDisplay(champion.survive), inline: true },
    { name: '補助性能', value: levelDisplay(champion.utility), inline: true },
    {
      name: '説明',
      value: champion.describe.length > 1024 ? champion.describe.slice(0, 1024) : champion.describe,
    },
  );
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const championName = interaction.options.getString('champion_name');

    if (!championName) {
      await interaction.reply({
        embeds: [createErrorEmbed(CHAMPION_ERROR_MESSAGES.NO_NAME)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const champion = getChampionByName(championName);
    if (!champion) {
      await interaction.reply({
        embeds: [createErrorEmbed(CHAMPION_ERROR_MESSAGES.NOT_FOUND(championName))],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({ embeds: [createChampionEmbed(champion)] });
  },
});
