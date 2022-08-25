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

const FCMTokenModal = (dbName: string) =>
    mongoose.connection.useDb(dbName).model("FCMTokens", FCMSchema);
export default FCMTokenModal;
