import { fetchChampionData } from '@/data/championData.js';
import { fetchWildRiftData } from '@/data/wildriftRss.js';
import { fetchWinRateData } from '@/data/winRate.js';
import logger from '@/logger.js';
import type ApplicationCommand from '@/templates/ApplicationCommand.js';
import type Event from '@/templates/Event.js';
import {
  type AutocompleteCommand,
  type ButtonCommand,
  type ContextCommand,
  type ModalCommand,
  type SelectCommand,
} from '@/templates/InteractionCommands.js';
import type MessageCommand from '@/templates/MessageCommand.js';
import type { CommandModule } from '@/types/type.js';
import { Client, Collection, GatewayIntentBits, Partials, WebhookClient } from 'discord.js';
import { readdirSync } from 'fs';

// Initialize and fetch all required data from external sources
async function initializeData(): Promise<void> {
  logger.info('[INITIALIZING CONNECTIONS AND DATA]');
  try {
    await Promise.all([fetchChampionData(), fetchWildRiftData(), fetchWinRateData()]);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to initialize data:', error.message);
    } else {
      logger.error('Failed to initialize data: Unknown error');
    }
    process.exit(1);
  }
}

// Initialize Discord client with required intents and collections
function initializeClient(): void {
  logger.info('[INITIALIZING CLIENT]');
  logger.info('Creating Discord Client Object...');

  global.client = Object.assign(
    new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
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
}

// Generic function to load commands from a directory into a collection
async function loadCommands<T extends { data: { name: string } }>(
  directory: string,
  collection: Collection<string, T>,
  filterFn: (file: string) => boolean = (file) => file.endsWith('.js') || file.endsWith('.ts'),
): Promise<void> {
  try {
    const files = readdirSync(directory).filter(filterFn);
    for (const file of files) {
      const module = (await import(`./${directory}/${file}`)) as CommandModule<T>;
      const command = module.default;
      collection.set(command.data.name, command);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to load commands from ${directory}:`, error.message);
    } else {
      logger.error(`Failed to load commands from ${directory}: Unknown error`);
    }
    throw error;
  }
}

// Load message-based commands from a directory
async function loadMessageCommands(
  directory: string,
  collection: Collection<string, MessageCommand>,
  filterFn: (file: string) => boolean = (file) => file.endsWith('.js') || file.endsWith('.ts'),
): Promise<void> {
  try {
    const files = readdirSync(directory).filter(filterFn);
    for (const file of files) {
      const module = (await import(`./${directory}/${file}`)) as CommandModule<MessageCommand>;
      const command = module.default;
      collection.set(command.name, command);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to load message commands from ${directory}:`, error.message);
    } else {
      logger.error(`Failed to load message commands from ${directory}: Unknown error`);
    }
    throw error;
  }
}

// Set up event handler for Discord events
function setupEventHandler(event: Event): void {
  const handler = (...args: unknown[]) => {
    void (async () => {
      try {
        await event.execute(...args);
      } catch (error) {
        if (error instanceof Error) {
          logger.error(`Error in event ${event.name}:`, error.message);
        } else {
          logger.error(`Error in event ${event.name}: Unknown error`);
        }
      }
    })();
  };

  if (event.once) {
    client.once(event.name, handler);
  } else {
    client.on(event.name, handler);
  }
}

// Load component commands (buttons, selects, modals, autocomplete)
async function loadComponentCommands(): Promise<void> {
  logger.info('[LOADING COMPONENT COMMANDS]');
  try {
    for (const directory of readdirSync('./components')) {
      if (directory in client.components) {
        const componentType = directory as keyof typeof client.components;
        const collection = client.components[componentType];
        await loadCommands(
          `components/${directory}`,
          collection as Collection<
            string,
            ButtonCommand | SelectCommand | ModalCommand | AutocompleteCommand
          >,
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to load component commands:', error.message);
    } else {
      logger.error('Failed to load component commands: Unknown error');
    }
    throw error;
  }
}

// Load all types of commands (application, context, message, and component commands)
async function loadAllCommands(): Promise<void> {
  logger.info('[CREATING COMMANDS COLLECTIONS]');
  try {
    await Promise.all([
      loadCommands('commands', client.commands),
      loadCommands('contexts', client.contextCommands),
      loadMessageCommands('messageCommands', client.msgCommands),
      loadComponentCommands(),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to load commands:', error.message);
    } else {
      logger.error('Failed to load commands: Unknown error');
    }
    process.exit(1);
  }
}

// Set up all event handlers from the events directory
async function setupEventHandlers(): Promise<void> {
  logger.info('Adding EventHandler...');
  try {
    const eventFiles = readdirSync('./events').filter(
      (file) => file.endsWith('.js') || file.endsWith('.ts'),
    );

    for (const file of eventFiles) {
      const module = (await import(`./events/${file}`)) as CommandModule<Event>;
      const event = module.default;
      setupEventHandler(event);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to setup event handlers:', error.message);
    } else {
      logger.error('Failed to setup event handlers: Unknown error');
    }
    process.exit(1);
  }
}

// Set up process event handlers for graceful shutdown and error handling
function setupProcessExitHandler(): void {
  logger.info('Adding ProcessExitHandler...');
  const { ADMIN_WEBHOOK } = process.env;

  // Handle normal process exit
  process.on('exit', (code) => {
    void (async () => {
      try {
        logger.error(`⚠️ プロセス終了 (コード: ${code})`);
        if (ADMIN_WEBHOOK) {
          const webhook = new WebhookClient({ url: ADMIN_WEBHOOK });
          await webhook.send(`⚠️ プロセス終了 (コード: ${code})`);
        }
      } catch (error) {
        if (error instanceof Error) {
          logger.error('Failed to send webhook notification:', error.message);
        } else {
          logger.error('Failed to send webhook notification: Unknown error');
        }
      }
    })();
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (error) => {
    if (error instanceof Error) {
      logger.error('Unhandled promise rejection:', error.message);
    } else {
      logger.error('Unhandled promise rejection: Unknown error');
    }
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    if (error instanceof Error) {
      logger.error('Uncaught exception:', error.message);
    } else {
      logger.error('Uncaught exception: Unknown error');
    }
    process.exit(1);
  });
}

// Main initialization function
async function initialize(): Promise<void> {
  const { TOKEN } = process.env;

  try {
    await initializeData();
    initializeClient();
    await loadAllCommands();
    await setupEventHandlers();
    setupProcessExitHandler();

    await client.login(TOKEN);
    logger.info('[END STARTING]');
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to initialize:', error.message);
    } else {
      logger.error('Failed to initialize: Unknown error');
    }
    process.exit(1);
  }
}

// Start Application
void initialize();
