import mongoose from "mongoose";
const Schema = mongoose.Schema;

export enum EDiscountTypeEnum {
  PERCENTAGE = "PERCENTAGE",
  AMOUNT = "AMOUNT",
}

export interface IProductIdDiscountMap {
  discountValue: number;
  discountType: EDiscountTypeEnum;
}
export interface IDealDocument extends mongoose.Document {
  dealId: string;
  consumerId: number;
  name: string;
  image?: string;
  discountValue: string;
  selectedOutlets: any[];
  selectedProducts: any[];
  selectedCategories: any[];
  applyToAllOutlets: boolean;
  startDate: string;
  endDate: string;
  neverExpires: boolean;
  status: boolean;
  appliesTo?: Record<string, IProductIdDiscountMap>;
  categoriesAffected?: Record<string, boolean>;
}

export interface IDeal {
  dealId: string;
  consumerId: number;
  name: string;
  image?: string;
  discountValue: string;
  selectedOutlets: any[];
  selectedProducts: any[];
  selectedCategories: any[];
  applyToAllOutlets: boolean;
  startDate: string;
  endDate: string;
  neverExpires: boolean;
  status: boolean;
  appliesTo?: Record<string, IProductIdDiscountMap>;
  categoriesAffected?: Record<string, boolean>;
}

const DealsSchema = new Schema(
  {
    dealId: {
      type: String,
      required: true,
    },
    consumerId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    discountValue: {
      type: String,
      required: true,
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
    applyToAllOutlets: {
      type: Boolean,
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      default: Date.now(),
    },
    neverExpires: {
      type: Boolean,
    },
    status: {
      type: Boolean,
    },
    categoriesAffected: {
      type: Map,
      required: false,
      of: Boolean,
    },
    appliesTo: {
      type: Map,
      required: false,
      of: new Schema({
        discountValue: {
          type: Number,
          required: true,
        },
        discountType: {
          type: String,
          required: true,
          default: EDiscountTypeEnum.PERCENTAGE,
        },
      }),
    },
  },
  { timestamps: true }
);

const Deal = mongoose.model<IDealDocument>("Deal", DealsSchema);

export default Deal;
