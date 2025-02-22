import { readFileSync } from 'fs';
import axios, { type AxiosResponse } from 'axios';
import type { Champions, Config } from '../types/interface.js';

const config: Config = JSON.parse(readFileSync('./config.json', 'utf-8')) as Config;

let champions: Champions = {};

export async function fetchChampionData() {
  try {
    const res: AxiosResponse<Champions> = await axios.get(config.urlChampions);
    champions = res.data;
    console.log('[INFO] Champion data updated!');
  } catch (error: unknown) {
    console.error('[ERROR] Failed to fetch champion data:', error);
  }
}

setInterval(() => void fetchChampionData(), 24 * 60 * 60 * 1000);

export function getChampionByName(name: string) {
  return Object.values(champions).find((champ: { name: string }) =>
    champ.name.toLowerCase().includes(name.toLowerCase()),
  );
}

export function getChampionNames() {
  return Object.values(champions).map((champ: { name: string }) => champ.name);
}
