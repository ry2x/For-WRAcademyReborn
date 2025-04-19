import SubCommand from '@/templates/SubCommand.js';
import { Colors, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';
import logger from '@/logger.js';

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
        logger.warn('個別のメッセージ削除に失敗しました', err);
        continue;
      }
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Aqua)
          .setDescription(`${delCnt}件のメッセージを削除しました。`),
      ],
    });
  },
});
