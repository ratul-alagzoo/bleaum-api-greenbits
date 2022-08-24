import FCM from "../../models/FCMToken";
import { nanoid } from "nanoid";
import SendNotification from "../../helpers/sendNotification";

class notificationController {
  sendNotification = new SendNotification();
  constructor() {}

  public getNotification = async () => {
    let returnData = {};

    return await returnData;
  };

  public createNotification = async (Body: any) => {
    let returnData = {};

    this.sendNotification
      .fireNotification("12345", "Testing Title", "Testing Head")
      .then((res) => {
        returnData = {
          message: "Success",
          data: res,
        };
      })
      .catch((e) => {
        returnData = {
          message: "Faliure",
          data: e,
        };
      });

    return await returnData;
  };
}

export default notificationController;
