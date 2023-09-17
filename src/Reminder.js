import { model, Schema } from "mongoose";

let testSchema = new Schema({
  GuildID: String,
  ChannelID: String,
  UserID: String,
  DueDate: Date,
  Message: String
})

export default model('reminder', testSchema);