import SubCommand from '@/templates/SubCommand.js';
import { Colors, EmbedBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';
import { getChampionByName, lanes, roles } from '@/data/championData.js';
import { type Champion } from '@/types/champs.js';

export function getRoles(champion: Champion): string {
  return Object.values(lanes)
    .filter((lane) => champion[`is_${lane.value}` as keyof Champion])
    .map((lane) => `${lane.emoji}: ${lane.name}`)
    .join(', ');
}

function showLevel(level: number): string {
  return level === 0 ? '⬜⬜⬜' : level === 1 ? '🟦⬜⬜' : level === 2 ? '🟨🟨⬜' : '🟧🟧🟧';
}

const roleMapping: Record<string, keyof typeof roles> = {
  is_fighter: 'F',
  is_mage: 'M',
  is_assassin: 'A',
  is_marksman: 'MM',
  is_support: 'S',
  is_tank: 'T',
};

export function getTags(champion: Champion): string {
  return Object.entries(roleMapping)
    .filter(([key]) => champion[key as keyof Champion])
    .map(([, roleKey]) => {
      const role = roles[roleKey];
      return `${role.emoji}: ${role.name}`;
    })
    .join(', ');
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    function interactionErrorEmbed(msg: string): EmbedBuilder {
      return new EmbedBuilder().setColor(Colors.Red).setTitle(msg);
    }

    const championName = interaction.options.getString('championname');
    if (!championName) {
      await interaction.reply({
        embeds: [interactionErrorEmbed('❌チャンピオンの名前が指定されていません。')],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const champion = getChampionByName(championName);

    if (!champion) {
      await interaction.reply({
        embeds: [
          interactionErrorEmbed(`❌チャンピオン「${championName}」は見つかりませんでした。`),
        ],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const embed = new EmbedBuilder()
      .setColor(Colors.Orange)
      .setTitle(champion.name)
      .setDescription(
        champion.is_free ? `${champion.title}   フリーチャンピオン✅` : `${champion.title}`,
      )
      .setThumbnail(
        `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${champion.id}.png`,
      )
      .addFields(
        {
          name: champion.is_wr
            ? '<:Icon_WR:1342960956036218942> <:Icon_LOL:1342961477224497232>'
            : '<:Icon_LOL:1342961477224497232>',
          value: `マナタイプ : ${champion.type}`,
        },
        { name: 'レーン', value: getRoles(champion), inline: true },
        { name: 'ロール', value: getTags(champion), inline: true },
        { name: '難易度', value: showLevel(champion.difficult), inline: true },
        { name: 'ダメージ', value: showLevel(champion.damage), inline: true },
        { name: '耐久性', value: showLevel(champion.survive), inline: true },
        { name: '補助性能', value: showLevel(champion.utility), inline: true },
        {
          name: '説明',
          value:
            champion.describe.length > 1024 ? champion.describe.slice(0, 1024) : champion.describe,
        },
      );
    await interaction.reply({ embeds: [embed] });
  },
});
