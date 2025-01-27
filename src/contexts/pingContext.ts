import { ApplicationCommandType, ContextMenuCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { ContextCommand } from '../templates/InteractionCommands.js';

export default new ContextCommand({
  data: new ContextMenuCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('pingContext')
    .setType(ApplicationCommandType.Message),
  async execute(interaction): Promise<void> {
    await interaction.reply('ping context');
  },
});
