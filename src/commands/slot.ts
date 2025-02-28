import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';

const slot: string[] = [
  '<:seven:1344792025119330434>',
  '<:bar:1344792101384228975>',
  '<:bell:1344792119520264263>',
  '<:cherry:1344792157705338964>',
  '<:diamond:1344792171248877688>',
  '<:grapes:1344792186042191935>',
  '<:heart:1344792203347623996>',
  '<:lemon:1344792219848151110>',
  '<:orange:1344792238890418197>',
];

export function rollSlots() {
  const result = [
    slot[Math.floor(Math.random() * slot.length)],
    slot[Math.floor(Math.random() * slot.length)],
    slot[Math.floor(Math.random() * slot.length)],
  ];
  const isWin = result[0] === result[1] && result[1] === result[2];
  const message = isWin
    ? '**🎉 大当たり！3つ揃いました！ 🎉**'
    : result[0] === result[1] || result[1] === result[2] || result[0] === result[2]
      ? '**😲 惜しい！2つ揃いました！**'
      : '**💀 残念！また挑戦してね！**';

  return { result, isWin, message };
}

export default new ApplicationCommand({
  data: new SlashCommandBuilder().setName('slot').setDescription('スロットゲームをします'),
  async execute(interaction) {
    await interaction.deferReply();

    const { result, isWin, message } = rollSlots();
    const embed = new EmbedBuilder()
      .setDescription(
        `🎰 **スロットマシン <@${interaction.user.id}>** 🎰\n**\`${result.join(' | ')}\`**\n${message}`,
      )
      .setColor(isWin ? Colors.Yellow : Colors.Grey)
      .setFooter({ text: '1回目の挑戦' });

    const reRollButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`slotroll-${interaction.user.id}-1-${Date.now()}`)
        .setLabel('🎰 Reroll!')
        .setStyle(ButtonStyle.Primary),
    );

    await interaction.editReply({ embeds: [embed], components: [reRollButton] });
  },
});
