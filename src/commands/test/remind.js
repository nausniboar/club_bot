import { ApplicationCommandPermissionType, SlashCommandBuilder } from "discord.js";
import Reminder from '../../Reminder.js'
import { Model } from "mongoose";
import { ChatInputCommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('ping to remind user')
    .addIntegerOption((option) => option
      .setName('minutes')
      .setDescription('number of minutes away to be reminded')
      .setRequired(true)
    )
    .addStringOption((option) => option 
      .setName('message')
      .setDescription('message to remind user with')
      .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Model} testSchema
   */
  async execute(interaction) {
    console.log("here");
    /*let data = await Reminder.findOne({
      GuildID: interaction.guild.id, UserID: interaction.user.id
    })
    console.log("hi");
    if(data) {
      console.log("data");
      console.log(data);
    } else {*/
      //console.log("no data");
    //}
    const minutes = interaction.options.getInteger('minutes');
    const message = interaction.options.getString('message');
    let date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    const data = {
      GuildID: interaction.guild.id,
      ChannelID: interaction.channelId,
      UserID: interaction.user.id,
      DueDate: date,
      Message: message
    }
    Reminder.create(data);
    await interaction.reply({content: "Reminder logged."})
      .then(() => console.log(`Reminder logged for ${date}, in ${minutes} minutes.`))
    setTimeout(() => {
      interaction.channel.send(message)
      console.log(`Sent message ${message} in channel ${interaction.channelId}.`)
      Reminder.deleteOne(data).then(console.log("Deleted message from database."));
    }, minutes * 60000)
  }
}