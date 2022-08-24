import InventoryController from "../controllers/inventoryController";
import * as express from "express";

class Inventory {
  public path = "/inventory";
  public router = express.Router();
  inventoryController = new InventoryController();

  constructor() {
    this.router.get(`${this.path}`, this.GetAllInventory);
    this.router.get(`${this.path}/paginated`, this.GetAllInventoryPaginated);
    // this.router.get(`${this.path}/db`, this.GetAllInventoryInDB);
    this.router.get(`${this.path}/by`, this.GetInventoryBy);
    this.router.get(`${this.path}/deal`, this.GetInventoryByDeal);
    this.router.get(`${this.path}/id`, this.GetInventoryByID);
    this.router.get(`${this.path}/popular`, this.PopularProducts);
    this.router.get(`${this.path}/trending`, this.TrendingProducts);
    this.router.get(`${this.path}/search`, this.SearchInventory);
    this.router.get(`${this.path}/featured`, this.GetFeaturedInventory);
    this.router.get(`${this.path}/lowHighPrice`, this.GetLowToHightInventory);
    this.router.post(`${this.path}/filterByBrand`, this.GetFilterByBrand);
    this.router.post(`${this.path}/filterByTNC`, this.GetFilterByTNC);
    this.router.post(`${this.path}/filter`, this.GetFilteredAll);
    this.router.put(`${this.path}`, this.UpdateProduct);
  }

  private GetInventoryByID = async (
    req: express.Request,
    res: express.Response
  ) => {
    let product: any = await this.inventoryController.getInventoryByID(
      req.query.id
    );
    res.send(product);
  };

  private GetFilteredAll = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.getFilteredAll(
      req.query.outletChainID,
      req.body
    );
    await res.send(Inventory);
  };

  // private GetAllInventoryInDB = async(req: express.Request, res: express.Response) =>{
  //     let Inventory: any = await this.inventoryController.getGrowFlowInventoryInDb();
  //     await res.send(Inventory);
  // }

  private GetFeaturedInventory = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.getFeaturedInventory(
      req.query.outletChainID
    );
    await res.send(Inventory);
  };

  private GetLowToHightInventory = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.getLowHighPrice(
      req.query.outletChainID,
      req.query.sort
    );
    await res.send(Inventory);
  };

  private UpdateProduct = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.updateFromInventory(
      req.query.productID,
      req.query.outletChainID,
      req.body
    );
    await res.send(Inventory);
  };

  private GetAllInventoryPaginated = async (
    req: express.Request,
    res: express.Response
  ) => {
    let product: any = await this.inventoryController.getAllPaginatedProducts(
      req.query.outletChainID,
      req.query.page
    );
    console.log("Inventory Data", product);
    res.send(product);
  };

  private GetInventoryBy = async (
    req: express.Request,
    res: express.Response
  ) => {
    if (req.query.brandID) {
      let product: any = await this.inventoryController.getInventoryByBrand(
        req.query.brandID,
        req.query.outletChainID,
        req.query.page
      );
      await res.send(product);
    } else if (req.query.categoryID) {
      let product: any = await this.inventoryController.getInventoryByCategory(
        req.query.categoryID,
        req.query.outletChainID,
        req.query.page
      );
      await res.send(product);
    }
  };

  private GetInventoryByDeal = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.getInventoryByDeal(
      req.query.dealID,
      req.query.outletChainID,
      req.query.page
    );
    await res.send(Inventory);
  };

  private SearchInventory = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.searchInventory(
      req.query.outletChainID,
      req.query.name
    );
    await res.send(Inventory);
  };

  private PopularProducts = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.popularInventory();
    await res.send(Inventory);
  };

  private TrendingProducts = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.trendingInventory();
    await res.send(Inventory);
  };

  private GetFilterByBrand = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.getAllFilteredBrands(
      req.query.outletChainID,
      req.body
    );
    await res.send(Inventory);
  };

  private GetFilterByTNC = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.getFilterByTNC(
      req.query.outletChainID,
      req.body
    );
    await res.send(Inventory);
  };

  private GetAllInventory = async (
    req: express.Request,
    res: express.Response
  ) => {
    let Inventory: any = await this.inventoryController.getAllOutletInventory(
      req.query.outletChainID
    );
    await res.send(Inventory);
  };
}

export default Inventory;
