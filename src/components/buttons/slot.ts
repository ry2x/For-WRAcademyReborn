import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  MessageFlags,
} from 'discord.js';
import { rollResult, rollSlots } from '../../commands/slot.js';
import { ButtonCommand } from '../../templates/InteractionCommands.js';

export default new ButtonCommand({
  data: {
    name: 'slotroll',
  },
  async execute(interaction): Promise<void> {
    const [, userId] = interaction.customId.split('-');

    if (!(interaction.user.id === userId)) {
      await interaction.reply({
        content:
          '❌ 利用者以外はボタンは使用できません。\n自分で実行するには**`/slot`**を実行して下さい。',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const msg = interaction.message;
    const originalEmbed = msg.embeds[0];
    await interaction.update({ embeds: [originalEmbed], components: [] });
    if (interaction.createdTimestamp - interaction.message.createdTimestamp > 3 * 60 * 1000) {
      return;
    }

    const result = rollSlots();
    const message = `🎰 **スロットマシン <@${interaction.user.id}>** 🎰\n**\`${result.join(' | ')}\`**\n${rollResult(result)}`;
    const win = result[0] === result[1] && result[1] === result[2];

    const embed = new EmbedBuilder()
      .setDescription(message)
      .setColor(win ? Colors.Yellow : Colors.Grey);

    const reRollButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`slotroll-${interaction.user.id}`)
        .setLabel('🎰 Reroll!')
        .setStyle(ButtonStyle.Primary),
    );

    await interaction.followUp({ embeds: [embed], components: [reRollButton] });
  },
});
