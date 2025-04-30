import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import logger from '@/utils/logger.js';
import { type ChatInputCommandInteraction } from 'discord.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      const emojiName = interaction.options.getString('name', true);
      const action = interaction.options.getString('action', true);

      let emojiUrl = '';
      if (action !== 'delete') {
        emojiUrl = interaction.options.getString('url', true);
      }

      // Check if member is valid
      if (!interaction.member) {
        await interaction.reply({
          embeds: [interactionErrorEmbed('❌Could not find member info.')],
        });
        return;
      }

      // Check if guild is valid
      if (!interaction.guild) {
        await interaction.reply({
          embeds: [interactionErrorEmbed('❌Could not find server info.')],
        });
        return;
      }

      const emojis = await interaction.guild.emojis.fetch();
      const existingEmoji = emojis.find(emoji => emoji.name === emojiName);

      if (action === 'create') {
        if (existingEmoji) {
          await interaction.reply(`Emoji \`${emojiName}\` already exists. Here it is: ${existingEmoji}`);
        } else {
          const newEmoji = await interaction.guild.emojis.create({ attachment: emojiUrl, name: emojiName });
          await interaction.reply(`Successfully added emoji \`${emojiName}\`: ${newEmoji}`);
        }
      } else if (action === 'update') {
        if (existingEmoji) {
          await existingEmoji.delete();
          const newEmoji = await interaction.guild.emojis.create({ attachment: emojiUrl, name: emojiName });
          await interaction.reply(`Successfully updated emoji \`${emojiName}\` to ${newEmoji}`);
        } else {
          await interaction.reply(`❌Emoji \`${emojiName}\` does not exist.`);
        }
      } else if (action === 'delete') {
        if (existingEmoji) {
          await existingEmoji.delete();
          await interaction.reply(`Successfully deleted emoji: \`${emojiName}\``);
        } else {
          await interaction.reply(`❌Emoji \`${emojiName}\` does not exist.`);
        }
      } else {
        await interaction.reply(`❌Invalid action: ${action}. Please use 'Create', 'Update' or 'Delete'.`);
      }
      
    } catch (error) {
      logger.error('Error occurred while managing emoji:', error);
      await interaction.reply({
        embeds: [
          interactionErrorEmbed('❌An error occurred while managing the emoji. Check the logs for more details.'),
        ],
      });
    }
  },
});
