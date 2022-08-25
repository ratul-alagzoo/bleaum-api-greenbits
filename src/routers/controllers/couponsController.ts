import Coupons from "../../models/coupons";
import { nanoid } from "nanoid";
import NotificationControllerV1 from "./notificationController.v1";
import {
  ENotificationIntent,
  ENotificationTopics,
} from "../../models/notification";

class CouponController {
  constructor() {}

  public getAllCoupons = async (consumerId: any) => {
    let returnData = {};
    await Coupons(process.env.DB_NAME as string).find({ consumerId: consumerId })
      .then(async (res: any) => {
        // console.log(res);
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "Error finding Coupons",
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

  public searchCoupons = async (consumerId: any, name: any) => {
    let returnData = {};
    await Coupons(process.env.DB_NAME as string).find({
      consumerId: consumerId,
      couponCode: { $regex: name, $options: "i" },
    })
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding coupon",
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

  public getSingleCoupon = async (couponCode: any) => {
    let returnData = {};
    await Coupons(process.env.DB_NAME as string).find({ couponCode: couponCode })
      .then(async (res: any) => {
        // console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Coupons Found",
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

  public getOutletCoupon = async (consumerId: any, outletChainId: any) => {
    let returnData = {};
    await Coupons(process.env.DB_NAME as string).find({
      consumerId: consumerId,
      "selectedOutlets.outletChainID": outletChainId,
    })
      .then(async (res: any) => {
        // console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Coupons Found",
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

  public updateCoupon = async (couponId: any, Body: any) => {
    let returnData = {};
    try {
      console.log("Body is: ", Body);
      await Coupons(process.env.DB_NAME as string).findOneAndUpdate({ couponId: couponId }, Body, {
        new: true,
      }).then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Coupons Found",
          };
        } else {
          //notification block
          if (res.status) {
            NotificationControllerV1.sendTopicBasedNotification({
              highlights: `Enjoy ${
                res?.couponType === "Free Shiping"
                  ? "Free Shipping"
                  : res?.couponType === "Amount"
                  ? `$${res?.discountValue} off`
                  : `${res?.discountValue}% off`
              }`,
              intent: ENotificationIntent.ALL,
              meta: res,
              outletChainId: process?.env?.MENU_KEY as string,
              topic: ENotificationTopics.COUPON_UPDATED,
            }).catch((e) => console.error(e));
          }
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      });
      return await returnData;
    } catch (e) {
      console.error(e);
      returnData = {
        Message: "Failure",
        data: "Something unexpected occured",
      };
      return returnData;
    }
  };

  public deleteCoupon = async (couponId: any) => {
    let returnData = {};
    await Coupons(process.env.DB_NAME as string).findOneAndDelete({ couponId: couponId }).then(
      async (res: any) => {
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Coupons Found",
          };
        } else {
          returnData = {
            Message: "Success",
            data: "Deleted Successfully",
          };
        }
      }
    );
    return await returnData;
  };

  public createCoupon = async (Body: any) => {
    let returnData = {};
    let deal = await new (Coupons(process.env.DB_NAME as string))({
      couponId: nanoid(8),
      consumerId: Body.consumerId,
      couponCode: Body.couponCode,
      couponType: Body.couponType,
      discountValue: Body.discountValue,
      selectedOutlets: Body.selectedOutlets,
      selectedProducts: Body.selectedProducts,
      selectedCategories: Body.selectedCategories,
      applyToAllOutlets: Body.applyToAllOutlets,
      entireCart: Body.entireCart,
      startDate: Body.startDate,
      endDate: Body.endDate,
      memberType: Body.memberType,
      neverExpires: Body.neverExpires,
      rules: Body.rules,
      status: Body.status,
    });

    await deal
      .save()
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Coupons is not created",
          };
        } else {
          //notification block
          if (res.status) {
            NotificationControllerV1.sendTopicBasedNotification({
              highlights: `Enjoy ${
                res?.couponType === "Free Shiping"
                  ? "Free Shipping"
                  : res?.couponType === "Amount"
                  ? `$${res?.discountValue} off`
                  : `${res?.discountValue}% off`
              }`,
              intent: ENotificationIntent.ALL,
              meta: { ...res._doc },
              outletChainId: process?.env?.MENU_KEY as string,
              topic: ENotificationTopics.COUPON_ADDED,
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

export default CouponController;
