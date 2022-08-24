import * as express from 'express';
import BrandController from '../controllers/brandController';

class Brand {
    public path = '/brand';
    public router = express.Router();
    brandController = new BrandController();

    constructor(){
        this.router.get(`${this.path}`, this.GetBrands);
        this.router.get(`${this.path}/id/`, this.GetBrand);
        this.router.get(`${this.path}/paginated/`, this.GetPaginatedBrand);
        this.router.get(`${this.path}/search/`, this.SearchByBrandName);
        this.router.put(`${this.path}`, this.UpdateBrand);

        this.router.get(`${this.path}/outlet`, this.GetBrandForOutlet);
    }

    private GetBrands = async(req: express.Request, res: express.Response) => {
        let brand: any = await this.brandController.getAllBrands();
        res.send(brand);
    }

    private SearchByBrandName = async(req: express.Request, res: express.Response) => {
        let brand: any = await this.brandController.searchByBrand(req.query.name);
        res.send(brand);
    }

    private GetBrandForOutlet = async(req: express.Request, res: express.Response) => {
        let brand: any = await this.brandController.getAllOutletBrands(req.query.OutletId);
        res.send(brand);
    }

    private GetBrand = async(req: express.Request, res: express.Response) => {
        let brand: any = await this.brandController.getSingleBrand(req.query.brandID);
        res.send(brand);
    }

    private GetPaginatedBrand = async(req: express.Request, res: express.Response) => {
        let brand: any = await this.brandController.getPaginatedBrands(req.query.page);
        res.send(brand);
    }

    private UpdateBrand = async(req: express.Request, res: express.Response) => {
        let brand: any = await this.brandController.updateBrand(req.query.brandID, req.body);
        res.send(brand);
    }
}

export default Brand;