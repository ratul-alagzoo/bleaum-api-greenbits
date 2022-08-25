import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IMediaDocument extends mongoose.Document {
  outletChainID: string;
  mainLogoFileSource?: string;
  faviconLogoFileSource?: string;
  footerLogoFileSource?: string;
}

const MediaSchema = new Schema(
  {
    outletChainID: {
      type: String,
      required: true,
    },
    mainLogoFileSource: {
      type: String,
    },
    faviconLogoFileSource: {
      type: String,
    },
    footerLogoFileSource: {
      type: String,
    },
  },
  { timestamps: true }
);

const MediaDocument = (dbName: string) =>
    mongoose.connection.useDb(dbName).model<IMediaDocument>("Media", MediaSchema);

export default MediaDocument;
