import { AutocompleteCommand } from '@/templates/InteractionCommands.js';
import { getChampionNames } from '@/data/championData.js';
import { toKatakana } from '@/utils/convertHiragana.js';

export default new AutocompleteCommand({
  data: {
    name: 'champion',
  },
  async execute(interaction) {
    const focusedValue = toKatakana(interaction.options.getFocused());
    const championNames = getChampionNames()
      .filter((name) => name.includes(focusedValue))
      .slice(0, 25);
    await interaction.respond(championNames.map((name) => ({ name, value: name })));
  },
});
