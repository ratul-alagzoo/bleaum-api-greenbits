import WishlistController from '../controllers/wishlistController';
import * as express from 'express';

class Wishlist {
    public path="/wishlist";
    public router = express.Router();
    wishlistController = new WishlistController();

    constructor(){
        this.router.get(`${this.path}`, this.GetAllWishList);
        this.router.post(`${this.path}`, this.CreateWishList);
        this.router.put(`${this.path}`, this.UpdateWishList);
        this.router.patch(`${this.path}/product`, this.PatchWishList);
        this.router.delete(`${this.path}`, this.DeleteWishList);
        this.router.delete(`${this.path}/all`, this.DeleteAllWishList);
    }

    private GetAllWishList = async(req: express.Request, res: express.Response) => {
        let wishList: any = await this.wishlistController.getAllWishList(req.query.userID);
        res.send(wishList);
    }

    private CreateWishList = async(req: express.Request, res: express.Response) => {
        let wishList: any = await this.wishlistController.createNewWishList(req.body);
        res.send(wishList);
    }

    private UpdateWishList = async(req: express.Request, res: express.Response) => {
        let wishList: any = await this.wishlistController.updateWishList(req.query.userID, req.body);
        res.send(wishList);
    }

    private PatchWishList = async(req: express.Request, res: express.Response) => {
        let wishList: any = await this.wishlistController.patchWishList(req.query.userID, req.query.wishlistID, req.body);
        res.send(wishList);
    }
    
    private DeleteWishList = async(req: express.Request, res: express.Response) => {
        let wishList: any = await this.wishlistController.deleteWishList(req.query.wishlistID);
        res.send(wishList);
    }

    private DeleteAllWishList = async(req: express.Request, res: express.Response) => {
        let wishList: any = await this.wishlistController.deleteAllWishList(req.query.userID);
        res.send(wishList);
    }
}

export default Wishlist;
