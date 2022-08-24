import mongoose from "mongoose";
const Schema = mongoose.Schema;

const loyaltySchema = new Schema(
  {
    loyaltyID: {
      type: String,
    },
    outletChainID: {
      type: String,
      required: true,
    },
    consumerId: {
      type: String,
      required: true,
    },
    monday: [{ type: Number, required: true }],
    tuesday: [{ type: Number, required: true }],
    wednesday: [{ type: Number, required: true }],
    thursday: [{ type: Number, required: true }],
    friday: [{ type: Number, required: true }],
    saturday: [{ type: Number, required: true }],
    sunday: [{ type: Number, required: true }],
    pointsToPrice: {
      type: Number,
      required: true,
    },
    PointsToPointsEarnedRatio: {
      type: Number,
    },
    PointsForRegistration: {
      type: Number,
      default: 0,
    },
    PointsOnFirstOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const loyalty = mongoose.model("Loyalty", loyaltySchema);

export default loyalty;
