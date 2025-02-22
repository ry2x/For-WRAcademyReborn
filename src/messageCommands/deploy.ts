import deployGlobalCommands from '../deployGlobalCommands.js';
import MessageCommand from '../templates/MessageCommand.js';

const { TOKEN, CLIENT_ID } = process.env as {
  TOKEN: string;
  CLIENT_ID: string;
};

export default new MessageCommand({
  name: 'deploy',
  description: 'Deploys the slash commands',
  async execute(message): Promise<void> {
    if (message.author.id !== client.application?.owner?.id) return;
    await deployGlobalCommands();
  },
});
