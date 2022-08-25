import { IGetAllInventoryPaginated } from "../../dtos/inventory/v2/get-all-inventory";
import {
  IControllerResponse,
  IControllerResponsePaginated,
} from "../../dtos/types/controller-response.interface";
import Inventory from "../../models/inventory";

class InventoryControllerV2 {
  constructor() {}

  public getAllPaginatedInventories = async (
    param: IGetAllInventoryPaginated
  ): Promise<IControllerResponsePaginated<any>> => {
    console.log("Param is: ", param);
    const { outletChainID, latestFirst, sortByAlpha, limit, page, search } =
      param;
    let filters: object = { outletChainID: outletChainID };
    if (search) {
      filters = {
        ...filters,
        "product.name": { $regex: search, $options: "i" },
      };
    }
    const perPage = limit ? +limit : 100;
    let currentPage = page ? +page : 1;
    let totalPages = 0;

    let sortFilters = { createdAt: -1 };
    if (latestFirst) {
      sortFilters = { ...sortFilters, createdAt: +latestFirst >= 1 ? -1 : 1 };
    }

    try {
      const total = await Inventory(process.env.DB_NAME as string).count({ ...filters });
      totalPages = Math.ceil(total / perPage);
      //   console.log("Total pages: ", total);
      const inventories = await Inventory(process.env.DB_NAME as string).find({ ...filters })
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
            inventories,
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

  public getTHCAndCBDLimits = async (): Promise<IControllerResponse<any>> => {
    try {
      let limits = {
        upperTHCLimit: 100,
        lowerTHCLimit: 0,
        upperCBDLimit: 100,
        lowerCBDLimit: 0,
      };

      const allInventories = await Inventory(process.env.DB_NAME as string).find().lean();

      limits = allInventories.reduce(
        (acc, data) => {
          return {
            ...acc,
            upperTHCLimit: Number.isNaN(data?.product?.thc)
              ? acc.upperTHCLimit
              : +acc.upperTHCLimit < +data?.product?.thc
              ? +data?.product?.thc
              : +acc.upperTHCLimit,
            lowerTHCLimit: Number.isNaN(data?.product?.thc)
              ? acc.lowerTHCLimit
              : +acc.lowerTHCLimit > +data?.product?.thc
              ? +data?.product?.thc
              : +acc.lowerTHCLimit,
            upperCBDLimit: Number.isNaN(data?.product?.cbd)
              ? acc.upperCBDLimit
              : +acc.upperCBDLimit < +data?.product?.cbd
              ? +data?.product?.cbd
              : +acc.upperCBDLimit,
            lowerCBDLimit: Number.isNaN(data?.product?.cbd)
              ? acc.lowerCBDLimit
              : +acc.lowerCBDLimit > +data?.product?.cbd
              ? +data?.product?.cbd
              : +acc.lowerCBDLimit,
          };
        },
        { ...limits }
      );

      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data: {
            limits,
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

export default InventoryControllerV2;
