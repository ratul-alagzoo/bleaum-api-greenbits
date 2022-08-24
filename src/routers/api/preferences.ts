import * as express from "express";
import PreferencesController from '../controllers/preferencesController';

class Preferences {
    public path="/preferences";
    public router = express.Router();
    preferencesController = new PreferencesController();

    constructor(){
        // this.router.get(`${this.path}`, this.GetProductsBy);
    }

}

export default Preferences;