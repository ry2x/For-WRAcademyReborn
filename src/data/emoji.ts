import logger from '@/utils/logger.js';
import type { ApplicationEmoji } from 'discord.js';

export const emojiList = ['SR', 'WR'];

type Emoji = Record<string, ApplicationEmoji>;

// Initialize empty emoji storage
const emojis: Emoji = {};

export async function fetchEmoji(): Promise<void> {
  const res = await global.client.application?.emojis.fetch();
  logger.info('Fetched emojis...', res);

  if (!res) {
    console.error('Failed to fetch emojis');
    return;
  }

  res.forEach((emoji) => {
    if (emoji.name && emojiList.includes(emoji.name)) {
      emojis[emoji.name] = emoji;
    }
  });
  logger.info('Emojis fetched successfully:', emojis);
}

export function getEmoji(name: string): ApplicationEmoji | undefined {
  return emojis[name];
}
