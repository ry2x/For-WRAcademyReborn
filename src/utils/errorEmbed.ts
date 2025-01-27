import { Colors, EmbedBuilder, type InteractionReplyOptions } from 'discord.js';

const interactionErrorEmbed = new EmbedBuilder()
  .setColor(Colors.Red)
  .setTitle('Error occurred!')
  .setDescription('There was an error while executing this command!');

export const interactionError: InteractionReplyOptions = {
  embeds: [interactionErrorEmbed],
  ephemeral: true,
};
