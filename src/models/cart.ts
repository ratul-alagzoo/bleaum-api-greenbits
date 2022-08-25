import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    cartId: {
        type:String, 
        required: true
    },
    outletId: {
        type: String,
        required: true
    },
    consumerId: {
        type: Number
    },
    customerId: {
        type: String
    },
    products: {
        type: Array
    },
    totalPrice: {
        type: Number
    },
    status:{
        type:Boolean,
        default: false
    },
    deActivate:{
        type:Boolean,
        default: false
    }
},
    { timestamps: true }
)

const Cart = (dbName: string) =>
    mongoose.connection.useDb(dbName).model('Cart', CartSchema)

export default Cart;