import * as yup from "yup";

export const upsertDealsSchema = yup.object({
  body: yup.object({
    name: yup.string().trim().required().min(2),
    selectedCategories: yup
      .array()
      .required("Categories array must be present")
      .of(
        yup.object({
          categoryID: yup
            .string()
            .trim()
            .min(4, "It is usually larger than 4 characters")
            .required("Category ID is required"),
          name: yup.string().trim().required("Cateory name is required"),
        })
      ),

    selectedProducts: yup
      .array()
      .required("Products array must be present")
      .of(
        yup.object({
          name: yup.string().trim().required("Name of the product is required"),
          productID: yup
            .string()
            .trim()
            .min(4, "It is usually larger than 4 characters")
            .required("Product ID is required"),
        })
      ),
    consumerId: yup
      .number()
      .required("Consmer ID is required and must be a number"),
    selectedOutlets: yup
      .array()
      .of(
        yup.object({
          outletChainID: yup
            .string()
            .trim()
            .min(4, "It is usually larger than 4 characters")
            .required("Outlet Chain ID is required"),
          name: yup.string().trim().required("OutletChain name is required"),
        })
      )
      .required("Selected outlets is required"),
    image: yup.string().trim().url("Not a valid url"),
    dealId: yup.string().min(6, "It is usually greater than 6 characters"),
    startDate: yup.date().required("Start date field is required"),
    endDate: yup.date(),
    neverExpires: yup.bool().required("Never Expires is required"),
    status: yup.bool().required("Status of the deal is required"),
    applyToAllOutlets: yup.bool().required("Apply to all outlets is required"),
    discountValue: yup.number().required("Discount value is required"),
  }),
});

export interface IUpsertDeal {
  image?: string;
  dealId: string;
  startDate: string;
  endDate?: string;
  neverExpires: boolean;
  status: boolean;
  applyToAllOutlets: boolean;
  consumerId: number;
  discountValue: string;
  selectedCategories: { name: string; categoryID: string }[];
  selectedProducts: { name: string; productID: string }[];
  selectedOutlets: { name: string; outletChainID: string }[];
}
