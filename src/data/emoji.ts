import { EMOJIS } from '@/constants/emoji.js';
import logger from '@/utils/logger.js';
import type { ApplicationEmoji } from 'discord.js';

type Emoji = Record<string, ApplicationEmoji>;

// Initialize empty emoji storage
const emojis: Emoji = {};

/**
 * Fetches emojis from the Discord client and stores valid ones in memory
 * Valid emojis are those whose names match the codes defined in EMOJIS constant
 * @throws {Error} If fetching emojis from Discord fails
 * @returns Promise that resolves when emojis are fetched and stored
 */
export async function fetchEmoji(): Promise<void> {
  const res = await global.client.application?.emojis.fetch();
  logger.info('Fetched emojis...', res);

  if (!res) {
    console.error('Failed to fetch emojis');
    return;
  }

  const validEmojiNames = EMOJIS.map((emoji) => emoji.code);

  res.forEach((emoji) => {
    if (emoji.name && validEmojiNames.includes(emoji.name)) {
      emojis[emoji.name] = emoji;
    }
  });
  const emojiNames = Object.keys(emojis);
  logger.info('Emojis fetched successfully:', emojiNames);
}

/**
 * Uploads new emojis to the Discord server if they don't already exist
 * Only uploads emojis defined in the EMOJIS constant that aren't already on the server
 * @throws {Error} If uploading emojis to Discord fails
 * @returns Promise that resolves when all new emojis are uploaded
 */
export async function uploadEmojis(): Promise<void> {
  const existingEmojis = await global.client.application?.emojis.fetch();
  const deployedEmojis = [];

  if (existingEmojis) {
    const existingEmojisMap = new Map(
      existingEmojis.map((emoji) => [emoji.name, emoji]),
    );
    for (const { code, url } of EMOJIS) {
      if (existingEmojisMap.has(code)) {
        logger.info(`Emoji already exists: ${code}`);
      } else {
        const newEmoji = await global.client.application?.emojis.create({
          attachment: url,
          name: code,
        });
        logger.info(`Added new emoji: ${code}`);
        deployedEmojis.push(newEmoji);
      }
    }

    const emojiList = deployedEmojis
      .filter((emoji) => emoji !== undefined)
      .map((emoji) => emoji.toString())
      .join(' ');
    logger.info(
      emojiList.length === 0
        ? 'No new emojis deployed'
        : `Emojis deployed successfully, new emojis: ${emojiList}`,
    );
  }
}

/**
 * Gets the Discord formatted emoji string for the given emoji name
 * @param name - The name/code of the emoji to retrieve
 * @returns Discord formatted emoji string in the format <:name:id>
 * @throws {Error} If the emoji with the given name doesn't exist
 */
export function getEmoji(name: string): string {
  return `<:${emojis[name].name}:${emojis[name].id}>`;
}
