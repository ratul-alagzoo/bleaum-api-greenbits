import { Types } from "mongoose";
import App from "../../app";
import {
  IGetAllAdminNotificationsPaginated,
  IGetAllNotificationsPaginated,
  INotification,
  IUpsertNotificationAdmin,
} from "../../dtos/notifications/v1/notifcations-validators";
import {
  IControllerResponse,
  IControllerResponsePaginated,
} from "../../dtos/types/controller-response.interface";
import NotificationDocument, {
  ENotificationIntent,
  ENotificationTopics,
} from "../../models/notification";
import NotificationMetaDocument from "../../models/notification-meta";
import NotificationSettingsDocument from "../../models/notification-settings";
import User from "../../models/users";
import { EVENTS } from "../../socket";
import PushNotificationControllerV1 from "./pushNotificationController.v1";

interface ISendIndividualNotification {
  intent: ENotificationIntent.INDIVIDUAL;
  outletChainId: string;
  meta: any;
  userId: string;
  highlights: string;
  topic: ENotificationTopics;
}

interface ISendAllNotfification {
  intent: ENotificationIntent.ALL;
  outletChainId: string;
  meta: any;
  topic: ENotificationTopics;
  highlights: string;
}

export const dummyNotificationResponse: INotification = {
  userId: "sample-user-id",
  isSeen: false,
  intentTo: ENotificationIntent.INDIVIDUAL,
  outletChainId: "SAMPLE_OUTLET_CHAIN_ID",
  fromAdmin: false,
  blackListedFor: { "i-have-deleted-this": true },
  seenBy: { "sample-user-id": true },
  notificationInfo: {
    title: "New Coupons Available",
    highlights: "Get 20% off on each order",
    topic: ENotificationTopics.OTHERS,
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/cannaby-firebase.appspot.com/o/images%2FHamiltons%20Circle%20Logo-High%20Res%20(2).jpg?alt=media&token=149686dc-07bd-43d8-b6bf-762ad640a8fc",
    details: "<h1>Hello World</h1>",
    meta: {},
  },
};

export const dummyNotificationResponse2: INotification = {
  userId: "sample-user-id",
  isSeen: false,
  outletChainId: "SAMPLE_OUTLET_CHAIN_ID",
  fromAdmin: false,
  intentTo: ENotificationIntent.ALL,
  blackListedFor: { "i-have-deleted-this": true },
  seenBy: { "sample-user-id": true },
  notificationInfo: {
    title: "New Coupons Available",
    highlights: "Get 20% off on each order",
    topic: ENotificationTopics.OTHERS,
    imageUrl: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    details: "<h1>Hello World</h1>",
    meta: {},
  },
};

class NotificationControllerV1 {
  outletChainId: string;
  constructor() {
    //IMPORTANT
    this.outletChainId = (process.env?.MENU_KEY ?? "NOT_FOUND") as string;
    // console.log("OutletChain id is: ", this.outletChainId);
  }

  //method for sending dummy notification
  public sendDummyNotification = async (id: string): Promise<boolean> => {
    try {
      await NotificationControllerV1.sendInAppNotifications(
        [id],
        dummyNotificationResponse
      );
      return true;
    } catch (e) {
      console.error("Socket related error happened: ", e);
      return false;
    }
  };

  //method for sending persisted dummy notification
  public sendDummyNotificationPersisted = async (
    id: string
  ): Promise<boolean> => {
    try {
      const dataToSave = await NotificationDocument(process.env.DB_NAME as string).create({
        ...dummyNotificationResponse,
        outletChainId: this.outletChainId,
        userId:
          dummyNotificationResponse.intentTo === ENotificationIntent.ALL
            ? null
            : id,
      });
      const data = await dataToSave.save();
      await NotificationControllerV1.sendInAppNotifications([id], data);
      return true;
    } catch (e) {
      console.error("Socket related error happened: ", e);
      return false;
    }
  };

  //method for getting notifications for users
  public getPaginatedNotificationsForUsers = async (
    param: IGetAllNotificationsPaginated
  ): Promise<IControllerResponsePaginated<any>> => {
    // console.log("Param is: ", param);
    const { userId, limit, page } = param;

    try {
    } catch {}
    let filters: object = {
      outletChainId: { $eq: this.outletChainId },
      [`blackListedFor.${userId}`]: {
        $exists: false,
      },
      $or: [
        { userId: { $eq: userId } },
        { intentTo: { $eq: ENotificationIntent.ALL } },
      ],
    };

    const perPage = limit ? +limit : 100;
    let currentPage = page ? +page : 1;
    let totalPages = 0;

    let sortFilters = { createdAt: -1 };
    // if (latestFirst) {
    //   sortFilters = { ...sortFilters, createdAt: +latestFirst >= 1 ? -1 : 1 };
    // }
    try {
      //check till which date we have to get notifications
      const metaData = await NotificationMetaDocument(process.env.DB_NAME as string).findOne({
        userId,
        outletChainId: this.outletChainId,
      }).lean();
      if (metaData) {
        filters = { ...filters, createdAt: { $gt: metaData.updatedAt } };
      }

      const total = await NotificationDocument(process.env.DB_NAME as string).count({ ...filters });
      totalPages = Math.ceil(total / perPage);
      //   console.log("Total pages: ", total);
      const notifications = await NotificationDocument(process.env.DB_NAME as string).find({ ...filters })
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
            notifications,
            paginationData: {
              currentPage,
              perPage,
              totalPages,
              total: total,
            },
          },
        },
      };
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: {
            notifications: [],
            paginationData: {
              currentPage: 1,
              perPage: 0,
              totalPages: 0,
              total: 0,
            },
          },
        },
      };
    }
  };

  //method for getting notifications for admin
  public getPaginatedNotificationsForAdmin = async (
    param: IGetAllAdminNotificationsPaginated
  ): Promise<IControllerResponsePaginated<any>> => {
    // console.log("Param is: ", param);
    const { outletChainId, limit, page, search } = param;
    let filters: object = {
      outletChainId: { $eq: outletChainId },
      fromAdmin: true,
    };

    const perPage = limit ? +limit : 100;
    let currentPage = page ? +page : 1;
    let totalPages = 0;

    if (!!search) {
      filters = {
        ...filters,
        "notificationInfo.title": { $regex: search, $options: "i" },
      };
    }
    let sortFilters = { createdAt: -1 };
    // if (latestFirst) {
    //   sortFilters = { ...sortFilters, createdAt: +latestFirst >= 1 ? -1 : 1 };
    // }
    try {
      const total = await NotificationDocument(process.env.DB_NAME as string).count({ ...filters });
      totalPages = Math.ceil(total / perPage);
      //   console.log("Total pages: ", total);
      const notifications = await NotificationDocument(process.env.DB_NAME as string).find({ ...filters })
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
            notifications,
            paginationData: {
              currentPage,
              perPage,
              totalPages,
              total: total,
            },
          },
        },
      };
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: {
            notifications: [],
            paginationData: {
              currentPage: 1,
              perPage: 0,
              totalPages: 0,
              total: 0,
            },
          },
        },
      };
    }
  };

  //api for deleting all notifications
  public deleteAllUsersNotification = async (
    userId: string
  ): Promise<IControllerResponse<any>> => {
    try {
      await NotificationMetaDocument(process.env.DB_NAME as string).findOneAndUpdate(
        { userId, outletChainId: this.outletChainId },
        {
          $set: {
            userId,
            outletChainId: this.outletChainId,
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
          data: {
            message: "Deleted All notifications",
          },
        },
      };
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: {
            message: "Something unexpected happened",
          },
        },
      };
    }
  };

  // api for marking as seen (only considering the latest element)
  public toggleSeen = async (
    userId: string
  ): Promise<IControllerResponse<any>> => {
    try {
      let filters: object = {
        outletChainId: { $eq: this.outletChainId },
        [`blackListedFor.${userId}`]: {
          $exists: false,
        },
        $or: [
          { userId: { $eq: userId } },
          { intentTo: { $eq: ENotificationIntent.ALL } },
        ],
      };
      const data = await NotificationDocument(process.env.DB_NAME as string).findOne(
        { ...filters },
        {},
        { sort: { createdAt: -1 } }
      ).lean();
      if (data) {
        if (data.intentTo === ENotificationIntent.ALL) {
          await NotificationDocument(process.env.DB_NAME as string).updateOne(
            {
              _id: data._id,
            },
            {
              ...data,
              seenBy: {
                ...data.seenBy,
                [userId]: true,
              },
            }
          );
        } else {
          await NotificationDocument(process.env.DB_NAME as string).updateOne(
            { _id: data._id },
            { ...data, isSeen: true }
          );
        }
        return {
          statusCode: 200,
          toSend: {
            Message: "Success",
            data: {
              message: "Marked as seen",
            },
          },
        };
      } else {
        return {
          statusCode: 200,
          toSend: {
            Message: "Success",
            data: {
              message: "Marked as seen",
            },
          },
        };
      }
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: {
            message: "Something unexpected happened",
          },
        },
      };
    }
  };

  //method for deleting a particular notification
  public deleteNotificationForParticularUser = async (params: {
    userId: string;
    notificationId: string;
  }): Promise<IControllerResponse<any>> => {
    try {
      const { userId, notificationId } = params;
      const data = await NotificationDocument(process.env.DB_NAME as string).findOne({
        _id: new Types.ObjectId(notificationId),
      }).lean();
      if (!data) {
        return {
          statusCode: 404,
          toSend: {
            Message: "Failure",
            data: {
              message: "Notification not found",
            },
          },
        };
      }
      await NotificationDocument(process.env.DB_NAME as string).updateOne(
        {
          _id: data._id,
        },
        {
          ...data,
          blackListedFor: {
            ...data.blackListedFor,
            [userId]: true,
          },
        }
      );
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
      console.error(e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: {
            message: "Something unexpected happened",
          },
        },
      };
    }
  };

  //method for deleting a particular notification from admin side
  public deleteNotificationForAdmin = async (params: {
    outletChainId: string;
    notificationId: string;
  }): Promise<IControllerResponse<any>> => {
    try {
      const { outletChainId, notificationId } = params;
      await NotificationDocument(process.env.DB_NAME as string).deleteOne({
        outletChainId,
        fromAdmin: true,
        _id: new Types.ObjectId(notificationId),
      });
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
      console.error(e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: {
            message: "Something unexpected happened",
          },
        },
      };
    }
  };

  //method for sending manual notification
  public upsertNotificationAdmin = async (
    params: IUpsertNotificationAdmin
  ): Promise<IControllerResponse<any>> => {
    try {
      const { query, body, outletChainId } = params;
      let data: any;
      if (query.notificationId) {
        data = await NotificationDocument(process.env.DB_NAME as string).findOneAndUpdate(
          { outletChainId, _id: new Types.ObjectId(query.notificationId) },
          {
            $set: {
              outletChainId,
              fromAdmin: true,
              intentTo: ENotificationIntent.ALL,
              seenBy: {},
              blackListedFor: {},
              notificationInfo: {
                title: body?.title ?? "",
                highlights: body?.highlights ?? "",
                imageUrl: body?.imageUrl ?? "",
                details: body?.details ?? "",
                topic: ENotificationTopics.OTHERS,
                mediums: {
                  viaEmail: body.viaEmail,
                  viaMobile: body.viaMobile,
                  viaSms: body.viaSms,
                  viaSystem: body.viaSystem,
                },
                meta: {},
              },
            },
          },
          {
            upsert: true,
            new: true,
          }
        );
      } else {
        const dataToSave = await NotificationDocument(process.env.DB_NAME as string).create({
          outletChainId,
          fromAdmin: true,
          intentTo: ENotificationIntent.ALL,
          seenBy: {},
          blackListedFor: {},
          notificationInfo: {
            title: body?.title ?? "",
            highlights: body?.highlights ?? "",
            imageUrl: body?.imageUrl ?? "",
            details: body?.details ?? "",
            topic: ENotificationTopics.OTHERS,
            mediums: {
              viaEmail: body.viaEmail,
              viaMobile: body.viaMobile,
              viaSms: body.viaSms,
              viaSystem: body.viaSystem,
            },
            meta: {},
          },
        });

        data = await dataToSave.save();
      }

      //send via system
      if (data?.notificationInfo?.mediums?.viaSystem) {
        NotificationControllerV1.sendInAppNotificationsToAllUsers(
          data,
          outletChainId
        )
          .then(() => console.log("Successfully sent notifications via system"))
          .catch((e) =>
            console.error("Error in sending in app notifications: ", e)
          );
      }

      //send via mobile
      if (data?.notificationInfo?.mediums?.viaMobile) {
        PushNotificationControllerV1.sendPushNotificationsToAllUsers(
          data,
          outletChainId
        )
          .then(() => console.log("Successfully sent notifications via mobile"))
          .catch((e) =>
            console.error("Error in sending push notifications: ", e)
          );
      }

      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data: {
            message: "Updated",
            data,
          },
        },
      };
    } catch (e) {
      console.error(e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: {
            message: "Something unexpected happened",
          },
        },
      };
    }
  };

  public static sendInAppNotificationsToAllUsers = async (
    message: INotification,
    outletChainID: string
  ) => {
    try {
      //TO DO add outletchainIds here
      const dbUsers = await User(process.env.DB_NAME as string).find({}).lean();
      let users = dbUsers.map((obj) => {
        // console.log(obj);
        return obj.userID;
      });
      // console.log("Users are: ", users);
      await App.io.to([...users]).emit(EVENTS.RECEIVE_NOTIFICATION, message);
    } catch (e) {
      console.error("In app notification sending failed: ", e);
    }
  };

  /**
   *
   * @param message Notification object
   * @param userId ID of the user
   * @param outletChainID OutletchainId
   */
  public static sendInAppNotificationsToSpecificUser = async (
    message: INotification,
    userId: string,
    outletChainID: string
  ) => {
    try {
      await App.io.to([userId]).emit(EVENTS.RECEIVE_NOTIFICATION, message);
    } catch (e) {
      console.error("In app notification sending failed: ", e);
    }
  };

  //for testing purposes
  public static sendInAppNotifications = async (
    users: string[],
    message: INotification
  ) => {
    try {
      await App.io.to([...users]).emit(EVENTS.RECEIVE_NOTIFICATION, message);
    } catch (e) {
      console.error("In app notification sending failed: ", e);
    }
  };

  public static sendTopicBasedNotification = async (
    params: ISendAllNotfification | ISendIndividualNotification
  ) => {
    try {
      if (params.intent === ENotificationIntent.ALL) {
        let notificationSettingsDocument =
          await NotificationSettingsDocument(process.env.DB_NAME as string).findOne({
            outletChainID: params.outletChainId,
          }).lean();
        if (!notificationSettingsDocument) {
          throw new Error(
            "Notification Settings not found in DB with this outletChainID in notificationController"
          );
        }
        const nTopiInfo =
          notificationSettingsDocument?.preferences[params.topic];
        let notification: INotification = {
          blackListedFor: {},
          fromAdmin: false,
          intentTo: params.intent,
          isSeen: false,
          userId: "",
          seenBy: {},
          outletChainId: params.outletChainId,
          notificationInfo: {
            highlights: `${nTopiInfo?.messages?.particularUser ?? ""} ${
              params.highlights
            }`,
            title: nTopiInfo?.displayName,
            meta: params.meta,
            topic: params.topic,
            details: "",
            imageUrl: "",
            adminMessage: nTopiInfo?.messages?.adminSite ?? "",
          },
        };
        // console.log("Notification to save: ", params.meta);
        let dataToSave = await NotificationDocument(process.env.DB_NAME as string).create(notification);

        let data = await dataToSave.save();
        // console.log("Notification inserted");
        const mediums =
          notificationSettingsDocument?.preferences[params.topic]?.mediums;
        if (mediums?.system) {
          NotificationControllerV1.sendInAppNotificationsToAllUsers(
            data,
            params.outletChainId
          );
        }
        if (mediums?.mobile) {
          PushNotificationControllerV1.sendPushNotificationsToAllUsers(
            data,
            params.outletChainId
          );
        }
      } else if (params.intent === ENotificationIntent.INDIVIDUAL) {
        let notificationSettingsDocument =
          await NotificationSettingsDocument(process.env.DB_NAME as string).findOne({
            outletChainID: params.outletChainId,
          }).lean();
        if (!notificationSettingsDocument) {
          throw new Error(
            "Notification Settings not found in DB with this outletChainID in notificationController"
          );
        }
        const nTopiInfo =
          notificationSettingsDocument?.preferences[params.topic];
        let notification: INotification = {
          blackListedFor: {},
          fromAdmin: false,
          intentTo: params.intent,
          isSeen: false,
          userId: params.userId,
          seenBy: {},
          outletChainId: params.outletChainId,
          notificationInfo: {
            highlights: `${nTopiInfo?.messages?.particularUser ?? ""} ${
              params.highlights
            }`,
            title: nTopiInfo?.displayName,
            meta: params.meta,
            topic: params.topic,
            details: "",
            imageUrl: "",
            adminMessage: nTopiInfo?.messages?.adminSite ?? "",
          },
        };
        // console.log("Notification to save: ", params.meta);
        let dataToSave = await NotificationDocument(process.env.DB_NAME as string).create(notification);

        let data = await dataToSave.save();
        // console.log("Notification inserted");
        const mediums =
          notificationSettingsDocument?.preferences[params.topic]?.mediums;
        if (mediums?.system) {
          NotificationControllerV1.sendInAppNotificationsToSpecificUser(
            data,
            params?.userId,
            params.outletChainId
          );
        }
        if (mediums?.mobile) {
          PushNotificationControllerV1.sendPushNotificationsToSpecificUser(
            data,
            params?.userId,
            params.outletChainId
          );
        }
      }
    } catch (e) {
      console.error(
        "Something expected happenned in notification controller: ",
        e
      );
    }
  };
}

export default NotificationControllerV1;
