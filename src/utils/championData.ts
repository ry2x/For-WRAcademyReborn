import axios, { type AxiosResponse } from 'axios';
import config from '../config.json' with { type: 'json' };
import logger from '../logger.js';
import type { Champion, Champions } from '../types/interface.js';

export type LaneKey = 'all' | 'top' | 'jg' | 'mid' | 'ad' | 'sup';

export type Lane = {
  name: string;
  value: LaneKey;
};

export const lanes:Record<LaneKey, Lane> = {
  all: {
    name: 'All (全レーン)',
    value: 'all',
  },
  top: {
    name: 'Top (トップ)',
    value: 'top',
  },
  jg: {
    name: 'Jungle (ジャングル)',
    value: 'jg',
  },
  mid: {
    name: 'Mid (ミッド)',
    value: 'mid',
  },
  ad: {
    name: 'ADC (ボット)',
    value: 'ad',
  },
  sup: {
    name: 'Support (サポート)',
    value: 'sup',
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
  return Object.values(champions).filter((champ: Champion) => {
    switch (lane) {
      case lanes.all.value:
        return Object.values(champions);
      case lanes.top.value:
        return champ.is_top;
      case lanes.jg.value:
        return champ.is_jg;
      case lanes.mid.value:
        return champ.is_mid;
      case lanes.ad.value:
        return champ.is_ad;
      case lanes.sup.value:
        return champ.is_sup;
      default:
        return false;
    }
  });
}

export function getLaneEmoji(lane: string) {
  switch (lane) {
    case lanes.all.value:
      return '<:Lane_All:1343842075464175616>';
    case lanes.top.value:
      return '<:Lane_Top:1343276732194750485>';
    case lanes.jg.value:
      return '<:Lane_Jungle:1343276691853934647>';
    case lanes.mid.value:
      return '<:Lane_Mid:1343276706143932447>';
    case lanes.ad.value:
      return '<:Lane_Bot:1343276674044792974>';
    case lanes.sup.value:
      return '<:Lane_Support:1343276719049543803>';
    default:
      return '';
  }
}
