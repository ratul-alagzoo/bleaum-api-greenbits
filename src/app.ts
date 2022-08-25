import express from "express";
import * as bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { createServer, Server as HttpServer } from "http";
import socket from "./socket";
import { mapClientsMiddleware } from "./middlewares/mapClients.middleware";
dotenv.config();

class App {
  public app: express.Application;
  public port: number;
  public httpServer: HttpServer;
  public static io: Server;

  constructor(controllers: any, port: any) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.connectToDatabase();

    this.httpServer = createServer(this.app);
    App.io = new Server(this.httpServer);
  }

  private initializeMiddlewares() {
    this.app.use(cookieParser());
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ limit: "50mb" }));
    this.app.use(
      cors({
        credentials: true,
        origin: /[\s\S]*/,
        exposedHeaders: ["set-cookie"],
      })
    );
    this.app.use(bodyParser.json());
    this.app.use(mapClientsMiddleware);
  }

  private initializeControllers(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use("/", controller.router);
    });
  }

  private connectToDatabase() {
    const options = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: true, //make this also true
    };

    mongoose
      .connect(`${process.env.MONGO_URL}`, options)
      .then(() => {
        console.log("Mongo Connected!!!");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  public listen() {
    // this.app.listen(this.port, () => {
    //   console.log(`App listening on the port ${this.port}`);
    // });
    this.httpServer.listen(this.port, () => {
      console.log(`Server is listening on port: `, this.port);
      socket({ io: App.io });
    });
  }
}

export default App;
