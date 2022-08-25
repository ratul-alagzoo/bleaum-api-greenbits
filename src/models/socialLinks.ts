import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IEachSocialMediaLink {
  medium: string;
  themeColor?: string;
  dropsownColor?: string;
  link: string;
  fontAwesomeRef: string;
}

export interface ISocialLinksDocument extends mongoose.Document {
  outletChainID: string;
  links: IEachSocialMediaLink[];
}

const SocialLinksSchema = new Schema(
  {
    outletChainID: {
      type: String,
      required: true,
    },
    links: [
      {
        medium: {
          type: String,
          required: true,
        },
        themeColor: {
          type: String,
          required: false,
        },
        dropdownColor: {
          type: String,
          required: false,
        },
        link: {
          type: String,
          required: true,
        },
        fontAwesomeRef: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const SocialLinksDocument = (dbName: string) =>
    mongoose.connection.useDb(dbName).model<ISocialLinksDocument>(
  "SocialLinks",
  SocialLinksSchema
);

export default SocialLinksDocument;
