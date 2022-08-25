import Banner from "../../models/banner";
import { nanoid } from "nanoid";

class BannerController {
    constructor() { }

    public getAllBanners = async (outletChainID: any, isAdmin = false) => {
        let returnData = {};
        let queries: any = {outletChainID: outletChainID, status: true};
        if(isAdmin){
            let {status, ...others} = queries;
            queries = {...others}
        }
        await Banner(process.env.DB_NAME as string).find({ ...queries }).then(async (res: any) => {
            if (!res) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Banner'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        }).catch(e => console.log(e));
        return await returnData;
    }

    public getSingleBanner = async (bannerId: any) => {
        let returnData = {};
        await Banner(process.env.DB_NAME as string).find({ bannerId: bannerId }).then(async (res: any) => {
            // console.log(res);
            if (res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No Banner Found'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        }).catch(e => console.log(e));
        return await returnData;
    }

    public createBanner = async (Body: any) => {
        let returnData = {}
        let banner = await new (Banner(process.env.DB_NAME as string))({
            bannerId: nanoid(8),
            consumerId: Body.consumerId,
            outletChainID: Body.outletChainID,
            title: Body.title,
            time: Body.time,
            image: Body.image,
            link: Body.link,
            status: Body.status
        });

        await banner.save().then(async (res: any) => {
            console.log(res);
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Banner is not created'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        }).catch((err: any) => console.log(err));
        return await returnData;
    }

    public updateBanner = async(bannerId:any, body: any) => {
        let returnData = {}
        await Banner(process.env.DB_NAME as string).findOneAndUpdate({bannerId: bannerId}, body, {new:true}).then(async (res: any) => {
            console.log(res);
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Banner is not Updated'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        }).catch((err: any) => console.log(err));
        return await returnData;
    }

    public deleteBanner = async(bannerId: any) => {
        let returnData = {}
        await Banner(process.env.DB_NAME as string).findOneAndDelete({bannerId: bannerId}).then(async (res: any) => {
            console.log(res);
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Banner is not Deleted'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': "Banner is Deleted Successfully"
                }
            }
        }).catch((err: any) => console.log(err));
        return await returnData;
    }
}

export default BannerController;