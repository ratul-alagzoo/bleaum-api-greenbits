import * as yup from "yup";

//fro request validations
export const upsertMediaSchema = yup.object({
  body: yup.object({
    mainLogoFileSource: yup
      .string()
      .trim()
      .matches(/^(ftp|http|https):\/\/[^ "]+$/, "Must be a valid URL"),
    faviconLogoFileSource: yup
      .string()
      .trim()
      .matches(/^(ftp|http|https):\/\/[^ "]+$/, "Must be a valid URL"),
    footerLogoFileSource: yup
      .string()
      .trim()
      .matches(/^(ftp|http|https):\/\/[^ "]+$/, "Must be a valid URL"),
  }),
});

export const getMediaSchema = yup.object({
  query: yup.object({
    outletChainID: yup.string().required("outletChainID is required"),
  }),
});

//for controllers <----- Incoming
export interface IUpsertMedia {
  mainLogoFileSource?: string;
  faviconLogoFileSource?: string;
  footerLogoFileSource?: string;
  outletChainID?: string;
}
