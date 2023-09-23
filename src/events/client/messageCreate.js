import { Client, Message, Routes } from "discord.js";
import InktoberPlayer from "../../models/InktoberPlayer";

export default {
  name: 'messageCreate',
  once: false,
  /**
   * @param {Message} msg
   * @param {Client} client 
   */
  async execute (msg, client) {
    // message -> message triggers
    const lowerCase = msg.content.toLowerCase();
    const sentence = msg.content.split(" ");
    if(lowerCase.startsWith("i'm")) {
      let returnMsg = 'Hi,';
      if(sentence.length > 1) {
        for(let i = 1; i < sentence.length; i++) {
          returnMsg += ' ' + sentence[i]
        }
        msg.channel.send(returnMsg + ", I'm Dad!");
      }
    }
    //console.log(msg.content);
    //console.log(client.user.id);
    // message @ bot -> message triggers
    if(sentence[0] == `<${client.user.id}>`) {
      if(lowerCase.includes("what are you thinking about?")) {
        responses = ['dunno man', 'everything', 'thos beans', ]
        msg.channel.send("thos beans");
      } else if(lowerCase.includes("hey")) {
        msg.channel.send("hey");
      }
      //else if(lowerCase.includes(""))
    }
    // message -> reaction triggers
    if(msg.content === 'h') {
      await client.rest.put(Routes.channelMessageOwnReaction(
        msg.channelId,
        msg.id,
        encodeURI('🇭')
      ));
    }
    switch(msg.channelId){
      case '1154998816987164682':
        if(msg.attachments.size > 0) {
          //const player = client.users.fetch(msg.author.id)
          InktoberPlayer.findOneAndUpdate(
            {UserID: msg.author.id},
            {PassedDay: true},
            {new: true, runValidators: true}
          ).then((doc) => {
            console.log(doc)
          }).catch((err) => {
            console.log(err);
          });
        }
        break;
      default:
        break;
    }
    //msg.channel.send("No.");
  }
}