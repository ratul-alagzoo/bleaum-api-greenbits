import * as yup from "yup";
import {
  ENotificationIntent,
  IEachNotification,
} from "../../../models/notification";

//for request validations
export const getAllNotificationsSchema = yup.object({
  query: yup.object({
    limit: yup.number().positive("Limit must be a positive number"),
    page: yup.number().positive("Page should be a positive number"),
    search: yup.string().trim().min(1, "Search parameters can't be empty"),
    sortByAlpha: yup.number(),
    latestFirst: yup.number(),
    userId: yup.string().trim().required("User id is required"),
  }),
});

export const getAllAdminNotificationsSchema = yup.object({
  query: yup.object({
    limit: yup.number().positive("Limit must be a positive number"),
    page: yup.number().positive("Page should be a positive number"),
    search: yup.string().trim().min(1, "Search parameters can't be empty"),
    sortByAlpha: yup.number(),
    latestFirst: yup.number(),
  }),
});

export const upsertNewNotificationAdminSchema = yup.object({
  query: yup.object({
    notificationId: yup.string().trim(),
  }),
  body: yup.object({
    title: yup.string().trim(),
    // .required("Title is required")
    details: yup.string().trim(),
    imageUrl: yup.string().url("Must be a valid url"),
    highlights: yup.string().trim().required("Highlights is required"),
    viaEmail: yup.boolean().required("Status of email medium is required"),
    viaSms: yup.boolean().required("Status of sms medium is required"),
    viaMobile: yup.boolean().required("Status of mobile medium is required"),
    viaSystem: yup.boolean().required("Status of medium system is required"),
  }),
});

export const deleteAllNotificationsSchema = yup.object({
  query: yup.object({
    userId: yup.string().trim().required("User id is required"),
  }),
});

export const toggleSeenNotificationsSchema = yup.object({
  query: yup.object({
    userId: yup.string().trim().required("User id is required"),
  }),
});

export const deleteParticularNotificationUserSchema = yup.object({
  query: yup.object({
    userId: yup.string().trim().required("User id is required"),
    notificationId: yup.string().trim().required("Notification id is required"),
  }),
});

export const deleteParticularNotificationAdminSchema = yup.object({
  query: yup.object({
    notificationId: yup.string().trim().required("Notification id is required"),
  }),
});

//for controllers <--- Incoming

export interface IGetAllNotificationsPaginated {
  limit?: number;
  page?: number;
  sortByAlpha?: boolean;
  latestFirst?: boolean;
  userId: string;
}

export interface IGetAllAdminNotificationsPaginated {
  limit?: number;
  page?: number;
  sortByAlpha?: boolean;
  latestFirst?: boolean;
  outletChainId: string;
  search?: string;
}

export interface IUpsertNotificationAdmin {
  query: {
    notificationId?: string;
  };
  body: {
    title?: string;
    highlights: string;
    viaEmail: boolean;
    viaSms: boolean;
    viaMobile: boolean;
    viaSystem: boolean;
    details?: string;
    imageUrl?: string;
  };
  outletChainId: string;
}

//for controller --- > outgoing

export interface INotification {
  userId: string;
  isSeen: boolean;
  fromAdmin: boolean;
  outletChainId: string;
  blackListedFor: Record<string, boolean>;
  seenBy: Record<string, boolean>;
  intentTo: ENotificationIntent;
  notificationInfo: IEachNotification;
}
