import * as firebaseAdmin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { INotification } from "../../dtos/notifications/v1/notifcations-validators";
import { IUpsertPNToken } from "../../dtos/pntokens/v1/pn-tokens.validators";
import { IControllerResponse } from "../../dtos/types/controller-response.interface";
import * as serviceAccountConfig from "../../firebase/hamilton-mobile-app-firebase-adminsdk-bu4z1-71d53c08f1.json";
import {
  ENotificationIntent,
  ENotificationTopics,
} from "../../models/notification";
import PNDocument from "../../models/pntokens";

class PushNotificationControllerV1 {
  outletChainId: string;
  constructor() {
    //IMPORTANT
    this.outletChainId = (process.env?.MENU_KEY ?? "NOT_FOUND") as string;
    // console.log("OutletChain id is: ", this.outletChainId);

    if (!firebaseAdmin.apps.length) {
      console.log("Initializing firebase app...");
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(
          serviceAccountConfig as ServiceAccount
        ),
        storageBucket: "gs://hamilton-mobile-app.appspot.com",
      });
    } else {
      firebaseAdmin.app();
    }
  }

  //method for sending dummy notification
  public sendDummyPushNotification = async (
    fcmToken: string
  ): Promise<boolean> => {
    try {
      // console.log("Here...");
      await PushNotificationControllerV1.sendPushNotifications([fcmToken], {
        blackListedFor: {},
        fromAdmin: false,
        intentTo: ENotificationIntent.INDIVIDUAL,
        userId: "user-id",
        isSeen: false,
        notificationInfo: {
          title: "Greetings..",
          highlights: "A test push notification...",
          meta: {},
          topic: ENotificationTopics.OTHERS,
          imageUrl: "https://wallpaperaccess.com/full/1555192.jpg",
        },
        outletChainId: "outletchain-id",
        seenBy: {},
      });
      return true;
    } catch (e) {
      console.error("Push notifications related error happened: ", e);
      return false;
    }
  };

  public upsertPNTokenService = async (
    params: IUpsertPNToken
  ): Promise<IControllerResponse<any>> => {
    try {
      const { clientId, ip, userId } = params;
      const data = await PNDocument.findOneAndUpdate(
        { clientId, userId, ip },
        {
          $set: {
            ...params,
            expireAt: null,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data,
        },
      };
    } catch (e) {
      console.error("Something unexpected happenned ", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  public deletePNTokenService = async (params: {
    userId: string;
    clientId: string;
    ip: string | null;
  }): Promise<IControllerResponse<any>> => {
    try {
      const { clientId, ip, userId } = params;
      await PNDocument.deleteMany({ clientId, userId, ip });
      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data: {
            message: "Deleted",
          },
        },
      };
    } catch (e) {
      console.error("Something unexpected happenned ", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  //for testing purposes
  public static sendPushNotifications = async (
    users: string[],
    message: INotification
  ) => {
    try {
      await firebaseAdmin
        .messaging()
        .sendMulticast({
          tokens: [...users],
          notification: {
            title: message.notificationInfo?.title ?? "Notification",
            body: message.notificationInfo?.highlights,
            // imageUrl: message.notificationInfo?.imageUrl,
          },
        })
        .then((data) => {
          if (data?.responses[0]?.error) {
            console.log("From firebase: ", data?.responses[0]?.error);
          }
        });
      console.log("Message sent");
    } catch (e) {
      console.error("Push notification sending failed: ", e);
    }
  };

  public static sendPushNotificationsToAllUsers = async (
    message: INotification,
    outletChainId: string
  ) => {
    try {
      const userTokens = await PNDocument.find({ outletChainId }).lean();
      let tokens = userTokens.map((obj) => obj.token);
      await firebaseAdmin
        .messaging()
        .sendMulticast({
          tokens: [...tokens],
          notification: {
            title: message.notificationInfo?.title ?? "Notification",
            body: message.notificationInfo?.highlights,
            // imageUrl: message.notificationInfo?.imageUrl,
          },
        })
        .then((data) => {
          if (data?.responses[0]?.error) {
            console.log("From firebase: ", data?.responses[0]?.error);
          }
        });
    } catch (e) {
      console.error("Push notification sending failed: ", e);
    }
  };

  public static sendPushNotificationsToSpecificUser = async (
    message: INotification,
    userId: string,
    outletChainId: string
  ) => {
    try {
      const userToken = await PNDocument.findOne({
        outletChainId,
        userId,
      }).lean();
      if (userToken?.token) {
        await firebaseAdmin
          .messaging()
          .sendMulticast({
            tokens: [userToken?.token],
            notification: {
              title: message.notificationInfo?.title ?? "Notification",
              body: message.notificationInfo?.highlights,
              // imageUrl: message.notificationInfo?.imageUrl,
            },
          })
          .then((data) => {
            if (data?.responses[0]?.error) {
              console.log("From firebase: ", data?.responses[0]?.error);
            }
          });
      }
    } catch (e) {
      console.error("Push notification sending failed: ", e);
    }
  };
}

export default PushNotificationControllerV1;
