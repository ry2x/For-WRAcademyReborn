import axios, { type AxiosResponse } from 'axios';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import logger from '../logger.js';
import type { Config } from '../types/type.js';
import { type WinRates } from '../types/winRate.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, '../config.json'), 'utf8')) as Config;

let WinRates: WinRates = {
  result: 0,
  data: {
    0: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    },
    1: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    },
    2: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    },
    3: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    },
    4: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    },
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

setInterval(() => void fetchWinRateData(), 24 * 60 * 60 * 1000);
