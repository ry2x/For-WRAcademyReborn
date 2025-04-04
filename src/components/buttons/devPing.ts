import { ButtonCommand } from '@/templates/InteractionCommands.js';
import { pingEmbed } from '@/embeds/pingEmbed.js';

export default new ButtonCommand({
  data: {
    name: 'devping',
  },
  async execute(interaction): Promise<void> {
    const [, ping] = interaction.customId.split('-');
    await interaction.reply({
      embeds: [pingEmbed(ping)],
    });
  },
});
