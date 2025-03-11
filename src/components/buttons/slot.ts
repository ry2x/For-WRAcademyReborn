import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  MessageFlags,
} from 'discord.js';
import { rollSlots } from '../../commands/slot.js';
import { interactionErrorEmbed } from '../../embed/errorEmbed.js';
import { ButtonCommand } from '../../templates/InteractionCommands.js';

const slotCommand = '</slot:1344816455035781233>';

export default new ButtonCommand({
  data: {
    name: 'slotroll',
  },
  async execute(interaction): Promise<void> {
    const [, userId, count] = interaction.customId.split('-');
    let current: number = Number(count) + 1;

    if (!(interaction.user.id === userId)) {
      await interaction.reply({
        content: `❌ 利用者以外はボタンは使用できません。\n自分で実行するには${slotCommand}を実行して下さい。`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const msg = interaction.message;
    const originalEmbed = msg.embeds[0];
    await interaction.update({ embeds: [originalEmbed], components: [] });
    if (interaction.createdTimestamp - interaction.message.createdTimestamp > 3 * 60 * 1000) {
      await interaction.followUp({
        embeds: [
          interactionErrorEmbed(
            `❌このボタンは3分が経過したので使用できません。\n再度で実行するには${slotCommand}を実行して下さい。`,
          ),
        ],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const { result, isWin, message } = rollSlots();
    const embed = new EmbedBuilder()
      .setDescription(message)
      .setColor(isWin ? Colors.Yellow : Colors.Grey)
      .setFooter({ text: `${current}回目の挑戦` });

    current = isWin ? 0 : current;
    const reRollButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`slotroll-${interaction.user.id}-${current}-${Date.now()}`)
        .setLabel('🎰 Reroll!')
        .setStyle(ButtonStyle.Danger),
    );

    await interaction.followUp({
      embeds: [embed],
      components: [reRollButton],
      content: `**${result.join(' | ')}**`,
    });
  },
});
