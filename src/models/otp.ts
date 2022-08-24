import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OtpSchema = new Schema({
    otpID: {
        type: String
    },
    OtpValue: {
        type: String,
        required: true
    },
    customerID: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
})

const OTP = mongoose.model('Order', OtpSchema);
export default OTP;