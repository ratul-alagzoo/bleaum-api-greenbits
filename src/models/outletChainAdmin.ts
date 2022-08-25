import mongoose from "mongoose";
import { string } from "yup";
const Schema = mongoose.Schema;

const OutletChainAdminSchema = new Schema(
  {
    adminID: {
      type: String,
      required: true,
    },
    outletID: {
      type: String,
    },
    consumerId: {
      type: Number,
      default: 1,
    },
    outletName: {
      type: String,
      required: true,
    },
    soleOutlet: {
      type: Boolean,
      required: true,
      default: false,
    },
    noOfChains: {
      type: Number,
      default: 0,
    },
    adminName: {
      type: String,
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    adminImage: {
      type: String,
    },
    adminPassword: {
      type: String,
      default: "123456",
    },
    countryCode: {
      type: Number,
      default: 1,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    assessmentFee: {
      type: Number,
      default: "199",
    },
    logo: {
      type: String,
    },
    helpEmail: {
      type: String,
    },
    helpContact: {
      type: String,
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    renawalDate: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    opensAt: {
      type: "string",
      required: false,
    },
    closesAt: {
      type: "string",
      required: false,
    },
    copyrightText: {
      type: "string",
      required: "false",
    },
    outletChainID: {
      type: "string",
      required: false,
    },
    country: {
      type: "String",
      required: "false",
    },
  },
  {
    timestamps: true,
  }
);

const OutletChainAdmin = (dbName: string) =>
    mongoose.connection.useDb(dbName).model(
  "OutletChainAdmin",
  OutletChainAdminSchema
);

export default OutletChainAdmin;
