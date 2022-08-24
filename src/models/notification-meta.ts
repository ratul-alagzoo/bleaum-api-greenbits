import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IEachNotificationMeta {
  userId: string;
  excludeTill: string;
}

export interface INotificationMetaDocument extends mongoose.Document {
  userId: string;
  createdAt: string;
  updatedAt: string;
  outletChainId: string;
}

const NotificationMetaSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    outletChainId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const NotificationMetaDocument = mongoose.model<INotificationMetaDocument>(
  "NotificationMeta",
  NotificationMetaSchema
);

export default NotificationMetaDocument;
