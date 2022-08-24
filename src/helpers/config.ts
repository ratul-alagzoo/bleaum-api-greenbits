import * as dotenv from "dotenv";
import { string } from "yup";

dotenv.config();
export const myConfig = {
  greenBitsUsername: process.env.GREEN_BITS_USERNAME as string,
  greenBitsPassword: process.env.GREEN_BITS_PASSWORD as string,
  greenBitsDomain: process.env.GREEN_BITS_DOMAIN as string,
  outletChainId: process.env.OUTLET_CHAIN_ID as string,
  xGbDeviceID: process.env.GREEN_BITS_X_GB_DEVICE_ID as string,
  xGbClient: process.env.GREEN_BITS_X_GB_CLIENT as string,
};
