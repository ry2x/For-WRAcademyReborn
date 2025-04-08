import { Colors, EmbedBuilder, MessageFlags, type InteractionReplyOptions } from 'discord.js';

export function interactionErrorEmbed(msg: string): EmbedBuilder {
  return new EmbedBuilder().setColor(Colors.Red).setTitle(msg);
}

export const interactionError: InteractionReplyOptions = {
  embeds: [interactionErrorEmbed('❌コマンド実行中にエラーが発生しました！')],
  flags: MessageFlags.Ephemeral,
};
