import { getChampionsByLane, getLaneEmoji } from '@/data/championData.js';
import { LANES } from '@/types/common.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import { Colors, EmbedBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const wrOnly = interaction.options.getBoolean('wr_only') ?? true;
    const team: { [key: string]: string[] } = {};
    const selectedChamps = new Set<string>();

    await Promise.all(
      Object.entries(LANES).map(async ([key, lane]) => {
        let champions = getChampionsByLane(lane.value);
        if (wrOnly) {
          champions = champions.filter((c) => c.is_wr);
        }

        champions = champions.filter((c) => !selectedChamps.has(c.id));

        if (champions.length < 2) {
          await interaction.deleteReply();
          await interaction.followUp({
            embeds: [
              interactionErrorEmbed(
                `❌${lane.value.toUpperCase()} にチャンピオンが不足しています。`,
              ),
            ],
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const selected = champions.sort(() => 0.5 - Math.random()).slice(0, 2);
        team[key] = selected.map((c) => c.name);

        selected.forEach((c) => selectedChamps.add(c.id));
      }),
    );

    const embed = new EmbedBuilder()
      .setTitle(
        `🎲 ランダムチーム：各2体 ${wrOnly ? '<:WR:1343276543945740298>' : '<:SR:1343276485942841485>'}`,
      )
      .addFields(
        Object.entries(team).map(([lane, champs]) => ({
          name: getLaneEmoji(lane) + lane.toUpperCase(),
          value: champs.map((c) => `・**${c}**`).join('\n'),
        })),
      )
      .setColor(Colors.Orange)
      .setThumbnail(
        `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${selectedChamps.values().next().value}.png`,
      );

    await interaction.editReply({ embeds: [embed] });
  },
});
