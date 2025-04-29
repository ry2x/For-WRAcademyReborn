import config from '@/constants/config.js';
import type ApplicationCommand from '@/templates/ApplicationCommand.js';
import { type ContextCommand } from '@/templates/InteractionCommands.js';
import type { CommandModule } from '@/types/type.js';
import logger from '@/utils/logger.js';
import { REST } from '@discordjs/rest';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { Routes } from 'discord.js';
import { readdirSync } from 'fs';

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

/**
 * Checks if a given filename has a supported file extension
 * @param fileName The name of the file to check
 * @returns True if the file has a supported extension, false otherwise
 */
export function isValidFileExtension(fileName: string): boolean {
  return config.SUPPORTED_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

// Helper function to load command files
async function loadCommandFiles<T>(
  directory: string,
): Promise<RESTPostAPIApplicationCommandsJSONBody[]> {
  const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
  const files = readdirSync(directory).filter(isValidFileExtension);

  for (const file of files) {
    try {
      const module = (await import(`${directory}/${file}`)) as CommandModule<
        T extends ApplicationCommand ? ApplicationCommand : ContextCommand
      >;
      const command = module.default;

      // Skip 'empty' commands that are disabled via environment variables
      if (command && command.data && command.data.name !== 'empty') {
        commands.push(command.data.toJSON());
      }
    } catch (error) {
      logger.error(`Failed to load command from file ${file}:`, error);
    }
  }

  return commands;
}

export default async function deployGlobalCommands() {
  if (!TOKEN || !CLIENT_ID) {
    throw new Error('Missing required environment variables: TOKEN or CLIENT_ID');
  }

  logger.info('[STARTING DEPLOYING GLOBAL COMMANDS]');

  try {
    // Load both types of commands
    const standardCommands = await loadCommandFiles<ApplicationCommand>('./commands');
    const contextCommands = await loadCommandFiles<ContextCommand>('./contexts');
    const allCommands = [...standardCommands, ...contextCommands];

    // Initialize REST client
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    logger.info('PUSHING COMMANDS TO DISCORD');
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: allCommands,
    });

    logger.info('[END DEPLOYING GLOBAL COMMANDS]');
  } catch (error) {
    logger.error('Failed to deploy commands:', error);
    throw error;
  }
}
