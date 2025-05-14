import { interactionError } from '@/embeds/errorEmbed.js';
import { type ChatInputCommandInteraction } from 'discord.js';

/**
 * Safely sends an error message to a Discord interaction
 * This helper ensures we handle both deferred and non-deferred interactions correctly
 */
export async function sendErrorToInteraction(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  if (interaction.deferred || interaction.replied) {
    await interaction.followUp(interactionError);
  } else {
    await interaction.reply(interactionError);
  }
}
