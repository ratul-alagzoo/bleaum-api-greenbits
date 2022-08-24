import mongoose from "mongoose";
const Schema = mongoose.Schema;

const pageSchema = new Schema({
    outletChainID: {
        type: String, 
        required: true
    },
    consumerId: {
        type:String, 
    },
    pageId:{
        type: String,
    },
    pageName: {
        type: String,
        default:''
    },
    title: {
        type:String,
        required:true
    },
    subtitle: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    }
},
{ 
    timestamps: true 
})

const pages = mongoose.model('Pages', pageSchema);

export default pages;