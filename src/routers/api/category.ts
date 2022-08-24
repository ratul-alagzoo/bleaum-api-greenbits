import * as express from 'express';
import CategoryController from '../controllers/categoryController';

class Category {
    public path = '/category';
    public router = express.Router();
    categoryController = new CategoryController();

    constructor(){
        this.router.get(`${this.path}`, this.GetCategories);
        this.router.get(`${this.path}/paginated/`, this.GetPaginatedCategories);
        this.router.get(`${this.path}/id`, this.GetSingleCategory);
        this.router.get(`${this.path}/search/`, this.SearchByCategoryName);
        this.router.put(`${this.path}`, this.UpdateCategory);
        this.router.get(`${this.path}/outlet`, this.GetCategoriesForOutlet);

    }

    private GetCategories = async(req: express.Request, res: express.Response) => {
        let category: any = await this.categoryController.getAllCategories();
        res.send(category);
    }

    private SearchByCategoryName = async(req: express.Request, res: express.Response) => {
        let category: any = await this.categoryController.searchByCategory(req.query.name);
        res.send(category);
    }

    private GetCategoriesForOutlet = async(req: express.Request, res: express.Response) => {
        let category: any = await this.categoryController.getAllCategoriesOutlet(req.query.OutletId);
        await res.send(category);
    }

    private GetPaginatedCategories = async(req: express.Request, res: express.Response) => {
        let brand: any = await this.categoryController.getPaginatedCategories(req.query.page);
        res.send(brand);
    }

    private GetSingleCategory = async(req: express.Request, res: express.Response) => {
        let category: any = await this.categoryController.getSingleCategory(req.query.categoryID);
        res.send(category);
    }
    
    private UpdateCategory = async(req: express.Request, res: express.Response) => {
        let category: any = await this.categoryController.updateCategory(req.query.categoryID, req.body);
        res.send(category);
    }
}

export default Category;