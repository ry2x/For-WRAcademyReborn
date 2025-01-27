import { type BaseInteraction, Events } from 'discord.js';
import logger from '../logger.js';
import type ApplicationCommand from '../templates/ApplicationCommand.js';
import Event from '../templates/Event.js';
import {
  type ButtonCommand,
  type ModalCommand,
  type SelectCommand,
  type ContextCommand,
  type AutocompleteCommand,
} from '../templates/InteractionCommands.js';
import { interactionError } from '../utils/errorEmbed.js';

export default new Event({
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction): Promise<void> {
    // Dynamic interaction handling
    if (
      !(
        interaction.isChatInputCommand() ||
        interaction.isButton() ||
        interaction.isContextMenuCommand() ||
        interaction.isAnySelectMenu() ||
        interaction.isModalSubmit() ||
        interaction.isAutocomplete()
      )
    )
      return;
    if (
      interaction.isChatInputCommand() ||
      interaction.isButton() ||
      interaction.isContextMenuCommand() ||
      interaction.isAnySelectMenu() ||
      interaction.isModalSubmit()
    ) {
      try {
        let command:
          | ButtonCommand
          | ContextCommand
          | ApplicationCommand
          | SelectCommand
          | ModalCommand;
        if (interaction.isButton()) {
          command = client.components.buttons.get(interaction.customId) as ButtonCommand;
          await command.execute(interaction);
        } else if (interaction.isContextMenuCommand()) {
          command = client.contextCommands.get(interaction.commandName) as ContextCommand;
          await command.execute(interaction);
        } else if (interaction.isChatInputCommand()) {
          command = client.commands.get(interaction.commandName) as ApplicationCommand;
          await command.execute(interaction);
        } else if (interaction.isAnySelectMenu()) {
          command = client.components.selects.get(interaction.customId) as SelectCommand;
          await command.execute(interaction);
        } else if (interaction.isModalSubmit()) {
          command = client.components.modals.get(interaction.customId) as ModalCommand;
          await command.execute(interaction);
        } else {
          return;
        }
      } catch (error) {
        logger.error(error);
        await interaction.reply(interactionError);
      }
    }

    if (interaction.isAutocomplete()) {
      try {
        const command = client.components.autocomplete.get(
          interaction.commandName,
        ) as AutocompleteCommand;
        await command.execute(interaction);
      } catch (error) {
        logger.error(error);
        await interaction.respond([
          {
            name: 'failed to autocomplete',
            value: 'error',
          },
        ]);
      }
    }
  },
});
