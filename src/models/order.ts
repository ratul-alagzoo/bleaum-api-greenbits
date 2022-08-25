import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderID: {
        type: String, 
        required: true
    },
    consumerId: {
        type: Number
    },
    outletID: {
        type: String,
    },
    customer: {
        type: Object
    },
    products: {
        type: Array
    },
    totalPrice: {
        type: Number
    },
    discount: {
        type: Object
    },
    finalPrice: {
        type: Number
    },
    growflow: {
        type: Array
    },
    status: {
        type: String,
        default: 'CREATED'
    },
    cancelled: {
        type: Boolean, 
        default: false
    }
},
{ timestamps: true }
)

const Order = (dbName: string) =>
    mongoose.connection.useDb(dbName).model('Order', OrderSchema);
export default Order;