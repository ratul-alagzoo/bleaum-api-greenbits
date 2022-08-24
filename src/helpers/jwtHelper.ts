import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import e from "express";
dotenv.config();

export const generateJWT = async (data: any) => {
  const privateKey = process.env.TOKEN_KEY as jwt.Secret;
  const expiry = process.env.TOKEN_EXPIRY;
  //   console.log("Private key is: ", privateKey, "Expiry is: ", expiry);
  try {
    return await jwt.sign(data, privateKey, { expiresIn: expiry });
  } catch (e) {
    console.error("JWT generation error : ", e);
    return null;
  }
};

export const verifyJWT = async (token: any) => {
  const privateKey = process.env.TOKEN_KEY as jwt.Secret;
  try {
    let extracted = (await jwt.verify(token, privateKey)) as any;

    if (!!extracted?.data) {
      return extracted.data;
    }

    throw new Error("Token is not valid");
  } catch (e) {
    return null;
  }
};
