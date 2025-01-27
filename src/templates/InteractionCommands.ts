import {
  type AutocompleteInteraction,
  type AnySelectMenuInteraction,
  type ButtonInteraction,
  type ContextMenuCommandBuilder,
  type ContextMenuCommandInteraction,
  type ModalSubmitInteraction,
} from 'discord.js';
import BaseCommand from './BaseCommand.js';

type dummyData = {
  name: string;
};

/**
 * Represents an Context Command
 */
export class ContextCommand extends BaseCommand<
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction
> {}

/**
 * Represents an Button Command
 */
export class ButtonCommand extends BaseCommand<dummyData, ButtonInteraction> {}

/**
 * Represents a Select Command
 */
export class SelectCommand extends BaseCommand<dummyData, AnySelectMenuInteraction> {}

/**
 * Represents a Modal Command
 */
export class ModalCommand extends BaseCommand<dummyData, ModalSubmitInteraction> {}

/**
 * Represents a Autocomplete Command
 */
export class AutocompleteCommand extends BaseCommand<dummyData, AutocompleteInteraction> {}
