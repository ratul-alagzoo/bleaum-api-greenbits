import UserController from "../controllers/usersController";
import * as express from "express";
// const auth = require('../../middlewares/auth');

class users {
  public path = "/user";
  public router = express.Router();
  userController = new UserController();

  constructor() {
    this.router.get(`${this.path}`, this.GetAllUsers);
    this.router.get(`${this.path}/details`, this.GetUserDetails);
    this.router.get(`${this.path}/check`, this.CheckUser);
    this.router.get(`${this.path}/checkEmail`, this.CheckEmail);
    this.router.post(`${this.path}/checkMobileNo`, this.CheckMobileNo);
    this.router.post(`${this.path}`, this.CreateNewUser);
    this.router.put(`${this.path}`, this.UpdateUser);
    this.router.delete(`${this.path}`, this.DeleteUser);
    this.router.get(`${this.path}/login`, this.LoginUser);
    this.router.get(`${this.path}/login-auth`, this.LoginAuthenticator);
    this.router.get(`${this.path}/address`, this.GetAddresses);
    this.router.get(`${this.path}/address/id`, this.GetSingleAddress);
    this.router.put(`${this.path}/address`, this.UpdateAddresses);
    this.router.patch(`${this.path}/address`, this.PatchAddresses);
    this.router.post(`${this.path}/address`, this.AddAddresses);
    this.router.delete(`${this.path}/address`, this.DeleteAddresses);
    this.router.get(`${this.path}/search`, this.SearchUser);
    this.router.get(`${this.path}/paginated`, this.GetUsersPaginated);
  }

  private GetAddresses = async (
    req: express.Request,
    res: express.Response
  ) => {
    let User: any = await this.userController.getAddress(req.query.userID);
    res.send(User);
  };

  private GetUsersPaginated = async (
    req: express.Request,
    res: express.Response
  ) => {
    let product: any = await this.userController.getAllSelectedUsers(
      req.query.page
    );
    res.send(product);
  };

  private SearchUser = async (req: express.Request, res: express.Response) => {
    let deal: any = await this.userController.searchUser(
      req.query.consumerId,
      req.query.name
    );
    res.send(deal);
  };

  private GetSingleAddress = async (
    req: express.Request,
    res: express.Response
  ) => {
    let User: any = await this.userController.getSingleAddress(
      req.query.userID,
      req.query.addressID
    );
    res.send(User);
  };

  private UpdateAddresses = async (
    req: express.Request,
    res: express.Response
  ) => {
    let User: any = await this.userController.updateAddress(
      req.query.userID,
      req.query.addressID,
      req.body
    );
    res.send(User);
  };

  private PatchAddresses = async (
    req: express.Request,
    res: express.Response
  ) => {
    let User: any = await this.userController.patchAddress(
      req.query.userID,
      req.query.addressID,
      req.body
    );
    res.send(User);
  };

  private AddAddresses = async (
    req: express.Request,
    res: express.Response
  ) => {
    let User: any = await this.userController.addAddress(
      req.query.userID,
      req.body
    );
    res.send(User);
  };

  private DeleteAddresses = async (
    req: express.Request,
    res: express.Response
  ) => {
    let User: any = await this.userController.deleteAddress(
      req.query.userID,
      req.query.addressID
    );
    res.send(User);
  };

  private GetAllUsers = async (req: express.Request, res: express.Response) => {
    let User: any = await this.userController.getAllUsers(req.query.consumerId);
    res.send(User);
  };

  private GetUserDetails = async (
    req: express.Request,
    res: express.Response
  ) => {
    let User: any = await this.userController.getUserDetails(req.query.userID);
    res.send(User);
  };

  private CreateNewUser = async (
    req: express.Request,
    res: express.Response
  ) => {
    let User: any = await this.userController.createNewUser(req.body);
    res.send(User);
  };

  private CheckUser = async (req: express.Request, res: express.Response) => {
    let User: any = await this.userController.checkUserExists(
      req.query.firebaseUID
    );
    res.send(User);
  };

  private CheckEmail = async (req: express.Request, res: express.Response) => {
    let User: any = await this.userController.checkUserEmailExists(
      req.query.email
    );
    res.send(User);
  };

  private DeleteUser = async (req: express.Request, res: express.Response) => {
    let User: any = await this.userController.deleteUser(req.query.userID);
    res.send(User);
  };

  private CheckMobileNo = async (
    req: express.Request,
    res: express.Response
  ) => {
    let User: any = await this.userController.checkUserMobileNoExists(
      req.body.mobileNo
    );
    res.send(User);
  };

  private UpdateUser = async (req: express.Request, res: express.Response) => {
    let User: any = await this.userController.updateUser(
      req.query.userID,
      req.body
    );
    res.send(User);
  };

  private LoginUser = async (req: express.Request, res: express.Response) => {
    let User: any = await this.userController.loginUserNew(req.query);
    res.send(User);
  };

  private LoginAuthenticator = async (
    req: express.Request,
    res: express.Response
  ) => {
    let User: any = await this.userController.loginUserAuthenticator(
      req.query.email
    );
    res.send(User);
  };
}

export default users;
