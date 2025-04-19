import logger from '@/logger.js';
import type ApplicationCommand from '@/templates/ApplicationCommand.js';
import { type ContextCommand } from '@/templates/InteractionCommands.js';
import type { CommandModule } from '@/types/type.js';
import { REST } from '@discordjs/rest';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { Routes } from 'discord.js';
import { readdirSync } from 'fs';
const { TOKEN, CLIENT_ID } = process.env;

export default async function deployGlobalCommands() {
  logger.info('[STARTING DEPLOYING GLOBAL COMMANDS]');

  const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
  const commandFiles: string[] = readdirSync('./commands').filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts'),
  );
  for (const file of commandFiles) {
    const module = (await import(`./commands/${file}`)) as CommandModule<ApplicationCommand>;
    const command: ApplicationCommand = module.default;
    const commandData = command.data.toJSON();
    commands.push(commandData);
  }

  const contextCommandFiles: string[] = readdirSync('./contexts').filter(
    (file) => file.endsWith('.js') || file.endsWith('.ts'),
  );
  for (const file of contextCommandFiles) {
    const module = (await import(`./contexts/${file}`)) as CommandModule<ContextCommand>;
    const command: ContextCommand = module.default;
    const commandData = command.data.toJSON();
    commands.push(commandData);
  }

  logger.info('PUSH COMMANDS TO DISCORD');

  const rest = new REST({ version: '10' }).setToken(TOKEN as string);

  try {
    logger.info('PUSHING COMMANDS TO DISCORD');

    await rest.put(Routes.applicationCommands(CLIENT_ID as string), {
      body: commands,
    });

    logger.info('[END DEPLOYING GLOBAL COMMANDS]');
  } catch (error) {
    logger.error(error);
  }
}
