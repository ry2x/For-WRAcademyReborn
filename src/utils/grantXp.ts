import { GuildMember } from 'discord.js';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js'; // Drizzle ORM のインスタンス
import { userLevels, users } from '../db/schema.js';

const { DEFAULT_CHANNEL_ID } = process.env;

function calculateRequiredXP(level: number): number {
  return Math.floor(100 * Math.pow(1.2, level));
}

async function grantXP(gMember: GuildMember) {
  const xpGained = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
  const userId = gMember.id;

  // クールダウン判定
  let user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    user = {
      id: userId,
      level: 1,
      xp: 0,
      lastXpAt: new Date(0),
      nextLevelXp: calculateRequiredXP(2),
      joinedAT: gMember.joinedAt ? gMember.joinedAt : new Date(0),
    };
    await db.insert(users).values(user);
  }

  const now = new Date();
  if ((now.getTime() - new Date(user.lastXpAt).getTime()) / 1000 < 45) return;

  let newXP = user.xp + xpGained;
  let newLevel = user.level;
  let nextLevelXP = user.nextLevelXp;

  // レベルアップ判定
  while (newXP >= nextLevelXP) {
    newLevel++;
    newXP -= nextLevelXP; // 次のレベル分のXPを引く
    nextLevelXP = calculateRequiredXP(newLevel + 1); // 次のレベルに必要なXPを計算
  }

  // XP付与
  await db.transaction(async (tx) => {
    await tx.insert(userLevels).values({
      userId: userId,
      xpGained: xpGained,
    });

    await tx
      .update(users)
      .set({ xp: newXP, level: newLevel, nextLevelXp: nextLevelXP, lastXpAt: now })
      .where(eq(users.id, userId));
  });

  if (newLevel > user.level) {
    const channel = client.channels.cache.get(DEFAULT_CHANNEL_ID || '');
    if (channel?.isSendable()) {
      channel.send(`🎉 ${userId} がレベル ${newLevel} にアップ！`);
    }
  }
}
