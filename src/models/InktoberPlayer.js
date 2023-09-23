import { model, Schema } from "mongoose";

let InktoberPlayerSchema = new Schema({
  UserID: String,
  PassedDay: Boolean
})

export default model('inktoberPlayer', InktoberPlayerSchema);