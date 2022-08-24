// outletName: "",
//   opensAt: "8:00 am",
//   closesAt: "11:00 am",
//   location: {
//     type: "Point",
//     cordinates: [0, 0],
//   },
//   copyrightText: "Copyright",
//   assessmentFee: 0,
//   helpEmail: "",
//   helpContact: "",
//   country: "",
//   state: "",
//   address: "",
import * as yup from "yup";

//fro request validations
export const upsertBasicInfoSchema = yup.object({
  body: yup.object({
    outletName: yup.string().trim().required("Outlet name is required"),
    opensAt: yup
      .string()
      .trim()
      .required("OpensAt is required")
      .test(
        "Just check if its a valid date",
        "Must be a valid date",
        (opensAt) => new Date(opensAt + "").toString() !== "Invalid Date"
      ),
    closesAt: yup
      .string()
      .trim()
      .required("ClosesAt is required")
      .test(
        "Just check if its a valid date",
        "Must be a valid date",
        (closesAt) => new Date(closesAt + "").toString() !== "Invalid Date"
      ),
    latitude: yup.number().required("Latitude is required"),
    longitude: yup.number().required("Longitude is required"),
    country: yup.string().trim().required("Country is required"),
    state: yup.string().trim().required("State is required"),
    address: yup.string().trim().required("Address is required"),
    helpContact: yup.number().required("Support contact is required"),
    helpEmail: yup
      .string()
      .email("Must be a valid email")
      .required("Support email is required"),
    assessmentFee: yup.number().required("Assessment fee is required"),
    copyrightText: yup.string().required("Copyright Text is required"),
  }),
});

export interface IUpsertBasicInfo {
  outletName: string;
  opensAt: string;
  closesAt: string;
  latitude: number;
  longitude: number;
  copyrightText: string;
  assessmentFee: number;
  helpEmail: string;
  helpContact: string;
  country: string;
  state: string;
  address: string;
  outletChainID: string;
}
