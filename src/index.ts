import config from '@/constants/config.js';
import { fetchChampionData } from '@/data/championData.js';
import { fetchEmoji, uploadEmojis } from '@/data/emoji.js';
import { fetchWildRiftData } from '@/data/wildriftRss.js';
import { fetchWinRateData } from '@/data/winRate.js';
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
import { initI18n, t } from '@/utils/i18n.js';
import logger from '@/utils/logger.js';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { readdirSync } from 'fs';

const UPDATE_TIME = {
  HOURS: 0,
  MINUTES: 30,
  SECONDS: 0,
  MILLISECONDS: 0,
} as const;

/**
 * Checks if a given filename has a supported file extension
 * @param fileName The name of the file to check
 * @returns True if the file has a supported extension, false otherwise
 */
export function isValidFileExtension(fileName: string): boolean {
  return config.SUPPORTED_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

/**
 * Calculates the next update time based on the configured UPDATE_TIME constants
 * @returns {Date} The next scheduled update time
 */
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

/**
 * Schedules daily updates for fetching new data
 * Recursively sets up the next update after completion
 */
function scheduleDailyUpdate(): void {
  const now = new Date();
  const nextUpdate = getNextUpdateTime();
  const timeUntilNextUpdate = nextUpdate.getTime() - now.getTime();

  setTimeout(() => {
    void (async () => {
      try {
        await Promise.all([
          fetchChampionData(),
          fetchWildRiftData(),
          fetchWinRateData(),
        ]);
        scheduleDailyUpdate();
      } catch (error) {
        handleError(t('initialization.failed.daily'), error);
      }
    })();
  }, timeUntilNextUpdate);
}

/**
 * Initializes and fetches all required data from external sources
 * @throws {Error} When data initialization fails
 */
async function initializeData(): Promise<void> {
  try {
    await Promise.all([
      fetchChampionData(),
      fetchWildRiftData(),
      fetchWinRateData(),
    ]);
    scheduleDailyUpdate();
  } catch (error) {
    handleError(t('initialization.failed.data'), error);
    process.exit(1);
  }
}

/**
 * Initializes Discord client with required intents and collections
 * Sets up the global client object with necessary collections for commands
 */
function initializeClient(): void {
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

/**
 * Generic function to load commands from a specified directory into a collection
 * @param {string} directory - The directory path containing command files
 * @param {Collection<string, T>} collection - The collection to store commands
 * @param {Function} filterFn - Optional function to filter valid files
 * @throws {Error} When command loading fails
 */
async function loadCommands<T extends { data: { name: string } }>(
  directory: string,
  collection: Collection<string, T>,
  filterFn: (file: string) => boolean = isValidFileExtension,
): Promise<void> {
  try {
    const files = readdirSync(directory).filter(filterFn);
    for (const file of files) {
      const module = (await import(
        `./${directory}/${file}`
      )) as CommandModule<T>;
      const command = module.default;
      collection.set(command.data.name, command);
    }
  } catch (error) {
    handleError(
      t('initialization.failed.commands', { directory: directory }),
      error,
    );
    throw error;
  }
}

/**
 * Loads message-based commands from a specified directory
 * @param {string} directory - The directory path containing message command files
 * @param {Collection<string, MessageCommand>} collection - The collection to store commands
 * @param {Function} filterFn - Optional function to filter valid files
 * @throws {Error} When message command loading fails
 */
async function loadMessageCommands(
  directory: string,
  collection: Collection<string, MessageCommand>,
  filterFn: (file: string) => boolean = isValidFileExtension,
): Promise<void> {
  try {
    const files = readdirSync(directory).filter(filterFn);
    for (const file of files) {
      const module = (await import(
        `./${directory}/${file}`
      )) as CommandModule<MessageCommand>;
      const command = module.default;
      collection.set(command.name, command);
    }
  } catch (error) {
    handleError(
      t('initialization.failed.messageCommands', { directory: directory }),
      error,
    );
    throw error;
  }
}

/**
 * Loads all component commands (buttons, selects, modals, autocomplete)
 * @throws {Error} When component command loading fails
 */
async function loadComponentCommands(): Promise<void> {
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
    handleError(
      t('initialization.failed.component', { directory: './components' }),
      error,
    );
    throw error;
  }
}

/**
 * Loads all types of commands (application, context, message, and component commands)
 * @throws {Error} When command loading fails
 */
async function loadAllCommands(): Promise<void> {
  try {
    await Promise.all([
      loadCommands('commands', client.commands),
      loadCommands('contexts', client.contextCommands),
      loadMessageCommands('messageCommands', client.msgCommands),
      loadComponentCommands(),
    ]);
  } catch (error) {
    handleError(t('initialization.failed.allCommands'), error);
    process.exit(1);
  }
}

/**
 * Sets up an event handler for Discord events
 * @param {Event} event - The event object containing name and execution logic
 */
function setupEventHandler(event: Event): void {
  const handler = (...args: unknown[]) => {
    void (async () => {
      try {
        await event.execute(...args);
      } catch (error) {
        handleError(
          t('initialization.failed.event', { eventName: event.name }),
          error,
        );
      }
    })();
  };

  if (event.once) {
    client.once(event.name, handler);
  } else {
    client.on(event.name, handler);
  }
}

/**
 * Sets up all event handlers from the events directory
 * @throws {Error} When event handler setup fails
 */
async function setupEventHandlers(): Promise<void> {
  try {
    const eventFiles = readdirSync('./events').filter(isValidFileExtension);

    for (const file of eventFiles) {
      const module = (await import(`./events/${file}`)) as CommandModule<Event>;
      const event = module.default;
      setupEventHandler(event);
    }
  } catch (error) {
    handleError(t('initialization.failed.eventHandler'), error);
    process.exit(1);
  }
}

/**
 * Sets up process event handlers for graceful shutdown and error handling
 * Handles process exit, unhandled rejections, and uncaught exceptions
 */
function setupProcessExitHandler(): void {
  // Handle normal process exit
  process.on('exit', (code) => {
    void (async () => {
      try {
        logger.error(t('initialization.failed.processError', { code: code }));
        await notifyAdminWebhook(
          t('initialization.failed.processError', { code: code }),
        );
      } catch (error) {
        handleError(t('initialization.failed.process'), error);
      }
    })();
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (error) => {
    void (async () => {
      handleError(t('initialization.failed.unhandled'), error);
      await notifyAdminWebhook(t('initialization.failed.unhandled'));
    })();
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    handleError(t('initialization.failed.uncaught'), error);
    void (async () => {
      await notifyAdminWebhook(t('initialization.failed.uncaught'));
      process.exit(1);
    })();
  });
}

/**
 * Main initialization function that bootstraps the application
 * Initializes i18n, data, client, commands, and event handlers
 * @throws {Error} When initialization fails
 */
async function initialize(): Promise<void> {
  const { TOKEN } = process.env;

  try {
    logger.info('[START STARTING]');

    await initI18n();

    logger.info('i18n initialized');

    await initializeData();

    logger.info('Data initialized');

    initializeClient();

    logger.info('Client initialized');

    await loadAllCommands();

    logger.info('Commands loaded');

    await setupEventHandlers();

    logger.info('Event handlers setup');

    setupProcessExitHandler();

    logger.info('Process exit handlers setup');

    await client.login(TOKEN);

    logger.info('[END STARTING]');

    logger.info('[EMOJI FETCH STARTING]');

    await uploadEmojis();
    await fetchEmoji();

    logger.info('[EMOJI FETCH END]');
  } catch (error) {
    handleError('Failed to starting', error);
    process.exit(1);
  }
}

// Start Application
void initialize();
