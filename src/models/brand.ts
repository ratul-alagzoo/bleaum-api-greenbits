import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
    brandID: {
        type:String, 
        required: true
    },
    name:{
        type: String,
        required: true
    },
    slug:{
        type: String,
    },
    countInventory: {
        type: Array
    },
    image : {
        type: String,
        default:''
    },
    status:{
        type:Boolean,
        default: false
    },
    productCount: {
        type: Number,
        default:0
    }
},
    { timestamps: true }
)

const Brand = mongoose.model('Brand', BrandSchema)

export default Brand;