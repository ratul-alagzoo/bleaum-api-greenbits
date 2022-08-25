import mongoose from "mongoose";
import { ENotificationTopics } from "./notification";
const Schema = mongoose.Schema;

export interface IEachNotificationType {
  displayName: string;
  mediums: {
    email: boolean;
    system: boolean;
    mobile: boolean;
    sms: boolean;
  };
  messages: {
    particularUser: string;
    adminSite: string;
  };
  disabled?: boolean;
}

export interface INotificationSettingsDocument extends mongoose.Document {
  outletChainID: string;
  preferences: {
    [key: string]: IEachNotificationType;
  };
}

export const initialNotificationSettingsData: Record<
  ENotificationTopics,
  IEachNotificationType
> = {
  others: {
    displayName: "Others",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Not Provided",
      adminSite: "Not Provided",
    },
    disabled: true,
  },
  register: {
    displayName: "Register",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Welcome to Bloom",
      adminSite: "Welcome to the system",
    },
  },
  orderConfirmation: {
    displayName: "Order Confirmation",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Your order has been confirmed",
      adminSite: "Order Confirmed",
    },
  },
  orderPending: {
    displayName: "Order Pending",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Your order is pending",
      adminSite: "Order Pending",
    },
    disabled: true
  },
  orderProcessing: {
    displayName: "Order Processing",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Your order is being processed",
      adminSite: "Order Processing",
    },
  },
  orderReceived: {
    displayName: "Order Received",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Your order has been received",
      adminSite: "Order Received",
    },
    disabled: true
  },
  newOrder: {
    displayName: "New Order",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Your order has been placed",
      adminSite: "Order placed",
    },
  },
  dealAdded: {
    displayName: "New Deal",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "A new deal placed",
      adminSite: "You placed a new deal",
    },
  },
  dealUpdated: {
    displayName: "Deal Updated",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Deal updated",
      adminSite: "Deal has been updated",
    },
  },
  couponAdded: {
    displayName: "New Coupon",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Coupon added",
      adminSite: "You added a coupon",
    },
  },
  couponUpdated: {
    displayName: "Coupon Updated",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Coupon updated",
      adminSite: "You updated a coupon",
    },
  },
  loyaltyPointsEarned: {
    displayName: "Added Loyalty points",
    mediums: {
      email: false,
      sms: false,
      system: false,
      mobile: false,
    },
    messages: {
      particularUser: "Loyalty points updated",
      adminSite: "You updated loyalty points",
    },
  },
};

const NotificationSettingsSchema = new Schema(
  {
    outletChainID: {
      type: String,
      required: true,
    },
    preferences: {
      type: Map,
      required: true,
      of: new mongoose.Schema({
        displayName: {
          type: String,
          required: true,
        },
        disabled: {
          type: Boolean,
          required: false,
          default: false,
        },
        mediums: {
          email: {
            type: Boolean,
            required: true,
            default: false,
          },
          system: {
            type: Boolean,
            required: true,
            default: false,
          },
          mobile: {
            type: Boolean,
            required: true,
            default: false,
          },
          sms: {
            type: Boolean,
            required: true,
            default: false,
          },
        },
        messages: {
          particularUser: {
            type: String,
            required: true,
          },
          adminSite: {
            type: String,
            required: true,
          },
        },
      }),
    },
  },
  { timestamps: true }
);

const NotificationSettingsDocument = (dbName: string) =>
    mongoose.connection.useDb(dbName).model<INotificationSettingsDocument>(
    "NotificationSettings",
    NotificationSettingsSchema
  );

export default NotificationSettingsDocument;
