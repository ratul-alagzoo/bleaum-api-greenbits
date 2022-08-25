import Brand from "../../models/brand";
import { nanoid } from "nanoid";
import Product from "../../models/products";

class BrandController {
    constructor() {}

    public getAllBrands = async() => {
        let returnData = {};
        await Brand(process.env.DB_NAME as string).find().then(async (res:any) => {
            if(!res){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Brand'
                }
            }
            else{
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        }).catch(e => console.log(e));
        return await returnData;
    }

    public getPaginatedBrands = async(Page: any) => {
        let returnData = {};
        const resultsPerPage = 30;
        let page = Page >= 1 ? Page : 1;
        page = page - 1;
        await Brand(process.env.DB_NAME as string).find()
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .then(async (res:any) => {
            if(!res){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Brand'
                }
            }
            else{
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        }).catch(e => console.log(e));
        return await returnData;
    }

    public searchByBrand = async(Name: any) => {
        let returnData = {};
        await Brand(process.env.DB_NAME as string).find({name: {$regex: Name, $options: 'i'}})
        .limit(5)
        .then(async (res:any) => {
            console.log(res);
            if(!res || res.length === 0){
                returnData = {
                    'Message': 'Failure',
                    'data': 'No Brand found'
                }
            }
            else{
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        }).catch(e => console.log(e));
        return await returnData;
    }

    public updateBrand = async(brandID: any, Body: any) => {
        let returnData = {}
    await Brand(process.env.DB_NAME as string).findOneAndUpdate({brandID: brandID}, Body, {new:true}).then(async (res: any) => {
        if(!res){
          returnData = {
            'Message': 'Failure',
            'data': 'No Brand found'
          }
        }
        else{
          returnData = {
          'Message': 'Success',
          'data': res
          }
        }
      })
      return await returnData;
    }
    
    public getSingleBrand = async(brandID: any) => {
        let returnData = {};
        await Brand(process.env.DB_NAME as string).find({brandID: brandID}).then(async (res:any) => {
            // console.log(res);
            if(res.length === 0){
                returnData = {
                    'Message': 'Failure',
                    'data': 'No Brand Found'
                }
            }
            else{
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        }).catch(e => console.log(e));
        return await returnData;
    }

    public getAllOutletBrands = async(outletId: any) => {
        let returnData: any = {};
        let brands: any = [];
        // console.log(outletId);
        await Brand(process.env.DB_NAME as string).find({}, {countInventory:{ $elemMatch: { outletChainID: outletId} },brandID: 1, name: 1, slug: 1, image: 1, status: 1 })
        .then(async (res:any) => {
            // console.log(res);
            await res.map((obj: any) => {
                if(obj.countInventory.length){
                    brands.push(obj);
                }
            })
            if(!res){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding brands'
                }
            }
            else{
                returnData = {
                    'Message': 'Success',
                    'data': await brands
                }
            }
        }).catch(e => console.log(e));

        return await returnData;
    }

    public addMultipleBrands = async(Body: any) => {
        let returnData = {};
        let sampleArray: any[] = [];
        let filtered = await Body.filter((value:any, index:any, self:any) =>
        index === self.findIndex((t:any) => (
            t.name === value.name
        ))
        )
        console.log(filtered, 'filtered brands', filtered.length)
        for(let i=0; i< filtered.length; i++){
            // console.log(Body.json[i], `body${i}`);
            await Brand(process.env.DB_NAME as string).findOneAndUpdate({brandID: filtered[i].brandID}, filtered[i], {new: true}).then(async (res:any) => {
                if(!res || res.length === 0){
                    sampleArray.push(filtered[i])
                }
                else{
                }
            });
            
        }
        // console.log(sampleArray, 'sample Brands');
        await Brand(process.env.DB_NAME as string).insertMany(sampleArray).then(async(response) => {
            // console.log(response, 'response');
            if(!response || response.length === 0){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Manufacturer is not created'
                }
            }
            returnData = {
                'Message': 'Brand',
                'data': response
            }
            }).catch((err: any) => {
                console.log(err);
                returnData = {
                  'Message': 'Failure',
                  'data': {
                    "Message": 'Manufacturer name already exists | Server error',
                    "server": err
                  }
                }
        });
        return await returnData;
    }
   
}

export default BrandController;