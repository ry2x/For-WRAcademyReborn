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
  '<:watermelon:1344792252756529192>',
];

export function rollSlots() {
  return [
    slot[Math.floor(Math.random() * slot.length)],
    slot[Math.floor(Math.random() * slot.length)],
    slot[Math.floor(Math.random() * slot.length)],
  ];
}

export function rollResult(result: string[]) {
  if (result[0] === result[1] && result[1] === result[2]) {
    return '**🎉 大当たり！3つ揃いました！ 🎉**';
  } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
    return '**😲 惜しい！2つ揃いました！**';
  } else {
    return '**💀 残念！また挑戦してね！**';
  }
}
export default new ApplicationCommand({
  data: new SlashCommandBuilder().setName('slot').setDescription('スロットゲームをします'),
  async execute(interaction) {
    await interaction.deferReply();

    const result = rollSlots();
    const message = `🎰 **スロットマシン <@${interaction.user.id}>** 🎰\n${result.join(' | ')}\n${rollResult(result)}`;
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

    await interaction.editReply({ embeds: [embed], components: [reRollButton] });
  },
});
