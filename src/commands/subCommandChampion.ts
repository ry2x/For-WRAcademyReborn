import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { lanes } from '../data/championData.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('champion')
    .setDescription('Champion commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('info')
        .setDescription('指定したチャンピオンの情報を表示します')
        .addStringOption((option) =>
          option
            .setName('championname')
            .setDescription('チャンピオンの名前')
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('lanechamps')
        .setDescription('指定したレーンのチャンピオン一覧を表示します')
        .addStringOption((option) =>
          option
            .setName('lane')
            .setDescription('レーンを指定')
            .setRequired(true)
            .addChoices(
              Object.entries(lanes).map(([, v]) => ({
                name: v.name,
                value: v.value,
              })),
            ),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('random')
        .setDescription(
          '指定したレーンまたは全レーンからチャンピオンをランダムに表示します。(1体~10体:デフォルト1体)',
        )
        .addStringOption((option) =>
          option
            .setName('lane')
            .setDescription('レーンを指定')
            .setRequired(true)
            .addChoices(
              Object.entries(lanes).map(([, v]) => ({
                name: v.name,
                value: v.value,
              })),
            ),
        )
        .addIntegerOption((option) =>
          option
            .setName('count')
            .setDescription('ランダムに選ぶチャンピオンの数（1〜10）')
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(10),
        )
        .addBooleanOption((option) =>
          option
            .setName('wr_only')
            .setDescription('Wild Riftに実装されているチャンピオン限定にする (デフォルト: true)')
            .setRequired(false),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('team')
        .setDescription(
          '各レーン（Top, JG, Mid, ADC, Sup）から2体ずつ、計10体をランダムに選択（重複なし）',
        )
        .addBooleanOption((option) =>
          option
            .setName('wr_only')
            .setDescription('Wild Riftに実装されているチャンピオン限定にする (デフォルト: true)')
            .setRequired(false),
        ),
    ),
  hasSubCommands: true,
});
