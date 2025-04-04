import { AutocompleteCommand } from '@/templates/InteractionCommands.js';
import { autocompleteChampionName } from './championName.js';

export default new AutocompleteCommand({
  data: {
    name: 'winrate',
  },
  async execute(interaction) {
    await autocompleteChampionName(interaction);
  },
});
