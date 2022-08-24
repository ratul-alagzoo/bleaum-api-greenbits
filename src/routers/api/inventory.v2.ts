import InventoryController from "../controllers/inventoryController.v2";
import * as express from "express";
import {
  getAllInventorySchema,
  IGetAllInventoryPaginated,
} from "../../dtos/inventory/v2/get-all-inventory";
import { checkIfAuthenticated } from "../../middlewares/checkIfAuthenticated.middleware";
import { validateIncomingRequest } from "../../middlewares/validateIncomingRequest.middleware";

/**
 * @swagger
 * tags:
 *  name: Inventory_V2
 *  description: inventory related APIs
 * */
class InventoryV2 {
  public path = "/v2/admin/inventories";
  public router = express.Router();
  inventoryController = new InventoryController();

  constructor() {
    this.router.get(
      `${this.path}/paginated`,
      checkIfAuthenticated,
      validateIncomingRequest(getAllInventorySchema),
      this.GetAllInventoriesPaginated
    );
    this.router.get(`${this.path}/thc-cbd-limits`, this.GetTHCAndCBDLimits);
  }

  private GetAllInventoriesPaginated = async (
    req: express.Request,
    res: express.Response
  ) => {
    let queryData = {
      ...req.query,
      outletChainID: (req as any)?.extracted?.outletChainID as string,
    };
    let data = await this.inventoryController.getAllPaginatedInventories(
      queryData as IGetAllInventoryPaginated
    );
    return res.status(data.statusCode).send(data.toSend);
  };

  /**
   * @swagger
   * /v2/admin/inventories/thc-cbd-limits:
   *  get:
   *      tags:
   *          - Inventory_V2
   *      summary: Get bounds in thc and cbd limits
   *      responses:
   *          '422':
   *              description: If any validation error occurs
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *          '200':
   *              description: Request process successfully
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Success'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *                                    limits:
   *                                          type: object
   *                                          properties:
   *                                              upperTHCLimit:
   *                                                    type: number
   *                                              upperCBDLimit:
   *                                                    type: number
   *                                              lowerTHCLimit:
   *                                                    type: number
   *                                              lowerCBDLimit:
   *                                                    type: number
   *          '404':
   *              description: Products not found
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *          '401':
   *              description: if unauthenticated.login and try again
   *              content:
   *                application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            Message:
   *                                 type: string
   *                                 default: 'Failure'
   *                            data:
   *                                type: object
   *                                properties:
   *                                    message:
   *                                          type: string
   *
   *
   * */
  private GetTHCAndCBDLimits = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.inventoryController.getTHCAndCBDLimits();
    return res.status(data.statusCode).send(data.toSend);
  };
}

export default InventoryV2;
