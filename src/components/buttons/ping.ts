import { ButtonCommand } from '../../templates/InteractionCommands.js';

export default new ButtonCommand({
  data: {
    name: 'ButtonPing',
  },
  async execute(interaction): Promise<void> {
    await interaction.reply('Pong!');
  },
});
