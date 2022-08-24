import * as express from "express";
import notificationController from "../controllers/notificationController";

class notification {
  public path = "/notification";
  public router = express.Router();
  notificationController = new notificationController();

  constructor() {
    this.router.get(`${this.path}`, this.GetNotifications);
    this.router.post(`${this.path}`, this.CreateNotification);
  }

  private GetNotifications = async (
    req: express.Request,
    res: express.Response
  ) => {
    let notification: any = await this.notificationController.getNotification();
    await res.send(notification);
  };
  private CreateNotification = async (
    req: express.Request,
    res: express.Response
  ) => {
    let page: any = await this.notificationController.createNotification(
      req.body
    );
    await res.send(page);
  };
}

export default notification;
