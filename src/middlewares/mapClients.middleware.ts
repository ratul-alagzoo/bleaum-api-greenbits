import express from "express";
import * as dotenv from "dotenv";
const possibleClients: Record<string, string> = {
  //"<outletChainID>|<consumerID>": "<envbSuffix>"
  "df48aa8c-4345-466a-8b8e-e959a2bfcdaa|1": "codys-cannabis",
  "76742ea6-4b29-4e17-a4ff-e3bd416fa121|1": "blooms-for-wellness",
};

export const mapClientsMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const outletChainID = req.headers.outletchainid as string;
    const consumerID = req.headers.consumerid as string;
    const key = `${outletChainID}|${consumerID}`;
    if (!possibleClients[key]) {
      return res.status(403).send("Invalid client info");
    } else {
      const path = `.env.${possibleClients[key]}`;
      await dotenv.config({
        path,
        override: true,
      });
      return next();
    }
  } catch (e) {
    return res.status(500).send();
  }
};
