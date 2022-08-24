import * as express from 'express';
import PageController from '../controllers/pageController';

class Page {
    public path = '/Page';
    public router = express.Router();
    pageController = new PageController();

    constructor(){
        this.router.get(`${this.path}`, this.GetPages);
        this.router.post(`${this.path}`, this.CreatePage);
        this.router.put(`${this.path}`, this.UpdatePage);
        this.router.delete(`${this.path}`, this.DeletePage);
        this.router.get(`${this.path}/id`, this.GetPage);
        this.router.get(`${this.path}/outletId`, this.GetAllOutletPages);
    }

    private GetPages = async(req: express.Request, res: express.Response) => {
        let page: any = await this.pageController.getAllPage();
        await res.send(page);
    }

    private GetPage = async(req: express.Request, res: express.Response) => {
        let page: any = await this.pageController.getSinglePage(req.query.id, req.query.page);
        await res.send(page);
    }

    private GetAllOutletPages = async(req: express.Request, res: express.Response) => {
        let page: any = await this.pageController.getAllOutletPages(req.query.id);
        await res.send(page);
    }

    private CreatePage = async(req: express.Request, res: express.Response) => {
        let page: any = await this.pageController.createPage(req.body);
        await res.send(page);
    }

    private UpdatePage = async(req: express.Request, res: express.Response) => {
        let page: any = await this.pageController.updatePage(req.query.id, req.query.page, req.body);
        await res.send(page);
    }

    private DeletePage = async(req: express.Request, res: express.Response) => {
        let page: any = await this.pageController.deletePage(req.query.pageId);
        await res.send(page);
    }
}

export default Page;