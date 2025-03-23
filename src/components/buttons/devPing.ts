import { pingEmbed } from '../../embeds/pingEmbed.js';
import { ButtonCommand } from '../../templates/InteractionCommands.js';

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
