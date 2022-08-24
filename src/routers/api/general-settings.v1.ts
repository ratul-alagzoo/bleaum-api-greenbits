import * as express from "express";
import {
  IUpsertBasicInfo,
  upsertBasicInfoSchema,
} from "../../dtos/general-settings/v1/basic-info-page";
import {
  getMediaSchema,
  IUpsertMedia,
  upsertMediaSchema,
} from "../../dtos/general-settings/v1/media-page";
import {
  IUpsertNotificationSettings,
  upsertNotificationSettingsSchema,
} from "../../dtos/general-settings/v1/notification-settings";
import {
  getSocialMediasSchema,
  IUpsertSocialLinks,
  upsertSocialLinksSchema,
} from "../../dtos/general-settings/v1/social-links-page";
import { checkIfAuthenticated } from "../../middlewares/checkIfAuthenticated.middleware";
import { validateIncomingRequest } from "../../middlewares/validateIncomingRequest.middleware";
import { IEachSocialMediaLink } from "../../models/socialLinks";
import GeneralSettingsController from "../controllers/generalSettingsController.v1";

class GeneralSettings {
  public path = "/v1/general-settings";
  public router = express.Router();
  public generalSettingsController = new GeneralSettingsController();

  constructor() {
    //media related
    this.router.patch(
      `${this.path}/media`,
      checkIfAuthenticated,
      validateIncomingRequest(upsertMediaSchema),
      this.UpsertMedia
    );

    this.router.get(
      `${this.path}/media`,
      validateIncomingRequest(getMediaSchema),
      this.GetMedia
    );

    //sociallinks related
    this.router.patch(
      `${this.path}/social-links`,
      checkIfAuthenticated,
      validateIncomingRequest(upsertSocialLinksSchema),
      this.UpsertSocialLinks
    );

    this.router.get(
      `${this.path}/social-links`,
      validateIncomingRequest(getSocialMediasSchema),
      this.GetSocialLinks
    );

    //basic-info related
    this.router.get(
      `${this.path}/basic-info`,
      validateIncomingRequest(getSocialMediasSchema),
      this.GetBasicInfo
    );
    this.router.patch(
      `${this.path}/basic-info`,
      checkIfAuthenticated,
      validateIncomingRequest(upsertBasicInfoSchema),
      this.UpsertBasicInfo
    );

    //notification-settings related
    this.router.get(
      `${this.path}/notification-settings`,
      validateIncomingRequest(getSocialMediasSchema),
      this.GetNotificationSettings
    );
    this.router.patch(
      `${this.path}/notification-settings`,
      checkIfAuthenticated,
      validateIncomingRequest(upsertNotificationSettingsSchema),
      this.UpsertNotificationSettings
    );
  }

  //media related
  private UpsertMedia = async (req: express.Request, res: express.Response) => {
    const body = req.body;
    // console.log("Outletchain id: ", (req as any)?.extracted?.outletChainID);
    let param: IUpsertMedia = {
      faviconLogoFileSource: body.faviconLogoFileSource,
      mainLogoFileSource: body.mainLogoFileSource,
      footerLogoFileSource: body.footerLogoFileSource,
      outletChainID: (req as any)?.extracted?.outletChainID as string,
    };
    let data = await this.generalSettingsController.upsertMedia(param);
    return res.status(data.statusCode).send(data.toSend);
  };

  private GetMedia = async (req: express.Request, res: express.Response) => {
    let data = await this.generalSettingsController.getMedia(
      (req as any)?.query?.outletChainID as string
    );
    return res.status(data.statusCode).send(data.toSend);
  };

  //social links related

  private UpsertSocialLinks = async (
    req: express.Request,
    res: express.Response
  ) => {
    const links = req.body?.links as IEachSocialMediaLink[];
    // console.log("Outletchain id: ", (req as any)?.extracted?.outletChainID);
    let param: IUpsertSocialLinks = {
      links,
      outletChainID: (req as any)?.extracted?.outletChainID as string,
    };
    let data = await this.generalSettingsController.upsertSocialLinks(param);
    return res.status(data.statusCode).send(data.toSend);
  };

  private GetSocialLinks = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.generalSettingsController.getSocialLinks(
      (req as any)?.query?.outletChainID as string
    );
    return res.status(data.statusCode).send(data.toSend);
  };

  //basic info related
  private GetBasicInfo = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.generalSettingsController.getBasicInfo(
      (req as any)?.query?.outletChainID as string
    );
    return res.status(data.statusCode).send(data.toSend);
  };

  private UpsertBasicInfo = async (
    req: express.Request,
    res: express.Response
  ) => {
    const body = req.body;
    // console.log("Outletchain id: ", (req as any)?.extracted?.outletChainID);
    // console.log("Body is: ", body);
    let param: IUpsertBasicInfo = {
      outletChainID: (req as any)?.extracted?.outletChainID as string,
      address: body.address,
      assessmentFee: body.assessmentFee,
      closesAt: body.closesAt,
      opensAt: body.opensAt,
      copyrightText: body.copyrightText,
      country: body.country,
      helpContact: body.helpContact,
      helpEmail: body.helpEmail,
      latitude: body.latitude,
      longitude: body.longitude,
      outletName: body.outletName,
      state: body.state,
    };
    let data = await this.generalSettingsController.upsertBasicInfo(param);
    return res.status(data.statusCode).send(data.toSend);
  };

  //notification settings related
  //basic info related
  private GetNotificationSettings = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.generalSettingsController.getNotificationSettings(
      (req as any)?.query?.outletChainID as string
    );
    return res.status(data.statusCode).send(data.toSend);
  };

  private UpsertNotificationSettings = async (
    req: express.Request,
    res: express.Response
  ) => {
    const body = req.body;

    let data = await this.generalSettingsController.upsertNotificationSettings({
      ...body,
      outletChainID: (req as any)?.extracted?.outletChainID as string,
    } as IUpsertNotificationSettings);
    return res.status(data.statusCode).send(data.toSend);
  };
}

export default GeneralSettings;
