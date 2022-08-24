import * as yup from "yup";
import { IEachSocialMediaLink } from "../../../models/socialLinks";

const eachLinkSchema = yup.object({
  medium: yup
    .string()
    .trim()
    .required("medium is required. Ex: 'facebook', 'twitter' etc."),
  themeColor: yup.string().trim(),
  dropdownColor: yup.string().trim(),
  link: yup
    .string()
    .trim()
    .required("link is required")
    .matches(/^(ftp|http|https):\/\/[^ "]+$/, "Must be a valid URL"),
  fontAwesomeRef: yup
    .string()
    .trim()
    .required("fontAwesomeRef is required")
    .test(
      "Just check if includes fa",
      "Must be a valid font awesome icon class name",
      (fontAwesomeRef) => (fontAwesomeRef + "").includes("fa")
    ),
});

//fro request validations
export const upsertSocialLinksSchema = yup.object({
  body: yup.object({
    links: yup
      .array()
      .required("Array of links is required")
      .of(eachLinkSchema),
  }),
});

export const getSocialMediasSchema = yup.object({
  query: yup.object({
    outletChainID: yup.string().required("outletChainID is required"),
  }),
});

//for controllers <----- Incoming
export interface IUpsertSocialLinks {
  outletChainID: string;
  links: IEachSocialMediaLink[];
}
