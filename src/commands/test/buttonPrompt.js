import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder,
  ButtonStyle, StringSelectMenuBuilder, ComponentType, Component, ChatInputCommandInteraction, 
   } from "discord.js";

// This command is a two-phase test command. 
export default {
  data: new SlashCommandBuilder()
    .setName('buttonprompt')
    .setDescription('Prompts a given user for which bingus emote is the cutest.')
    .addUserOption((option) => option
      .setName('user')
      .setDescription('selects a user')
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client 
   */
  async execute (interaction, client) {
    const buttonRow = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId('button1')
        .setStyle(ButtonStyle.Primary)
        .setLabel("bingus1")
        .setEmoji('1152292608941502526'),
      new ButtonBuilder()
        .setCustomId('button2')
        .setStyle(ButtonStyle.Secondary)
        .setLabel("bingus2")
        .setEmoji('1152292607242809364'),
      new ButtonBuilder()
        .setCustomId('button3')
        .setStyle(ButtonStyle.Success)
        .setLabel("bingus3")
        .setEmoji('1152292605430866001'),
    );
    const buttonRowTwo = new ActionRowBuilder().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId('feedback')
        .setOptions(
          {label: 'Powerful', value: 'powerful'},
          {label: 'Delicious', value: 'delicious'},
        )
    );

    // Sending the response to the command
    const reply = await interaction.reply({
      components: [buttonRow.toJSON()],
      content: "Which bingus is the cutest?"
    })
    // interaction.reply gives us a promise which gets fulfilled when the message
    // finally gets posted to the channel. We can use this to execute more code
    // upon the message being successfully sent.
    /*.then(async (res1) => {
      // The response object is an InteractionResponse object, which actually doesn't
      // have any information about the repsonse's message. We need to call its 
      // function "fetch()" in order to get the message it belongs to.
      const msg = await res1.fetch();
      // We're fetching the message in the first place in order to create a filter
      // function, which we will use further down, which verifies that the right message
      // is being clicked by the right user.
      const filter = (i) => {
        // deferUpdate() prevents our bot from interpreting a lack of response as
        // our own command failing.
        i.deferUpdate();
        return i.user.id === interaction.user.id && i.message.id === msg.id
      }
      // Calling the awaitMessageComponent function on the interaction's
      // channel object. This creates a new event listener for new message
      // component interactions in the channel. We pass in our aforementioned filter, too,
      // as well as a time limit of 30 seconds. 
      interaction.channel.awaitMessageComponent({filter, time: 30000})
      // Now we wait for a promise to be returned from our message component listener,
      // which will indicate whether the user clicked on the button within 30 seconds,
      // handling it with a .then() and .catch() pair.
      .then((collected) => {
        console.log("collected")
        // Editing our interaction the first time to reflect the new prompt.
        interaction.editReply({
          content: `You picked bingus ${collected.customId.slice(-1)}! Why did you pick him?`,
          components: [buttonRowTwo.toJSON()]
        })
        // Awaiting a second message component, our string select menu.
        interaction.channel.awaitMessageComponent({filter, time: 30000})
          // If our promise resolves, due to the user selecting any of the two string select
          // menu options, then we display the selected option.
          .then((collected2) => {
            console.log("collected #2")
            interaction.editReply({
              content: `You chose bingus ${collected.customId.slice(-1)} because he was ${collected2.values[0]}.`,
              components: []
            })
          })
          // If the user doesn't select any of the two string options, we edit the interaction
          // to reflect that.
          .catch((uncollected2) => {
            console.log("uncollected #2");
            console.log(uncollected2);
            interaction.followUp("Didn't select an option in time :(")
          })
      // Backing out of the above scope, which all executes if the user selects any of the
      // buttons in the first place. If the user doesn't select any button, then we don't
      // display our follow-up question and string select menu, and we edit the interaction
      // to reflect that.
      }).catch((uncollected) => {
        console.log("uncollected")
        console.log(uncollected)
        interaction.followUp("Didn't click a button in time :(")
      })
    })*/
    // Alternative implementation using collectors. Looks like collectors don't have a time limit.

    const msg = await reply.fetch();
    const filter = (i) => {
      i.deferUpdate();
      return i.user.id === interaction.user.id && i.message.id === msg.id
    }

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter
    })
    collector.on('collect', (interaction2) => {
      interaction.editReply({
        content: `You picked bingus ${interaction2.customId.slice(-1)}! Why did you pick him?`,
        components: [buttonRowTwo.toJSON()]
      })
    })

    const collector2 = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter
    })
    collector2.on('collect', (interaction3) => {
      const bingusNum = interaction3.message.content.charAt(18);
      interaction.editReply({
        content: `You chose bingus ${bingusNum} because he was ${interaction3.values[0]}.`,
        components: []
      })
    })
  }
}
