import axios, { AxiosResponse } from 'axios';
import { type WinRates } from '../src/types/winRate';

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

const win: AxiosResponse<WinRates> = await axios.get(
  'https://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2',
);

WinRates = win.data;

const lane = WinRates.data[4][4];

console.log('AIn1', lane?.length);

const champ = lane?.find((hero) => hero.hero_id.toString() === '10081');

console.log('Ain', champ);
