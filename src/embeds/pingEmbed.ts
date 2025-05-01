import { t } from '@/utils/i18n.js';
import { Colors, EmbedBuilder } from 'discord.js';

export function pingEmbed(description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle('Ping')
    .setDescription(t('ping', { ping: description }));
}
