import { db } from '@/db/index.js';
import type { NewUser, User } from '@/db/schema.js';
import * as schema from '@/db/schema.js';
import logger from '@/logger.js';
import { type GuildMember } from 'discord.js';
import { eq } from 'drizzle-orm';

const { DEFAULT_CHANNEL_ID } = process.env;

// Calculate required XP for the next level using exponential growth
function calculateRequiredXP(level: number): number {
  return Math.floor(100 * Math.pow(1.2, level));
}

// Generate random XP gain between 5 and 15
function calculateXPGain(): number {
  return Math.floor(Math.random() * (15 - 5 + 1)) + 5;
}

// Send level up notification to the default channel
async function sendLevelUP(nickname: string, newLevel: number): Promise<void> {
  try {
    const channel = client.channels.cache.get(DEFAULT_CHANNEL_ID || '');
    if (channel?.isSendable()) {
      await channel.send(`🎉 ${nickname} がレベル ${newLevel} にアップ！`);
    }
  } catch (error) {
    logger.error('Failed to send level up notification:', error);
  }
}

// Create a new user record in the database
async function createNewUser(userId: string, gMember: GuildMember): Promise<User> {
  const newUser: NewUser = {
    id: userId,
    level: 1,
    xp: 0,
    lastXpAt: new Date(0),
    nextLevelXp: calculateRequiredXP(2),
    joinedAT: gMember.joinedAt ? gMember.joinedAt : new Date(0),
  };

  await db.insert(schema.users).values(newUser);
  return newUser as User;
}

// Check if enough time has passed since last XP gain (45 seconds cooldown)
function isCooldownExpired(lastXpAt: Date): boolean {
  const now = new Date();
  return (now.getTime() - lastXpAt.getTime()) / 1000 >= 45;
}

// Calculate new level and XP after gaining experience
function calculateNewLevelAndXP(
  currentUser: User,
  xpGained: number,
): {
  newXP: number;
  newLevel: number;
  nextLevelXP: number;
} {
  let newXP = currentUser.xp + xpGained;
  let newLevel = currentUser.level;
  let nextLevelXP = currentUser.nextLevelXp;

  while (newXP >= nextLevelXP) {
    newLevel++;
    newXP -= nextLevelXP;
    nextLevelXP = calculateRequiredXP(newLevel + 1);
  }

  return { newXP, newLevel, nextLevelXP };
}

// Update user's XP, level, and related data in the database
async function updateUserXP(
  userId: string,
  userData: {
    xp: number;
    level: number;
    nextLevelXp: number;
  },
): Promise<void> {
  await db
    .update(schema.users)
    .set({
      xp: userData.xp,
      level: userData.level,
      nextLevelXp: userData.nextLevelXp,
      lastXpAt: new Date(),
    })
    .where(eq(schema.users.id, userId));
}

// Main function to handle XP granting and level up logic
export async function grantXP(gMember: GuildMember): Promise<void> {
  const userId = gMember.id;
  const users = schema.users;

  try {
    // Get user data from database
    let user = (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0];

    // Create new user if not exists
    if (!user) {
      user = await createNewUser(userId, gMember);
      await sendLevelUP(gMember.nickname || gMember.displayName || '', user.level);
      return;
    }

    // Check cooldown period
    if (!isCooldownExpired(user.lastXpAt)) {
      return;
    }

    // Calculate and update XP
    const xpGained = calculateXPGain();
    const { newXP, newLevel, nextLevelXP } = calculateNewLevelAndXP(user, xpGained);

    await updateUserXP(userId, { xp: newXP, level: newLevel, nextLevelXp: nextLevelXP });

    // Send level up notification if leveled up
    if (newLevel > user.level) {
      await sendLevelUP(gMember.nickname || gMember.displayName || '', newLevel);
    }
  } catch (error) {
    logger.error('Failed to process XP:', error);
    throw error;
  }
}
