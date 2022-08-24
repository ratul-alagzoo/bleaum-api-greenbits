import * as express from "express";
import PointsController from "../controllers/loyaltyPointsController";

class Points {
  public path = "/loyaltyPoints";
  public router = express.Router();
  pointsController = new PointsController();

  constructor() {
    this.router.get(`${this.path}`, this.GetPoints);
    this.router.post(`${this.path}`, this.CreatePoints);
    this.router.put(`${this.path}`, this.UpdatePoints);
    this.router.delete(`${this.path}`, this.DeletePoints);
    this.router.get(`${this.path}/id/`, this.GetSinglePoints);
    this.router.put(`${this.path}/earn/`, this.EarnPoints);
  }

  private GetPoints = async (req: express.Request, res: express.Response) => {
    let points: any = await this.pointsController.getAllPoints();
    await res.send(points);
  };

  private GetSinglePoints = async (
    req: express.Request,
    res: express.Response
  ) => {
    let points: any = await this.pointsController.getSingleUserPoints(
      req.query.userID,
      req.query.outletID
    );
    await res.send(points);
  };

  private UpdatePoints = async (
    req: express.Request,
    res: express.Response
  ) => {
    let points: any = await this.pointsController.updatePoints(
      req.query.userID,
      req.body,
      req.query.outletID
    );
    await res.send(points);
  };

  private EarnPoints = async (req: express.Request, res: express.Response) => {
    let points: any = await this.pointsController.earnPoints(
      req.query.userID,
      req.query.outletID,
      req.body
    );
    await res.send(points);
  };

  private DeletePoints = async (
    req: express.Request,
    res: express.Response
  ) => {
    let points: any = await this.pointsController.deletePoints(
      req.query.outletID,
      req.query.pointsID
    );
    await res.send(points);
  };

  private CreatePoints = async (
    req: express.Request,
    res: express.Response
  ) => {
    let points: any = await this.pointsController.createPoints(
      req.body,
      req.query.outletID
    );
    await res.send(points);
  };
}

export default Points;
