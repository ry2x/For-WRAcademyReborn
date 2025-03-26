import SubCommand from '@/templates/SubCommand.js';
import { type ChatInputCommandInteraction, Colors, EmbedBuilder } from 'discord.js';
import { desc } from 'drizzle-orm';
import { db } from '@/db/index.js';
import * as schema from '@/db/schema.js';

async function getLeaderboard(limit: number = 10) {
  const users = schema.users;
  return await db.select().from(users).orderBy(desc(users.level), desc(users.xp)).limit(limit);
}

function createProgressBar(current: number, max: number, length: number = 15): string {
  const progress = Math.min(Math.max(current / max, 0), 1);
  const filledLength = Math.round(length * progress);
  const emptyLength = length - filledLength;

  const filled = '█'.repeat(filledLength);
  const empty = '░'.repeat(emptyLength);

  return `${filled}${empty}`;
}

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

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const leaderboard = await getLeaderboard(10);

    if (leaderboard.length === 0) {
      await interaction.reply('リーダーボードにデータがありません。');
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('👑レベルランキング TOP 10')
      .setColor(Colors.Gold)
      .setTimestamp()
      .setFooter({ text: 'レベルアップまでの進捗バー' });

    // リーダーボードの内容を作成
    const leaderboardContent = leaderboard
      .map((user, index) => {
        const percentage = Math.round((user.xp / user.nextLevelXp) * 100);
        const progressBar = createProgressBar(user.xp, user.nextLevelXp);
        return `${getRankEmoji(index + 1)} **${index + 1}位** <@${user.id}>\nレベル: **${user.level}** | XP: **${percentage}%**\n${progressBar}`;
      })
      .join('\n\n');

    embed.setDescription(leaderboardContent);

    await interaction.reply({ embeds: [embed] });
  },
});
