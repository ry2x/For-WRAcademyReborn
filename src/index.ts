import 'dotenv/config';
import { readdirSync } from 'fs';
import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';
import deployGlobalCommands from './deployGlobalCommands.js';
import logger from './logger.js';
import type ApplicationCommand from './templates/ApplicationCommand.js';
import type Event from './templates/Event.js';
import {
  type AutocompleteCommand,
  type ModalCommand,
  type SelectCommand,
  type ContextCommand,
  type ButtonCommand,
} from './templates/InteractionCommands.js';
import type MessageCommand from './templates/MessageCommand.js';
import type { commandModule } from './types/interface.js';

const { TOKEN } = process.env;

logger.info('[INITIALIZING CLIENT]');

await deployGlobalCommands();

logger.info('[FINISHED DEPLOYING GLOBAL COMMANDS]');

// Discord client object
logger.info('Create Discord Client Object');
global.client = Object.assign(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
  }),
  {
    commands: new Collection<string, ApplicationCommand>(),
    msgCommands: new Collection<string, MessageCommand>(),
    contextCommands: new Collection<string, ContextCommand>(),
    components: {
      buttons: new Collection<string, ButtonCommand>(),
      selects: new Collection<string, SelectCommand>(),
      modals: new Collection<string, ModalCommand>(),
      autocomplete: new Collection<string, AutocompleteCommand>(),
    },
  },
);

// Set each command in the commands folder as a command in the client.commands collection
logger.info('[CREATING COMMANDS COLLECTIONS]');

// Set SlashCommands
logger.info('SlashCommands');
const commandFiles: string[] = readdirSync('./commands').filter(
  (file) => file.endsWith('.js') || file.endsWith('.ts'),
);
for (const file of commandFiles) {
  const module = (await import(`./commands/${file}`)) as commandModule<ApplicationCommand>;
  const command: ApplicationCommand = module.default;
  client.commands.set(command.data.name, command);
}

// Set ContextCommands
logger.info('ContextCommands');
const contextCommandFiles: string[] = readdirSync('./contexts').filter(
  (file) => file.endsWith('.js') || file.endsWith('.ts'),
);
for (const file of contextCommandFiles) {
  const module = (await import(`./contexts/${file}`)) as commandModule<ContextCommand>;
  const command: ContextCommand = module.default;
  client.contextCommands.set(command.data.name, command);
}

// Set MessageCommands
logger.info('MessageCommands');
const msgCommandFiles: string[] = readdirSync('./messageCommands').filter(
  (file) => file.endsWith('.js') || file.endsWith('.ts'),
);
for (const file of msgCommandFiles) {
  const module = (await import(`./messageCommands/${file}`)) as commandModule<MessageCommand>;
  const command: MessageCommand = module.default;
  client.msgCommands.set(command.name, command);
}

// Set ComponentCommands
logger.info('ComponentCommands');
for (const directory of readdirSync('./components')) {
  if (directory in client.components) {
    for (const file of readdirSync(`./components/${directory}`).filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts'),
    )) {
      const module = (await import(`./components/${directory}/${file}`)) as commandModule<
        ButtonCommand | SelectCommand | ModalCommand | AutocompleteCommand
      >;
      const command: ButtonCommand | SelectCommand | ModalCommand | AutocompleteCommand =
        module.default;
      (
        client.components[directory as keyof typeof client.components] as Collection<
          string,
          typeof command
        >
      ).set(command.data.name, command);
    }
  }
}

// Event handling
logger.info('EventHandler');
const eventFiles: string[] = readdirSync('./events').filter(
  (file) => file.endsWith('.js') || file.endsWith('.ts'),
);

for (const file of eventFiles) {
  const module = (await import(`./events/${file}`)) as commandModule<Event>;
  const event: Event = module.default;
  if (event.once) {
    client.once(event.name, (...args) => {
      void (async () => await event.execute(...args))();
    });
  } else {
    client.on(event.name, (...args) => {
      void (async () => await event.execute(...args))();
    });
  }
}

await client.login(TOKEN);
logger.info('[END STARTING]');
