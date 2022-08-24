import App from "./app";
import dotenv from "dotenv";
import product from "./routers/api/product";
import brand from "./routers/api/brand";
import inventory from "./routers/api/inventory";
import category from "./routers/api/category";
import outletChain from "./routers/api/outletChain";
import outletchainadmin from "./routers/api/outletChainAdmin";
import order from "./routers/api/order";
import user from "./routers/api/users";
import wishlist from "./routers/api/wishlist";
import deal from "./routers/api/deals";
import cart from "./routers/api/cart";
import coupon from "./routers/api/coupons";
import membership from "./routers/api/membership";
import banner from "./routers/api/banner";
import page from "./routers/api/pages";
import verification from "./routers/api/verification";
import cannabisId from "./routers/api/cannabisID";
import dashboard from "./routers/api/dashBoard";
import generalSettingsV1 from "./routers/api/general-settings.v1";
import usersV2 from "./routers/api/users.v2";
import inventoriesV2 from "./routers/api/inventory.v2";
import categoriesV2 from "./routers/api/category.v2";
import brandsV2 from "./routers/api/brand.v2";
import notificationsV1 from "./routers/api/notification.v1";
import pushNotificationV1 from "./routers/api/push-notification.v1";
import { SwaggerDOC } from "./swagger-config";
import loyaltyPoints from "./routers/api/loyaltyPoints";
import loyalty from "./routers/api/loyalty";
import dealsV1 from "./routers/api/deals.v1";

dotenv.config();

const app = new App(
  [
    new inventory(),
    new user(),
    new order(),
    new product(),
    new brand(),
    new category(),
    new outletChain(),
    new outletchainadmin(),
    new wishlist(),
    new deal(),
    new coupon(),
    new cart(),
    new membership(),
    new banner(),
    new page(),
    new verification(),
    new cannabisId(),
    new dashboard(),
    new generalSettingsV1(),
    new usersV2(),
    new inventoriesV2(),
    new categoriesV2(),
    new brandsV2(),
    new notificationsV1(),
    new pushNotificationV1(),

    //add documenatations
    new SwaggerDOC(),
    new loyaltyPoints(),
    new loyalty(),
    new dealsV1(),
  ],
  process.env.PORT
);

app.listen();

// Production
// MONGO_URL=mongodb+srv://api-alpha:F4I5P7y6Jf80kAtw@api-alpha.f6lqn.mongodb.net/hamiltons?retryWrites=true&w=majority

// Development
// MONGO_URL="mongodb://omairar:omair12345@cluster0-shard-00-00.zz4sr.mongodb.net:27017,cluster0-shard-00-01.zz4sr.mongodb.net:27017,cluster0-shard-00-02.zz4sr.mongodb.net:27017/cannabyAPI?ssl=true&replicaSet=atlas-fsubdw-shard-0&authSource=admin&retryWrites=true&w=majority"

//GrowFlow
// MONGO_URL="mongodb://omairar:omair12345@cluster0-shard-00-00.zz4sr.mongodb.net:27017,cluster0-shard-00-01.zz4sr.mongodb.net:27017,cluster0-shard-00-02.zz4sr.mongodb.net:27017/cannaby?ssl=true&replicaSet=atlas-fsubdw-shard-0&authSource=admin&retryWrites=true&w=majority"

// Development
// MONGO_URL="mongodb://omairar:omair12345@cluster0-shard-00-00.zz4sr.mongodb.net:27017,cluster0-shard-00-01.zz4sr.mongodb.net:27017,cluster0-shard-00-02.zz4sr.mongodb.net:27017/cannabyQA?ssl=true&replicaSet=atlas-fsubdw-shard-0&authSource=admin&retryWrites=true&w=majority"
