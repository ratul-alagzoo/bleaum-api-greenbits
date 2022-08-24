import * as express from 'express';
import MembershipController from '../controllers/membershipController';

class Membership {
    public path = '/membership';
    public router = express.Router();
    membershipController = new MembershipController();

    constructor(){
        this.router.get(`${this.path}`, this.GetMemberships);
        this.router.get(`${this.path}/single`, this.GetSingleMembership);
        this.router.post(`${this.path}`, this.CreateNewMembership);
        this.router.put(`${this.path}`, this.UpdateMembership);
    }

    private GetMemberships = async(req: express.Request, res: express.Response) => {
        let membership: any = await this.membershipController.getAllMemberships(req.query.consumerID);
        res.send(membership);
    }

    private GetSingleMembership = async(req: express.Request, res: express.Response) => {
        let membership: any = await this.membershipController.getSingleMembership(req.query.membershipID);
        res.send(membership);
    }

    private UpdateMembership = async(req: express.Request, res: express.Response) => {
        let membership: any = await this.membershipController.updateMembership(req.query.membershipID, req.body);
        res.send(membership);
    }

    private CreateNewMembership = async(req: express.Request, res: express.Response) => {
        let membership: any = await this.membershipController.createNewMembership(req.body);
        res.send(membership);
    }
}

export default Membership;