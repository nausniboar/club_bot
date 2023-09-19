import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ActionRowBuilder, Client } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('buttontest')
    .setDescription('Makes a prompt to press testButton.')
  ,
  /**
   * @param {ChatInputCommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute (interaction, client) {
    const button = new ButtonBuilder()
      .setCustomId('testbutton')
      .setLabel('Click me')
      .setStyle(ButtonStyle.Success);
    
    await interaction.reply({
      components: [new ActionRowBuilder().setComponents(button)]
    })
  }
}