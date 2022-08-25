import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
    membershipID: {
        type:String, 
        required: true
    },
    consumerID:{
        type: Number,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    level:{
        type: String,
        required:true
    },
    unlocksAtAmountSpent: {
        type: String,
        default:''
    },
    membershipDiscounts:{
        type:Array,
        default: false
    },
    applyToAllOutlets: {
        type: String,
        default: false
    },
    outlets: {
        type: Array,
    },
    status: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
)

const Membership = (dbName: string) =>
    mongoose.connection.useDb(dbName).model('Membership', MembershipSchema)

export default Membership;