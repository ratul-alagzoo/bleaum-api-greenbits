import WishList from '../../models/wishlist';
import { nanoid } from 'nanoid';

class WishlistController {
    constructor(){}

    public updateWishList = async(userID: any,Body: any) => {
        let returnData = {}
        console.log(userID, Body);
        await WishList.findOneAndUpdate({ userID: userID }, Body, { new: true }).then(async (res: any) => {
            if (!res) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No WishList Found'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        })
        return await returnData;
    } 

    public patchWishList = async(userID: any, wishlistID: any, Body: any) => {
        let returnData = {};
        console.log(userID, wishlistID, Body)
        await WishList.update(
        { userID: userID, wishlistID: wishlistID },
        { $set: {"product.quantity": Body.quantity}}
        ).then(async (res: any) => {
            console.log(res, 'res:')
        if (!res) {
            returnData = {
            Message: "Failure",
            data: "No Address Found",
            };
        } else {
            returnData = {
            Message: "Success",
            data: res,
            };
        }
        });
        return await returnData;
    } 

    public deleteWishList = async(wishListID: any) => {
        let returnData = {}
        await WishList.findOneAndDelete({ wishlistID: wishListID }).then(async (res: any) => {
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No WishList Found'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': 'Deleted Successfully'
                }
            }
        })
        return await returnData;
    } 

    public getAllWishList = async(userID: any) => {
        let returnData = {}
        await WishList.find({ userID: userID }).then(async (res: any) => {
            // console.log(res);
            if (!res) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No WishList Found'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': res
                }
            }
        })
        return await returnData;
    } 

    public createNewWishList = async(Body: any) => {
        let returnData = {}
        let wishList = new WishList({
            userID: Body.userID,
            wishlistID: nanoid(),
            product: Body.product
        })

        await wishList.save().then(async(response: any) => {
            if(!response){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Wishlist is not created'
                }
            }
            returnData = {
                'Message': 'Success',
                'data': response
            }
        }).catch(
          (err: any) => {
            console.log(err);
            returnData = {
              'Message': 'Failure',
              'data': err
            }
          });
    
        return await returnData;
    } 

    public deleteAllWishList = async(userID: any) => {
        let returnData = {}
        await WishList.remove({ userID: userID }).then(async (res: any) => {
            console.log(res);
            if (!res || res.length === 0) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No WishList Found'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': `Deleted ${res}`
                }
            }
        })
        return await returnData;
    } 
}

export default WishlistController;
