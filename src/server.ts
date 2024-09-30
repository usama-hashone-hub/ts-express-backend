import "reflect-metadata";
import express, { Request } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import jwtStrategy from "./v1/auth/jwtStrategy";
import passport from "passport";
import router from "./routes";
import { RegisterRoutes } from "./tsoa/routes";
import * as swaggerDocument from "./tsoa/swagger.json";
import { createBullBoard } from "bull-board";
import { UserQueueAdapter } from "./v1/user/bull-queues/default.queue";

const app = express();

app.enable("trust proxy");

app.use(cors<Request>());

app.use(helmet());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the Type Safe backend");
});

RegisterRoutes(app);

app.use("/v1/api", router);

app.use("/bull-board", createBullBoard([UserQueueAdapter]).router);

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { app };
