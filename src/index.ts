import "dotenv/config";
import { createServer } from "http";
import { app } from "./server";
import mongoose from "mongoose";
import { GraphqlServer } from "./graphql";
import mqConnection from "./rabbitmq";

const httpServer = createServer(app);
console.log(process.env.MONGODB_URL, "process.env.MONGODB_URL");
mongoose
  .connect(process.env.MONGODB_URL as string)
  .then(() => {
    console.log("✅ Connected To MongoDb");
  })
  .catch((e) => {
    console.log("❌ Error Connecting Mongodb.......");
  });

GraphqlServer().then((res) => {
  console.log("✅ GraphQl " + res);
});

mqConnection
  .connect()
  .then((res) => {
    console.log(`✅ Rabbit MQ Connection is ready`);
  })
  .catch((err) => {
    console.error("❌ Rabbit MQ Error", err.message);
  });

const unexpectedErrorHandler = (error: Error) => {
  console.error(error);
};

app.listen(process.env.PORT, () => {
  console.log(`✅ Rest: ${process.env.PORT}`);
});

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  if (httpServer) {
    httpServer.close();
  }
});
