import { autocompleteChampionName } from '@/components/autocomplete/championName.js';
import { AutocompleteCommand } from '@/templates/InteractionCommands.js';

export default new AutocompleteCommand({
  data: {
    name: 'winrate',
  },
  async execute(interaction) {
    await autocompleteChampionName(interaction);
  },
});
