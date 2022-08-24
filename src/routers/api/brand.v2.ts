import BrandController from "../controllers/brandController.v2";
import * as express from "express";
import { validateIncomingRequest } from "../../middlewares/validateIncomingRequest.middleware";
import {
  getAllManufacturesSchema,
  IGetAllManufacturersPaginated,
} from "../../dtos/manufactures/v2/get-all-manufacturers";

class BrandV2 {
  public path = "/v2/admin/brands";
  public router = express.Router();
  brandController = new BrandController();

  constructor() {
    this.router.get(
      `${this.path}/paginated`,
      validateIncomingRequest(getAllManufacturesSchema),
      this.GetAllBrandsPaginated
    );
  }

  private GetAllBrandsPaginated = async (
    req: express.Request,
    res: express.Response
  ) => {
    let queryData = {
      ...req.query,
    };
    let data = await this.brandController.getAllPaginatedBrands(
      queryData as IGetAllManufacturersPaginated
    );
    return res.status(data.statusCode).send(data.toSend);
  };
}

export default BrandV2;
