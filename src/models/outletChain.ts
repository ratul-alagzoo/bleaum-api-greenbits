import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OutletChainSchema = new Schema({
    outletChainID:{
        type:String,
        required: true
    },
    outletSuperAdminID: {
        type: String, 
    },
    consumerId: {
        type: Number,
        required: true
    },
    outletName:{
        type: String,
        required: true
    },
    adminName: {
        type: String,
    },
    adminEmail:{
        type:String,
        required: true
    },
    adminImage: {
        type:String,
    },
    adminPassword: {
        type: String,
        default: '123456'
    },
    location: {
        // type: {
        //   type: String, 
        //   enum: ['Point'], 
        // },
        coordinates: {
          longitude:{
              type: Number
          },
          latitude:{
              type: Number
          }
        }
    },
    assessmentFee: {
        type: Number,
        default: '199'
    },
    logo: {
        type: String, 
    },
    countryCode: {
        type: Number,
        default:1
    },
    phone: {
        type: Number,
    },
    address : {
        type:String,
        default:''
    },
    city: {
        type:String,
        default:''
    },
    state: {
        type:String,
        default:''
    },
    taxes: {
        type: Array,
    },
    isActive:{
        type:Boolean,
        default:false
    },
    isSubOutlet: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
)

const OutletChain = mongoose.model('OutletChain', OutletChainSchema)
export default OutletChain;