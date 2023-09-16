import { SlashCommandBuilder, ComponentType, Component } from "discord.js";

// This command is a two-phase test command. 
export default {
  data: new SlashCommandBuilder()
    .setName('countto')
    .setDescription('Prompts a given user to count to the desired number for a special prize.')
    .addIntegerOption((option) => option
      .setName('max')
      .setDescription('maximum number to count to')
      .setRequired(true)
    )
    .addUserOption((option) => option
      .setName('user')
      .setDescription('selects a user')
    ),
  
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client 
   */
  async execute (interaction, client) {
    // Sending the response to the command
    const reply = await interaction.reply({
      content: `If you count to a number, you will receive a special gift.`
    })
    //const msg = await reply.fetch();
    

    const max = interaction.options.getInteger('max');
    console.log(interaction.user);
    console.log(max);
    
    const recursive = (interaction, max, iter) => {
      console.log(`Max: ${max}, iter: ${iter}`)
      const filter = (msg) => {
        return msg.author.id === interaction.user.id 
      }
      const collector = interaction.channel.createMessageCollector({filter})

      collector.on('collect', (message) => {
        console.log("here");
        let succeed = false;
        let num = parseInt(message.content);
        console.log("here 2");
        let str = "";
        if (num === null) {
          str = message.content;
        } else if (num === NaN) {
          str = "Uh oh, you didn't enter a parseable number. Game over."
        } else if(num == max) {
          str = "Yay! You win!"
        } else if(num != iter) {
          str = "Whoops! You entered the wrong number. Game over."
        } else if(num == iter) {
          str = `Next number: ${iter+1}`
          succeed = true;
        } else {
          str = "Else"
        }
        interaction.editReply({
          content: str
        })
        if(succeed) recursive(interaction, max, iter+1);
      })
      collector.on('end', (collected) => {
        console.log("Ended");
        if(interaction.options.getInteger('max') != iter) {
          console.log("Time expired")
          interaction.editReply({
            content: "Took too long to reply, game over."
          })
        } else {
          console.log("Time expired, but won")
        }
      })
    }
    recursive(interaction, max, 1)
  }
}
