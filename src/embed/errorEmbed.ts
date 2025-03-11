import { Colors, EmbedBuilder, MessageFlags, type InteractionReplyOptions } from 'discord.js';

export function interactionErrorEmbed(msg: string): EmbedBuilder {
  return new EmbedBuilder().setColor(Colors.Red).setTitle(msg);
}

export const interactionError: InteractionReplyOptions = {
  embeds: [interactionErrorEmbed('❌An error occurred when attempting to execute that command!')],
  flags: MessageFlags.Ephemeral,
};
