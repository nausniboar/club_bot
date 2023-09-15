import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('add a role')
    .addRoleOption((option) => option
      .setName('newrole')
      .setDescription('adds a new role')
      .setRequired(true)
    ),
  async execute (interaction, client) {
    const addedRole = interaction.options._hoistedOptions[0].role;
    //console.log(addedRole);
    interaction.member.roles.add(addedRole);
    await interaction.reply({
      content: `Added ${addedRole.name} to ${interaction.member.displayName}.`
    });
  }
}