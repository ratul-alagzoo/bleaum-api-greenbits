import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CouponsSchema = new Schema({
  couponId: {
    type: String,
    required: true,
  },
  consumerId: {
    type: Number,
    required: true,
  },
  couponCode: {
    type: String,
    required: true,
  },
  couponType: {
    type: String,
  },
  discountValue: {
    type: Number,
  },
  selectedOutlets: {
    type: Array,
  },
  selectedProducts: {
    type: Array,
  },
  selectedCategories: {
    type: Array,
  },
  entireCart: {
    type: Boolean,
  },
  applyToAllOutlets: {
    type: Boolean,
  },
  memberType: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  neverExpires: {
    type: Boolean,
  },
  rules: {
    type: Object,
  },
  status: {
    type: Boolean,
  },
});

const Coupons = mongoose.model("Coupon", CouponsSchema);

export default Coupons;
