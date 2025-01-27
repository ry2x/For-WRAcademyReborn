import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type CacheType,
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder().setName('test-button').setDescription('Button test'),
  async execute(interaction): Promise<void> {
    await pingButton(interaction);
  },
});

async function pingButton(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle('Button test')
    .setDescription('Push Button');

  const button = new ButtonBuilder()
    .setCustomId('button-ping')
    .setStyle(ButtonStyle.Primary)
    .setLabel('Ping!');

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  await interaction.reply({
    components: [row],
    embeds: [embed],
  });
}
