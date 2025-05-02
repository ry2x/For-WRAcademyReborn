import { emojiList, getEmoji } from '@/data/emoji.js';
import SubCommand from '@/templates/SubCommand.js';
import { type ChatInputCommandInteraction } from 'discord.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const message = emojiList
      .map((emoji) => {
        return emoji + ':' + (getEmoji(emoji)?.toString() ?? 'undefined');
      })
      .join('\n');

    await interaction.reply({
      content: message,
    });
  },
});
