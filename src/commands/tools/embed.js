import { SlashCommandBuilder, EmbedBuilder, Embed, ChatInputCommandInteraction, Client } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Builds an embed')
  ,
  /**
   * @param {ChatInputCommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute (interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("Embed Title")
      .setDescription("Embed Description")
      .setColor(0xffff00)
      .setImage(client.user.displayAvatarURL())
      .setTimestamp(Date.now())
      .setAuthor({
        url: 'https://www.youtube.com/watch?v=-YvgQz1crQg',
        iconURL: interaction.user.displayAvatarURL(),
        name: interaction.user.tag
      })
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: client.user.tag
      })
      .setURL("https://www.youtube.com/watch?v=-YvgQz1crQg") //url for title
      .addFields([
        { 
          name: 'field name1',
          value: 'field value1',
          inline: true
        },
        { 
          name: 'field name2',
          value: 'field value2',
          inline: true
        },
        { 
          name: 'field name3',
          value: 'field value3',
          inline: false
        },
        { 
          name: 'field name4',
          value: 'field value4',
          inline: true
        },
        { 
          name: 'field name5',
          value: 'field value5',
          inline: true
        }
      ])
    await interaction.reply({
      embeds: [embed]
    })
  }
}