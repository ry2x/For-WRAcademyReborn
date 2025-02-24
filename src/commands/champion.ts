import { Colors, EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
import ApplicationCommand from '../templates/ApplicationCommand.js';
import type { Champion } from '../types/interface.js';
import { getChampionByName } from '../utils/championData.js';

function getRoles(champion: Champion): string {
  let roles = '→';
  if (champion.is_top) roles += 'トップ<:Lane_Top:1342957411408941167>　';
  if (champion.is_jg) roles += 'ジャングル<:Lane_Jungle:1342957406266593311> 　';
  if (champion.is_mid) roles += 'ミッド<:Lane_Mid:1342957408040783963>　';
  if (champion.is_ad) roles += 'ボット<:Lane_Bot:1342957400495231067>　';
  if (champion.is_sup) roles += 'サポート<:Lane_Support:1342957409747992576>　';
  return roles;
}

function getTags(champion: Champion): string {
  let tags = '→';
  if (champion.is_fighter) tags += 'ファイター<:fighter:1343296794343247985>　';
  if (champion.is_mage) tags += 'メイジ<:mage:1343296818775326780>　';
  if (champion.is_assassin) tags += 'アサシン<:assassin:1343296727712530494>　';
  if (champion.is_marksman) tags += 'マークスマン<:marksman:1343296831781605376>　';
  if (champion.is_support) tags += 'サポート<:support:1343296844586946681>　';
  if (champion.is_tank) tags += 'タンク<:tank:1343296805575589939>　';
  return tags;
}

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName('champion')
    .setDescription('指定したチャンピオンの情報を表示します')
    .addStringOption((option) =>
      option
        .setName('championname')
        .setDescription('チャンピオンの名前')
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async execute(interaction): Promise<void> {
    function interactionErrorEmbed(msg: string): EmbedBuilder {
      return new EmbedBuilder().setColor(Colors.Red).setTitle(msg);
    }

    const championName = interaction.options.getString('championname');
    if (!championName) {
      await interaction.reply({
        embeds: [interactionErrorEmbed('❌チャンピオンの名前が指定されていません。')],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const champion = getChampionByName(championName);

    if (!champion) {
      await interaction.reply({
        embeds: [
          interactionErrorEmbed(`❌チャンピオン「${championName}」は見つかりませんでした。`),
        ],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const embed = new EmbedBuilder()
      .setColor(Colors.Orange)
      .setTitle(champion.name)
      .setDescription(champion.title)
      .setThumbnail(
        `https://ddragon.leagueoflegends.com/cdn/15.4.1/img/champion/${champion.id}.png`,
      )
      .addFields(
        {
          name: champion.is_wr
            ? '<:Icon_WR:1342960956036218942> <:Icon_LOL:1342961477224497232>'
            : '<:Icon_LOL:1342961477224497232>',
          value: `マナタイプ : ${champion.type}`,
        },
        { name: 'レーン', value: getRoles(champion), inline: true },
        { name: 'ロール', value: getTags(champion), inline: true },
        {
          name: '説明',
          value:
            champion.describe.length > 1024 ? champion.describe.slice(0, 1024) : champion.describe,
        },
      );
    await interaction.reply({ embeds: [embed] });
  },
});
