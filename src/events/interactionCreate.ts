import { interactionError } from '@/embeds/errorEmbed.js';
import type ApplicationCommand from '@/templates/ApplicationCommand.js';
import Event from '@/templates/Event.js';
import {
  type AutocompleteCommand,
  type ButtonCommand,
  type ContextCommand,
  type ModalCommand,
  type SelectCommand,
} from '@/templates/InteractionCommands.js';
import { handleError } from '@/utils/errorHandler.js';
import {
  BaseError,
  DiscordError,
  ValidationError,
} from '@/utils/errors/errors.js';
import { t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';
import {
  Events,
  type AnySelectMenuInteraction,
  type AutocompleteInteraction,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type ContextMenuCommandInteraction,
  type ModalSubmitInteraction,
} from 'discord.js';

type CommandInteraction =
  | ButtonInteraction
  | ChatInputCommandInteraction
  | ContextMenuCommandInteraction
  | AnySelectMenuInteraction
  | ModalSubmitInteraction;

type Command =
  | ButtonCommand
  | ContextCommand
  | ApplicationCommand
  | SelectCommand
  | ModalCommand
  | AutocompleteCommand;

export default new Event({
  name: Events.InteractionCreate,
  async execute(
    interaction: CommandInteraction | AutocompleteInteraction,
  ): Promise<void> {
    try {
      // Handle different interaction types
      if (isCommandInteraction(interaction)) {
        await handleCommandInteraction(interaction);
      } else if (interaction.isAutocomplete()) {
        await handleAutocompleteInteraction(interaction);
      }
    } catch (error) {
      logger.error(t('interaction.failed.create'), error);
    }
  },
});

// Helper functions
function isCommandInteraction(
  interaction: CommandInteraction | AutocompleteInteraction,
): interaction is CommandInteraction {
  return (
    interaction.isChatInputCommand() ||
    interaction.isButton() ||
    interaction.isContextMenuCommand() ||
    interaction.isAnySelectMenu() ||
    interaction.isModalSubmit()
  );
}

function isButtonCommand(command: Command): command is ButtonCommand {
  return 'execute' in command && command.execute.length === 1;
}

function isContextCommand(command: Command): command is ContextCommand {
  return 'execute' in command && command.execute.length === 1;
}

function isApplicationCommand(command: Command): command is ApplicationCommand {
  return 'execute' in command && command.execute.length === 1;
}

function isSelectCommand(command: Command): command is SelectCommand {
  return 'execute' in command && command.execute.length === 1;
}

function isModalCommand(command: Command): command is ModalCommand {
  return 'execute' in command && command.execute.length === 1;
}

function isAutocompleteCommand(
  command: Command,
): command is AutocompleteCommand {
  return 'execute' in command && command.execute.length === 1;
}

async function handleCommandInteraction(
  interaction: CommandInteraction,
): Promise<void> {
  try {
    let command: Command | undefined;

    if (interaction.isButton()) {
      command = client.components.buttons.get(
        interaction.customId.split('-')[0],
      );
      if (command && isButtonCommand(command)) {
        await command.execute(interaction);
      }
    } else if (interaction.isContextMenuCommand()) {
      command = client.contextCommands.get(interaction.commandName);
      if (command && isContextCommand(command)) {
        await command.execute(interaction);
      }
    } else if (interaction.isChatInputCommand()) {
      command = client.commands.get(interaction.commandName);
      if (command && isApplicationCommand(command)) {
        await command.execute(interaction);
      }
    } else if (interaction.isAnySelectMenu()) {
      command = client.components.selects.get(interaction.customId);
      if (command && isSelectCommand(command)) {
        await command.execute(interaction);
      }
    } else if (interaction.isModalSubmit()) {
      command = client.components.modals.get(interaction.customId);
      if (command && isModalCommand(command)) {
        await command.execute(interaction);
      }
    }

    if (!command) {
      logger.warn(
        t('interaction.failed.notFound', { name: interaction.id }),
        interaction,
      );
    }
  } catch (error) {
    logger.error(t('interaction.failed.error'), error);
    await handleInteractionError(interaction);
  }
}

async function handleAutocompleteInteraction(
  interaction: AutocompleteInteraction,
): Promise<void> {
  try {
    const command = client.components.autocomplete.get(interaction.commandName);

    if (!command) {
      throw new ValidationError(
        t('autoComplete.failed.notFound', { name: interaction.commandName }),
        {
          timestamp: new Date(),
          command: interaction.commandName,
          userId: interaction.user.id,
          guildId: interaction.guildId ?? undefined,
        },
        { command: ['Command not found'] },
      );
    }

    if (isAutocompleteCommand(command)) {
      await command.execute(interaction);
    }
  } catch (error) {
    // Handle the error using our new error system
    if (error instanceof BaseError) {
      handleError('autoComplete.execution', error);
    } else {
      handleError(
        'autoComplete.failed.error',
        new DiscordError(
          error instanceof Error
            ? error.message
            : t('autoComplete.failed.error'),
          {
            timestamp: new Date(),
            command: interaction.commandName,
            userId: interaction.user.id,
            guildId: interaction.guildId ?? undefined,
          },
          error instanceof Error ? error : undefined,
        ),
      );
    }

    // Always respond to the interaction to prevent Discord timeout
    await interaction.respond([
      {
        name: t('autoComplete.failed.error'),
        value: 'error',
      },
    ]);
  }
}

async function handleInteractionError(
  interaction: CommandInteraction,
): Promise<void> {
  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(interactionError);
    } else {
      await interaction.reply(interactionError);
    }
  } catch (error) {
    logger.error(t('interaction.failed.sendingError'), error);
  }
}
