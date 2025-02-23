import { CHAMP_PER_PAGE, createPageButton, createPageEmbed } from '../../commands/championLane.js';
import { ButtonCommand } from '../../templates/InteractionCommands.js';
import { getChampionsByLane } from '../../utils/championData.js';
import { interactionErrorEmbed } from '../../utils/errorEmbed.js';

export default new ButtonCommand({
  data: {
    name: 'champLane',
  },
  async execute(interaction): Promise<void> {
    await interaction.deferUpdate();
    const [, lane, strPage] = interaction.customId.split('-');

    if (interaction.createdTimestamp - interaction.message.createdTimestamp > 3 * 60 * 1000) {
      const msg = interaction.message;
      const embed = msg.embeds[0];

      await interaction.editReply({
        embeds: [embed],
        components: [],
      });
      return;
    }

    if (interaction.message.member?.id === interaction.user.id) {
      await interaction.reply({
        embeds: [interactionErrorEmbed('❌このボタンは使用できません。')],
        ephemeral: true,
      });
      return;
    }

    const page = parseInt(strPage, 10);
    const champions = getChampionsByLane(lane);
    if (!champions || champions.length === 0) {
      await interaction.reply({
        embeds: [interactionErrorEmbed('❌該当するチャンピオンがいません。')],
        ephemeral: true,
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

    await interaction.editReply({
      embeds: [createPageEmbed(page, championNames, lane, totalPages, CHAMP_PER_PAGE)],
      components: [createPageButton(page, lane, totalPages)],
    });
  },
});
