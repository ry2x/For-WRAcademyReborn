import { db } from '@/db/index.js';
import * as schema from '@/db/schema.js';
import logger from '@/logger.js';
import { type GuildMember } from 'discord.js';
import { eq } from 'drizzle-orm';

const { DEFAULT_CHANNEL_ID } = process.env;

function calculateRequiredXP(level: number): number {
  return Math.floor(100 * Math.pow(1.2, level));
}

async function sendLevelUP(nickname: string, newLevel: number) {
  const channel = client.channels.cache.get(DEFAULT_CHANNEL_ID || '');
  if (channel?.isSendable()) {
    await channel.send(`🎉 ${nickname} がレベル ${newLevel} にアップ！`);
  }
}

export async function grantXP(gMember: GuildMember) {
  const users = schema.users;
  const xpGained = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
  const userId = gMember.id;

  let user = (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0];

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
    await sendLevelUP(gMember.nickname || gMember.displayName || '', 1);
    return;
  }

  const now = new Date();
  if ((now.getTime() - new Date(user.lastXpAt).getTime()) / 1000 < 45) return;

  let newXP = user.xp + xpGained;
  let newLevel = user.level;
  let nextLevelXP = user.nextLevelXp;

  // レベルアップ判定
  while (newXP >= nextLevelXP) {
    newLevel++;
    newXP -= nextLevelXP;
    nextLevelXP = calculateRequiredXP(newLevel + 1);
  }

  try {
    // ユーザー情報を更新
    await db
      .update(users)
      .set({ xp: newXP, level: newLevel, nextLevelXp: nextLevelXP, lastXpAt: now })
      .where(eq(users.id, userId));

    // レベルアップ通知
    if (newLevel > user.level) {
      await sendLevelUP(gMember.nickname || gMember.displayName || '', newLevel);
      return;
    }
  } catch (error) {
    logger.error('Failed to update XP:', error);
  }
}
