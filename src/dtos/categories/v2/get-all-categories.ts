import * as yup from "yup";

//for request validations
export const getAllCategoriesSchema = yup.object({
  query: yup.object({
    limit: yup.number().positive("Limit must be a positive number"),
    page: yup.number().positive("Page should be a positive number"),
    search: yup.string().trim().min(1, "Search parameters can't be empty"),
    sortByAlpha: yup.number(),
    latestFirst: yup.number(),
  }),
});

//for controllers <--- Incoming

export interface IGetAllCategoriesPaginated {
  limit?: number;
  page?: number;
  search?: string;
  sortByAlpha?: boolean;
  latestFirst?: boolean;
}
