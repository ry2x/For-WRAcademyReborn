import { AutocompleteCommand } from '../../templates/InteractionCommands.js';
import { getChampionNames } from '../../utils/championData.js';

export default new AutocompleteCommand({
  data: {
    name: 'champion',
  },
  async execute(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const championNames = getChampionNames()
      .filter((name) => name.toLowerCase().includes(focusedValue))
      .slice(0, 25);
    await interaction.respond(championNames.map((name) => ({ name, value: name })));
  },
});
