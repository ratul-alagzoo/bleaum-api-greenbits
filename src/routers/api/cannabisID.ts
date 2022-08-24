import * as express from 'express';
import CannabisController from '../controllers/cannabisIDController';

class Cannabis {
    public path = '/cannabisid';
    public router = express.Router();
    cannabisController = new CannabisController();

    constructor(){
        this.router.post(`${this.path}`, this.CreateCannabis);
        this.router.put(`${this.path}`, this.UpdateCannabis);
        this.router.delete(`${this.path}`, this.DeleteCannabis);
        this.router.get(`${this.path}/id/`, this.GetCannabis);
        this.router.get(`${this.path}/outletId/`, this.GetAllOutletCannabis);
        this.router.get(`${this.path}/paginated/`, this.GetPaginatedCannabis);
    }


    private GetCannabis = async(req: express.Request, res: express.Response) => {
        let Cannabis: any = await this.cannabisController.getSingleCannabis(req.query.cannabisId);
        await res.send(Cannabis);
    }


    private GetAllOutletCannabis = async(req: express.Request, res: express.Response) => {
        let Cannabis: any = await this.cannabisController.getAllOutletCannabis(req.query.id);
        await res.send(Cannabis);
    }


    private GetPaginatedCannabis = async (req: express.Request, res: express.Response) =>{
        let Cannabis: any = await this.cannabisController.getPaginatedCannabis(req.query.page)
        await res.send(Cannabis);
    }

    private CreateCannabis = async(req: express.Request, res: express.Response) => {
        let Cannabis: any = await this.cannabisController.createCannabis(req.body);
        await res.send(Cannabis);
    }

    private UpdateCannabis = async(req: express.Request, res: express.Response) => {
        let Cannabis: any = await this.cannabisController.updateCannabis(req.query.cannabisId, req.body);
        await res.send(Cannabis);
    }

    private DeleteCannabis = async(req: express.Request, res: express.Response) => {
        let Cannabis: any = await this.cannabisController.deleteCannabis(req.query.cannabisId);
        await res.send(Cannabis);
    }
}

export default Cannabis;