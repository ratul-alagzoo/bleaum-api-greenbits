import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../helpers/jwtHelper";
export const checkIfAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["my-token"];
  const extracted = await verifyJWT(token);
  if (!extracted) {
    return res.status(401).send({
      Message: "Failure",
    });
  } else {
    //@ts-ignore
    req.extracted = extracted;
    return next();
  }
};
