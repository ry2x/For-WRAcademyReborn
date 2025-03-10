import axios, { type AxiosResponse } from 'axios';
import config from '../config.json' with { type: 'json' };
import logger from '../logger.js';
import type { Champion, Champions } from '../types/interface.js';

export const lanes = {
  all: 'all',
  top: 'top',
  jg: 'jg',
  mid: 'mid',
  ad: 'ad',
  sup: 'sup',
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
      case lanes.all:
        return Object.values(champions);
      case lanes.top:
        return champ.is_top;
      case lanes.jg:
        return champ.is_jg;
      case lanes.mid:
        return champ.is_mid;
      case lanes.ad:
        return champ.is_ad;
      case lanes.sup:
        return champ.is_sup;
      default:
        return false;
    }
  });
}

export function getLaneEmoji(lane: string) {
  switch (lane) {
    case lanes.all:
      return '<:Lane_All:1343842075464175616>';
    case lanes.top:
      return '<:Lane_Top:1343276732194750485>';
    case lanes.jg:
      return '<:Lane_Jungle:1343276691853934647>';
    case lanes.mid:
      return '<:Lane_Mid:1343276706143932447>';
    case lanes.ad:
      return '<:Lane_Bot:1343276674044792974>';
    case lanes.sup:
      return '<:Lane_Support:1343276719049543803>';
    default:
      return '';
  }
}
