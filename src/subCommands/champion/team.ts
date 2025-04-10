import { getChampionsByLane, getLaneEmoji } from '@/data/championData.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import { LANES } from '@/types/game.js';
import { Colors, EmbedBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js';

type Team = {
  [key: string]: string[];
};

const handleInsufficientChampions = (
  interaction: ChatInputCommandInteraction,
  lane: string,
): Promise<void> => {
  return interaction
    .deleteReply()
    .then(() =>
      interaction.followUp({
        embeds: [interactionErrorEmbed(`❌${lane.toUpperCase()} にチャンピオンが不足しています。`)],
        flags: MessageFlags.Ephemeral,
      }),
    )
    .then(() => undefined);
};

const generateTeam = (wrOnly: boolean, selectedChamps: Set<string>): Promise<Team> => {
  const team: Team = {};

  return Promise.all(
    Object.entries(LANES).map(([key, lane]) => {
      let champions = getChampionsByLane(lane.value);
      if (wrOnly) {
        champions = champions.filter((c) => c.is_wr);
      }

      champions = champions.filter((c) => !selectedChamps.has(c.id));

      if (champions.length < 2) {
        throw new Error(`Insufficient champions for ${lane.value}`);
      }

      const selected = champions.sort(() => 0.5 - Math.random()).slice(0, 2);
      team[key] = selected.map((c) => c.name);
      selected.forEach((c) => selectedChamps.add(c.id));
    }),
  ).then(() => team);
};

const createTeamEmbed = (team: Team, wrOnly: boolean, firstChampionId: string): EmbedBuilder => {
  return new EmbedBuilder()
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
      `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${firstChampionId}.png`,
    );
};

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const wrOnly = interaction.options.getBoolean('wr_only') ?? true;
    const selectedChamps = new Set<string>();

    try {
      const team = await generateTeam(wrOnly, selectedChamps);
      const firstChampionId = selectedChamps.values().next().value;
      if (!firstChampionId) {
        throw new Error('No champions were selected');
      }
      const embed = createTeamEmbed(team, wrOnly, firstChampionId);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Insufficient champions')) {
        const lane = error.message.split('for ')[1];
        await handleInsufficientChampions(interaction, lane);
      } else {
        await interaction.editReply({
          embeds: [interactionErrorEmbed('❌ チーム生成中にエラーが発生しました。')],
        });
      }
    }
  },
});
