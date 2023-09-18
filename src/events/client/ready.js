import mongoose, { Query } from 'mongoose'
import Reminder from '../../models/Reminder.js'

export default {
  name: 'ready',
  once: true,
  
  /**
   * @param {Client} client
   */
  async execute (client) {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true
    })
    .then(async () => {
      console.log("Connected to MongoDB");
      console.log("Fetching reminders...");
      let count = 0;
      for await (const reminder of Reminder.find()) {
        console.log(`Reminder set for ${reminder.DueDate}, in ${reminder.DueDate-Date.now()} ms.`)
        setTimeout(async() => {
          const channel = await client.channels.fetch(reminder.ChannelID);
          channel.send(reminder.Message);
          console.log(`Sent reminder message "${reminder.Message}" in ${reminder.ChannelID}.`);
          Reminder.deleteOne(reminder).then(console.log("Deleted message from database."));
        }, reminder.DueDate - Date.now());
        count++;
      }
      if(count == 0) console.log("No reminders.")
      console.log("Finished fetching reminders.");
    })
    .catch((err)=>console.log(err));

    console.log(`Logged in as ${client.user.tag}!`);
    /*for(let i = 0; i < 5; i++) {
      setTimeout(() => {console.log("hey " + i)}, 5 + 1000 * i)
    }*/
  }
}