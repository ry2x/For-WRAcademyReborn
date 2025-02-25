import config from '../config.json' with { type: 'json' };
import MessageCommand from '../templates/MessageCommand.js';

export default new MessageCommand({
  name: 'undeploy',
  description: 'Undeploy the slash commands',
  async execute(message, args): Promise<void> {
    if (message.author.id !== client.application?.owner?.id) return;

    if (!args[0]) {
      await message.reply(
        `Incorrect number of arguments! The correct format is \`${config.prefix}undeploy <guild/global>\``,
      );
      return;
    }

    if (args[0].toLowerCase() === 'global') {
      // global un-deployment

      // undeploy the commands
      await client.application?.commands.set([]);

      await message.reply('Underlying!');
    } else if (args[0].toLowerCase() === 'guild') {
      // guild deployment

      // undeploy the commands
      await message.guild?.commands.set([]);

      await message.reply('Underlying!');
    }
  },
});
