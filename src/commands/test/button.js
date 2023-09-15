import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder,
  ButtonStyle, StringSelectMenuBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName('button')
    .setDescription('button test')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('selects a user')
    ),
  async execute (interaction, client) {
    const buttonRow = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId('button-test1')
        .setStyle(ButtonStyle.Danger)
        .setLabel("Bad!"),
      new ButtonBuilder()
        .setCustomId('button-test2')
        .setStyle(ButtonStyle.Danger)
        .setLabel("Bad!"),
      new ButtonBuilder()
        .setCustomId('button-test3')
        .setStyle(ButtonStyle.Danger)
        .setLabel("Bad!"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Clicky")
        .setURL("https://discord.com/channels/1146580014389788692/1146580015220265003/1149617630207037440"),
      new ButtonBuilder()
        .setCustomId('button2-test')
        .setStyle(ButtonStyle.Success)
        .setLabel("Cool!")
    );
    const buttonRowTwo = new ActionRowBuilder().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId('pizza_type')
        .setOptions(
          {label: 'Cheese', value: 'cheese'},
          {label: 'Pepperoni', value: 'pepperoni'},
        )
    );

    await interaction.reply({
      components: [buttonRow.toJSON()],
      content: "Here's a button man"
    }).then(() => {
      interaction.channel.awaitMessageComponent({ filter: (i) => i.user.id === interaction.user.id, time: 30000 })
        .then((collected) => {
          console.log(collected)
          //interaction.followUp("You clicked a button man, good job");
          interaction.editReply({
            content: "You clicked a button man, good job",
            components: [buttonRow.toJSON(), buttonRowTwo.toJSON()]
          }).then((collected2) => {
            console.log("Test?")
            interaction.followUp("I guess you clicked on the drop-down menu?")
          }).catch((collected2) => {
            console.log("Test 2?")
            interaction.followUp("Looks like you didn't click the drop-down menu.")
          })
        }).catch((collected) => {
          console.log(collected)
          interaction.followUp("I guess you didn't click on a button. Rip")
        })
    }).catch((collected) => {
      console.log(collected)
      interaction.followUp("No button clicky??")
    })

    /*const userInteraction = await reply
    .awaitMessageComponent({
      filter: (i) => i.user.id === interaction.user.id,
      time: 30_000,
    })
    .catch(async(error) => {
      await reply.edit({content: ""})
    }*/
  }
}
