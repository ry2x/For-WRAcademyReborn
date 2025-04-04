import { type RssWildRift, type RssWildRiftItem } from '@/types/news.js';
import type { Config } from '@/types/type.js';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { join } from 'path';
import { fileURLToPath } from 'url';
import logger from '@/logger.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, '../config.json'), 'utf8')) as Config;

let data: RssWildRift = {
  title: '',
  favicon: '',
  elements: [],
};

export async function fetchWildRiftData() {
  try {
    const res: AxiosResponse<RssWildRift> = await axios.get(config.urlRssWildRift);
    data = res.data;
    logger.info('WildRift RSS  data updated!');
  } catch (error: unknown) {
    logger.error('Failed to fetch WildRift RSS data:', error);
  }
}

setInterval(() => void fetchWildRiftData(), 24 * 60 * 60 * 1000);

export function getWildriftNews(count: number): RssWildRiftItem[] {
  return data.elements.slice(0, count);
}

export function getWildriftFaivcon(): string {
  return data.favicon;
}

export function unixMsToYMD(unixTimeMs: string): string {
  const date = new Date(unixTimeMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}

export function getTipsFromContent(content: string): string {
  try {
    const dom = new JSDOM(content);
    const document = dom.window.document;
    return document.querySelector('[data-testid="rich-text-html"] div')?.textContent?.trim() || '';
  } catch (error) {
    logger.error('Failed to parse content:', error);
    return '';
  }
}
