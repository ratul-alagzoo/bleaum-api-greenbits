import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    wishlistID: {
        type: String,
        required: true
    },
    product: {
        type: Object,
        required: true
    }
},
{ timestamps: true }
)

const WishList = mongoose.model('WishList', WishlistSchema);

export default WishList;