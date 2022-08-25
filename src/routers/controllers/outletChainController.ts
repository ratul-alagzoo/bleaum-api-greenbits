import OutletChain from "../../models/outletChain";
import OutletChainAdmin from "../../models/outletChainAdmin";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
dotenv.config();

class OutletChainController {
  constructor() {}

  public getAllOutletChains = async (consumerId: any) => {
    let returnData = {};
    // console.log(consumerId);
    const getOutletAdminDetails = await OutletChainAdmin(process.env.DB_NAME as string).findOne({
      consumerId: consumerId,
    });
    console.log("details admin", getOutletAdminDetails);
    if (getOutletAdminDetails?.soleOutlet) {
      returnData = {
        Message: "Success",
        data: [getOutletAdminDetails],
      };
    } else {
      await OutletChain(process.env.DB_NAME as string).find({ consumerId: consumerId })
        .then(async (res: any) => {
          console.log(res);
          if (!res || res.length === 0) {
            returnData = {
              Message: "Failure",
              data: [],
            };
          } else {
            returnData = {
              Message: "Success",
              data: res,
            };
          }
        })
        .catch((e) => console.log(e));
    }

    return await returnData;
  };

  public getOutletChain = async (outletChainID: any) => {
    let returnData = {};
    await OutletChain(process.env.DB_NAME as string).find({ outletChainID: outletChainID })
      .then(async (res: any) => {
        // console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: [],
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public addOutletChain = async (Body: any) => {
    let returnData = {};
    const getSuperAdminDetails = await OutletChainAdmin(process.env.DB_NAME as string).find({
      adminID: Body.outletSuperAdminID,
    });
    const getOutletChainDetails = await OutletChain(process.env.DB_NAME as string).find({
      outletSuperAdminID: Body.outletSuperAdminID,
    });
    // console.log(getSuperAdminDetails[0].noOfChains, ': details admin : details chain :', getOutletChainDetails.length);
    if (getSuperAdminDetails[0].noOfChains === getOutletChainDetails.length) {
      console.log("max reached");
      returnData = {
        Message: "Failure",
        data: "Max chain limit reached, contact super admin!",
      };
    } else {
      console.log("continue");
      // let hashPassword = await bcrypt.hash(Body.password)
      let outletChain = new (OutletChain(process.env.DB_NAME as string))({
        outletChainID: nanoid(),
        outletName: Body.outletName,
        consumerId: Body.consumerId,
        outletSuperAdminID: Body.outletSuperAdminID,
        adminName: Body.adminName,
        adminEmail: Body.adminEmail,
        adminImage: Body.adminImage,
        countryCode: Body.countryCode,
        taxes: Body.taxes,
        phone: Body.phone,
        address: Body.address,
        city: Body.city,
        state: Body.state,
        isActive: Body.isActive,
      });
      await outletChain
        .save()
        .then(async (response: any) => {
          if (!response) {
            returnData = {
              Message: "Failure",
              data: "Outlet Chain is not created",
            };
          }
          returnData = {
            Message: "Success",
            data: response,
          };
        })
        .catch((err: any) => console.log(err));
    }
    return await returnData;
  };

  public deleteOutletChain = async (outletChainID: any) => {
    let returnData = {};
    await OutletChain(process.env.DB_NAME as string).findOneAndDelete({ outletChainID: outletChainID })
      .then(async (res: any) => {
        // console.log(res);
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "No outlet Chain Found",
          };
        } else {
          returnData = {
            Message: "Success",
            data: "Product Deleted Successfully.",
          };
        }
      })
      .catch((e) => console.log(e));
    return await returnData;
  };

  public updateOutletChain = async (outletChainID: any, Body: any) => {
    let returnData = {};
    await OutletChain(process.env.DB_NAME as string).findOneAndUpdate({ outletChainID: outletChainID }, Body, {
      new: true,
    }).then(async (res: any) => {
      if (!res) {
        returnData = {
          Message: "Failure",
          data: "No outlet Chain Found",
        };
      } else {
        returnData = {
          Message: "Success",
          data: res,
        };
      }
    });
    return await returnData;
  };
}

export default OutletChainController;
