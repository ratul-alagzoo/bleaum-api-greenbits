import { IGetAllCategoriesPaginated } from "../../dtos/categories/v2/get-all-categories";
import { IControllerResponsePaginated } from "../../dtos/types/controller-response.interface";
import Category from "../../models/category";

class CategoriesControllerV2 {
  constructor() {}

  public getAllPaginatedCategories = async (
    param: IGetAllCategoriesPaginated
  ): Promise<IControllerResponsePaginated<any>> => {
    console.log("Param is: ", param);
    const { latestFirst, sortByAlpha, limit, page, search } = param;
    let filters: object = {};
    if (search) {
      filters = {
        ...filters,
        name: { $regex: search, $options: "i" },
      };
    }
    const perPage = limit ? +limit : 30;
    let currentPage = page ? +page : 1;
    let totalPages = 0;

    let sortFilters = { createdAt: -1 };
    if (latestFirst) {
      sortFilters = { ...sortFilters, createdAt: +latestFirst >= 1 ? -1 : 1 };
    }

    try {
      const total = await Category(process.env.DB_NAME as string).count({ ...filters });
      totalPages = Math.ceil(total / perPage);
      //   console.log("Total pages: ", total);
      const categories = await Category(process.env.DB_NAME as string).find({ ...filters })
        //@ts-ignore
        .sort({ ...sortFilters })
        .limit(perPage)
        .skip(perPage * (currentPage - 1))
        .lean();

      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data: {
            categories,
            paginationData: {
              currentPage,
              perPage,
              totalPages,
              total,
            },
          },
        },
      };
    } catch (e) {
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: {
            paginationData: {
              currentPage: 0,
              perPage: 0,
              totalPages: 0,
              total: 0,
            },
          },
        },
      };
    }
  };
}

export default CategoriesControllerV2;
