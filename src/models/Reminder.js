import { model, Schema } from "mongoose";

let ReminderSchema = new Schema({
  GuildID: String,
  ChannelID: String,
  UserID: String,
  DueDate: Date,
  Message: String
})

export default model('reminder', ReminderSchema);