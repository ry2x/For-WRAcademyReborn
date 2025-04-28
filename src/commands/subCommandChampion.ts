import { LANES, RANK_RANGES } from '@/constants/game.js';
import ApplicationCommand from '@/templates/ApplicationCommand.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';

const { ENABLE_SUBCOMMAND_CHAMPION } = process.env;

const command = ENABLE_SUBCOMMAND_CHAMPION?.toLowerCase() === 'true' ? new ApplicationCommand({  data: new SlashCommandBuilder()
    .setName('champion')
    .setDescription('Champion commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('info')
        .setDescription('指定したチャンピオンの情報を表示します')
        .addStringOption((option) =>
          option
            .setName('champion_name')
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
              Object.entries(LANES).map(([, v]) => ({
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
              Object.entries(LANES).map(([, v]) => ({
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
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName('stats')
        .setDescription('チャンピオンのスタッツ')
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('winrate')
            .setDescription('チャンピオンのWILDRIFTでの勝率を確認する')
            .addStringOption((option) =>
              option
                .setName('champion_name')
                .setDescription('チャンピオンの名前')
                .setRequired(true)
                .setAutocomplete(true),
            )
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription('対象にするランク（デフォルト：マスター＋）')
                .setRequired(false)
                .addChoices(
                  Object.entries(RANK_RANGES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            )
            .addStringOption((option) =>
              option
                .setName('lane')
                .setDescription('レーンを指定（デフォルト：チャンピョン規定レーン）')
                .setRequired(false)
                .addChoices(
                  Object.entries(LANES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('lanewinrate')
            .setDescription('レーンの勝率トップ5を表示します')
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription('対象にするランク（デフォルト：マスター＋）')
                .setRequired(false)
                .addChoices(
                  Object.entries(RANK_RANGES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            )
            .addStringOption((option) =>
              option
                .setName('lane')
                .setDescription('レーンを指定（デフォルト：全て）')
                .setRequired(false)
                .addChoices(
                  Object.entries(LANES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('pickrate')
            .setDescription('レーンのピック率トップ5を表示します')
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription('対象にするランク（デフォルト：マスター＋）')
                .setRequired(false)
                .addChoices(
                  Object.entries(RANK_RANGES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            )
            .addStringOption((option) =>
              option
                .setName('lane')
                .setDescription('レーンを指定（デフォルト：全て）')
                .setRequired(false)
                .addChoices(
                  Object.entries(LANES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            )
            .addBooleanOption((option) =>
              option
                .setName('banrate')
                .setDescription('バン率を考慮します（デフォルト：FALSE）')
                .setRequired(false),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('strength')
            .setDescription('システム的に評価されているチャンピオンを表示します。')
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription('対象にするランク（デフォルト：マスター＋）')
                .setRequired(false)
                .addChoices(
                  Object.entries(RANK_RANGES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            )
            .addStringOption((option) =>
              option
                .setName('lane')
                .setDescription('レーンを指定（デフォルト：全て）')
                .setRequired(false)
                .addChoices(
                  Object.entries(LANES).map(([, v]) => ({
                    name: v.name,
                    value: v.value,
                  })),
                ),
            ),
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
