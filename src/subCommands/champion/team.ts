import { LANES } from '@/constants/game.js';
import { getChampionsByLane } from '@/data/championData.js';
import { getEmoji } from '@/data/emoji.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import type { Champion } from '@/types/champs.js';
import { type LaneKey } from '@/types/game.js';
import { getLanePositionSets } from '@/utils/constantsUtils.js';
import { t } from '@/utils/i18n.js';
import {
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
} from 'discord.js';

const CHAMP_COUNT = 2;
const THUMBNAIL_URL =
  'https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion';

type Team = Record<LaneKey, Champion[]>;

function getUniqueChampionsByLane(
  lane: LaneKey,
  wrOnly: boolean,
  selectedChamps: Set<string>,
): Champion[] | null {
  let champions = getChampionsByLane(lane);
  champions = wrOnly ? champions.filter((champ) => champ.is_wr) : champions;
  champions = champions.filter((champ) => !selectedChamps.has(champ.id));

  if (champions.length < CHAMP_COUNT) {
    return null;
  }

  return champions
    .sort(function () {
      return 0.5 - Math.random();
    })
    .slice(0, CHAMP_COUNT);
}

function createTeam(wrOnly: boolean): Team | null {
  const selectedChamps = new Set<string>();
  const team: Team = {
    all: [],
    top: [],
    jungle: [],
    mid: [],
    ad: [],
    support: [],
  };

  for (const lane of Object.keys(team) as LaneKey[]) {
    if (lane !== LANES.all.value) {
      const champions = getUniqueChampionsByLane(lane, wrOnly, selectedChamps);
      if (!champions) {
        return null;
      }
      champions.forEach((champ) => {
        selectedChamps.add(champ.id);
        team[lane].push(champ);
      });
    }
  }

  return team;
}

function createTeamFieldValue(champions: Champion[]): string {
  return champions.map((champ) => `・**${champ.name}**`).join('\n');
}

function createTeamFieldName(lane: LaneKey): string {
  const laneSet = getLanePositionSets(lane);
  return `${getEmoji(laneSet[0].emoji)} ${t(`constants:${laneSet[0].name}`)}`;
}

function createTeamEmbed(team: Team, wrOnly: boolean): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(
      `${t('champion:body.team.title')} ${wrOnly ? getEmoji('WR') : getEmoji('SR')}`,
    )
    .addFields(
      Object.entries(team)
        .filter(([lane]) => lane !== LANES.all.value)
        .map(([lane, champs]) => ({
          name: createTeamFieldName(lane as LaneKey),
          value: createTeamFieldValue(champs),
        })),
    )
    .setColor(Colors.Orange)
    .setThumbnail(`${THUMBNAIL_URL}/${team.top[0].id}.png`);
  return embed;
}

export default new SubCommand({
  execute: async function (
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    await interaction.deferReply();

    const wrOnly = interaction.options.getBoolean('wr_only') ?? true;

    const team = createTeam(wrOnly);
    if (!team) {
      await interaction.editReply({
        embeds: [interactionErrorEmbed(t('champion:body.team.error'))],
      });
      return;
    }

    await interaction.editReply({ embeds: [createTeamEmbed(team, wrOnly)] });
  },
});
