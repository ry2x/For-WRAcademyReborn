import { interactionErrorEmbed } from '@/embeds/errorEmbed.js';
import SubCommand from '@/templates/SubCommand.js';
import {
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  GuildMember,
  type VoiceChannel,
} from 'discord.js';

/**
 * Retrieves the target voice channel from the interaction.
 * If no channel is specified, it defaults to the user's current voice channel.
 */
function getTargetChannel(interaction: ChatInputCommandInteraction): VoiceChannel | null {
  return (
    (interaction.options.getChannel('vc_channel', false) as VoiceChannel) ||
    (interaction.member instanceof GuildMember ? interaction.member.voice.channel : null)
  );
}

/**
 * Splits members into teams and returns the result as an array of strings.
 */
function splitIntoTeams(members: GuildMember[], teamCount: number): string[][] {
  const shuffledMembers = [...members]; // Create a copy to avoid modifying the original array
  for (let i = shuffledMembers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledMembers[i], shuffledMembers[j]] = [shuffledMembers[j], shuffledMembers[i]];
  }
  const teams: string[][] = Array.from({ length: teamCount }, () => []);
  shuffledMembers.forEach((member, index) => {
    teams[index % teamCount].push(`<@${member.id}>`);
  });
  return teams;
}

/**
 * Builds an embed displaying the team division results.
 */
function buildTeamEmbed(teams: string[][]): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle('チーム分け結果')
    .setColor(Colors.Aqua)
    .addFields(
      teams.map((team, index) => ({
        name: `チーム ${index + 1}`,
        value: team.join('\n') || 'なし',
        inline: true,
      })),
    );
  return embed;
}

export default new SubCommand({
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const teamCount = interaction.options.getInteger('team_count', false) ?? 2;
    const targetChannel = getTargetChannel(interaction);
    const includeBot = interaction.options.getBoolean('is_bot', false) ?? false;
    const excludeMember = interaction.options.getMember('exclude') as GuildMember | null;

    // Validate team count
    if (teamCount <= 1) {
      await interaction.reply({
        embeds: [interactionErrorEmbed('チーム数は2以上を指定してください。')],
        ephemeral: true,
      });
      return;
    }

    // Validate target channel
    if (!targetChannel || !targetChannel.isVoiceBased()) {
      await interaction.reply({
        embeds: [interactionErrorEmbed('有効なVCチャンネルを指定してください。')],
        ephemeral: true,
      });
      return;
    }

    // Get members from the target channel
    let members = Array.from(targetChannel.members.values());

    // Filter out bots if includeBot is false
    if (!includeBot) {
      members = members.filter((member) => !member.user.bot);
    }

    // Exclude specified member if applicable
    const filteredMembers = excludeMember
      ? members.filter((member) => member.id !== excludeMember.id)
      : members;

    // Validate if there are enough members
    if (filteredMembers.length < 2) {
      await interaction.reply({
        embeds: [interactionErrorEmbed('チャンネルに有効なメンバーがいません。')],
        ephemeral: true,
      });
      return;
    }

    // Split members into teams
    const teams = splitIntoTeams(filteredMembers, teamCount);

    // Build and send the embed with team results
    const embed = buildTeamEmbed(teams);
    await interaction.reply({ embeds: [embed] });
  },
});
