import Cart from "../../models/cart";
import { nanoid } from "nanoid";

class CartController {
    constructor() { }

    public storecart = async(Body: any) => {
        let returnData = {};

        let cart = await new (Cart(process.env.DB_NAME as string))({
            cartId: nanoid(8),
            consumerId: Body.consumerId,
            outletId: Body.outletId,
            customerId: Body.customerId,
            products: Body.products,
            totalPrice: Body.totalPrice,
            status: Body.status
        });

        await cart.save().then(async(res: any) => {
            console.log(res);
            if(!res || res.length === 0){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Cart is not created'
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

    public deleteCart = async(customerId:any, productID: any) => {
        let returnData = {};
        await Cart(process.env.DB_NAME as string).update({customerId: customerId}, { $pull: {products: {productID:productID}} }).then(async (res: any) => {
            console.log(res);
            if(!res){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Cart'
                }
            }
            else{
                returnData = {
                    'Message': 'Success',
                    'data': "Product Deleted Successfully"
                }
            }
        }).catch(e => console.log(e));
        return await returnData;
    }

    public deleteWholeCart = async(cartId:any) => {
        let returnData = {};
        await Cart(process.env.DB_NAME as string).findOneAndDelete({cartId: cartId}).then(async (res: any) => {
            console.log(res);
            if(!res){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Cart'
                }
            }
            else{
                returnData = {
                    'Message': 'Success',
                    'data': "Cart Deleted Successfully"
                }
            }
        }).catch(e => console.log(e));
        return await returnData;
    }

    public addProductToCart = async(customerId: any, Body: any) => {
        let returnData = {};
        await Cart(process.env.DB_NAME as string).update({ customerId: customerId }, {"$push": { "products": Body }}, {products: 1}).then(async (res: any) => {
            if (!res) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No User Found'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': "Product Added to Cart"
                }
            }
        })
        return await returnData;
    }

    public getCart = async(customerId: any) => {
        let returnData = {};
        await Cart(process.env.DB_NAME as string).find({customerId: customerId, deActivate: false}).then(async (res:any) => {
            if(!res){
                returnData = {
                    'Message': 'Failure',
                    'data': 'Error finding Cart'
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

    public updatePatchCart = async(customerId: any, productID: any,Body: any) => {
        let returnData = {}
        console.log(Body, productID, customerId);
        await Cart(process.env.DB_NAME as string).update({ customerId: customerId, "products.productID": productID },
        { $set: {"products.$.quantity": Body.quantity, "products.$.image": Body.image, "products.$.name": Body.name}}
        ,{multi: true}).then(async (res: any) => {
            console.log(res);
            if (!res) {
                returnData = {
                    'Message': 'Failure',
                    'data': 'No Product Found'
                }
            }
            else {
                returnData = {
                    'Message': 'Success',
                    'data': 'Cart Updated'
                }
            }
        })
        return await returnData;
    }
    
}

export default CartController;
