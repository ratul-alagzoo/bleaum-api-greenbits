import * as express from "express";
import LoyaltyController from "../controllers/loyaltyController";

class Loyalty {
  public path = "/loyalty";
  public router = express.Router();
  calanderController = new LoyaltyController();

  constructor() {
    this.router.get(`${this.path}`, this.GetLoyalty);
    this.router.post(`${this.path}`, this.CreateLoyalty);
    this.router.put(`${this.path}`, this.UpdateLoyalty);
    this.router.put(`${this.path}/calander/`, this.UpdateLoyaltyDate);
    // this.router.delete(`${this.path}`, this.DeleteLoyalty);
  }

  private GetLoyalty = async (req: express.Request, res: express.Response) => {
    let points: any = await this.calanderController.getAllLoyalty(
      req.query.consumerId
    );
    await res.send(points);
  };

  private UpdateLoyalty = async (
    req: express.Request,
    res: express.Response
  ) => {
    let points: any = await this.calanderController.updateLoyalty(
      req.query.loyaltyID,
      req.query.consumerId,
      req.body
    );
    await res.send(points);
  };

  private UpdateLoyaltyDate = async (
    req: express.Request,
    res: express.Response
  ) => {
    let points: any = await this.calanderController.updateLoyaltyDate(
      req.query.day,
      req.query.loyaltyID,
      req.query.consumerId,
      req.body
    );
    await res.send(points);
  };

  private CreateLoyalty = async (
    req: express.Request,
    res: express.Response
  ) => {
    let points: any = await this.calanderController.createLoyalty(req.body);
    await res.send(points);
  };
}

export default Loyalty;
//   private GetSingleLoyalty = async (
//     req: express.Request,
//     res: express.Response
//   ) => {
//     let points: any = await this.calanderController.getSingleUserLoyalty(
//       req.query.userID
//     );
//     await res.send(points);
//   };

//   private DeleteLoyalty = async (
//     req: express.Request,
//     res: express.Response
//   ) => {
//     let points: any = await this.calanderController.deleteLoyalty(
//       req.query.pointsId
//     );
//     await res.send(points);
//   };
