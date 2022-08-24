import * as yup from "yup";
import { ENotificationDevice } from "../../../models/pntokens";
//for request validations
export const upsertPNTokenSchema = yup.object({
  body: yup.object({
    userId: yup.string().trim().required("User id is required"),
    clientId: yup.string().trim().required("Client id is required"),
    ip: yup.string().trim(),
    token: yup.string().trim().required("Token is required").min(10),
    device: yup
      .string()
      .trim()
      .required("Device type is required")
      .oneOf([...Object.keys(ENotificationDevice)]),
  }),
});

export const deletePNTokensSchema = yup.object({
  query: yup.object({
    userId: yup.string().trim().required("User id is required"),
    clientId: yup.string().trim().required("Client id is required"),
    ip: yup.string().trim(),
  }),
});

//for controller <--- Incoming
export interface IUpsertPNToken {
  userId: string;
  clientId: string;
  device: ENotificationDevice;
  expireAt?: Date;
  ip: string | null;
  token: string;
}
