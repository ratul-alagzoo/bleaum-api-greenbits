import * as express from 'express';
import CouponsController from '../controllers/couponsController';

class Coupon {
    public path = '/coupon';
    public router = express.Router();
    couponsController = new CouponsController();

    constructor(){
        this.router.get(`${this.path}/all`, this.GetCoupons);
        this.router.get(`${this.path}`, this.GetSingleCoupon);
        this.router.get(`${this.path}/outlet`, this.GetOutletCoupon);
        this.router.get(`${this.path}/search`, this.SearchOutletCoupon);
        this.router.post(`${this.path}`, this.CreateNewCoupon);
        this.router.put(`${this.path}`, this.UpdateCoupon);
        this.router.delete(`${this.path}`, this.DeleteCoupon);
    }

    private GetCoupons = async(req: express.Request, res: express.Response) => {
        let coupon: any = await this.couponsController.getAllCoupons(req.query.consumerId);
        res.send(coupon);
    }

    private SearchOutletCoupon = async(req: express.Request, res: express.Response) => {
        let deal: any = await this.couponsController.searchCoupons(req.query.consumerId, req.query.name);
        res.send(deal);
    }

    private GetSingleCoupon = async(req: express.Request, res: express.Response) => {
        let coupon: any = await this.couponsController.getSingleCoupon(req.query.couponCode);
        res.send(coupon);
    }

    private GetOutletCoupon = async(req: express.Request, res: express.Response) => {
        let coupon: any = await this.couponsController.getOutletCoupon(req.query.consumerId, req.query.outletChainID);
        res.send(coupon);
    }

    private CreateNewCoupon = async(req: express.Request, res: express.Response) => {
        let coupon: any = await this.couponsController.createCoupon(req.body);
        res.send(coupon);
    }

    private UpdateCoupon = async(req: express.Request, res: express.Response) => {
        let coupon: any = await this.couponsController.updateCoupon(req.query.couponId, req.body);
        res.send(coupon);
    }

    private DeleteCoupon = async(req: express.Request, res: express.Response) => {
        let coupon: any = await this.couponsController.deleteCoupon(req.query.couponId);
        res.send(coupon);
    }
}

export default Coupon;