import UserController from "../controllers/usersController.v2";
import * as express from "express";
import { validateIncomingRequest } from "../../middlewares/validateIncomingRequest.middleware";
import {
  getAllUsersSchema,
  IGetAllUserPaginated,
} from "../../dtos/users/v2/get-all-users";
import { checkIfAuthenticated } from "../../middlewares/checkIfAuthenticated.middleware";
// const auth = require('../../middlewares/auth');

class usersV2 {
  public path = "/v2/users";
  public router = express.Router();
  userController = new UserController();

  constructor() {
    this.router.get(
      `${this.path}/paginated`,
      checkIfAuthenticated,
      validateIncomingRequest(getAllUsersSchema),
      this.GetUsersPaginated
    );
  }

  private GetUsersPaginated = async (
    req: express.Request,
    res: express.Response
  ) => {
    let queryData = {
      ...req.query,
      outletChainID: (req as any)?.extracted?.outletChainID as string,
    };
    let data = await this.userController.getPaginatedUser(
      queryData as IGetAllUserPaginated
    );
    return res.status(data.statusCode).send(data.toSend);
  };
}

export default usersV2;
