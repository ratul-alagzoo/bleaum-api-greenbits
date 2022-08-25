import mongoose from "mongoose";
const Schema = mongoose.Schema;

export enum ENotificationIntent {
  ALL = "ALL",
  INDIVIDUAL = "INDIVIDUAL",
}
export enum ENotificationTopics {
  DEAL_ADDED = "dealAdded",
  DEAL_UPADTED = "dealUpdated",
  COUPON_ADDED = "couponAdded",
  COUPON_UPDATED = "couponUpdated",
  LOYALTY_POINTS_EARNED = "loyaltyPointsEarned",
  OTHERS = "others",
  USER_REGISTERED = "register",
  ORDER_CONFIRMED = "orderConfirmation",
  ORDER_PENDING = "orderPending",
  ORDER_RECEIVED = "orderReceived",
  ORDER_PROCESSING = "orderProcessing",
  NEW_ORDER = "newOrder",
  // DEAL_ADDED = "DEAL_ADDED",
  // DEAL_UPADTED = "DEAL_UPDATED",
  // COUPON_ADDED = "COUPON_ADDED",
  // COUPON_UPDATED = "COUPON_UPDATED",
  // LOYALTY_POINTS_EARNED = "LOYALTY_POINTS_EARNED",
  // OTHERS = "OTHERS",
  // USER_REGISTERED = "USER_RESISTERED",
  // ORDER_CONFIRMED = "ORDER_CONFIRMED",
  // ORDER_PENDING = "ORDER_PENDING",
  // ORDER_RECEIVED = "ORDER_RECEIVED",
  // ORDER_PROCESSING = " ORDER_PROCESSING"
}

export interface IEachNotification {
  title: string;
  highlights: string;
  topic: ENotificationTopics;
  details?: string;
  meta: Record<any, any>;
  imageUrl?: string;
  mediums?: {
    viaEmail?: boolean;
    viaSms?: boolean;
    viaMobile?: boolean;
    viaSystem?: boolean;
  };
  adminMessage?: string;
}

export interface INotificationDocument extends mongoose.Document {
  userId: string;
  isSeen: boolean;
  fromAdmin: boolean;
  outletChainId: string;
  blackListedFor: Record<string, boolean>;
  seenBy: Record<string, boolean>;
  intentTo: ENotificationIntent;
  notificationInfo: IEachNotification;
}

const NotificationSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    fromAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSeen: {
      type: Boolean,
      required: true,
      default: false,
    },
    intentTo: {
      type: String,
      required: true,
      enum: ["ALL", "INDIVIDUAL"],
      default: ENotificationIntent.INDIVIDUAL,
    },
    outletChainId: {
      type: String,
      required: true,
    },
    blackListedFor: {
      type: Map,
      required: true,
      of: Boolean,
    },
    seenBy: {
      type: Map,
      required: true,
      of: Boolean,
    },
    notificationInfo: {
      title: {
        type: String,
        required: true,
      },
      highlights: {
        type: String,
        required: true,
      },
      topic: {
        type: String,
        required: true,
        default: ENotificationTopics.OTHERS,
      },
      details: {
        type: String,
        required: false,
        default: "",
      },
      meta: {
        type: Object,
        required: true,
        default: {},
      },
      imageUrl: {
        type: String,
        required: false,
        default: "",
      },
      mediums: {
        type: Object,
        required: false,
        default: {
          viaEmail: false,
          viaSms: false,
          viaMobile: false,
          viaSystem: false,
        },
      },
      adminMessage: {
        type: String,
        required: false,
        default: "Not Provided",
      },
    },
  },
  { timestamps: true }
);

const NotificationDocument = (dbName: string) =>
    mongoose.connection.useDb(dbName).model<INotificationDocument>(
  "Notification",
  NotificationSchema
);

export default NotificationDocument;
