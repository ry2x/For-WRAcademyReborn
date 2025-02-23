import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import { getChampionsByLane } from '../utils/championData.js';

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
    const embed = new EmbedBuilder()
      .setTitle(`${lane} レーンのチャンピオン`)
      .setDescription(champions.map((champ) => `- **${champ.name}**`).join('\n'))
      .setColor(Colors.Orange);

    await interaction.reply({ embeds: [embed] });
  },
});
