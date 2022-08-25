import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
    productID: {
        type: String, 
        required: true
    },
    name:{
        type: String,
        required: true
    },
    slug:{
        type: String,
    },
    cbd:{
        type: Number,
    },
    thc:{
        type: Number,
    },
    shortDescription:{
        type: String,
        default:'',
        required: true
    },
    longDescription:{
        type: String,
        default:''
    },
    image : {
        type: String,
        default:''
    },
    imageGallery:[{
        type: String
    }],
    brandID:{
        type: String,
    },
    brandName: {
        type: String,
    },
    category:{
        type: Array,
        required: true
    },
    height:{
        type:Number,
        default:0
    },
    width:{
        type:Number,
        default:0
    },
    weight:{
        type:Number,
        default:0
    },
    status:{
        type:Boolean,
        default: false
    },
    missing: {
        type: Boolean,
        default: false
    },
    effects: {
        type: Array,
        default: ['Calm']
    }
},
{ timestamps: true }
)

const Product = (dbName: string) =>
    mongoose.connection.useDb(dbName).model('Product', ProductsSchema);

export default Product;