import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
    outletChainID: {
        type: String, 
        required: true
    },
    adminID: {
        type: String, 
    },
    consumerId: {
        type: Number,
    },
    productID: {
        type: String,
    },
    product: {
        type: Object, 
    },
    quantity: {
        type: Number,
    },
    originalPrice: {
        type: Number
    },
    discountPrice: {
        type: Number
    },
    discountPercentage: {
        type: Number
    },
    variants: {
        type: Array,
    },
    extras: {
        type: Object, 
    },
    featuredProduct: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
)

const Inventory = mongoose.model('inventory', InventorySchema);
export default Inventory;