import * as express from "express";
import { generateJWT } from "../../helpers/jwtHelper";
import OutletChainAdminController from "../controllers/outletChainAdminController";

class OutletChainAdmin {
  public path = "/oca";
  public router = express.Router();
  outletChainAdminController = new OutletChainAdminController();

  constructor() {
    this.router.post(`${this.path}/login`, this.LoginAdmin);
    this.router.get(`${this.path}`, this.GetAdmin);
    this.router.get(`${this.path}/consumer`, this.FindOutletFromConsumer);
    this.router.put(`${this.path}`, this.UpdateAdmin);
  }

  private LoginAdmin = async (req: express.Request, res: express.Response) => {
    let admin: any;
    if (!req.body.email || !req.body.password) {
      await res
        .status(400)
        .send({ Message: "Failure", data: "Email and Password is required!" });
    } else {
      admin = await this.outletChainAdminController.loginOutletChainAdmin(
        req.body
      );
    }
    if (admin?.Message === "Success" && !!admin.data?.length) {
      let toPass = admin.data.filter(
        (el: any) => el.adminEmail === req.body.email
      )[0];
      // console.log("To pass", toPass);
      let token = await generateJWT({ data: toPass });

      if (!!token) {
        res.cookie("my-token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24 * 30 * 1000,
          sameSite: "none",
        });
      }
    }
    await res.send(admin);
  };

  private FindOutletFromConsumer = async (
    req: express.Request,
    res: express.Response
  ) => {
    let admin = await this.outletChainAdminController.getOutletDetails(
      req.query.consumerId
    );
    await res.send(admin);
  };

  private GetAdmin = async (req: express.Request, res: express.Response) => {
    let admin: any = await this.outletChainAdminController.getOutletChainAdmin(
      req.query.adminID
    );
    res.send(admin);
  };

  private UpdateAdmin = async (req: express.Request, res: express.Response) => {
    let admin: any =
      await this.outletChainAdminController.updateOutletChainAdmin(
        req.query.adminID,
        req.body
      );
    res.send(admin);
  };
}

export default OutletChainAdmin;
