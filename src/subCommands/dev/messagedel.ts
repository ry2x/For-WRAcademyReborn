import SubCommand from '@/templates/SubCommand.js';
import { t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';
import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const count = interaction.options.getInteger('count', true) ?? 0;
    let delCnt = 0;

    const messages = await interaction.channel?.messages.fetch({ limit: count });
    if (!messages) return;

    for (const msg of messages.values()) {
      try {
        await msg.delete();

        if (delCnt === 0) {
          await interaction.deferReply();
        }

        delCnt++;
      } catch (err) {
        logger.warn(t('other:body.dev.message_del.failed'), err);
        continue;
      }
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Aqua)
          .setDescription(t('other:body.dev.message_del.complete', { count: delCnt })),
      ],
    });
  },
});
