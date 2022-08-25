import Order from "../../models/order";
import User from "../../models/users";
import PopularNTrending from "../../models/popularNtrending";
import Inventory from "../../models/inventory";
import NotificationControllerV1 from "./notificationController.v1";
import {
  ENotificationIntent,
  ENotificationTopics,
} from "../../models/notification";
import { code } from "../../helpers/generateCode";

class OrderController {
  constructor() {
    // let tokenService = new Token();
    // tokenService.getToken();
  }

  public getOrderDetails = async (orderID: any) => {
    let returnData = {};
    await Order(process.env.DB_NAME as string).find({ orderID: orderID, cancelled: false })
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding order",
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

  public cancelOrder = async (orderID: any) => {
    let returnData = {};
    await Order(process.env.DB_NAME as string).findOneAndUpdate(
      { orderID: orderID },
      { cancelled: true },
      { new: true }
    )
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding order",
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

  public getAllDay = async (consumerId: any) => {
    let returnData = {};
    await Order(process.env.DB_NAME as string).find({ consumerId: consumerId })
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding order",
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

  public updateOrder = async (orderID: any, body: any) => {
    let returnData = {};
    await Order(process.env.DB_NAME as string).findOneAndUpdate({ orderID: orderID }, body, {
      new: true,
    }).then(async (res: any) => {
      console.log(res);
      if (!res || res.length === 0) {
        returnData = {
          Message: "Failure",
          data: "No Order Found",
        };
      } else {
        const data = { ...res._doc };
        const statusMap: Record<string, ENotificationTopics> = {
          Dispatched: ENotificationTopics.ORDER_PROCESSING,
          Delivered: ENotificationTopics.ORDER_CONFIRMED,
        };
        if (statusMap[data?.status as string]) {
          NotificationControllerV1.sendTopicBasedNotification({
            highlights: `Order ID: ${data.orderID}`,
            intent: ENotificationIntent.INDIVIDUAL,
            userId: data.customer?.customerID,
            meta: {
              ...data,
            },
            outletChainId: process.env.OUTLET_CHAIN_ID as string,
            topic: statusMap[data?.status as string],
          })
            .then(() => {})
            .catch((e) =>
              console.error(
                "Unable to send notification in order controller ",
                e
              )
            );
        }

        returnData = {
          Message: "Success",
          data: res,
        };
      }
    });
    return await returnData;
  };

  public searchOrder = async (outletID: any, name: any) => {
    let returnData = {};
    await Order(process.env.DB_NAME as string).find({
      outletID: outletID,
      orderID: { $regex: name, $options: "i" },
    })
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding order",
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

  public getOrderByOutlet = async (outletID: any) => {
    let returnData = {};
    await Order(process.env.DB_NAME as string).find({ outletID: outletID })
      .then(async (res: any) => {
        console.log(res.length, "res");
        let customer = await User(process.env.DB_NAME as string).find({ customerID: res.customerID });
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding order",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
            customer: customer,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public createNewOrder = async (body: any) => {
    try {
      let returnData = {};
      let arrayProducts: any = [];
      body.products.map((product: any) => {
        arrayProducts.push(
          JSON.stringify({
            productId: product.productID,
            qty: product.quantity,
          }).replace(/"([^"]+)":/g, "$1:")
        );
      });
      let orderId = code();
      let found = false;
      while (!found) {
        const previousData = await Order(process.env.DB_NAME as string).findOne({ orderID: orderId }).lean();
        if (previousData) {
          orderId = code();
        } else {
          found = true;
        }
      }
      let order = await new (Order(process.env.DB_NAME as string))({
        orderID: orderId,
        outletID: body.outletID,
        customer: body.customer,
        consumerId: body.consumerId,
        products: body.products,
        totalPrice: body.totalPrice,
        discount: body.discount,
        finalPrice: body.finalPrice,
        status: body.status,
      });
      await order
        .save()
        .then(async (response: any) => {
          if (!response || response.length === 0) {
            returnData = {
              Message: "Failure",
              data: "order is not created",
            };
          } else {
            // console.log("Response is: ", {...response._doc});
            NotificationControllerV1.sendTopicBasedNotification({
              highlights: `Order ID: ${response._doc.orderID}`,
              intent: ENotificationIntent.INDIVIDUAL,
              userId: response._doc?.customer?.customerID,
              meta: {
                ...response._doc,
              },
              outletChainId: process.env.OUTLET_CHAIN_ID as string,
              topic: ENotificationTopics.NEW_ORDER,
            })
              .then(() => {})
              .catch((e) =>
                console.error(
                  "Unable to send notification in order controller ",
                  e
                )
              );
            returnData = {
              Message: "Success",
              data: response,
            };
          }
        })
        .catch((err: any) => console.log(err));
      body.products.map(async (product: any) => {
        await Inventory(process.env.DB_NAME as string).find({ productID: product.productID })
          .then(async (res) => {
            console.log(res[0], "upcoming");

            let objectBody = {
              outletChainID: body.outletID,
              Details: res[0],
              Date: Date.now(),
            };
            await PopularNTrending(process.env.DB_NAME as string).findOneAndUpdate(
              { "Details.productID": product.productID },
              { $set: objectBody },
              { upsert: true, new: true }
            );
            // console.log("Data is: ", data);
          })
          .catch((err: any) => console.log(err));
      });
      return returnData;
    } catch (e) {
      return {
        Message: "Failure",
        data: null,
      };
    }
  };

  public getorderbyCustomer = async (customerID: any) => {
    let returnData = {};

    // let token = localStorage.getItem("token");
    // if(!isTokenExpired(token)){
    //     let tokenService = new Token();
    //     tokenService.getToken();
    //     let token = localStorage.getItem("token");
    // }
    console.log("working");

    await Order(process.env.DB_NAME as string).find({ "customer.customerID": customerID, cancelled: false })
      .then(async (res: any) => {
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding order",
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
}

export default OrderController;
