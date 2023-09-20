import { SlashCommandBuilder, ComponentType, Component } from "discord.js";

/*function testFunc(option) {
  console.log("inside test function!!!!!!!!!!!!!")
  option
    .setName('limit')
    .setDescription('maximum number to count to')
    .setRequired(true)
  console.log(option);
  return option;
}*/

export default {
  data: new SlashCommandBuilder()
    .setName('countto')
    .setDescription('Prompts a given user to count to the desired number for a special prize.')
    .addIntegerOption((option) => option
      .setName('limit')
      .setDescription('maximum number to count to')
      .setRequired(true)
    ),
  
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client 
   */
  async execute (interaction, client) {
    // Sending the response to the command
    await interaction.reply({
      content: `If you count to a number, starting with 1, you will receive a special gift.`
    })
    const limit = interaction.options.getInteger('limit');
    let iter = 1;
    const filter = (msg) => {
      return msg.author.id === interaction.user.id 
    }
    const collector = interaction.channel.createMessageCollector({filter, max: limit});
    collector.on('collect', (message) => {
      let stop = true;
      let num = parseInt(message.content);
      console.log(`Iter: ${iter}, message: ${message}, num: ${num}`);
      let str = "";
      if (isNaN(num) || num === null) {
        str = "Uh oh, you didn't enter a parseable number. Game over."
      } else if(num == limit) {
        str = "Yay! You win!"
      } else if(num != iter) {
        str = "Whoops! You entered the wrong number. Game over."
      } else if(num == iter) {
        str = `Next number: ${iter+1}`
        iter++;
        stop = false;
      } else {
        str = "Uncaught input."
      }
      console.log(`Str: ${str}, stop: ${stop}`)
      interaction.editReply({
        content: str
      })
      if(stop){
        collector.stop();
        console.log("Collector stopped.");
      }
    })
    collector.on('end', (collected) => {
      console.log("Ended");
    })
  }
}
