import Points from "../../models/loyaltyPoints";
import User from "../../models/users";
import { nanoid } from "nanoid";
import { response } from "express";
import {
  ENotificationIntent,
  ENotificationTopics,
} from "../../models/notification";
import NotificationControllerV1 from "./notificationController.v1";

class PointsController {
  constructor() {}

  public getAllPoints = async () => {
    let returnData = {};
    // let queries: any = { outletChainID: outletChainID, status: true };
    // if (isAdmin) {
    //   let { status, ...others } = queries;
    //   queries = { ...others };
    // }
    await Points.find()
      .then(async (res: any) => {
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "Error finding Points",
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

  public getSingleUserPoints = async (userID: any, outletID: any) => {
    let returnData = {};
    await Points.findOne({ userID: userID })
      .then(async (res: any) => {
        // console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Points Found",
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

  public createPoints = async (Body: any, outletID: any) => {
    let returnData = {};
    await Points.findOneAndUpdate(
      { userID: "", outletChainID: outletID },
      { points: Body.points },
      { upsert: true }
    );
    // console.log(Body, outletID)

    await User.find({ userID: Body.userID })
      .then(async (res: any) => {
        // console.log(res)
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "User not found",
          };
        } else {
          let points = await new Points({
            pointsID: nanoid(8),
            userID: Body.userID,
            outletChainID: outletID,
            points: Body.points,
          });
          await points.save().then(async (res: any) => {
            if (res.length === 0) {
              returnData = {
                Message: "Failure",
                data: "Points not saved",
              };
            } else {
              // console.log("Here sending notification to user...");
              // NotificationControllerV1.sendTopicBasedNotification({
              //   highlights: `You have earned ${res.points} points`,
              //   intent: ENotificationIntent.INDIVIDUAL,
              //   userId: res?.userID,
              //   meta: { ...res._doc },
              //   outletChainId: process?.env?.MENU_KEY as string,
              //   topic: ENotificationTopics.LOYALTY_POINTS_EARNED,
              // })
              //   .then(() => {})
              //   .catch((e) => console.error(e));
              returnData = {
                Message: "Success",
                data: res,
              };
            }
          });
        }
      })

      .catch((err: any) => console.log(err));
    return await returnData;
  };

  public earnPoints = async (userID: any, outletID: any, body: any) => {
    let returnData = {};
    await Points.findOneAndUpdate(
      { userID: userID, outletChainID: outletID },
      { points: body.points },
      { new: true }
    )
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Points is not Updated",
          };
        } else {
          console.log("Here sending notification to user...", res.userID);
          NotificationControllerV1.sendTopicBasedNotification({
            highlights: `You have earned ${res.points} points`,
            intent: ENotificationIntent.INDIVIDUAL,
            userId: res?.userID,
            meta: { ...res._doc },
            outletChainId: process?.env?.MENU_KEY as string,
            topic: ENotificationTopics.LOYALTY_POINTS_EARNED,
          })
            .then(() => {})
            .catch((e) => console.error(e));
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((err: any) => console.log(err));
    return await returnData;
  };

  public updatePoints = async (userID: any, body: any, outletID: any) => {
    let returnData = {};
    await Points.findOneAndUpdate(
      { userID: userID, outletChainID: outletID },
      { points: body.points },
      { new: true }
    )
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Points is not Updated",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((err: any) => console.log(err));
    return await returnData;
  };

  public deletePoints = async (outletID: any, pointsId: any) => {
    let returnData = {};
    await Points.findOneAndDelete({
      pointsID: pointsId,
      outletChainID: outletID,
    })
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Points is not Deleted",
          };
        } else {
          returnData = {
            Message: "Success",
            data: "Points is Deleted Successfully",
          };
        }
      })
      .catch((err: any) => console.log(err));
    return await returnData;
  };
}

export default PointsController;
