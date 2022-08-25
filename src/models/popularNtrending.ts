import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PopularAndTrending = new Schema({
    outletChainID: {
        type: String, 
    },
    consumerId: {
        type: Number,
    },
    Details: {
        type: Object, 
    },
    Date: {
        type: Date
    }
},
{ timestamps: true }
)

const Model = (dbName: string) =>
    mongoose.connection.useDb(dbName).model('popularTrending', PopularAndTrending);
export default Model;