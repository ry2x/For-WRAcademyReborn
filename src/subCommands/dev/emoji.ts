import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import { t } from '@/utils/i18n.js';
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
          embeds: [interactionErrorEmbed(t('other:body.dev.emoji.is_member'))],
        });
        return;
      }

      // Check if guild is valid
      if (!interaction.guild) {
        await interaction.reply({
          embeds: [interactionErrorEmbed(t('other:body.dev.emoji.is_guild'))],
        });
        return;
      }

      const emojis = await interaction.guild.emojis.fetch();
      const existingEmoji = emojis.find((emoji) => emoji.name === emojiName);

      if (action === 'create') {
        if (existingEmoji) {
          await interaction.reply(
            t('other:body.dev.emoji.exists', {
              emojiName,
              existingEmoji: existingEmoji.toString(),
            }),
          );
        } else {
          const newEmoji = await interaction.guild.emojis.create({
            attachment: emojiUrl,
            name: emojiName,
          });
          await interaction.reply(
            t('other:body.dev.emoji.added', {
              emojiName,
              newEmoji: newEmoji.toString(),
            }),
          );
        }
      } else if (action === 'update') {
        if (existingEmoji) {
          await existingEmoji.delete();
          const newEmoji = await interaction.guild.emojis.create({
            attachment: emojiUrl,
            name: emojiName,
          });
          await interaction.reply(
            t('other:body.dev.emoji.updated', {
              emojiName,
              newEmoji: newEmoji.toString(),
            }),
          );
        } else {
          await interaction.reply(
            t('other:body.dev.emoji.not_exists', { emojiName: emojiName }),
          );
        }
      } else if (action === 'delete') {
        if (existingEmoji) {
          await existingEmoji.delete();
          await interaction.reply(
            t('other:body.dev.emoji.delete', { emojiName: emojiName }),
          );
        } else {
          await interaction.reply(
            t('other:body.dev.emoji.not_exists', { emojiName: emojiName }),
          );
        }
      } else {
        await interaction.reply(
          t('other:body.dev.emoji.invalid_action', { action: action }),
        );
      }
    } catch (error) {
      logger.error(t('other:body.dev.emoji.error'), error);
      await interaction.reply({
        embeds: [
          interactionErrorEmbed(
            t('other:body.dev.emoji.error') + t('other:body.dev.emoji.check'),
          ),
        ],
      });
    }
  },
});
