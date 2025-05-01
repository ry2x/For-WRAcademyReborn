import { LANES, RANK_RANGES } from '@/constants/game.js';
import ApplicationCommand from '@/templates/ApplicationCommand.js';
import { emptyCommand } from '@/utils/emptyCommand.js';
import { t } from '@/utils/i18n.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';

const { ENABLE_SUBCOMMAND_CHAMPION } = process.env;

const championCommand = new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('champion')
    .setDescription('Champion commands')
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('info')
        .setDescription(t('champion:command.info.description'))
        .addStringOption((option) =>
          option
            .setName('champion_name')
            .setDescription(t('champion:command.info.champion_name'))
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('lanechamps')
        .setDescription(t('champion:command.lanechamps.description'))
        .addStringOption((option) =>
          option
            .setName('lane')
            .setDescription(t('champion:command.lanechamps.lane'))
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
        .setDescription(t('champion:command.random.description'))
        .addStringOption((option) =>
          option
            .setName('lane')
            .setDescription(t('champion:command.random.lane'))
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
            .setDescription(t('champion:command.random.count'))
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(10),
        )
        .addBooleanOption((option) =>
          option
            .setName('wr_only')
            .setDescription(t('champion:command.random.wr_only'))
            .setRequired(false),
        ),
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('team')
        .setDescription(t('champion:command.team.description'))
        .addBooleanOption((option) =>
          option
            .setName('wr_only')
            .setDescription(t('champion:command.team.wr_only'))
            .setRequired(false),
        ),
    )
    .addSubcommandGroup(
      new SlashCommandSubcommandGroupBuilder()
        .setName('stats')
        .setDescription(t('champion:command.stats.description'))
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('winrate')
            .setDescription(t('champion:command.stats.winrate.description'))
            .addStringOption((option) =>
              option
                .setName('champion_name')
                .setDescription(t('champion:command.stats.winrate.champion_name'))
                .setRequired(true)
                .setAutocomplete(true),
            )
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription(t('champion:command.stats.winrate.rank'))
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
                .setDescription(t('champion:command.stats.winrate.lane'))
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
            .setDescription(t('champion:command.stats.lanewinrate.description'))
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription(t('champion:command.stats.lanewinrate.rank'))
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
                .setDescription(t('champion:command.stats.lanewinrate.lane'))
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
            .setDescription(t('champion:command.stats.pickrate.description'))
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription(t('champion:command.stats.pickrate.rank'))
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
                .setDescription(t('champion:command.stats.pickrate.lane'))
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
                .setDescription(t('champion:command.stats.pickrate.banrate'))
                .setRequired(false),
            ),
        )
        .addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName('strength')
            .setDescription(t('champion:command.stats.strength.description'))
            .addStringOption((option) =>
              option
                .setName('rank')
                .setDescription(t('champion:command.stats.strength.rank'))
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
                .setDescription(t('champion:command.stats.strength.lane'))
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
});

const command =
  ENABLE_SUBCOMMAND_CHAMPION?.toLowerCase() === 'true' ? championCommand : emptyCommand;

export default command;
