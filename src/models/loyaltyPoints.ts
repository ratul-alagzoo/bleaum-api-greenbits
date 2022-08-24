import mongoose from "mongoose";
const Schema = mongoose.Schema;

const loyaltyPointSchema = new Schema(
  {
    pointsID: {
      type: String,
    },
    outletChainID: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const loyaltyPoints = mongoose.model("LoyaltyPoint", loyaltyPointSchema);

export default loyaltyPoints;
