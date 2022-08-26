import FCMTokenModal from "../models/FCMToken";
import cerdentials from "./serviceAccount.json";
import * as admin from "firebase-admin";
const serviceAccount = cerdentials as admin.ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class SendNotification {
  notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };
  constructor() {}
  public fireNotification = async (
    CustomerID: any,
    Title: any,
    Message: any
  ) => {
    console.log(CustomerID);
    let token: any = [];
    await FCMTokenModal(process.env.DB_NAME as string)
      .find()
      .then(async (data: any) => {
        let data1 = [];
        for (let i = 0; i < data.length; i++) {
          //@ts-ignore
          await data1.push(data[i].Token);
        }
        console.log(data1);
        token = await data1;
      })
      .catch((err) => console.log(err));
    let safi = await {
      safi: "Party",
    };
    const payload = await {
      notification: {
        title: Title,
        body: Message + "|" + Date.now(),
      },
      tokens: token,
      // NOTE: The ‘data’ object is inside payload, not inside notification
    };
    const options = await this.notification_options;
    await console.log(token);
    await admin
      .messaging()
      .sendMulticast(payload)
      .then(async (response) => {
        console.log("Notification sent successfully");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
export default SendNotification;
