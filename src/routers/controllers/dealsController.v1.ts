import Deals, {
  EDiscountTypeEnum,
  IDealDocument,
  IProductIdDiscountMap,
} from "../../models/deals";
import { nanoid } from "nanoid";
import NotificationControllerV1 from "./notificationController.v1";
import {
  ENotificationIntent,
  ENotificationTopics,
} from "../../models/notification";
import { IUpsertDeal } from "../../dtos/deals/v1/deals-validator";
import { IControllerResponse } from "../../dtos/types/controller-response.interface";
import Inventory from "../../models/inventory";
import { _LeanDocument } from "mongoose";
import Category from "../../models/category";

class DealsControllerV1 {
  constructor() {}

  public UpsertDeal = async (params: {
    outletChainID: string;
    body: IUpsertDeal;
  }): Promise<IControllerResponse<any>> => {
    try {
      const { outletChainID, body } = params;
      //check if outlet chains are valid
      if (!body.applyToAllOutlets) {
        if (body.selectedOutlets.length === 0) {
          return {
            statusCode: 400,
            toSend: {
              Message: "Failure",
              data: {
                message: "Must choose at least one outlet",
              },
            },
          };
        } else {
          //check if unauthorized outlets are included
          if (body.selectedOutlets[0].outletChainID !== outletChainID) {
            return {
              statusCode: 403,
              toSend: {
                Message: "Failure",
                data: {
                  message: "Unauthorized to add this outlet chain",
                },
              },
            };
          }
        }
      } else {
        body.selectedOutlets = [];
      }

      //validate start date and end date
      if (!body.neverExpires) {
        if (!body.endDate) {
          return {
            statusCode: 400,
            toSend: {
              Message: "Failure",
              data: {
                message: "Ending date field is required",
              },
            },
          };
        }
        if (new Date() > new Date(body.endDate)) {
          return {
            statusCode: 400,
            toSend: {
              Message: "Failure",
              data: {
                message: "Deal must end in a future date",
              },
            },
          };
        }
        if (new Date(body.startDate) >= new Date(body?.endDate as string)) {
          return {
            statusCode: 400,
            toSend: {
              Message: "Failure",
              data: {
                message: "Ending date should be happenin after starting date",
              },
            },
          };
        }
      }
      if (
        body.selectedCategories.length !== 0 &&
        body.selectedProducts.length !== 0
      ) {
        return {
          statusCode: 400,
          toSend: {
            Message: "Failure",
            data: {
              message: "Can't have products and categories at the same time",
            },
          },
        };
      }

      let appliesTo: Record<string, IProductIdDiscountMap> = {};
      let categoriesAffected: Record<string, boolean> = {};
      let toInsert = {
        ...body,
        dealId: body.dealId ?? nanoid(8),
        appliesTo,
        categoriesAffected,
      };

      //an expired deal can not be edited
      if (body.dealId) {
        const prevDeal = await Deals.findOne({ dealId: body.dealId }).lean();
        if (!prevDeal) {
          return {
            statusCode: 404,
            toSend: {
              Message: "Failure",
              data: {
                message: "Deal not found",
              },
            },
          };
        }

        if (!prevDeal.neverExpires) {
          if (prevDeal.endDate && new Date() > new Date(prevDeal.endDate)) {
            return {
              statusCode: 404,
              toSend: {
                Message: "Failure",
                data: {
                  message: "An expired deal can not be edited",
                },
              },
            };
          }
        }
      }

      //if it is category based then populate products
      if (body.selectedCategories.length) {
        let categoryIds = body.selectedCategories.map((obj) => obj.categoryID);
        let categoryNames = body.selectedCategories.map((obj) => obj.name);

        let foundProducts = await Inventory.find({
          outletChainID,
          "product.category": {
            $elemMatch: {
              categoryID: {
                $in: categoryIds,
              },
              name: {
                $in: categoryNames,
              },
            },
          },
        }).lean();

        // if (foundProducts.length === 0) {
        //   return {
        //     statusCode: 404,
        //     toSend: {
        //       Message: "Failure",
        //       data: {
        //         message: "No products found under selected categories",
        //       },
        //     },
        //   };
        // }
        foundProducts.forEach((element) => {
          if (!!element.productID) {
            appliesTo = {
              ...appliesTo,
              [element.productID as string]: {
                discountValue: +body.discountValue,
                discountType: EDiscountTypeEnum.PERCENTAGE,
              },
            };
          }

          let tempCategoriesMap: Record<string, boolean> = {};
          //@ts-ignore
          element.product?.category?.forEach((obj) => {
            if (obj.categoryID) {
              tempCategoriesMap = {
                ...tempCategoriesMap,
                [obj?.categoryID]: true,
              };
            }
          });
          categoriesAffected = { ...categoriesAffected, ...tempCategoriesMap };
        });
        toInsert = {
          ...toInsert,
          appliesTo,
          categoriesAffected,
        };
      }
      //check if the products actually exist in the inventory
      else if (body.selectedProducts.length) {
        let productIds: string[] = body.selectedProducts.map(
          (obj) => obj.productID
        );
        let foundProducts = await Inventory.find({
          outletChainID,
          productID: {
            $in: productIds,
          },
        }).lean();

        // if (foundProducts.length !== productIds.length) {
        //   return {
        //     statusCode: 404,
        //     toSend: {
        //       Message: "Failure",
        //       data: {
        //         message: "One or more products not found",
        //       },
        //     },
        //   };
        // }
        foundProducts.forEach((element) => {
          if (!!element.productID) {
            appliesTo = {
              ...appliesTo,
              [element.productID as string]: {
                discountValue: +body.discountValue,
                discountType: EDiscountTypeEnum.PERCENTAGE,
              },
            };
          }

          let tempCategoriesMap: Record<string, boolean> = {};
          //@ts-ignore
          element.product?.category?.forEach((obj) => {
            if (obj.categoryID) {
              tempCategoriesMap = {
                ...tempCategoriesMap,
                [obj?.categoryID]: true,
              };
            }
          });
          categoriesAffected = { ...categoriesAffected, ...tempCategoriesMap };
        });

        toInsert = {
          ...toInsert,
          appliesTo,
          categoriesAffected,
        };
      } else {
        return {
          statusCode: 400,
          toSend: {
            Message: "Failure",
            data: {
              message: "Choose at least one product or category",
            },
          },
        };
      }
      const availableDeals = await this.GetAvailableDeals({
        outletChainID,
        consumerId: body.consumerId,
        excludedDealId: body.dealId,
      });
      // console.log("Available deals are: ", availableDeals);
      const productsReserved: Record<string, boolean> = availableDeals.reduce(
        (acc, el) => ({
          ...acc,
          ...(typeof el.appliesTo === "object" ? el.appliesTo : {}),
        }),
        {}
      );
      let keysToCompare = Object.keys(toInsert.appliesTo);
      for (let i = 0; i < keysToCompare.length; i++) {
        let temp = keysToCompare[i];
        if (productsReserved[temp as string]) {
          return {
            statusCode: 400,
            toSend: {
              Message: "Failure",
              data: {
                message: "Conflicting products exist",
              },
            },
          };
        }
      }

      const deal = await Deals.findOneAndUpdate(
        {
          consumerId: toInsert.consumerId,
          dealId: toInsert.dealId,
        },
        {
          $set: {
            ...toInsert,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

      //send notification
      if (!!deal) {
        NotificationControllerV1.sendTopicBasedNotification({
          highlights: `Enjoy ${deal?.discountValue}% off on ${
            deal?.selectedProducts.length
              ? "selected products"
              : "selected categories"
          }`,
          intent: ENotificationIntent.ALL,
          //@ts-ignore
          meta: { ...deal._doc },
          outletChainId: process?.env?.MENU_KEY as string,
          topic: !!body.dealId
            ? ENotificationTopics.DEAL_UPADTED
            : ENotificationTopics.DEAL_ADDED,
        })
          .then(() => {})
          .catch((e) => console.error(e));
      }

      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data: {
            appliesTo,
            categoriesAffected,
            total: Object.keys(appliesTo).length,
            deal,
          },
        },
      };
    } catch (e) {
      console.error("Something unexpected happenned while placing deal: ", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  public GetAvailableCategories = async (params: {
    outletChainID?: string;
    consumerID: number;
    excludedDealID?: string;
  }): Promise<IControllerResponse<any>> => {
    try {
      const availableDeals = await this.GetAvailableDeals({
        outletChainID: params.outletChainID ?? undefined,
        consumerId: params.consumerID,
        excludedDealId: params.excludedDealID ?? undefined,
      });
      const categoriesAffected = this.GetReservedCategoris(availableDeals);
      console.log("Affeceted categories are: ", categoriesAffected);

      let filters: Object = {};
      if (params.outletChainID) {
        filters = {
          ...filters,
          countInventory: {
            $elemMatch: { outletChainID: params.outletChainID },
          },
        };
      }
      const categories = await Category.find({ ...filters }).lean();
      // console.log("Unfiltered categories are: ", categories.length);
      const availableCategories = categories.filter(
        (el) => !categoriesAffected[el.categoryID as string]
      );

      console.log("Total available categories: ", availableCategories.length);
      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data: availableCategories,
        },
      };
    } catch (e) {
      console.error("Something unexpected happenned while placing deal: ", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  public GetAvailableProducts = async (params: {
    outletChainID?: string;
    excludedDealID?: string;
  }): Promise<IControllerResponse<any>> => {
    try {
      const availableDeals = await this.GetAvailableDeals({
        outletChainID: params.outletChainID ?? undefined,
        excludedDealId: params.excludedDealID ?? undefined,
      });
      const productsAffected = this.GetReservedProducts(availableDeals);

      let filters: Object = {};
      if (params.outletChainID) {
        filters = { ...filters, outletChainID: params.outletChainID };
      }
      const products = await Inventory.find({ ...filters }).lean();
      const availableProducts = products.filter(
        (el) => !productsAffected[el.productID as string]
      );
      console.log("Total available products: ", availableProducts.length);
      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data: availableProducts,
        },
      };
    } catch (e) {
      console.error("Something unexpected happenned while placing deal: ", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  private GetReservedCategoris = (deals: _LeanDocument<IDealDocument>[]) => {
    let categoriesAffected: Record<string, boolean> = {};
    deals.forEach((deal) => {
      categoriesAffected = {
        ...categoriesAffected,
        ...(typeof deal?.categoriesAffected === "object"
          ? deal?.categoriesAffected
          : {}),
      };
    });
    return categoriesAffected;
  };

  private GetReservedProducts = (deals: _LeanDocument<IDealDocument>[]) => {
    let productsAffected: Record<string, IProductIdDiscountMap> = {};
    deals.forEach((deal) => {
      productsAffected = {
        ...productsAffected,
        ...(typeof deal?.appliesTo === "object" ? deal?.appliesTo : {}),
      };
    });
    return productsAffected;
  };

  public GetApplicableDeals = async (params: {
    consumerId?: number;
    outletChainID?: string;
    hideDisabled?: number;
  }): Promise<IControllerResponse<any>> => {
    try {
      const { consumerId, outletChainID, hideDisabled } = params;
      let filters: Object = {};
      if (consumerId) {
        filters = { ...filters, consumerId: params.consumerId };
      }
      if (hideDisabled && hideDisabled > 0) {
        filters = { ...filters, status: true };
      }
      let andConditions: any[] = [
        {
          $or: [
            {
              neverExpires: true,
            },
            {
              endDate: {
                $gte: new Date(),
              },
            },
          ],
        },
      ];
      if (outletChainID) {
        andConditions = [
          ...andConditions,
          {
            $or: [
              {
                selectedOutlets: {
                  $elemMatch: {
                    outletChainID,
                  },
                },
              },
              {
                applyToAllOutlets: true,
              },
            ],
          },
        ];
      }
      filters = {
        ...filters,
        $and: [...andConditions],
      };
      const data = await Deals.find({
        ...filters,
      }).lean();
      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data,
        },
      };
    } catch (e) {
      console.error("Something unexpected happenned while placing deal: ", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  private GetAvailableDeals = async (params: {
    consumerId?: number;
    outletChainID?: string;
    excludedDealId?: string;
  }) => {
    const { consumerId, outletChainID, excludedDealId } = params;
    let filters: Object = {};
    if (consumerId) {
      filters = { ...filters, consumerId: params.consumerId };
    }
    let andConditions: any[] = [
      {
        $or: [
          {
            neverExpires: true,
          },
          {
            endDate: {
              $gte: new Date(),
            },
          },
        ],
      },
    ];
    if (outletChainID) {
      andConditions = [
        ...andConditions,
        {
          $or: [
            {
              selectedOutlets: {
                $elemMatch: {
                  outletChainID,
                },
              },
            },
            {
              applyToAllOutlets: true,
            },
          ],
        },
      ];
    }
    filters = {
      ...filters,
      $and: [...andConditions],
    };
    if (excludedDealId) {
      filters = {
        ...filters,
        dealId: {
          $not: {
            $in: [excludedDealId],
          },
        },
      };
    }
    return await Deals.find({
      ...filters,
    }).lean();
  };
}

export default DealsControllerV1;
