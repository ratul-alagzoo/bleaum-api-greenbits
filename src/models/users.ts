import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    firebaseUID: {
        type: String,
    },
    userID: {
        type: String,
        required: true
    },
    consumerId: {
        type: Number,
        required: true
    },
    thirdPartyKey: {
        type: String
    },
    token: {
        type: String
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        default: '123456'
    },
    dob: {
        type: Date,
    },
    countryCode: {
        type: String,
    },
    mobileNo: {
        type: String,
    },
    altMobileNo: {
        type: String
    },
    gender: {
        type: String
    },
    addresses: {
        type: Array,
    },
    location: {
        type: {
          type: String, 
          enum: ['Point']
        },
        coordinates: {
          type: [Number]
        }
    },
    accountCreatedOn: {
        type: Date,
        default: Date.now()
    }
},
{ timestamps: true }
)

const User = mongoose.model('User', UsersSchema);

export default User;