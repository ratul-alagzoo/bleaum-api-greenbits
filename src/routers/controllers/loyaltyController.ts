import Loyalty from "../../models/loyalty";
// import User from "../../models/users";
import { nanoid } from "nanoid";

class LoyaltyController {
  constructor() {}

  public getAllLoyalty = async (consumerId: any) => {
    let returnData = {};
    // let queries: any = { outletChainID: outletChainID, status: true };
    // if (isAdmin) {
    //   let { status, ...others } = queries;
    //   queries = { ...others };
    // }
    await Loyalty(process.env.DB_NAME as string).findOne({ consumerId: consumerId })
      .then(async (res: any) => {
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "Error finding Loyalty",
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

  public updateLoyalty = async (loyaltyID: any, consumerId: any, body: any) => {
    let returnData = {};
    let I_D = "loyaltyID";
    await Loyalty(process.env.DB_NAME as string).findOneAndUpdate(
      { loyaltyID: loyaltyID, consumerId: consumerId },
      {
        ...body,
        outletChainID: process.env.MENU_KEY,
      },
      {
        new: true,
      }
    )
      .then(async (res: any) => {
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Loyalty is not Updated",
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

  public updateLoyaltyDate = async (
    day: any,
    loyaltyID: any,
    consumerId: any,
    body: any
  ) => {
    let returnData = {};
    let data: any = {};
    data[day] = body.value;
    await Loyalty(process.env.DB_NAME as string).findOneAndUpdate(
      { loyaltyID: loyaltyID, consumerId: consumerId },
      data,
      {
        new: true,
      }
    )
      .then(async (res: any) => {
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Loyalty is not Updated",
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

  public createLoyalty = async (Body: any) => {
    let returnData = {};

    let calander = await new (Loyalty(process.env.DB_NAME as string))({
      outletChainID: process.env.MENU_KEY,
      loyaltyID: nanoid(8),
      consumerId: Body.consumerId,
      monday: Body.monday,
      tuesday: Body.tuesday,
      wednesday: Body.wednesday,
      thursday: Body.thursday,
      friday: Body.friday,
      saturday: Body.saturday,
      sunday: Body.sunday,
      pointsToPrice: Body.pointsToPrice,
      PointsToPointsEarnedRatio: Body.PointsToPointsEarnedRatio,
      PointsForRegistration: Body.PointsForRegistration,
      PointsOnFirstOrder: Body.PointsOnFirstOrder,
    });

    await calander
      .save()
      .then(async (res: any) => {
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Loyalty is not created",
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

    // User.find()
    //   .then(async (res: any) => {
    //     res.forEach(async (element: any) => {
    //       let points = await new Loyalty({
    //         userID: element.userID,
    //         points: 0,
    //       });
    //       await points.save().then(async (res: any) => {
    //         console.log(res);
    //         if (!res || res.length === 0) {
    //           returnData = {
    //             Message: "Failure",
    //             data: "Loyalty is not created",
    //           };
    //         } else {
    //           returnData = {
    //             Message: "Success",
    //             data: res,
    //           };
    //         }
    //       });
    //     });
    //   })

    //   .catch((err: any) => console.log(err));
    return await returnData;
  };
}

export default LoyaltyController;
//   public getSingleUserLoyalty = async (userID: any) => {
//     let returnData = {};
//     await Loyalty.find({ userID: userID })
//       .then(async (res: any) => {
//         // console.log(res);
//         if (res.length === 0) {
//           returnData = {
//             Message: "Failure",
//             data: "No Loyalty Found",
//           };
//         } else {
//           returnData = {
//             Message: "Success",
//             data: res,
//           };
//         }
//       })
//       .catch((e) => console.log(e));
//     return await returnData;
//   };

//   public deleteLoyalty = async (bannerId: any) => {
//     let returnData = {};
//     await Loyalty.findOneAndDelete({ bannerId: bannerId })
//       .then(async (res: any) => {
//         console.log(res);
//         if (!res || res.length === 0) {
//           returnData = {
//             Message: "Failure",
//             data: "Loyalty is not Deleted",
//           };
//         } else {
//           returnData = {
//             Message: "Success",
//             data: "Loyalty is Deleted Successfully",
//           };
//         }
//       })
//       .catch((err: any) => console.log(err));
//     return await returnData;
//   };
