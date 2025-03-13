import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { desc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';

async function getLeaderboard(limit: number = 10) {
  return await db.query.users.findMany({
    orderBy: desc(users.xp),
    limit: limit,
  });
}

export const command = {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('XPランキングを表示します'),

  async execute(interaction: ChatInputCommandInteraction) {
    const leaderboard = await getLeaderboard(10);

    if (leaderboard.length === 0) {
      return interaction.reply('リーダーボードにデータがありません。');
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 XPランキング 🏆')
      .setColor(Colors.Gold)
      .setTimestamp();

    leaderboard.forEach((user, index) => {
      embed.addFields({
        name: `#${index + 1} <@${user.id}>`,
        value: `レベル: **${user.level}** | XP: **${user.xp}**`,
        inline: false,
      });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
