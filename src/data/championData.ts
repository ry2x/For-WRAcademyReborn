import axios, { type AxiosResponse } from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import logger from '../logger.js';
import type { Champion, Champions, Config, Lane, LaneKey } from '../types/type.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, '../config.json'), 'utf8')) as Config;

export const lanes: Record<LaneKey, Lane> = {
  all: {
    name: 'All (全レーン)',
    value: 'all',
    emoji: '<:Lane_All:1343842075464175616>',
  },
  top: {
    name: 'Top (トップ)',
    value: 'top',
    emoji: '<:Lane_Top:1343276732194750485>',
  },
  jg: {
    name: 'Jungle (ジャングル)',
    value: 'jg',
    emoji: '<:Lane_Jungle:1343276691853934647>',
  },
  mid: {
    name: 'Mid (ミッド)',
    value: 'mid',
    emoji: '<:Lane_Mid:1343276706143932447>',
  },
  ad: {
    name: 'ADC (ボット)',
    value: 'ad',
    emoji: '<:Lane_Bot:1343276674044792974>',
  },
  sup: {
    name: 'Support (サポート)',
    value: 'sup',
    emoji: '<:Lane_Support:1343276719049543803>',
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

export function getChampionNames() {
  return Object.values(champions).map((champ: Champion) => champ.name);
}

export function getChampionsByLane(lane: string) {
  if (lane === lanes.all.value) {
    return Object.values(champions);
  }

  const laneKey = `is_${lane}` as keyof Champion;

  return Object.values(champions).filter((champ) => champ[laneKey] === true);
}

export function getLaneEmoji(lane: string): string {
  return lanes[lane as LaneKey]?.emoji ?? '';
}
