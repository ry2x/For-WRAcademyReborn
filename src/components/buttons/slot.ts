import { rollSlots } from '@/commands/slot.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import { ButtonCommand } from '@/templates/InteractionCommands.js';
import { t } from '@/utils/i18n.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  MessageFlags,
} from 'discord.js';

export default new ButtonCommand({
  data: {
    name: 'slotroll',
  },
  async execute(interaction): Promise<void> {
    const [, userId, count] = interaction.customId.split('-');
    let current: number = Number(count) + 1;

    if (!(interaction.user.id === userId)) {
      await interaction.reply({
        content: t('other:command.slot.button.invalid_user'),
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const msg = interaction.message;
    const originalEmbed = msg.embeds[0];
    await interaction.update({ embeds: [originalEmbed], components: [] });
    if (interaction.createdTimestamp - interaction.message.createdTimestamp > 3 * 60 * 1000) {
      await interaction.followUp({
        embeds: [interactionErrorEmbed(t('other:command.slot.button.time_out'))],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const { result, isWin, message } = rollSlots();
    const embed = new EmbedBuilder()
      .setDescription(message)
      .setColor(isWin ? Colors.Yellow : Colors.Grey)
      .setFooter({ text: t('other:command.slot.button.count', { count: current }) });

    current = isWin ? 0 : current;
    const reRollButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`slotroll-${interaction.user.id}-${current}-${Date.now()}`)
        .setLabel(t('other:command.slot.button.reroll'))
        .setStyle(ButtonStyle.Danger),
    );

    await interaction.followUp({
      embeds: [embed],
      components: [reRollButton],
      content: `**${result.join(' | ')}**`,
    });
  },
});
