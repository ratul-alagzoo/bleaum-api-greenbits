import Cannabis from "../../models/cannbisID";
import { nanoid } from "nanoid";

class CannabisIdController {
  constructor() {}

  public getSingleCannabis = async (cannabisId: any) => {
    let returnData = {};
    await Cannabis.find({ cannabisId: cannabisId })
      .then(async (res: any) => {
        // console.log(res);
        if (res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "No Cannabis Found",
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

  public getAllOutletCannabis = async (outletId: any) => {
    var returnData = {};
    await Cannabis.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userID",
          as: "userData",
        },
      },
      {
        $match: { outletChainID: outletId },
      },
    ]).then(async (res: any) => {
      console.log(res);
      if (res.length === 0) {
        returnData = {
          Message: "Failure",
          data: "No Cannabis Found",
        };
      } else {
        console.log("success");
        returnData = {
          Message: "Success",
          data: res,
        };
      }
    });

    return await returnData;
  };

  public getPaginatedCannabis = async (Page: any) => {
    let returnData = {};
    const resultsPerPage = 30;
    let page = Page >= 1 ? Page : 1;
    page = page - 1;
    await Cannabis.find()
      .limit(resultsPerPage)
      .skip(resultsPerPage * page)
      .then(async (res: any) => {
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "Error finding Brand",
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

  public createCannabis = async (Body: any) => {
    let returnData = {};
    let cannabisId = await new Cannabis({
      cannabisId: nanoid(8),
      email: Body.email,
      medicalRecommendation: Body.medicalRecommendation,
      phoneNumber: Body.phoneNumber,
      consumerId: Body.consumerId,
      outletChainID: Body.outletChainID,
      patientId: Body.patientId,
      licenseExpiry: Body.licenseExpiry,
      patientBirthdate: Body.patientBirthdate,
      cardId: Body.cardId,
      address: Body.address,
      image: Body.image,
      status: Body.status,
    });

    await cannabisId
      .save()
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Cannabis is not created",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((err: any) => console.log(err));
    return await returnData;
  };

  public updateCannabis = async (cannabisId: any, body: any) => {
    let returnData = {};
    await Cannabis.findOneAndUpdate({ cannabisId: cannabisId }, body, {
      new: true,
    })
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Cannabis is not Updated",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      })
      .catch((err: any) => console.log(err));
    return await returnData;
  };

  public deleteCannabis = async (cannabisId: any) => {
    let returnData = {};
    await Cannabis.findOneAndDelete({ cannabisId: cannabisId })
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Cannabis is not Deleted",
          };
        } else {
          returnData = {
            Message: "Success",
            data: "Cannabis is Deleted Successfully",
          };
        }
      })
      .catch((err: any) => console.log(err));
    return await returnData;
  };
}

export default CannabisIdController;
