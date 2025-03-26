import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('news')
    .setDescription('News commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('wildrift')
        .setDescription('ワイルドリフト公式ページから最新のニュースを最大10件を表示します。')
        .addNumberOption((option) =>
          option
            .setName('count')
            .setDescription('表示するニュースの数を指定します。')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(10),
        ),
    ),
  hasSubCommands: true,
});
