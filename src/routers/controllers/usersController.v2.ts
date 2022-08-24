import { IControllerResponsePaginated } from "../../dtos/types/controller-response.interface";
import { IGetAllUserPaginated } from "../../dtos/users/v2/get-all-users";
import User from "../../models/users";

class UserControllersV2 {
  constructor() {}

  public getPaginatedUser = async (
    param: IGetAllUserPaginated
  ): Promise<IControllerResponsePaginated<any>> => {
    console.log("Param is: ", param);
    const { outletChainID, latestFirst, sortByAlpha, limit, page, search } =
      param;
    let filters: object = { outletChainID: outletChainID };
    if (search) {
      filters = {
        ...filters,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
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
      const total = await User.count({ ...filters });
      totalPages = Math.ceil(total / perPage);
      //   console.log("Total pages: ", total);
      const users = await User.find({ ...filters })
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
            users,
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

export default UserControllersV2;
