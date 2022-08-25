import { IUpsertBasicInfo } from "../../dtos/general-settings/v1/basic-info-page";
import { IUpsertMedia } from "../../dtos/general-settings/v1/media-page";
import {
  eachNotificationTypeSchama,
  IUpsertNotificationSettings,
} from "../../dtos/general-settings/v1/notification-settings";
import { IUpsertSocialLinks } from "../../dtos/general-settings/v1/social-links-page";
import { IControllerResponse } from "../../dtos/types/controller-response.interface";
import MediaDocument from "../../models/media";
import { ENotificationTopics } from "../../models/notification";
import NotificationSettingsDocument, {
  initialNotificationSettingsData,
} from "../../models/notification-settings";
import OutletChainAdmin from "../../models/outletChainAdmin";
import SocialLinksDocument from "../../models/socialLinks";

const initialBasicInfo = {
  outletName: "",
  opensAt: new Date().setHours(8),
  closesAt: new Date().setHours(11),
  location: {
    type: "Point",
    coordinates: [0, 0],
  },
  copyrightText: "Copyright",
  assessmentFee: 0,
  helpEmail: "",
  helpContact: "",
  country: "",
  state: "",
  address: "",
};

class GeneralSettingsController {
  constructor() {}

  //media related
  public upsertMedia = async (
    param: IUpsertMedia
  ): Promise<IControllerResponse<any>> => {
    try {
      let {
        outletChainID,
        faviconLogoFileSource,
        footerLogoFileSource,
        mainLogoFileSource,
      } = param;
      let data = await MediaDocument(process.env.DB_NAME as string).findOneAndUpdate(
        { outletChainID: outletChainID },
        {
          $set: {
            outletChainID,
            faviconLogoFileSource: faviconLogoFileSource ?? "",
            footerLogoFileSource: footerLogoFileSource ?? "",
            mainLogoFileSource: mainLogoFileSource ?? "",
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
      console.error("Error", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  public getMedia = async (
    outletChainID: string
  ): Promise<IControllerResponse<any>> => {
    try {
      let data = await MediaDocument(process.env.DB_NAME as string).findOne({
        outletChainID,
      });

      if (!data) {
        data = await this.insertInitialData(outletChainID);
      }
      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data,
        },
      };
    } catch (e) {
      console.error("Error", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  //insert initial data ---> seeding purpose
  private insertInitialData = async (outletChainID: string) => {
    let data = await MediaDocument(process.env.DB_NAME as string).create({
      outletChainID,
      faviconLogoFileSource: "",
      mainLogoFileSource: "",
      footerLogoFileSource: "",
    });

    return await data.save();
  };

  //social links related
  public upsertSocialLinks = async (
    param: IUpsertSocialLinks
  ): Promise<IControllerResponse<any>> => {
    try {
      let { outletChainID, links } = param;
      let data = await SocialLinksDocument(process.env.DB_NAME as string).findOneAndUpdate(
        { outletChainID: outletChainID },
        {
          $set: {
            outletChainID,
            links,
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
      console.error("Error", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  public getSocialLinks = async (
    outletChainID: string
  ): Promise<IControllerResponse<any>> => {
    try {
      let data = await SocialLinksDocument(process.env.DB_NAME as string).findOne({
        outletChainID,
      });
      //avoid 404
      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data: data ?? {
            outletChainID,
            links: [],
          },
        },
      };
    } catch (e) {
      console.error("Error", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  //basic info related
  public getBasicInfo = async (outletChainID: string) => {
    try {
      let data = await OutletChainAdmin(process.env.DB_NAME as string).findOne({
        outletChainID,
      }).lean();
      if (!data) {
        return {
          statusCode: 404,
          toSend: {
            Message: "Failure",
            data: null,
          },
        };
      }
      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data: {
            ...initialBasicInfo,
            ...data,
          },
        },
      };
    } catch (e) {
      console.error("Error", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };
  public upsertBasicInfo = async (
    param: IUpsertBasicInfo
  ): Promise<IControllerResponse<any>> => {
    try {
      let { outletChainID, latitude, longitude, ...others } = param;
      // console.log("Others is: ", others);
      let data = await OutletChainAdmin(process.env.DB_NAME as string).findOneAndUpdate(
        { outletChainID: outletChainID },
        {
          $set: {
            outletChainID,
            ...others,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          },
        },
        {
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
      console.error("Error", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  //notificationsettings related
  public upsertNotificationSettings = async (
    param: IUpsertNotificationSettings
  ): Promise<IControllerResponse<any>> => {
    try {
      let { outletChainID, preferences } = param;
      let passedKeys = Object.keys(param.preferences);
      let allowedKeys = Object.keys(initialNotificationSettingsData);

      let processedKeys: string[] = [];

      for (let i = 0; i < passedKeys.length; i++) {
        let key = passedKeys[i];
        //sanity check
        if (processedKeys.includes(key)) {
          return {
            statusCode: 400,
            toSend: {
              Message: "Failure",
              data: "Contains duplicate data",
            },
          };
        }
        if (allowedKeys.includes(key)) {
          try {
            //@ts-ignore
            await eachNotificationTypeSchama.validate(preferences[key]);
          } catch (e) {
            return {
              statusCode: 400,
              toSend: {
                Message: "Failure",
                data: "Contains illegal data",
              },
            };
          }
        } else {
          return {
            statusCode: 400,
            toSend: {
              Message: "Failure",
              data: "Contains illegal data",
            },
          };
        }
        processedKeys.push(key);
      }

      let previousData = await NotificationSettingsDocument(process.env.DB_NAME as string).findOne({
        outletChainID,
      }).lean();
      let data:any;
      if (previousData) {
        const toSet = {
          ...initialNotificationSettingsData,
          ...previousData.preferences,
          ...preferences,
        };
        console.log("To Set", toSet);
        data = await NotificationSettingsDocument(process.env.DB_NAME as string).findOneAndUpdate(
          { outletChainID },
          {
            $set: {
              outletChainID,
              preferences: toSet,
            },
          },
          { new: true, upsert: true }
        );
      } else {
        data = await NotificationSettingsDocument(process.env.DB_NAME as string).create({
          outletChainID,
          preferences: {
            ...initialNotificationSettingsData,
            ...preferences,
          },
        });
      }
      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data,
        },
      };
    } catch (e) {
      console.error("Error", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  public getNotificationSettings = async (
    outletChainID: string
  ): Promise<IControllerResponse<any>> => {
    try {
      let data = await NotificationSettingsDocument(process.env.DB_NAME as string).findOne({
        outletChainID,
      });

      if (!data) {
        data = await this.insertInitialNotificationSettingsData(outletChainID);
        // console.log("Data is: ", data);
      }
      return {
        statusCode: 200,
        toSend: {
          Message: "Success",
          data,
        },
      };
    } catch (e) {
      console.error("Error", e);
      return {
        statusCode: 500,
        toSend: {
          Message: "Failure",
          data: null,
        },
      };
    }
  };

  //insert initial data ---> seeding purpose
  private insertInitialNotificationSettingsData = async (
    outletChainID: string
  ) => {
    let data = await NotificationSettingsDocument(process.env.DB_NAME as string).create({
      outletChainID,
      preferences: initialNotificationSettingsData,
    });

    return await data.save();
  };
}

export default GeneralSettingsController;
