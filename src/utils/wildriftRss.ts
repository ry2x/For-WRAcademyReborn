import { readFileSync } from 'fs';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import logger from '../logger.js';
import type { Config, RssWildRift, RssWildRiftItem } from '../types/interface.js';

const config: Config = JSON.parse(readFileSync('./config.json', 'utf-8')) as Config;

let data: RssWildRift = {
  title: '',
  favicon: '',
  elements: [],
};

export async function fetchWildRiftData() {
  try {
    const res: AxiosResponse<RssWildRift> = await axios.get(config.urlRssWildRift);
    data = res.data;
    logger.info('[INFO] WildRift RSS  data updated!');
  } catch (error: unknown) {
    logger.error('[ERROR] Failed to fetch WildRift RSS data:', error);
  }
}

setInterval(() => void fetchWildRiftData(), 24 * 60 * 60 * 1000);

export function getWildriftNews(count: number): RssWildRiftItem[] {
  return data.elements.slice(0, count - 1);
}

export function getWildriftFaivcon(): string {
  return data.favicon;
}

export function getTipsFromContent(content: string): string {
  try {
    const dom = new JSDOM(content);
    const element = dom.window.document.querySelector('[data-testid="rich-text-html"] div');
    return element?.textContent || '';
  } catch (error) {
    logger.error('[ERROR] Failed to parse content:', error);
    return '';
  }
}
