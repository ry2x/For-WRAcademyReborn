import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { emptyCommand } from '@/utils/emptyCommand.js';
import { t } from '@/utils/i18n.js';

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';

const { ENABLE_SUBCOMMAND_SLOT } = process.env;

const probabilitySlots: { emoji: string; probability: number }[] = [
  { emoji: '<:seven:1344792025119330434>', probability: 0.02 },
  { emoji: '<:bar:1344792101384228975>', probability: 0.12 },
  { emoji: '<:bell:1344792119520264263>', probability: 0.12 },
  { emoji: '<:cherry:1344792157705338964>', probability: 0.14 },
  { emoji: '<:diamond:1344792171248877688>', probability: 0.12 },
  { emoji: '<:grapes:1344792186042191935>', probability: 0.12 },
  { emoji: '<:heart:1344792203347623996>', probability: 0.12 },
  { emoji: '<:lemon:1344792219848151110>', probability: 0.12 },
  { emoji: '<:orange:1344792238890418197>', probability: 0.12 },
];

function getRandomSlot() {
  const random = Math.random();
  let cumulativeProbability = 0;
  for (const slot of probabilitySlots) {
    cumulativeProbability += slot.probability;
    if (random < cumulativeProbability) {
      return slot.emoji;
    }
  }
  return probabilitySlots[probabilitySlots.length - 1].emoji;
}

export function rollSlots() {
  const result = [getRandomSlot(), getRandomSlot(), getRandomSlot()];

  // Check if all three slots show the same symbol. BAR matches with any symbol
  const nonBarSymbols = result.filter((emoji) => emoji !== '<:bar:1344792101384228975>');
  const uniqueCount = new Set(nonBarSymbols).size;

  const isWin = uniqueCount <= 1;
  const isAlmostWin = uniqueCount === 2;

  const message = isWin
    ? t('other:command.slot.win')
    : isAlmostWin
      ? t('other:command.slot.almost_win')
      : t('other:command.slot.miss');

  return { result, isWin, message };
}

const slotCommand = new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('slot')
    .setDescription(t('other:command.slot.description')),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const { result, isWin, message } = rollSlots();
    const embed = new EmbedBuilder()
      .setDescription(message)
      .setColor(isWin ? Colors.Yellow : Colors.Grey)
      .setFooter({ text: t('other:command.slot.first_time') });

    const reRollButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`slotroll-${interaction.user.id}-1-${Date.now()}`)
        .setLabel('🎰 Reroll!')
        .setStyle(ButtonStyle.Danger),
    );

    await interaction.editReply({
      embeds: [embed],
      components: [reRollButton],
      content: `**${result.join(' | ')}**`,
    });
  },
});

const command = ENABLE_SUBCOMMAND_SLOT?.toLowerCase() === 'true' ? slotCommand : emptyCommand;

export default command;
