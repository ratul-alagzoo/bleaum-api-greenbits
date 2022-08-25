import pages from "../../models/pages"
import { nanoid } from "nanoid";

class PageController {
    constructor() { }

    public getAllPage = async () => {
        let returnData = {};
        await pages(process.env.DB_NAME as string).find({}).then(async (res: any) => {
            if (!res) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Page'
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

    public getSinglePage = async (outletId: any, page: any) => {

        let returnData = {};
        await pages(process.env.DB_NAME as string).findOne({ outletChainID: outletId, pageName: page }).then(async (res: any) => {
            // console.log(res);
            if (!res) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No Page Found'
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

    public getAllOutletPages = async (outletId: any) => {

        let returnData = {};
        await pages(process.env.DB_NAME as string).find({ outletChainID: outletId}).then(async (res: any) => {
            // console.log(res);
            if (!res) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No Page Found'
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

    public createPage = async (Body: any) => {
        let returnData = {}
        let Page = await new (pages(process.env.DB_NAME as string))({
            pageId: nanoid(8),
            title: Body.title,
            subtitle: Body.subtitle,
            body: Body.body,
            outletChainId: Body.outletChainId,
            consumerId: Body.consumerId,
            pageName: Body.pageName
        });

        await Page.save().then(async (res: any) => {
            console.log(res);
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Page is not created'
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

    public updatePage = async(outletId: any, page: any, body: any) => {
        console.log(outletId, page, body)
        let returnData = {}
        await pages(process.env.DB_NAME as string).findOneAndUpdate({outletChainID: outletId, pageName: page}, body, {new:true, upsert:true}).then(async (res: any) => {
            console.log(res);
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Page is not Updated'
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

    public deletePage = async(pageId: any) => {
        let returnData = {}
        await pages(process.env.DB_NAME as string).findOneAndDelete({pageId: pageId}).then(async (res: any) => {
            console.log(res);
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Page is not Deleted'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': "Page is Deleted Successfully"
                }
            }
        }).catch((err: any) => console.log(err));
        return await returnData;
    }
}

export default PageController;