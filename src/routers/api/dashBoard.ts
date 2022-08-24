import * as express from 'express';
import DashBoardController from '../controllers/dashBoardController';

class Dashboard {
    public path = '/dashboard';
    public router = express.Router();
    dashBoardController = new DashBoardController();

    constructor(){
        this.router.get(`${this.path}`, this.GetDashboard);
    }

    private GetDashboard = async(req: express.Request, res: express.Response) => {
        let dashboard: any = await this.dashBoardController.getDashboardDetails();
        await res.send(dashboard);
    }
}

export default Dashboard;