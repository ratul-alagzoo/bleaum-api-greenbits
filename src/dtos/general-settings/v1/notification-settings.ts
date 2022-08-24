import * as yup from "yup";
import { IEachNotificationType } from "../../../models/notification-settings";

export const eachNotificationTypeSchama = yup.object().shape({
  displayName: yup.string().trim().required("Display name is required"),
  mediums: yup.object().shape({
    email: yup.boolean().required("Requires a boolean value"),
    sms: yup.boolean().required("Requires a boolean value"),
    system: yup.boolean().required("Requires a boolean value"),
    mobile: yup.boolean().required("Requires a boolean value"),
  }),
  messages: yup.object().shape({
    particularUser: yup.string().trim().required("Required"),
    adminSite: yup.string().trim().required("Required"),
  }),
});
//for request validations//TO DO
export const upsertNotificationSettingsSchema = yup.object({
  body: yup.object({
    preferences: yup.object().required("Preferences is required"),
  }),
});

export const getMediaSchema = yup.object({
  query: yup.object({
    outletChainID: yup.string().required("outletChainID is required"),
  }),
});

//for controllers <----- Incoming
export interface IUpsertNotificationSettings {
  preferences: IEachNotificationType;
  outletChainID?: string;
}
