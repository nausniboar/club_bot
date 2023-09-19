import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('return a ping')
  ,
  async execute (interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true
    });
    const newMessage = `API latency: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`
    await interaction.editReply({
      content: newMessage
    });
  }
}