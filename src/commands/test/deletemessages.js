import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('deletemessages')
    .setDescription('Deletes x messages from optionally specified channel.')
    .addIntegerOption((option) => option
      .setName('amount')
      .setDescription('Selects number of messages to delete.')
      .setRequired(true)
    )
    .addChannelOption((option) => option
      .setName('channel')
      .setDescription('Select which channel. Default is the same channel.')
    ),
  async execute(interaction, client) {
    let channel = interaction.options.getChannel('channel')
    channel = channel == null ? interaction.channel : channel
    const amt = interaction.options.getInteger('amount')
    channel.bulkDelete(amt);
    await interaction.reply({
      content: `Bulk deleted ${amt} messages.`
    });
  }
}