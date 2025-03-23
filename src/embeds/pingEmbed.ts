import { Colors, EmbedBuilder } from 'discord.js';

export function pingEmbed(description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle('Ping')
    .setDescription(`ping値は${description}msです`);
}
