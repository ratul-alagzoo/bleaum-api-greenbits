import * as express from 'express';
import VerificationController from '../controllers/verificationController';

class Verification {
    public path = '/Verification';
    public router = express.Router();
    verificationController = new VerificationController();

    constructor(){
        this.router.get(`${this.path}`, this.GetVerifications);
        this.router.post(`${this.path}`, this.CreateVerification);
        this.router.put(`${this.path}`, this.UpdateVerification);
        this.router.delete(`${this.path}`, this.DeleteVerification);
        this.router.get(`${this.path}/id/`, this.GetVerification);
        this.router.get(`${this.path}/cannabisId/`, this.GetSingleVerification);
        this.router.get(`${this.path}/search/`, this.SearchByVerification);
    }

    private GetVerifications = async(req: express.Request, res: express.Response) => {
        let verification: any = await this.verificationController.getAllVerification();
        await res.send(verification);
    }

    private GetVerification = async(req: express.Request, res: express.Response) => {
        let verification: any = await this.verificationController.getOutletVerification(req.query.outletId);
        await res.send(verification);
    }

    private GetSingleVerification = async(req: express.Request, res: express.Response) => {
        let verification: any = await this.verificationController.getSingleVerification(req.query.id);
        await res.send(verification);
    }

    private SearchByVerification = async(req: express.Request, res: express.Response) =>{
        let verification: any = await this.verificationController.searchByVerification(req.query.name);
        res.send(verification);
    }

    private CreateVerification = async(req: express.Request, res: express.Response) => {
        let verification: any = await this.verificationController.createVerification(req.body);
        await res.send(verification);
    }

    private UpdateVerification = async(req: express.Request, res: express.Response) => {
        let verification: any = await this.verificationController.updateVerification(req.query.id, req.body);
        await res.send(verification);
    }

    private DeleteVerification = async(req: express.Request, res: express.Response) => {
        let verification: any = await this.verificationController.deleteVerification(req.query.verificationId);
        await res.send(verification);
    }
}

export default Verification;