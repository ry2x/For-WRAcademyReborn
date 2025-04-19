import config from '@/constants/config.js';
import logger from '@/logger.js';
import { type RssWildRift, type RssWildRiftItem } from '@/types/news.js';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { JSDOM } from 'jsdom';

// Cache for WildRift RSS data
let data: RssWildRift = {
  title: '',
  favicon: '',
  elements: [],
};

/**
 * Fetches WildRift RSS data from the API and updates the local cache
 * @throws Error if API request fails
 */
export async function fetchWildRiftData(): Promise<void> {
  try {
    const res: AxiosResponse<RssWildRift> = await axios.get(config.urlRssWildRift);
    data = res.data;
    logger.info('WildRift RSS data updated successfully');
  } catch (error) {
    logger.error('Failed to fetch WildRift RSS data:', error);
    throw error;
  }
}

/**
 * Gets the latest WildRift news items
 * @param count - Number of news items to return
 * @returns Array of news items
 */
export function getWildriftNews(count: number): RssWildRiftItem[] {
  return data.elements.slice(0, count);
}

/**
 * Gets the WildRift favicon URL
 * @returns The favicon URL
 */
export function getWildriftFaivcon(): string {
  return data.favicon;
}

/**
 * Converts Unix timestamp in milliseconds to YYYY/MM/DD format
 * @param unixTimeMs - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function unixMsToYMD(unixTimeMs: string): string {
  const date = new Date(unixTimeMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}

/**
 * Extracts tips from HTML content
 * @param content - HTML content to parse
 * @returns Extracted tips text
 */
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
