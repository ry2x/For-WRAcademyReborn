import type ApplicationCommand from '@/templates/ApplicationCommand.js';
import {
  type AutocompleteCommand,
  type ButtonCommand,
  type ContextCommand,
  type ModalCommand,
  type SelectCommand,
} from '@/templates/InteractionCommands.js';
import type MessageCommand from '@/templates/MessageCommand.js';
import { type Client, type Collection } from 'discord.js';

/**
 * Extended Discord client with custom collections for commands and components
 */
interface DiscordClient extends Client {
  /** Collection of application commands */
  commands: Collection<string, ApplicationCommand>;
  /** Collection of message commands */
  msgCommands: Collection<string, MessageCommand>;
  /** Collection of context menu commands */
  contextCommands: Collection<string, ContextCommand>;
  /** Collection of interaction components */
  components: {
    /** Collection of button components */
    buttons: Collection<string, ButtonCommand>;
    /** Collection of select menu components */
    selects: Collection<string, SelectCommand>;
    /** Collection of modal components */
    modals: Collection<string, ModalCommand>;
    /** Collection of autocomplete components */
    autocomplete: Collection<string, AutocompleteCommand>;
  };
}

declare global {
  // eslint-disable-next-line no-var
  var client: DiscordClient;

  /**
   * Utility type to make specific properties of a type optional
   * @template T - The base type
   * @template K - The keys to make optional
   */
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

export {};
