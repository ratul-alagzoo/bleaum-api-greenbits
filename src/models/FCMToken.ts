import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FCMSchema = new Schema({
  userID: {
    type: String,
  },
  Token: {
    type: String,
  },
  Status: {
    type: String,
  },
});

const FCMTokenModal = mongoose.model("FCMTokens", FCMSchema);
export default FCMTokenModal;
