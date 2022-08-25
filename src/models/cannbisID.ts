import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CannabisSchema = new Schema({
    cannabisId: {
        type:String, 
        required: true
    },
    consumerId: {
        type:String, 
    },
    outletChainID: {
        type: String, 
        required: true
    },
    photoID:{
        type: String,
        default: ''
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    patientId: {
        type: String,
        default: ''
    },
    medicalRecommendation: {
        type: String, 
    },
    licenseExpiry: {
        type: Date,
        default: 3
    },
    patientBirthdate: {
        type: Date,
        default: 3
    },
    cardId: {
        type: String,
        default:''
    },
    address: {
        type: String,
        default:''
    },
    image: {
        type: String,
        default:''
    },
    status:{
        type:Boolean,
        default: false
    },
},
    { timestamps: true }
)

const Cannabis = (dbName: string) =>
    mongoose.connection.useDb(dbName).model('Cannabis', CannabisSchema)

export default Cannabis;