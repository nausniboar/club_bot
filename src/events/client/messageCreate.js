import { Message } from "discord.js";

export default {
  name: 'messageCreate',
  once: true,
  /**
   * @param {Message} msg
   * @param {Client} client 
   */
  async execute (msg, client) {
    switch(msg.channelId){
      case 1146580015220265003:
        break;

      default:
        break;
    }
    //msg.channel.send("No.");
  }
}