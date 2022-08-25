import * as express from "express";
import BannerController from "../controllers/bannerController";
import { mapClientsMiddleware } from "../../middlewares/mapClients.middleware";
class Banner {
  public path = "/banner";
  public router = express.Router();
  bannerController = new BannerController();

  constructor() {
    this.router.get(`${this.path}`, this.GetBanners);
    this.router.post(`${this.path}`, this.CreateBrand);
    this.router.put(`${this.path}`, this.UpdateBrand);
    this.router.delete(`${this.path}`, this.DeleteBrand);
    this.router.get(`${this.path}/id/`, this.GetBanner);
  }

  private GetBanners = async (req: express.Request, res: express.Response) => {
    let banner: any = await this.bannerController.getAllBanners(
      req.query.outletChainID,
      req.query?.isAdmin === "1"
    );
    await res.send(banner);
  };

  private GetBanner = async (req: express.Request, res: express.Response) => {
    let banner: any = await this.bannerController.getSingleBanner(
      req.query.bannerId
    );
    await res.send(banner);
  };

  private CreateBrand = async (req: express.Request, res: express.Response) => {
    let banner: any = await this.bannerController.createBanner(req.body);
    await res.send(banner);
  };

  private UpdateBrand = async (req: express.Request, res: express.Response) => {
    let banner: any = await this.bannerController.updateBanner(
      req.query.bannerId,
      req.body
    );
    await res.send(banner);
  };

  private DeleteBrand = async (req: express.Request, res: express.Response) => {
    let banner: any = await this.bannerController.deleteBanner(
      req.query.bannerId
    );
    await res.send(banner);
  };
}

export default Banner;
