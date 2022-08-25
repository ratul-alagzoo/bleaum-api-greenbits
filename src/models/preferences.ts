import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PreferencesSchema = new Schema({
    consumerId: {
        type: Number,
    },
    color: {
        type: String
    },
    theme: {
        type: String
    },
    zendeskKey: {
        type: String
    },
    headerTitle: {
        type: String
    },
    copyright: {
        type: String
    },
    footerLinks: {
        type: Array
    },
    navigationLinks: {
        type: Array
    },
    Date: {
        type: Date
    }
},
{ timestamps: true }
)

const Model = (dbName: string) =>
    mongoose.connection.useDb(dbName).model('preferences', PreferencesSchema);
export default Model;