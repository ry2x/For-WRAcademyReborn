import logger from '@/logger.js';
import type { Config } from '@/types/type.js';
import { type HeroStats, type WinRates, type lane, type rankRange } from '@/types/winRate.js';
import axios, { type AxiosResponse } from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, '../config.json'), 'utf8')) as Config;

let WinRates: WinRates = {
  result: 0,
  data: {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
  },
};

export async function fetchWinRateData() {
  try {
    const res: AxiosResponse<WinRates> = await axios.get(config.urlWinRate);
    WinRates = res.data;
    logger.info('Champion data updated!');
  } catch (error: unknown) {
    logger.error('Failed to fetch winRate data:', error);
  }
}

/**
 * 特定のチャンピオンのデータを取得する関数
 * @param championId チャンピオンID
 * @param lane レーン（1:mid, 2:top, 3:adc, 4:sup, 5:jg）
 * @param rankRange ランク範囲（0:ALL, 1:Dia+, 2:Mas+, 3:Ch+, 4:super server）
 * @returns チャンピオンのデータ。見つからない場合はnull
 */
export function getChampionStats(championId: number, lane: lane, rankRange: rankRange) {
  const laneData = WinRates.data[rankRange]?.[lane];

  const champData =
    laneData?.find((hero) => hero.hero_id.toString() === championId.toString()) || null;

  return champData;
}

/**
 * レーンごとのチャンピオン情報を取得する関数
 * @param lane レーン（1:mid, 2:top, 3:adc, 4:sup, 5:jg）
 * @param rankRange ランク範囲（0:ALL, 1:Dia+, 2:Mas+, 3:Ch+, 4:super server）
 * @returns レーンごとのチャンピオン情報
 */
export function getLaneStats(lane: lane, rankRange: rankRange): HeroStats[] {
  const laneData = WinRates.data[rankRange][lane];
  return laneData ? laneData : [];
}

/**
 * レーンごとのチャンピオン情報を勝率でソートして取得する関数
 * @param lane レーン（1:mid, 2:top, 3:adc, 4:sup, 5:jg）
 * @param rankRange ランク範囲（0:ALL, 1:Dia+, 2:Mas+, 3:Ch+, 4:super server）
 * @param limit 取得するチャンピオンの数（デフォルト: 10）
 * @returns 勝率順にソートされたチャンピオン情報
 */
export function getTopChampionsByWinRate(
  lane: lane,
  rankRange: rankRange,
  limit = 10,
): HeroStats[] {
  const laneData = getLaneStats(lane, rankRange);
  return laneData
    .sort((a, b) => parseFloat(b.win_rate_float) - parseFloat(a.win_rate_float))
    .slice(0, limit);
}

setInterval(() => void fetchWinRateData(), 24 * 60 * 60 * 1000);
