import * as express from 'express';
import CartController from '../controllers/cartController';

class Cart {
    public path = '/cart';
    public router = express.Router();
    cartController = new CartController();

    constructor(){
        this.router.post(`${this.path}`, this.StoreCart);
        this.router.post(`${this.path}/product`, this.AddProductToCart);
        this.router.put(`${this.path}/product`, this.UpdateProductFromCart);
        this.router.delete(`${this.path}`, this.DeleteCart);
        this.router.delete(`${this.path}/all`, this.DeleteWholeCart);
        this.router.get(`${this.path}`, this.GetCart);
    }

    private StoreCart = async(req: express.Request, res: express.Response) => {
        let cart: any = await this.cartController.storecart(req.body);
        res.send(cart);
    }

    private DeleteCart = async(req: express.Request, res: express.Response) => {
        let cart: any = await this.cartController.deleteCart(req.query.customerId, req.query.productID);
        res.send(cart);
    }

    private DeleteWholeCart = async(req: express.Request, res: express.Response) => {
        let cart: any = await this.cartController.deleteWholeCart(req.query.cartId);
        res.send(cart);
    }

    private AddProductToCart = async(req: express.Request, res: express.Response) => {
        let cart: any = await this.cartController.addProductToCart(req.query.customerId, req.body);
        res.send(cart);
    }
    
    private UpdateProductFromCart = async(req: express.Request, res: express.Response) => {
        let cart: any = await this.cartController.updatePatchCart(req.query.customerId, req.query.productID, req.body);
        res.send(cart);
    }

    private GetCart = async(req: express.Request, res: express.Response) => {
        let cart: any = await this.cartController.getCart(req.query.customerId);
        res.send(cart);
    }
}

export default Cart;
