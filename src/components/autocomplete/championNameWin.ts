import { AutocompleteCommand } from '@/templates/InteractionCommands';
import { autocompleteChampionName } from './championName';

export default new AutocompleteCommand({
  data: {
    name: 'winrate',
  },
  async execute(interaction) {
    await autocompleteChampionName(interaction);
  },
});
