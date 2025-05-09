import { t } from '@/utils/i18n.js';
import {
  Colors,
  EmbedBuilder,
  MessageFlags,
  type InteractionReplyOptions,
} from 'discord.js';

export function interactionErrorEmbed(msg: string): EmbedBuilder {
  return new EmbedBuilder().setColor(Colors.Red).setTitle(msg);
}

export const interactionError: InteractionReplyOptions = {
  embeds: [interactionErrorEmbed(t('errorEmbed'))],
  flags: MessageFlags.Ephemeral,
};
