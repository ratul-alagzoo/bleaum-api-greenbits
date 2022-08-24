import OutletChainAdmin from "../../models/outletChainAdmin";
import OutletChain from "../../models/outletChain";
import GeneralSettingsController from "./generalSettingsController.v1";

class OutletChainAdminController {
  constructor() {}

  public loginOutletChainAdmin = async (Body: any) => {
    let returnData = {};
    let chainAdmin = await OutletChainAdmin.find({ adminEmail: Body.email });
    let outletAdmin = await OutletChain.find({ adminEmail: Body.email });
    if (chainAdmin.length > 0) {
      // console.log(chainAdmin, 'chain')
      await OutletChainAdmin.find({
        adminEmail: Body.email,
        adminPassword: Body.password,
      })
        .lean()
        .then(async (res: any) => {
          console.log(res);
          if (!res?.length) {
            returnData = {
              Message: "Failure",
              data: "No Admin Found",
            };
          } else {
            returnData = {
              Message: "Success",
              data: res,
            };
          }
        })
        .catch((e) => console.log(e));
    } else if (outletAdmin.length > 0) {
      // console.log(outletAdmin, 'outlet')
      await OutletChain.find({
        adminEmail: Body.email,
        adminPassword: Body.password,
      })
        .lean()
        .then(async (res: any) => {
          console.log(res);
          if (!res?.length) {
            returnData = {
              Message: "Failure",
              data: "No Admin Found",
            };
          } else {
            returnData = {
              Message: "Success",
              data: res,
            };
          }
        })
        .catch((e) => console.log(e));
    } else {
      // console.log('Not Found')
      returnData = {
        Message: "Failure",
        data: "No Admin Found",
      };
    }
    //@ts-ignore
    if (!!returnData?.data?.length) {
      //@ts-ignore
      const currentOutletChainID = returnData?.data[0]?.outletChainID ?? null;
      if (!!currentOutletChainID) {
        const generalSettingsController = new GeneralSettingsController();
        const media = await generalSettingsController.getMedia(
          currentOutletChainID
        );
        //@ts-ignore
        let { adminPassword, ...others } = returnData.data[0];
        //@ts-ignore
        returnData.data[0] = {
          //@ts-ignore
          ...others,
          media: media.toSend?.data ?? {},
        };
      }
    }
    return await returnData;
  };

  public getOutletDetails = async (consumerId: any) => {
    let returnData = {};
    console.log(consumerId);
    await OutletChainAdmin.find({ consumerId: consumerId })
      .then(async (res) => {
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
    return await returnData;
  };

  public getOutletChainAdmin = async (adminID: any) => {
    let returnData = {};
    await OutletChainAdmin.find({ adminID: adminID }).then(async (res: any) => {
      if (!res) {
        returnData = {
          Message: "Failure",
          data: "No admin found",
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

  public updateOutletChainAdmin = async (adminID: any, Body: any) => {
    let returnData = {};
    await OutletChainAdmin.findOneAndUpdate({ adminID: adminID }, Body, {
      new: true,
    }).then(async (res: any) => {
      if (!res) {
        returnData = {
          Message: "Failure",
          data: "No admin found",
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

export default OutletChainAdminController;
