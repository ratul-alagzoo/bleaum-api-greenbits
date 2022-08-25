import Dashboard from "../../models/dashboard";
import User from "../../models/users";
import Order from "../../models/order";
import Inventory from "../../models/inventory";
import moment from "moment";

class DashboardController {
    constructor() {}

    findOccurance = (arr: any, key:any ) =>{
        let arr2:any = [];
        arr.forEach((x:any)=>{
           
           if(arr2.some((val:any)=>{ return val[key] == x[key] })){
               
            arr2.forEach((k:any)=>{
               if(k[key] === x[key]){ 
                 k["occurrence"]++
                 k["productDetails"] = { "image": x.image, "name": x.name, "brand": x.brandName}
                 k["total"] += x.price ? x.price : 0;
               }
            })
           }else{
             let a:any = {}
             a[key] = x[key]
             a["occurrence"] = 1
             a["productDetails"] = { "image": x.image, "name": x.name, "brand": x.brandName}
             a["total"] = x.price ? x.price : 0
             arr2.push(a);
           }
        })
          
        return arr2
    }

    createDashboard = async () => {
        const date = new Date();
        const weekly = new Date((date.getFullYear(), date.getMonth(), date.getDate() - 7));
        const monthly = new Date();
        monthly.setMonth(monthly.getMonth() -10);

        let totalRegistrations = 0;
        let totalOrders = 0;
        let totalRevenue = 0;
        let totalProducts = 0;
        let userRegistrationChart: any = [];
        let totalOrdersChartWeekly: any = [];
        let totalOrdersChartMonthly: any = [];
        let totalRevenueChartWeekly: any = [];
        let totalRevenueChartMonthly: any = [];
        let topSellingProductByRevenue: any = [];
        let topSellingProductByCount: any = [];
        let tempProducts: any = [];
        await User(process.env.DB_NAME as string).find({}).then((res: any) => {
            if(res.length){
                totalRegistrations= res.length;
            }
        })
        await User(process.env.DB_NAME as string).find({accountCreatedOn: {$gte: monthly}}).then((res: any) => {
            // console.log(new Date(date.getTime() - 1000 * 86400 * 7), res.length, 'weekly')
            if(res.length){
                res.map((data: any) => {
                    userRegistrationChart.push({date: moment(data.createdAt).format("MMM"), id: data.userID})
                })
            }
        })
        // await User.find({accountCreatedOn: {$gte:monthly}}).then((res: any) => {
        //     console.log(monthly, res.length, 'monthly')
        //     if(res.length){
        //         res.map((data: any) => {
        //             userRegistrationChart.push({date: moment(data.createdAt).format("MMM Do"), id: data.userID})
        //         })
        //     }
        // })
        await Order(process.env.DB_NAME as string).find({outletID: process.env.MENU_KEY}).then((res: any) => {
            if(res.length){
                totalOrders= res.length
                res.map((price: any) => {
                    console.log(price.products, 'product responses')
                    totalRevenue+=price.finalPrice;
                    if(price.products){
                        tempProducts.push(...price.products)
                    }
                })
            }
        })
        await Order(process.env.DB_NAME as string).find({createdAt: {$gte: new Date(date.getTime() - 1000 * 86400 * 7)}}).then((res: any) => {
            if(res.length){
                // console.log(res, 'order responses')
                res.map((price: any) => {
                    // console.log(...price.products, 'product array')
                    totalOrdersChartWeekly.push({date: moment(price.createdAt).format("MMM Do"), price: price.finalPrice})
                    totalRevenueChartWeekly.push({date: moment(price.createdAt).format("MMM Do"), price: price.finalPrice})
                })
            }
        })
        await Order(process.env.DB_NAME as string).find({createdAt: {$gte:monthly}}).then((res: any) => {
            if(res.length){
                // console.log(res, 'order responses')
                res.map((price: any) => {
                    // console.log(moment(price.createdAt).format("MMM"), 'product responses')
                    totalOrdersChartMonthly.push({date: moment(price.createdAt).format("MMM"), price: price.finalPrice})
                    totalRevenueChartMonthly.push({date: moment(price.createdAt).format("MMM"), price: price.finalPrice})
                })
            }
        })
        await Inventory(process.env.DB_NAME as string).find({}).then(async (res:any) => {
            if(res.length){
                totalProducts= res.length
            }
        })
        // console.log(tempProducts, 'temp products')
        topSellingProductByRevenue = this.findOccurance(tempProducts, "productID");
        topSellingProductByCount = this.findOccurance(tempProducts, "productID");
        topSellingProductByRevenue.sort((a: any, b: any) => parseFloat(b.total) - parseFloat(a.total));
        topSellingProductByCount.sort((a: any, b: any) => parseFloat(b.occurrence) - parseFloat(a.occurrence));
        
        // console.log(today, 'total', totalRegistrations, totalOrders, totalProducts, totalRevenue, topSellingProductByRevenue, topSellingProductByCount)
        let dashboard = await new (Dashboard(process.env.DB_NAME as string))({
            outletId: process.env.MENU_KEY,
            totalRegistrations: totalRegistrations,
            totalOrders: totalOrders,
            totalRevenue: totalRevenue,
            totalProducts: totalProducts,
            userRegistrationsChart: userRegistrationChart,
            totalOrdersChartWeekly: totalOrdersChartWeekly,
            totalOrdersChartMonthly: totalOrdersChartMonthly,
            totalRevenueChartWeekly: totalRevenueChartWeekly,
            totalRevenueChartMonthly: totalRevenueChartMonthly,
            topSellingByRevenue: topSellingProductByRevenue,
            topSellingByCount: topSellingProductByCount
        });

        let results = dashboard.save();
        return results;
    }
    
    getDashboardDetails = async() => {
        let returnData = {};
        const today = new Date();
        today.setMonth(today.getMonth() -1);
        const dashboard = await Dashboard(process.env.DB_NAME as string).findOne({createdAt: {$gte:today}});
        console.log('dashboard', dashboard)
        if(!dashboard){
            await this.createDashboard();
            await console.log('execute')
            await Dashboard(process.env.DB_NAME as string).find({createdAt: {$gte:today}}).then((res: any) => {
                
                returnData = {
                    'Message': 'Success',
                    'data': res[0]
                }
            });
        }
        else{
            returnData = {
                'Message': 'Success',
                'data': dashboard
            }
        }
        return await returnData;
    }

}

export default DashboardController;
