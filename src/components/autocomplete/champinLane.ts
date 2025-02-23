import { AutocompleteCommand } from '../../templates/InteractionCommands.js';
import { lanes } from '../../utils/championData.js';

export default new AutocompleteCommand({
  data: {
    name: 'lanechamps',
  },
  async execute(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const lane = lanes.filter((lane) => lane.toLowerCase().includes(focusedValue)).slice(0, 25);

    await interaction.respond(lane.map((lane) => ({ name: lane, value: lane })));
  },
});
