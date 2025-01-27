import { ButtonCommand } from '../../templates/InteractionCommands.js';

export default new ButtonCommand({
  data: {
    name: 'button-ping',
  },
  async execute(interaction): Promise<void> {
    await interaction.reply('Pong!');
  },
});
