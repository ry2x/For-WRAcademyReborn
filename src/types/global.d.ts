import { type Client, type Collection } from 'discord.js';
import type ApplicationCommand from '../templates/ApplicationCommand.ts';
import {
  type AutocompleteCommand,
  type ButtonCommand,
  type ModalCommand,
  type SelectCommand,
  type ContextCommand,
} from '../templates/InteractionCommands.js';
import type MessageCommand from '../templates/MessageCommand.ts';

interface DiscordClient extends Client {
  commands: Collection<string, ApplicationCommand>;
  msgCommands: Collection<string, MessageCommand>;
  contextCommands: Collection<string, ContextCommand>;
  components: {
    buttons: Collection<string, ButtonCommand>;
    selects: Collection<string, SelectCommand>;
    modals: Collection<string, ModalCommand>;
    autocomplete: Collection<string, AutocompleteCommand>;
  };
}

declare global {
  // eslint-disable-next-line no-var
  var client: DiscordClient;

  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

export {};
