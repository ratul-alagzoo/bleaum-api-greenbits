import Membership from "../../models/membership";
import { nanoid } from "nanoid";

class MembershipController {
    constructor() {}

    public getAllMemberships = async(consumerID: any) => {
        let returnData = {};
        await Membership.find({consumerID: consumerID}).then(async (res:any) => {
            if(!res){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Membership'
                }
            }
            else{
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        }).catch(e => console.log(e))
        return await returnData;
    }

    public getSingleMembership = async(membershipID: any) => {
        let returnData = {};
        await Membership.find({membershipID: membershipID}).then(async (res:any) => {
            if(!res){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Membership'
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

    public createNewMembership = async(body: any) => {
        let returnData = {};
        let membership = await new Membership({
            membershipID: nanoid(),
            consumerID: body.consumerID,
            name: body.name,
            level: body.level,
            unlocksAtAmountSpent: body.unlocksAt,
            membershipDiscounts: body.membershipDiscounts,
            applyToAllOutlets: body.applyToAllOutlets,
            outlets: body.outlets
        })
        await membership.save().then(async(res: any) => {
            console.log(res);
            if(!res || res.length === 0){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Membership is not created'
                }
            }
            else{
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        }).catch((err: any) => console.log(err));
        return await returnData;
    }

    public updateMembership = async(membershipID: any, body: any) => {
        let returnData = {};
        await Membership.findOneAndUpdate({membershipID: membershipID}, body, {new: true}).then(async (res:any) => {
            if(!res){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Membership'
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
}

export default MembershipController;