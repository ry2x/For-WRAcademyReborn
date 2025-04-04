import logger from '@/logger.js';
import type {
  Champion,
  Champions,
  LaneKey,
  PositionSet,
  RankRangeKey,
  RoleKey,
} from '@/types/champs.js';
import type { Config } from '@/types/type.js';
import type { lane, rankRange } from '@/types/winRate.js';
import axios, { type AxiosResponse } from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, '../config.json'), 'utf8')) as Config;

export const lanes: Record<LaneKey, PositionSet<LaneKey> & { apiParam: lane }> = {
  all: {
    name: 'All (全レーン)',
    value: 'all',
    emoji: '<:Lane_All:1343842075464175616>',
    apiParam: '0',
  },
  top: {
    name: 'Top (トップ)',
    value: 'top',
    emoji: '<:Lane_Top:1343276732194750485>',
    apiParam: '2',
  },
  jg: {
    name: 'Jungle (ジャングル)',
    value: 'jg',
    emoji: '<:Lane_Jungle:1343276691853934647>',
    apiParam: '5',
  },
  mid: {
    name: 'Mid (ミッド)',
    value: 'mid',
    emoji: '<:Lane_Mid:1343276706143932447>',
    apiParam: '1',
  },
  ad: {
    name: 'ADC (ボット)',
    value: 'ad',
    emoji: '<:Lane_Bot:1343276674044792974>',
    apiParam: '3',
  },
  sup: {
    name: 'Support (サポート)',
    value: 'sup',
    emoji: '<:Lane_Support:1343276719049543803>',
    apiParam: '4',
  },
} as const;

export const rankRanges: Record<RankRangeKey, PositionSet<RankRangeKey> & { apiParam: rankRange }> =
  {
    all: {
      name: '全ランク',
      value: 'all',
      emoji: '<:Rank_Challenger:1356509666527416462>',
      apiParam: '0',
    },
    diamondPlus: {
      name: 'ダイヤモンド',
      value: 'diamondPlus',
      emoji: '<:Rank_Master:1356509641562919032>',
      apiParam: '1',
    },
    masterPlus: {
      name: 'マスター',
      value: 'masterPlus',
      emoji: '<:Rank_Master:1356509641562919032>',
      apiParam: '2',
    },
    challengerPlus: {
      name: 'チャレンジャー以上',
      value: 'challengerPlus',
      emoji: '<:Rank_Challenger:1356509666527416462>',
      apiParam: '3',
    },
    superServer: {
      name: 'スーパーサーバー',
      value: 'superServer',
      emoji: '<:LRank_Legend:1356510180057284719>',
      apiParam: '4',
    },
  } as const;

export const roles: Record<RoleKey, PositionSet<RoleKey>> = {
  F: {
    name: 'ファイター',
    value: 'F',
    emoji: '<:fighter:1343296794343247985>',
  },
  M: {
    name: 'メイジ',
    value: 'M',
    emoji: '<:mage:1343296818775326780>',
  },
  A: {
    name: 'アサシン',
    value: 'A',
    emoji: '<:assassin:1343296727712530494>',
  },
  MM: {
    name: 'マークスマン',
    value: 'MM',
    emoji: '<:marksman:1343296831781605376>',
  },
  S: {
    name: 'サポート',
    value: 'S',
    emoji: '<:support:1343296844586946681>',
  },
  T: {
    name: 'タンク',
    value: 'T',
    emoji: '<:tank:1343296805575589939>',
  },
};

let champions: Champions = {};

export async function fetchChampionData() {
  try {
    const res: AxiosResponse<Champions> = await axios.get(config.urlChampions);
    champions = res.data;
    logger.info('Champion data updated!');
  } catch (error: unknown) {
    logger.error('Failed to fetch champion data:', error);
  }
}

setInterval(() => void fetchChampionData(), 24 * 60 * 60 * 1000);

export function getChampionByName(name: string) {
  return Object.values(champions).find((champ: Champion) =>
    champ.name.toLowerCase().includes(name.toLowerCase()),
  );
}

export function getChampById(id: string) {
  return Object.values(champions).find((champ: Champion) =>
    champ.id.toLowerCase().includes(id.toLowerCase()),
  );
}

export function getChampionNames(): string[] {
  return Object.values(champions).map((champ: Champion) => champ.name);
}

export function getChampionIds() {
  return Object.values(champions).map((champ: Champion) => champ.id);
}

export function getChampionsByLane(lane: LaneKey) {
  if (lane === lanes.all.value) {
    return Object.values(champions);
  }

  const laneKey = `is_${lane}` as keyof Champion;

  return Object.values(champions).filter((champ) => champ[laneKey] === true);
}

export function getLaneEmoji(lane: string): string {
  return lanes[lane as LaneKey]?.emoji ?? '';
}
export function getChampionLanes(champ: Champion): (PositionSet<LaneKey> & { apiParam: lane })[] {
  return Object.entries(lanes)
    .filter(([key]) => {
      const laneKey = `is_${key}` as keyof Champion;
      return champ[laneKey] === true;
    })
    .map(([key]) => lanes[key as LaneKey]);
}
