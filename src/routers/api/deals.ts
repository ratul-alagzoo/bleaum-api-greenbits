import * as express from 'express';
import DealsController from '../controllers/dealsController';

class Deal {
    public path = '/deal';
    public router = express.Router();
    dealController = new DealsController();

    constructor(){
        this.router.get(`${this.path}/all`, this.GetDeals);
        this.router.get(`${this.path}`, this.GetSingleDeal);
        this.router.get(`${this.path}/outlet`, this.GetOutletDeal);
        this.router.get(`${this.path}/search`, this.SearchDeal);
        this.router.post(`${this.path}`, this.CreateNewDeal);
        this.router.put(`${this.path}`, this.UpdateDeal);
        this.router.delete(`${this.path}`, this.DeleteDeal);
    }

    private GetDeals = async(req: express.Request, res: express.Response) => {
        let deal: any = await this.dealController.getAllDeals(req.query.consumerId);
        res.send(deal);
    }

    private SearchDeal = async(req: express.Request, res: express.Response) => {
        let deal: any = await this.dealController.searchDeals(req.query.consumerId, req.query.name);
        res.send(deal);
    }

    private GetSingleDeal = async(req: express.Request, res: express.Response) => {
        let deal: any = await this.dealController.getSingleDeal(req.query.dealId);
        res.send(deal);
    }

    private GetOutletDeal = async(req: express.Request, res: express.Response) => {
        let coupon: any = await this.dealController.getOutletDeal(req.query.consumerId, req.query.outletChainID);
        res.send(coupon);
    }

    private CreateNewDeal = async(req: express.Request, res: express.Response) => {
        let deal: any = await this.dealController.createDeal(req.body);
        res.send(deal);
    }

    private UpdateDeal = async(req: express.Request, res: express.Response) => {
        let deal: any = await this.dealController.updateDeal(req.query.dealId, req.body);
        res.send(deal);
    }

    private DeleteDeal = async(req: express.Request, res: express.Response) => {
        let deal: any = await this.dealController.deleteDeal(req.query.dealId);
        res.send(deal);
    }
}

export default Deal;