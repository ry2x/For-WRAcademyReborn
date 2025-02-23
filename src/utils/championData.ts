import { readFileSync } from 'fs';
import axios, { type AxiosResponse } from 'axios';
import logger from '../logger.js';
import type { Champion, Champions, Config } from '../types/interface.js';

const config: Config = JSON.parse(readFileSync('./config.json', 'utf-8')) as Config;

export const lanes = ['トップ', 'ジャングル', 'ミッド', 'ボット', 'サポート'];

let champions: Champions = {};

export async function fetchChampionData() {
  try {
    const res: AxiosResponse<Champions> = await axios.get(config.urlChampions);
    champions = res.data;
    logger.info('[INFO] Champion data updated!');
  } catch (error: unknown) {
    logger.error('[ERROR] Failed to fetch champion data:', error);
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
      case lanes[0]:
        return champ.is_top;
      case lanes[1]:
        return champ.is_jg;
      case lanes[2]:
        return champ.is_mid;
      case lanes[3]:
        return champ.is_ad;
      case lanes[4]:
        return champ.is_sup;
      default:
        return false;
    }
  });
}
