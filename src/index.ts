import { fetchChampionData } from '@/data/championData.js';
import { fetchWildRiftData } from '@/data/wildriftRss.js';
import { fetchWinRateData } from '@/data/winRate.js';
import { isValidFileExtension } from '@/deployGlobalCommands.js';
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
import { handleError, notifyAdminWebhook } from '@/utils/errorHandler.js';
import logger from '@/utils/logger.js';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { readdirSync } from 'fs';

const UPDATE_TIME = {
  HOURS: 0,
  MINUTES: 30,
  SECONDS: 0,
  MILLISECONDS: 0,
} as const;

function getNextUpdateTime(): Date {
  const now = new Date();
  const nextUpdate = new Date();
  nextUpdate.setHours(
    UPDATE_TIME.HOURS,
    UPDATE_TIME.MINUTES,
    UPDATE_TIME.SECONDS,
    UPDATE_TIME.MILLISECONDS,
  );

  if (nextUpdate <= now) {
    nextUpdate.setDate(nextUpdate.getDate() + 1);
  }

  return nextUpdate;
}

function scheduleDailyUpdate(): void {
  const now = new Date();
  const nextUpdate = getNextUpdateTime();
  const timeUntilNextUpdate = nextUpdate.getTime() - now.getTime();

  setTimeout(() => {
    void (async () => {
      try {
        await Promise.all([fetchChampionData(), fetchWildRiftData(), fetchWinRateData()]);
        scheduleDailyUpdate();
      } catch (error) {
        handleError('Daily update failed', error);
      }
    })();
  }, timeUntilNextUpdate);
}

// Initialize and fetch all required data from external sources
async function initializeData(): Promise<void> {
  logger.info('[INITIALIZING CONNECTIONS AND DATA]');
  try {
    await Promise.all([fetchChampionData(), fetchWildRiftData(), fetchWinRateData()]);
    scheduleDailyUpdate();
  } catch (error) {
    handleError('Failed to initialize data', error);
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
  filterFn: (file: string) => boolean = isValidFileExtension,
): Promise<void> {
  try {
    const files = readdirSync(directory).filter(filterFn);
    for (const file of files) {
      const module = (await import(`./${directory}/${file}`)) as CommandModule<T>;
      const command = module.default;
      collection.set(command.data.name, command);
    }
  } catch (error) {
    handleError(`Failed to load commands from ${directory}`, error);
    throw error;
  }
}

// Load message-based commands from a directory
async function loadMessageCommands(
  directory: string,
  collection: Collection<string, MessageCommand>,
  filterFn: (file: string) => boolean = isValidFileExtension,
): Promise<void> {
  try {
    const files = readdirSync(directory).filter(filterFn);
    for (const file of files) {
      const module = (await import(`./${directory}/${file}`)) as CommandModule<MessageCommand>;
      const command = module.default;
      collection.set(command.name, command);
    }
  } catch (error) {
    handleError(`Failed to load message commands from ${directory}`, error);
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
        handleError(`Error in event ${event.name}`, error);
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
    handleError('Failed to load component commands', error);
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
    handleError('Failed to load commands', error);
    process.exit(1);
  }
}

// Set up all event handlers from the events directory
async function setupEventHandlers(): Promise<void> {
  logger.info('Adding EventHandler...');
  try {
    const eventFiles = readdirSync('./events').filter(isValidFileExtension);

    for (const file of eventFiles) {
      const module = (await import(`./events/${file}`)) as CommandModule<Event>;
      const event = module.default;
      setupEventHandler(event);
    }
  } catch (error) {
    handleError('Failed to setup event handlers', error);
    process.exit(1);
  }
}

// Set up process event handlers for graceful shutdown and error handling
function setupProcessExitHandler(): void {
  logger.info('Adding ProcessExitHandler...');

  // Handle normal process exit
  process.on('exit', (code) => {
    void (async () => {
      try {
        const message = `⚠️ プロセス終了 (コード: ${code})`;
        logger.error(message);
        await notifyAdminWebhook(message);
      } catch (error) {
        handleError('Process exit notification failed', error);
      }
    })();
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (error) => {
    void (async () => {
      handleError('Unhandled promise rejection', error);
      await notifyAdminWebhook('⚠️ 未処理のPromise Rejectionが発生しました');
    })();
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    handleError('Uncaught exception', error);
    void (async () => {
      await notifyAdminWebhook('⚠️ 未処理の例外が発生しました');
      process.exit(1);
    })();
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
    handleError('Failed to initialize', error);
    process.exit(1);
  }
}

// Start Application
void initialize();
