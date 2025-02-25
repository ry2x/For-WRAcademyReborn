import { Colors, EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import { getChampionsByLane, getLaneEmoji } from '../utils/championData.js';
import { interactionErrorEmbed } from '../utils/errorEmbed.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('randomteam')
    .setDescription(
      '各レーン（Top, JG, Mid, ADC, Sup）から2体ずつ、計10体をランダムに選択（重複なし）',
    )
    .addBooleanOption((option) =>
      option
        .setName('wr_only')
        .setDescription('Wild Riftに実装されているチャンピオン限定にする (デフォルト: true)')
        .setRequired(false),
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const wrOnly = interaction.options.getBoolean('wr_only') ?? true;
    const lanes = ['top', 'jg', 'mid', 'ad', 'sup'];
    const team: { [key: string]: string[] } = {};
    const selectedChamps = new Set<string>();

    for (const lane of lanes) {
      let champions = getChampionsByLane(lane);
      if (wrOnly) {
        champions = champions.filter((c) => c.is_wr);
      }

      champions = champions.filter((c) => !selectedChamps.has(c.id));

      if (champions.length < 2) {
        await interaction.deleteReply();
        await interaction.followUp({
          embeds: [
            interactionErrorEmbed(`❌${lane.toUpperCase()} にチャンピオンが不足しています。`),
          ],
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const selected = champions.sort(() => 0.5 - Math.random()).slice(0, 2);
      team[lane] = selected.map((c) => c.name);

      selected.forEach((c) => selectedChamps.add(c.id));
    }

    const embed = new EmbedBuilder()
      .setTitle(
        `🎲 ランダムチーム：各2体 ${wrOnly ? '<:WR:1343276543945740298>' : '<:SR:1343276485942841485>'}`,
      )
      .addFields(
        Object.entries(team).map(([lane, champs]: [string, string[]]) => ({
          name: getLaneEmoji(lane) + lane.toUpperCase(),
          value: champs.map((c: string) => `・**${c}**`).join('\n'),
        })),
      )
      .setColor(Colors.Orange)
      .setThumbnail(
        `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${selectedChamps.values().next().value}.png`,
      );

    await interaction.editReply({ embeds: [embed] });
  },
});
