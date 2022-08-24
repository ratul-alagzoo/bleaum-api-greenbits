import * as express from 'express';
import OutletChainController from '../controllers/outletChainController';

class OutletChain {
    public path="/oc";
    public router= express.Router();
    outletChainController = new OutletChainController();

    constructor(){
        this.router.get(`${this.path}`, this.GetAllOutletsChains);
        this.router.get(`${this.path}/id/`, this.GetOutletChain);
        this.router.post(`${this.path}`, this.AddOutletChain);
        this.router.delete(`${this.path}`, this.DeleteOutletChain);
        this.router.put(`${this.path}`, this.UpdateOutletChain);
    }

    private GetAllOutletsChains = async(req: express.Request, res: express.Response) => {
        let outlets: any = await this.outletChainController.getAllOutletChains(req.query.consumerId);
        res.send(outlets);
    }

    private GetOutletChain = async(req: express.Request, res: express.Response) => {
        let outlets: any = await this.outletChainController.getOutletChain(req.query.outletChainID);
        res.send(outlets);
    }

    private AddOutletChain = async(req: express.Request, res: express.Response) => {
        let outlets: any = await this.outletChainController.addOutletChain(req.body);
        res.send(outlets);
    }

    private DeleteOutletChain = async(req: express.Request, res: express.Response) => {
        let outlets: any = await this.outletChainController.deleteOutletChain(req.query.outletChainID);
        res.send(outlets);
    }

    private UpdateOutletChain = async(req: express.Request, res: express.Response) => {
        let outlets: any = await this.outletChainController.updateOutletChain(req.query.outletChainID, req.body);
        res.send(outlets);
    }
}

export default OutletChain;