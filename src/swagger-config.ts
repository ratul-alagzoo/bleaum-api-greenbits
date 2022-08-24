import { Options } from "swagger-jsdoc";
const swaggerJSDoc = require("swagger-jsdoc");
import * as swaggerUI from "swagger-ui-express";
import * as express from "express";
import { Router } from "express";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Docs",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080/",
      },
      {
        url: "https://dev-cc.herokuapp.com/",
      },
    ],
  },
  apis: [`${__dirname}/routers/api/*.ts`],
};

export class SwaggerDOC {
  public router: Router;
  constructor() {
    let docSpecs = swaggerJSDoc(swaggerOptions);
    this.router = express.Router();
    this.router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docSpecs));
  }
}
