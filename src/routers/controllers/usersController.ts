import User from "../../models/users";
import { nanoid } from "nanoid";
import { SendMail } from "../../helpers/mailSender";
import NotificationControllerV1 from "./notificationController.v1";
import {
  ENotificationIntent,
  ENotificationTopics,
} from "../../models/notification";
import * as dotenv from "dotenv";

dotenv.config();

const otpGenerator = require("otp-generator");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
class UserController {
  constructor() {}

  public getAllUsers = async (consumerId: any) => {
    let returnData = {};

    //dummy delete
    // Dashboard.collection.drop();

    await User(process.env.DB_NAME as string).find({ consumerId: consumerId })
      .sort({ _id: -1 })
      .then(async (res) => {
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "Error finding users",
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

  public searchUser = async (consumerId: any, name: any) => {
    let returnData = {};
    await User(process.env.DB_NAME as string).find({
      consumerId: consumerId,
      $or: [
        { name: { $regex: name, $options: "i" } },
        { email: { $regex: name, $options: "i" } },
      ],
    })
      .then(async (res: any) => {
        console.log(res);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding User",
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

  public deleteUser = async (userID: any) => {
    let returnData = {};
    await User(process.env.DB_NAME as string).findOneAndDelete({ userID: userID }).then(async (res: any) => {
      if (!res) {
        returnData = {
          Message: "Failure",
          data: "No User Found",
        };
      } else {
        returnData = {
          Message: "Success",
          data: `Deleted ${res}`,
        };
      }
    });
    return await returnData;
  };

  public getAllSelectedUsers = async (Page: any) => {
    let returnData = {};
    const resultsPerPage = 30;
    let page = Page >= 1 ? Page : 1;
    page = page - 1;

    await User(process.env.DB_NAME as string).find()
      .limit(resultsPerPage)
      .skip(resultsPerPage * page)
      .then(async (results) => {
        // console.log(results)
        returnData = await {
          Message: "Success",
          data: results,
        };
      })
      .catch(async (err) => {
        returnData = await {
          Message: "Failure",
          data: "Error finding User",
        };
      });
    return await returnData;
  };

  public getUserDetails = async (userID: any) => {
    let returnData = {};

    await User(process.env.DB_NAME as string).find({ userID: userID })
      .then(async (res) => {
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error finding users",
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

  public checkUserExists = async (firebaseUID: any) => {
    let returnData = {};
    await User(process.env.DB_NAME as string).find({ firebaseUID: firebaseUID })
      .then(async (res) => {
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error User Not Found",
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

  public checkUserEmailExists = async (email: any) => {
    let returnData = {};
    await User(process.env.DB_NAME as string).find({ email: email })
      .then(async (res) => {
        console.log(res, "user", email);
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error User Not Found",
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

  public checkUserMobileNoExists = async (mobileNo: any) => {
    let returnData = {};
    console.log(mobileNo);
    await User(process.env.DB_NAME as string).find({ mobileNo: mobileNo })
      .then(async (res) => {
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Error User Not Found",
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

  public loginUserNew = async (body: any) => {
    console.log(body);
    SendMail(body.email);
    let returnData = {};
    if (body.email) {
      await User(process.env.DB_NAME as string).find({ email: body.email, password: body.password })
        .then(async (res) => {
          if (!res || res.length === 0) {
            returnData = {
              Message: "Failure",
              data: "Email or password is wrong",
            };
          } else {
            returnData = {
              Message: "Success",
              data: res,
            };
          }
        })
        .catch((e) => console.log(e));
    } else if (body.mobileNo) {
      await User(process.env.DB_NAME as string).find({ mobileNo: body.mobileNo, password: body.password })
        .then(async (res) => {
          if (!res || res.length === 0) {
            returnData = {
              Message: "Failure",
              data: "Mobile No or password is wrong",
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

  public loginUserAuthenticator = async (Email: any) => {
    let returnData = {};
    await User(process.env.DB_NAME as string).find({ email: Email })
      .then(async (res) => {
        if (!res || res.length === 0) {
          returnData = {
            Message: "Failure",
            data: "Email or password is wrong",
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

  public loginUser = async (body: any) => {
    let returnData = {};
    let otp = await otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      Symbol: false,
    });
    let user = await User(process.env.DB_NAME as string).find({ mobileNo: body.mobileNo });
    // console.log(otp, 'otp');
    await client.messages
      .create({
        body: `Your OTP: ${otp}`,
        from: `${process.env.TWILIO_PHONE_NO}`,
        to: body.mobileNo,
      })
      .then((message: any) => {
        console.log(message.body);
        if (user.length === 0) {
          returnData = {
            Message: "Success",
            data: [
              {
                OTP: message.body,
                Validity: "within next 24 hours",
              },
            ],
          };
        } else {
          returnData = {
            Message: "Success",
            data: [
              {
                OTP: message.body,
                Validity: "within next 24 hours",
                User: "User is Already registered",
              },
            ],
          };
        }
      });
    return await returnData;
  };

  public createNewUser = async (Body: any) => {
    let returnData = {};
    let addressArray: any[] = [];
    let loc: any = {};
    if (Body.addresses) {
      Body.addresses.map((address: any) => {
        address.addressID = nanoid();
        addressArray.push(address);
      });
    }

    if (Body.longitude && Body.latitude) {
      loc = {
        type: "Point",
        coordinates: [Body.longitude, Body.latitude],
      };
    }

    if (Body.firebaseUID) {
      await User(process.env.DB_NAME as string).find({ firebaseUID: Body.firebaseUID }).then(
        async (fire: any) => {
          if (fire.length) {
            returnData = {
              Message: "Failure",
              data: "Firebase ID exists",
            };
          } else {
            if (Body.mobileNo) {
              await User(process.env.DB_NAME as string).find({ mobileNo: Body.mobileNo }).then(
                async (res: any) => {
                  console.log(res, "mobile no response");
                  if (res.length) {
                    returnData = {
                      Message: "Failure",
                      data: "Phone No already exists",
                    };
                  } else {
                    let user = new (User(process.env.DB_NAME as string))({
                      firebaseUID: Body.firebaseUID,
                      consumerId: Body.consumerId,
                      userID: nanoid(),
                      name: Body.name,
                      image: Body.image,
                      email: Body.email,
                      password: Body.password,
                      mobileNo: Body.mobileNo,
                      dob: Body.dob,
                      altMobileNo: Body.altMobileNo,
                      gender: Body.gender,
                      addresses: Body.addresses,
                      accountCreatedOn: Date.now(),
                      countryCode: Body.countryCode,
                    });
                    // console.log(Body);
                    await user
                      .save()
                      .then(async (response: any) => {
                        if (!response) {
                          returnData = {
                            Message: "Failure",
                            data: "User is not created",
                          };
                        } else {
                          console.log("Here sending notification to user...");
                          NotificationControllerV1.sendTopicBasedNotification({
                            highlights: "",
                            intent: ENotificationIntent.INDIVIDUAL,
                            userId: response?.userID,
                            meta: { ...response._doc },
                            outletChainId: process?.env?.MENU_KEY as string,
                            topic: ENotificationTopics.USER_REGISTERED,
                          })
                            .then(() => {})
                            .catch((e) => console.error(e));
                          returnData = {
                            Message: "Success",
                            data: response,
                          };
                        }
                      })
                      .catch((err: any) => {
                        console.log(err);
                        returnData = {
                          Message: "Failure",
                          data: err,
                        };
                      });
                  }
                }
              );
            } else {
              await User(process.env.DB_NAME as string).find({ email: Body.email }).then(async (res: any) => {
                console.log(res, "Email response");
                if (res.length) {
                  returnData = {
                    Message: "Failure",
                    data: "Email already exists",
                  };
                } else {
                  let user = new (User(process.env.DB_NAME as string))({
                    firebaseUID: Body.firebaseUID,
                    consumerId: Body.consumerId,
                    userID: nanoid(),
                    name: Body.name,
                    image: Body.image,
                    email: Body.email,
                    password: Body.password,
                    mobileNo: Body.mobileNo,
                    dob: Body.dob,
                    altMobileNo: Body.altMobileNo,
                    gender: Body.gender,
                    addresses: Body.addresses,
                    accountCreatedOn: Date.now(),
                    countryCode: Body.countryCode,
                  });
                  // console.log(Body);
                  await user
                    .save()
                    .then(async (response: any) => {
                      if (!response) {
                        returnData = {
                          Message: "Failure",
                          data: "User is not created",
                        };
                      } else {
                        console.log("Here sending notification to user...");
                        NotificationControllerV1.sendTopicBasedNotification({
                          highlights: "",
                          intent: ENotificationIntent.INDIVIDUAL,
                          userId: response?.userID,
                          meta: { ...response._doc },
                          outletChainId: process?.env?.MENU_KEY as string,
                          topic: ENotificationTopics.USER_REGISTERED,
                        })
                          .then(() => {})
                          .catch((e) => console.error(e));
                        returnData = {
                          Message: "Success",
                          data: response,
                        };
                      }
                    })
                    .catch((err: any) => {
                      console.log(err);
                      returnData = {
                        Message: "Failure",
                        data: err,
                      };
                    });
                }
              });
            }
          }
        }
      );
      return await returnData;
    } else {
      if (Body.mobileNo) {
        await User(process.env.DB_NAME as string).find({ mobileNo: Body.mobileNo }).then(async (res: any) => {
          console.log(res, "mobile no response");
          if (res.length) {
            returnData = {
              Message: "Failure",
              data: "Phone No already exists",
            };
          } else {
            let user = new (User(process.env.DB_NAME as string))({
              firebaseUID: Body.firebaseUID,
              consumerId: Body.consumerId,
              userID: nanoid(),
              name: Body.name,
              image: Body.image,
              email: Body.email,
              password: Body.password,
              mobileNo: Body.mobileNo,
              dob: Body.dob,
              altMobileNo: Body.altMobileNo,
              gender: Body.gender,
              addresses: Body.addresses,
              location: loc,
              accountCreatedOn: Date.now(),
              countryCode: Body.countryCode,
            });
            // console.log(Body);
            await user
              .save()
              .then(async (response: any) => {
                if (!response) {
                  returnData = {
                    Message: "Failure",
                    data: "User is not created",
                  };
                } else {
                  console.log("Here sending notification to user...");
                  NotificationControllerV1.sendTopicBasedNotification({
                    highlights: "",
                    intent: ENotificationIntent.INDIVIDUAL,
                    userId: response?.userID,
                    meta: { ...response._doc },
                    outletChainId: process?.env?.MENU_KEY as string,
                    topic: ENotificationTopics.USER_REGISTERED,
                  })
                    .then(() => {})
                    .catch((e) => console.error(e));
                  returnData = {
                    Message: "Success",
                    data: response,
                  };
                }
              })
              .catch((err: any) => {
                console.log(err);
                returnData = {
                  Message: "Failure",
                  data: err,
                };
              });
          }
        });
      } else {
        await User(process.env.DB_NAME as string).find({ email: Body.email }).then(async (res: any) => {
          console.log(res, "Email response");
          if (res.length) {
            returnData = {
              Message: "Failure",
              data: "Email already exists",
            };
          } else {
            let user = new (User(process.env.DB_NAME as string))({
              firebaseUID: Body.firebaseUID,
              consumerId: Body.consumerId,
              userID: nanoid(),
              name: Body.name,
              image: Body.image,
              email: Body.email,
              password: Body.password,
              mobileNo: Body.mobileNo,
              dob: Body.dob,
              altMobileNo: Body.altMobileNo,
              gender: Body.gender,
              addresses: Body.addresses,
              location: loc,
              accountCreatedOn: Date.now(),
              countryCode: Body.countryCode,
            });
            // console.log(Body);
            await user
              .save()
              .then(async (response: any) => {
                if (!response) {
                  returnData = {
                    Message: "Failure",
                    data: "User is not created",
                  };
                } else {
                  console.log("Here sending notification to user...");
                  NotificationControllerV1.sendTopicBasedNotification({
                    highlights: "",
                    intent: ENotificationIntent.INDIVIDUAL,
                    userId: response?.userID,
                    meta: { ...response._doc },
                    outletChainId: process?.env?.MENU_KEY as string,
                    topic: ENotificationTopics.USER_REGISTERED,
                  })
                    .then(() => {})
                    .catch((e) => console.error(e));
                  returnData = {
                    Message: "Success",
                    data: response,
                  };
                }
              })
              .catch((err: any) => {
                console.log(err);
                returnData = {
                  Message: "Failure",
                  data: err,
                };
              });
          }
        });
      }
    }

    return await returnData;
  };

  public updateUser = async (userID: any, Body: any) => {
    let returnData = {};
    let loc = {
      type: "Point",
      coordinates: [Body.longitude, Body.latitude],
    };
    Body.location = loc;
    await User(process.env.DB_NAME as string).findOneAndUpdate({ userID: userID }, Body, { new: true }).then(
      async (res: any) => {
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "No User Found",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res,
          };
        }
      }
    );
    return await returnData;
  };

  public getAddress = async (userID: any) => {
    let returnData = {};
    await User(process.env.DB_NAME as string).find({ userID: userID }, { addresses: 1 }).then(
      async (res: any) => {
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "No Address Found",
          };
        } else {
          returnData = {
            Message: "Success",
            data: res[0],
          };
        }
      }
    );
    return await returnData;
  };

  public getSingleAddress = async (userID: any, addressID: any) => {
    let returnData = {};
    await User(process.env.DB_NAME as string).find(
      { userID: userID, "addresses.addressID": addressID },
      { addresses: 1 }
    ).then(async (res: any) => {
      if (!res) {
        returnData = {
          Message: "Failure",
          data: "No Address Found",
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

  public updateAddress = async (userID: any, addressID: any, Body: any) => {
    let returnData = {};
    let obj = {};
    if (Body.default === true) {
      console.log(Body.default);
      await User(process.env.DB_NAME as string).updateMany(
        { userID: userID },
        { $set: { "addresses.$[].default": false } }
      ).then((res) => {
        console.log(res, "update many");
      });
    }

    obj = {
      "addresses.$.type": Body.type,
      "addresses.$.openWeekends": Body.openWeekends,
      "addresses.$.name": Body.name,
      "addresses.$.contact": Body.contact,
      "addresses.$.address": Body.address,
      "addresses.$.landmark": Body.landmark,
      "addresses.$.city": Body.city,
      "addresses.$.zipcode": Body.zipcode,
      "addresses.$.state": Body.state,
      "addresses.$.country": Body.country,
      "addresses.$.default": Body.default,
    };

    await User(process.env.DB_NAME as string).update(
      { userID: userID, "addresses.addressID": addressID },
      { $set: obj }
    ).then(async (res: any) => {
      if (!res) {
        returnData = {
          Message: "Failure",
          data: "No Address Found",
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

  public patchAddress = async (userID: any, addressID: any, Body: any) => {
    let returnData = {};
    await User(process.env.DB_NAME as string).updateOne(
      { userID: userID, "addresses.addressID": addressID },
      { $set: Body }
    ).then(async (res: any) => {
      if (!res) {
        returnData = {
          Message: "Failure",
          data: "No Address Found",
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

  public deleteAddress = async (userID: any, addressID: any) => {
    let returnData = {};
    await User(process.env.DB_NAME as string).updateOne(
      { userID: userID },
      { $pull: { addresses: { addressID: addressID } } }
    ).then(async (res: any) => {
      if (!res) {
        returnData = {
          Message: "Failure",
          data: "No Address Found",
        };
      } else {
        returnData = {
          Message: "Success",
          data: "Address Deleted Successfully",
        };
      }
    });
    return await returnData;
  };

  public addAddress = async (userID: any, Body: any) => {
    let returnData = {};
    Body.addressID = nanoid();
    if (Body.default === true) {
      console.log(Body.default);
      await User(process.env.DB_NAME as string).updateMany(
        { userID: userID },
        { $set: { "addresses.$[].default": false } }
      ).then((res) => {
        console.log(res, "update many");
      });
    }
    await User(process.env.DB_NAME as string).updateOne(
      { userID: userID },
      { $push: { addresses: Body } },
      { addresses: 1 }
    ).then(async (res: any) => {
      if (!res) {
        returnData = {
          Message: "Failure",
          data: "No User Found",
        };
      } else {
        returnData = {
          Message: "Success",
          data: "Address Added Successfully",
        };
      }
    });
    return await returnData;
  };

  public updatePatchUser = async (userID: any, Body: any) => {
    let returnData = {};
    await User(process.env.DB_NAME as string).updateOne({ userID: userID }, { $set: Body }).then(
      async (res: any) => {
        if (!res) {
          returnData = {
            Message: "Failure",
            data: "No User Found",
          };
        } else {
          returnData = {
            Message: "Success",
            data: "User updated succesfully",
          };
        }
      }
    );
    return await returnData;
  };
}

export default UserController;
