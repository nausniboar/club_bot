import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";

export default {
  data: {
    name: `testbutton`
  },
  /**
   * @param {ChatInputCommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute (interaction, client) {
    console.log("Test button clicked");
    await interaction.reply({content: "Test button clicked", ephemeral: true})

    // Optional: Can replace above statement with these two lines to make non-interaction reply
    //interaction.deferUpdate();
    //interaction.channel.send("Test button clicked");
  }
}