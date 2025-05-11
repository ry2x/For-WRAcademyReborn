import config from '@/constants/config.js';
import { db } from '@/db/index.js';
import * as schema from '@/db/schema.js';
import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import {
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  MessageFlags,
} from 'discord.js';
import { desc } from 'drizzle-orm';

const { DEFAULT_GUILD_ID } = process.env;

const LEADERBOARD_CONFIG = {
  DEFAULT_LIMIT: 5,
  PROGRESS_BAR_LENGTH: 15,
} as const;

/**
 * Fetches the leaderboard data from the database
 * @param limit - Maximum number of users to fetch
 * @returns Array of user data sorted by level and XP
 */
async function getLeaderboard(
  limit: number = LEADERBOARD_CONFIG.DEFAULT_LIMIT,
) {
  const users = schema.users;
  if (!db) {
    throw new Error('Database not initialized');
  }
  return await db
    .select()
    .from(users)
    .orderBy(desc(users.level), desc(users.xp))
    .limit(limit);
}

/**
 * Creates a progress bar string
 * @param current - Current value
 * @param max - Maximum value
 * @param length - Length of the progress bar
 * @returns Progress bar string
 */
function createProgressBar(
  current: number,
  max: number,
  length: number = LEADERBOARD_CONFIG.PROGRESS_BAR_LENGTH,
): string {
  const progress = Math.min(Math.max(current / max, 0), 1);
  const filledLength = Math.round(length * progress);
  const emptyLength = length - filledLength;

  const filled = '█'.repeat(filledLength);
  const empty = '░'.repeat(emptyLength);

  return `${filled}${empty}`;
}

/**
 * Gets the emoji for a specific rank
 * @param rank - Rank number
 * @returns Emoji string
 */
function getRankEmoji(rank: number): string {
  switch (rank) {
    case 1:
      return '👑';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return '🎯';
  }
}

/**
 * Creates the leaderboard content string
 * @param leaderboard - Array of user data
 * @returns Formatted leaderboard content
 */
function createLeaderboardContent(
  leaderboard: (typeof schema.users.$inferSelect)[],
): string {
  return leaderboard
    .map((user, index) => {
      const percentage = Math.round((user.xp / user.nextLevelXp) * 100);
      const progressBar = createProgressBar(user.xp, user.nextLevelXp);
      return `${getRankEmoji(index + 1)} **${index + 1}位** <@${user.id}>\nレベル: **${user.level}** | XP: **${percentage}%**\n${progressBar}`;
    })
    .join('\n\n');
}

/**
 * Creates the leaderboard embed
 * @param content - Leaderboard content string
 * @returns Embed with leaderboard information
 */
function createLeaderboardEmbed(content: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('👑レベルランキング TOP 10')
    .setColor(Colors.Gold)
    .setTimestamp()
    .setFooter({ text: 'レベルアップまでの進捗バー' })
    .setDescription(content);
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (interaction.guildId !== DEFAULT_GUILD_ID) {
      await interaction.reply({
        embeds: [interactionErrorEmbed(config.LeaderBoardError.invalidServer)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const leaderboard = await getLeaderboard();

    if (leaderboard.length === 0) {
      await interaction.reply(config.LeaderBoardError.noData);
      return;
    }

    const content = createLeaderboardContent(leaderboard);
    const embed = createLeaderboardEmbed(content);

    await interaction.reply({ embeds: [embed] });
  },
});
