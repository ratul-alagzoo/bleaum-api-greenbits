import * as express from "express";
import {
  IUpsertDeal,
  upsertDealsSchema,
} from "../../dtos/deals/v1/deals-validator";
import { checkIfAuthenticated } from "../../middlewares/checkIfAuthenticated.middleware";
import { validateIncomingRequest } from "../../middlewares/validateIncomingRequest.middleware";
import DealsControllerV1 from "../controllers/dealsController.v1";
/**
 * @swagger
 * tags:
 *  name: DealsV1_Admin
 *  description: Refactored deals related APIS (admin only)
 * */

class DealsV1 {
  public path = "/v1/deals";
  public router = express.Router();
  dealController = new DealsControllerV1();
  constructor() {
    this.router.patch(
      `${this.path}`,
      checkIfAuthenticated,
      validateIncomingRequest(upsertDealsSchema),
      this.CreateNewDeal
    );

    this.router.get(
      `${this.path}/possible-categories`,
      this.GetCategoriesToChooseForm
    );
    this.router.get(
      `${this.path}/possible-products`,
      this.GetProductsToChooseForm
    );
    this.router.get(`${this.path}/applicable-deals`, this.GetApplicableDeals);
  }

  /**
   * @swagger
   * /v1/deals:
   *  patch:
   *      tags:
   *          - DealsV1_Admin
   *      summary: Update/Add deals
   *      requestBody:
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                            consumerId:
   *                                type: number
   *                                default: 1
   *                            neverExpires:
   *                                type: boolean,
   *                                default: false
   *                            dealId:
   *                                type: string
   *                                default: ""
   *                            startDate:
   *                                type: string
   *                                format: date
   *                            endDate:
   *                                type: string
   *                                format: date
   *                            status:
   *                                type: boolean
   *                            selectedProducts:
   *                                type: array
   *                                items:
   *                                    type: object
   *                                    properties:
   *                                            name:
   *                                                type: string
   *                                            productID:
   *                                                type: string
   *                            selectedOutlets:
   *                                type: array
   *                                items:
   *                                    type: object
   *                                    properties:
   *                                            name:
   *                                                type: string
   *                                            outletChainID:
   *                                                type: string
   *                            selectedCategories:
   *                                type: array
   *                                items:
   *                                    type: object
   *                                    properties:
   *                                            name:
   *                                                type: string
   *                                            categoryID:
   *                                                type: string
   *                            applyToAllOutlets:
   *                                  type: boolean
   *                            image:
   *                                 type: string
   *                            name:
   *                                 type: string
   *                            discountValue:
   *                                 type: string
   *
   *
   *
   *
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
  private CreateNewDeal = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.dealController.UpsertDeal({
      body: req.body as IUpsertDeal,
      outletChainID: (req as any)?.extracted?.outletChainID as string,
    });
    return res.status(data.statusCode).send(data.toSend);
  };

  /**
   * @swagger
   * /v1/deals/possible-categories:
   *  get:
   *      tags:
   *          - DealsV1_Admin
   *      summary: Get Available Categories to compose a deal
   *      parameters:
   *        - in: query
   *          name: consumerID
   *          type: number
   *          required: false
   *          description: Consumer ID
   *          default: 1
   *        - in: query
   *          name: outletChainID
   *          type: string
   *          required: false
   *          description: Outlet Chain ID
   *          default: null
   *        - in: query
   *          name: excludedDealID
   *          type: string
   *          required: false
   *          description: Deal ID to exclude
   *          default: null
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
  private GetCategoriesToChooseForm = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.dealController.GetAvailableCategories({
      outletChainID: req.query?.outletChainID
        ? (req.query.outletChainID as string)
        : undefined,
      consumerID: req.query?.consumerID ? +req.query?.consumerID : 1,
      excludedDealID: req.query?.excludedDealID
        ? (req.query.excludedDealID as string)
        : undefined,
    });
    return res.status(data.statusCode).send(data.toSend);
  };

  /**
   * @swagger
   * /v1/deals/possible-products:
   *  get:
   *      tags:
   *          - DealsV1_Admin
   *      summary: Get Available Products to compose a deal
   *      parameters:
   *        - in: query
   *          name: outletChainID
   *          type: string
   *          required: false
   *          description: Outlet Chain ID
   *          default: null
   *        - in: query
   *          name: excludedDealID
   *          type: string
   *          required: false
   *          description: Deal ID to exclude
   *          default: null
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
  private GetProductsToChooseForm = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.dealController.GetAvailableProducts({
      outletChainID: req.query?.outletChainID
        ? (req.query.outletChainID as string)
        : undefined,
      excludedDealID: req.query?.excludedDealID
        ? (req.query.excludedDealID as string)
        : undefined,
    });
    return res.status(data.statusCode).send(data.toSend);
  };

  /**
   * @swagger
   * /v1/deals/applicable-deals:
   *  get:
   *      tags:
   *          - DealsV1_Admin
   *      summary: Get Applicable deals
   *      parameters:
   *        - in: query
   *          name: outletChainID
   *          type: string
   *          required: false
   *          description: Outlet Chain ID
   *          default: null
   *        - in: query
   *          name: consumerID
   *          type: string
   *          required: false
   *          description: Consumer ID
   *          default: null
   *        - in: query
   *          name: hideDisabled
   *          type: number
   *          required: false
   *          description: Negative value for hiding disabled disabled and negative otherwise
   *          default: -1
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
  private GetApplicableDeals = async (
    req: express.Request,
    res: express.Response
  ) => {
    let data = await this.dealController.GetApplicableDeals({
      outletChainID: req.query?.outletChainID
        ? (req.query.outletChainID as string)
        : undefined,
      consumerId: req.query?.consumerID ? +req.query?.consumerID : 1,
      hideDisabled: req.query?.hideDisabled
        ? +req.query?.hideDisabled > 0
          ? 1
          : -1
        : 1,
    });
    return res.status(data.statusCode).send(data.toSend);
  };
}

export default DealsV1;
