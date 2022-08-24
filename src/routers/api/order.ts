import OrderController from '../controllers/orderController';
import * as express from 'express';

class Order {
    public path="/order";
    public router = express.Router();
    orderController = new OrderController();

    constructor(){
        this.router.get(`${this.path}`, this.GetOrder);
        this.router.get(`${this.path}/outlet`, this.GetOrderByOutlet);
        this.router.get(`${this.path}/customer`, this.GetOrderByCustomer);
        this.router.get(`${this.path}/all`, this.GetAllOrders);
        this.router.post(`${this.path}/cancel`, this.CancelOrder);
        this.router.get(`${this.path}/search`, this.SearchOrder);
        this.router.post(`${this.path}`, this.CreateOrder);
        this.router.put(`${this.path}`, this.UpdateOrder);
    }

    private GetOrder = async(req: express.Request, res: express.Response) => {
        let order: any = await this.orderController.getOrderDetails(req.query.orderID);
        res.send(order);
    }

    private SearchOrder = async(req: express.Request, res: express.Response) =>{
        let Inventory: any = await this.orderController.searchOrder(req.query.outletID, req.query.name);
        await res.send(Inventory);
    }
    
    private UpdateOrder = async(req: express.Request, res: express.Response) => {
        let order: any = await this.orderController.updateOrder(req.query.orderID, req.body);
        res.send(order);
    }

    private GetAllOrders = async(req: express.Request, res: express.Response) => {
        let order: any = await this.orderController.getAllDay(req.query.consumerId);
        res.send(order);
    }

    private GetOrderByOutlet = async(req: express.Request, res: express.Response) => {
        let order: any = await this.orderController.getOrderByOutlet(req.query.outletID);
        res.send(order);
    }

    private GetOrderByCustomer = async(req: express.Request, res: express.Response) => {
        let orderStatus: any = await this.orderController.getorderbyCustomer(req.query.customerID);
        res.send(orderStatus);
    }

    private CreateOrder = async(req: express.Request, res: express.Response) => {
        let order: any = await this.orderController.createNewOrder(req.body);
        res.send(order)
    }

    private CancelOrder = async(req: express.Request, res: express.Response) => {
        let order: any = await this.orderController.cancelOrder(req.query.orderID);
        res.send(order)
    }

}

export default Order;