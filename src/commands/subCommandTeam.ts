import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

const { ENABLE_SUBCOMMAND_TEAM } = process.env;

const command = ENABLE_SUBCOMMAND_TEAM?.toLowerCase() === 'true' ? new ApplicationCommand({  data: new SlashCommandBuilder()
    .setName('team')
    .setDescription('Team commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('random')
        .setDescription(
          'TESTING:指定したVCでランダムでチーム分けを行います。(このコマンドはテスト中です。)',
        )
        .addNumberOption((option) =>
          option
            .setName('team_count')
            .setDescription('分けるチーム数（デフォルト：２）')
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(5),
        )
        .addChannelOption((option) =>
          option
            .setName('vc_channel')
            .setDescription('チーム分けするVCチャンネル（デフォルト：参加中のVC）')
            .setRequired(false),
        )
        .addBooleanOption((option) =>
          option
            .setName('is_bot')
            .setDescription('ボットを含めるか（デフォルト：FALSE）')
            .setRequired(false),
        )
        .addUserOption((option) =>
          option.setName('exclude').setDescription('除外するメンバーを選択').setRequired(false),
        ),
    ),
  hasSubCommands: true,
}) : new ApplicationCommand({
  data: new SlashCommandBuilder().setName('empty').setDescription('empty command'),
  hasSubCommands: false,
  execute: async () => {
    // empty execute-function
  },
});

export default command;
