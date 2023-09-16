import { SlashCommandBuilder } from "discord.js";

export default {
  data: {
    name: 'test'
  },
  async execute (interaction, client) {
    console.log("Test button clicked");
  }
}