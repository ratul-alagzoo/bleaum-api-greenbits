import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DashboardSchema = new Schema({
    outletId: {
        type:String, 
        required: true
    },
    totalRegistrations:{
        type: String,
    },
    totalOrders:{
        type: String,
    },
    totalRevenue: {
        type: String
    },
    totalProducts:{
        type: String,
    },
    userRegistrationsChart: {
        type: Array
    },
    totalOrdersChartWeekly:{
        type: Array
    },
    totalOrdersChartMonthly:{
        type: Array
    },
    totalRevenueChartWeekly:{
        type: Array
    },
    totalRevenueChartMonthly:{
        type: Array
    },
    topSellingByRevenue:{
        type: Array,
    },
    topSellingByCount:{
        type: Array,
    }
},
    { timestamps: true }
)

const Dashboard = (dbName: string) =>
    mongoose.connection.useDb(dbName).model('Dashboard', DashboardSchema)

export default Dashboard;