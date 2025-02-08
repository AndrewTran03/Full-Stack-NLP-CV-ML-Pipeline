import "reflect-metadata";

import amqp from "amqplib";
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction } from "express";
import http from "http";
import { DataSource } from "typeorm";

import APP_ROUTER from "./routes";
import LOGGER from "./utils/logger";
import { startRabbitMQConnection } from "./utils/rabbitmq";
import {
  closeDBConnection,
  startDBConnection
} from "./utils/typeorm-connection";
import { testTypeORM } from "./utils/typeorm-test";
import { Optional } from "./utils/types";

const BACKEND_HOST = process.env["HOST"] ?? "localhost";
const BACKEND_PORT = process.env["PORT"] ? Number(process.env["PORT"]) : 3000;

const app = express();
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
app.use(cors({ credentials: true }));
app.use(APP_ROUTER);
app.use((_, res, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, HEAD, TRACE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const RABBITMQ_URL = "amqp://guest:guest@localhost:5672";

let rabbitmqConnection: Optional<amqp.Connection> = null;
let typeormConnection: Optional<DataSource> = null;

// NOTE: Only allowable with "Top-Level Await" setup with ESModules
// await Promise.all([
//   startRabbitMQConnection(RABBITMQ_URL),
//   startDBConnection()
// ])
//   .then(([rabbitmq, typeorm]) => {
//     LOGGER.info(JSON.stringify(rabbitmq));
//     LOGGER.info(JSON.stringify(typeorm));
//     rabbitmqConnection = rabbitmq;
//     typeormConnection = typeorm;
//   })
//   .catch((error: unknown) => {
//     LOGGER.error("Error starting the server:", error);
//     LOGGER.error("Failed to establish connections. Exiting the application.");
//     process.exit(1);
//   });

// const [rabbitmqConnection, typeormConnection] = await promiseResults;
// LOGGER.info(rabbitmqConnection);
// LOGGER.info(typeormConnection);

const server = http.createServer(app);
server.listen(BACKEND_PORT, BACKEND_HOST, async () => {
  LOGGER.info(`Server is running on "http://${BACKEND_HOST}:${BACKEND_PORT}"`);
  await initDependencies();
});
server.on("error", shutdown);
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function initDependencies(): Promise<void> {
  const createdRabbitMQConnection = await startRabbitMQConnection(RABBITMQ_URL);
  rabbitmqConnection = createdRabbitMQConnection;
  const createdAppDataSource = await startDBConnection();
  typeormConnection = createdAppDataSource;
  await testTypeORM();
  LOGGER.info("All App Dependencies initialized successfully.");
}

app.use(APP_ROUTER);

function shutdown() {
  LOGGER.warn("Shutting down server...");
  rabbitmqConnection?.close();
  closeDBConnection(typeormConnection);
  server.close(() => {
    LOGGER.warn("Server closed. Exiting process...");
    process.exit(0);
  });
}

export {
  rabbitmqConnection as RABBITMQ_CONNECTION,
  typeormConnection as SQLITE_TYPEORM_CONNECTION
};
