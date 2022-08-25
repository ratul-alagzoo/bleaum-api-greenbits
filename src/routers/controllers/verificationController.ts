import Verification from "../../models/verification"
import { nanoid } from "nanoid";

class VerificationController {
    constructor() { }

    public getAllVerification = async () => {
        let returnData = {};
        await Verification(process.env.DB_NAME as string).find({}).then(async (res: any) => {
            if (!res) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Verification'
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

    public getOutletVerification = async (outletChainID: any) => {
        let returnData = {};
        await Verification(process.env.DB_NAME as string).find({ outletChainID: outletChainID }).then(async (res: any) => {
            // console.log(res);
            if (res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No Verification Found'
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

    public getSingleVerification = async (cannabisID: any) => {
        let returnData = {};
        await Verification(process.env.DB_NAME as string).findOne({ verificationId: cannabisID }).then(async (res: any) => {
            // console.log(res);
            if (res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No Verification Found'
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

    public searchByVerification = async(Name: any) => {
        let returnData = {};
        await Verification(process.env.DB_NAME as string).find({name: {$regex: Name, $options: 'i'}})
        .limit(5)
        .then(async (res:any) => {
            console.log(res);
            if(!res || res.length === 0){
                returnData = {
                    'Message': 'Failure',
                    'data': 'No Product found'
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

    public createVerification = async (Body: any) => {
        let returnData = {}
        let Verifications = await new (Verification(process.env.DB_NAME as string))({
            verificationId: nanoid(8),
            firstName: Body.firstName,
            lastName: Body.lastName,
            email: Body.email,
            phoneNumber: Body.phoneNumber,
            gender: Body.gender,
            city: Body.city,
            state: Body.state,
            patientBirthdate: Body.patientBirthdate,
            medicalCondition: Body.medicalCondition,
            address: Body.address,
            image: Body.image,
            zipCode: Body.zipCode,
            assessmentFee: Body.assessmentFee,
            status: Body.status,
            outletChainID: Body.outletChainID,
            consumerId: Body.consumerId
        });

        await Verifications.save().then(async (res: any) => {
            console.log(res);
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Verification is not created'
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

    public updateVerification = async(VerificationId:any, body: any) => {
        let returnData = {}
        await Verification(process.env.DB_NAME as string).findOneAndUpdate({verificationId: VerificationId}, body, {new:true}).then(async (res: any) => {
            console.log(res);
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Verification is not Updated'
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

    public deleteVerification = async(VerificationId: any) => {
        let returnData = {}
        await Verification(process.env.DB_NAME as string).findOneAndDelete({VerificationId: VerificationId}).then(async (res: any) => {
            console.log(res);
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'Verification is not Deleted'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': "Verification is Deleted Successfully"
                }
            }
        }).catch((err: any) => console.log(err));
        return await returnData;
    }
}

export default VerificationController;