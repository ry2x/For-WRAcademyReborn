import { type Message } from 'discord.js';

export default class MessageCommand {
  name: string;
  description: string;
  execute: (message: Message, args: string[]) => Promise<void> | void;
  aliases: string[];

  /**
   * @param {{
   *      name: string,
   *      description: string,
   *      execute: (message: Message, args: string[]) => Promise<void> | void,
   *      aliases?: string[]
   *  }} options - The options for the message command
   */
  constructor(options: {
    name: string;
    description: string;
    execute: (message: Message, args: string[]) => Promise<void> | void;
    aliases?: string[];
  }) {
    this.name = options.name;
    this.description = options.description;
    this.execute = options.execute;
    this.aliases = options.aliases ?? [];
  }
}
