import config from '@/constants/config.js';
import { getChampionsByLane } from '@/data/championData.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import {
  CHAMP_PER_PAGE,
  createPageButton,
  createPageEmbed,
} from '@/subCommands/champion/lanechamps.js';
import { ButtonCommand } from '@/templates/InteractionCommands.js';
import type { LaneKey } from '@/types/game.js';
import { MessageFlags } from 'discord.js';

export default new ButtonCommand({
  data: {
    name: 'champLane',
  },
  async execute(interaction): Promise<void> {
    await interaction.deferUpdate();
    const [, lane, strPage] = interaction.customId.split('-') as [string, LaneKey, string];

    if (interaction.createdTimestamp - interaction.message.createdTimestamp > 3 * 60 * 1000) {
      const msg = interaction.message;
      const embed = msg.embeds[0];

      await interaction.editReply({
        embeds: [embed],
        components: [],
      });

      await interaction.followUp({
        embeds: [interactionErrorEmbed(config.ButtonError.timeOut)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (interaction.message.member?.id === interaction.user.id) {
      await interaction.followUp({
        embeds: [
          interactionErrorEmbed(
            `${config.ButtonError.invalidUser}\n自分で実行するには**\`/lanechamp\`**を実行して下さい。`,
          ),
        ],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const page = parseInt(strPage, 10);
    const champions = getChampionsByLane(lane);
    if (!champions || champions.length === 0) {
      await interaction.followUp({
        embeds: [interactionErrorEmbed(config.championError.notFound)],
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

    await interaction.editReply({
      embeds: [createPageEmbed(page, championNames, lane, totalPages, CHAMP_PER_PAGE)],
      components: [createPageButton(page, lane, totalPages)],
    });
  },
});
