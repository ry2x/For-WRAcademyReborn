import { getChampById, getChampionIds, getChampionNames } from '@/data/championData.js';
import { AutocompleteCommand } from '@/templates/InteractionCommands.js';
import { toKatakana } from '@/utils/convertHiragana.js';

export default new AutocompleteCommand({
  data: {
    name: 'champion',
  },
  async execute(interaction) {
    const focusedValue = toKatakana(interaction.options.getFocused());
    let championNames = getChampionNames()
      .filter((name) => name.includes(focusedValue))
      .slice(0, 25);
    if (championNames.length === 0) {
      const championId = getChampionIds()
        .filter((id) => id.toLowerCase().includes(interaction.options.getFocused().toLowerCase()))
        .slice(0, 25);
      championNames = championId.map((id) => {
        const champ = getChampById(id);
        if (!champ) {
          return '';
        }
        return champ.name;
      });
    }
    await interaction.respond(championNames.map((name) => ({ name, value: name })));
  },
});
