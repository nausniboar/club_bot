import { SlashCommandBuilder, EmbedBuilder, Embed, ChatInputCommandInteraction, Client } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription("For testing; interprets input as code with javascript's eval() function. Ephemeral/silent reply.")
    .addStringOption((option) => option
      .setName('string')
      .setDescription('the string to eval')
      .setRequired(true)
    )
  ,
  /**
   * @param {ChatInputCommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute (interaction, client) {
    await interaction.reply({
      content: `This dumbass <@${interaction.user.id}> tried to eval arbitrary code! Point and laugh!`
    })
  }
}