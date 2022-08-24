import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
    bannerId: {
        type:String, 
        required: true
    },
    consumerId: {
        type:String, 
    },
    outletChainID: {
        type: String, 
    },
    title: {
        type: String,
        default: ''
    },
    time: {
        type: Number,
        default: 3
    },
    image : {
        type: String,
        default:''
    },
    link: {
        type: String
    },
    status:{
        type:Boolean,
        default: false
    },
},
    { timestamps: true }
)

const Banner = mongoose.model('Banner', BannerSchema)

export default Banner;