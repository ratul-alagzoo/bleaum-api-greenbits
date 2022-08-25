import Deals from "../../models/deals";
import { nanoid } from "nanoid";
import { SendMail } from "../../helpers/mailSender";
import NotificationControllerV1 from "./notificationController.v1";
import {
  ENotificationIntent,
  ENotificationTopics,
} from "../../models/notification";
class DealController {
  constructor() {}

  public getAllDeals = async (consumerId: any) => {
    let returnData = {};
    await Deals(process.env.DB_NAME as string).find({ consumerId: consumerId })
      .then(async (res: any) => {
        console.log(res);
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "Error finding Deals",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public getSingleDeal = async (dealId: any) => {
    let returnData = {};
    await Deals(process.env.DB_NAME as string).find({ dealId: dealId })
      .then(async (res: any) => {
        // console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Deal Found",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public getOutletDeal = async (consumerId: any, outletChainId: any) => {
    let returnData = {};
    await Deals(process.env.DB_NAME as string).find({
      consumerId: consumerId,
      "selectedOutlets.outletChainID": outletChainId,
    })
      .then(async (res: any) => {
        // console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Deal Found",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public updateDeal = async (dealId: any, Body: any) => {
    let returnData = {};
    await Deals(process.env.DB_NAME as string).findOneAndUpdate({ dealId: dealId }, Body, { new: true }).then(
      async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Deal Found",
          };
        } else {
          //notification block
          if (res.status) {
            NotificationControllerV1.sendTopicBasedNotification({
              highlights: `Enjoy ${res?.discountValue}% off on ${
                res?.selectedProducts.length
                  ? "selected products"
                  : "selected categories"
              }`,
              intent: ENotificationIntent.ALL,
              meta: res,
              outletChainId: process?.env?.MENU_KEY as string,
              topic: ENotificationTopics.DEAL_UPADTED,
            })
              .then(() => {})
              .catch((e) => console.error(e));
          }
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      }
    );
    return await returnData;
  };

  public deleteDeal = async (dealId: any) => {
    let returnData = {};
    await Deals(process.env.DB_NAME as string).findOneAndDelete({ dealId: dealId }).then(async (res: any) => {
      if (!res || res.length === 0) {
        returnData = {
          Message: "Failure",
          data: "No Deal Found",
        };
      } else {
        returnData = {
          Message: "Success",
          data: "Deleted Successfully",
        };
      }
    });
    return await returnData;
  };

  public searchDeals = async (consumerId: any, name: any) => {
    let returnData = {};
    await Deals(process.env.DB_NAME as string).find({
      consumerId: consumerId,
      name: { $regex: name, $options: "i" },
    })
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding inventory",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public createDeal = async (Body: any) => {
    let returnData = {};
    let deal = await new (Deals(process.env.DB_NAME as string))({
      dealId: nanoid(8),
      consumerId: Body.consumerId,
      name: Body.name,
      discountValue: Body.discountValue,
      selectedOutlets: Body.selectedOutlets,
      selectedProducts: Body.selectedProducts,
      selectedCategories: Body.selectedCategories,
      applyToAllOutlets: Body.applyToAllOutlets,
      image: Body.image,
      startDate: Body.startDate,
      endDate: Body.endDate,
      neverExpires: Body.neverExpires,
      status: Body.status,
    });

    await deal
      .save()
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "deal is not created",
          };
        } else {
          //notification block
          if (res.status) {
            NotificationControllerV1.sendTopicBasedNotification({
              highlights: `Enjoy ${res?.discountValue}% off on ${
                res?.selectedProducts.length
                  ? "selected products"
                  : "selected categories"
              }`,
              intent: ENotificationIntent.ALL,
              meta: { ...res._doc },
              outletChainId: process?.env?.MENU_KEY as string,
              topic: ENotificationTopics.DEAL_ADDED,
            })
              .then(() => {})
              .catch((e) => console.error(e));
          }
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((err: any) => console.log(err));
    return await returnData;
  };
}

export default DealController;
