import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const verificationSchema = new Schema({
    consumerId: {
        type:String, 
    },
    outletChainID: {
        type: String, 
        required: true
    },
    verificationId: {
        type:String, 
        required: true
    },
    firstName: {
        type:String,
        required:true 
    },
    lastName: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true 
    },
    state: {
        type: String,
        required: true
    },
    patientBirthdate: {
        type: Date,
        default: 3
    },
    medicalCondition: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default:''
    },
    image: {
        type: String,
        default:''
    },
    zipCode:{
        type: String,
        required: true
    },
    assessmentFee:{
        type:Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Pending'
    }
},
    { timestamps: true }
)

const Verification = (dbName: string) =>
    mongoose.connection.useDb(dbName).model('Verification', verificationSchema)

export default Verification;