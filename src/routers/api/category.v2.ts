import CategoryController from "../controllers/categoriesController.v2";
import * as express from "express";
import { validateIncomingRequest } from "../../middlewares/validateIncomingRequest.middleware";
import {
  getAllCategoriesSchema,
  IGetAllCategoriesPaginated,
} from "../../dtos/categories/v2/get-all-categories";

class CategoryV2 {
  public path = "/v2/admin/categories";
  public router = express.Router();
  categoryController = new CategoryController();

  constructor() {
    this.router.get(
      `${this.path}/paginated`,
      validateIncomingRequest(getAllCategoriesSchema),
      this.GetAllCategoriesPaginated
    );
  }

  private GetAllCategoriesPaginated = async (
    req: express.Request,
    res: express.Response
  ) => {
    let queryData = {
      ...req.query,
    };
    let data = await this.categoryController.getAllPaginatedCategories(
      queryData as IGetAllCategoriesPaginated
    );
    return res.status(data.statusCode).send(data.toSend);
  };
}

export default CategoryV2;
