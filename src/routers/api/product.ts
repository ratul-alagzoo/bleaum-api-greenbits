import * as express from "express";
import ProductController from '../controllers/productController';

class Product {
    public path="/product";
    public router = express.Router();
    productController = new ProductController();

    constructor(){
        // this.router.get(`${this.path}`, this.GetProductsBy);
        this.router.get(`${this.path}/all`, this.GetAllProducts);
        this.router.get(`${this.path}/paginated`, this.GetProductsPaginated);
        this.router.get(`${this.path}/search/`, this.SearchBYProduct);
        this.router.post(`${this.path}/missing`, this.AddMissingProduct);
        this.router.get(`${this.path}/missing`, this.GetMissingProduct);

    }

    private GetProductsBy = async(req: express.Request, res: express.Response) =>{
        if(req.query.brandID){
            let product: any = await this.productController.getProductByBrand(req.query.brandID);
            res.send(product);
        }
        else if(req.query.categoryID){
            let product: any = await this.productController.getProductByCategory(req.query.categoryID);
            res.send(product);
        }
    }

    private GetProductsPaginated = async(req: express.Request, res: express.Response) => {
        let product: any = await this.productController.getAllSelectedProducts(req.query.page);
        res.send(product);
    }

    private AddMissingProduct = async(req: express.Request, res: express.Response) =>{
        let product: any = await this.productController.addMissingProduct(req.body);
        res.send(product);
    }

    private GetMissingProduct = async(req: express.Request, res: express.Response) =>{
        let product: any = await this.productController.getMissingProduct();
        res.send(product);
    }

    private SearchBYProduct = async(req: express.Request, res: express.Response) =>{
        let product: any = await this.productController.searchByProduct(req.query.name);
        res.send(product);
    }

    private GetAllProducts = async(req: express.Request, res: express.Response) => {
        let product: any = await this.productController.getAllProducts();
        res.send(product);
    }


}

export default Product;