import mongoose from "mongoose";
import { boolean } from "yup";
const Schema = mongoose.Schema;

export enum ENotificationDevice {
  WEB = "WEB",
  IOS = "IOS",
  ANDROID = "ANDROID",
  OTHERS = "OTHERS",
}

export interface IPNTokenDocument extends mongoose.Document {
  userId: string;
  clientId: string;
  device?: ENotificationDevice;
  expireAt: Date;
  token: string;
  ip: string | null;
}

const PNTokenSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: false,
      default: null,
    },
    device: {
      type: String,
      required: true,
      default: ENotificationDevice.OTHERS,
    },
    expireAt: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

const PNDocument = mongoose.model<IPNTokenDocument>("PNTokens", PNTokenSchema);

export default PNDocument;
