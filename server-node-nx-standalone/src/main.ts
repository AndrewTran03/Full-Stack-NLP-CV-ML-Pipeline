// /* eslint-disable import/first */
// import dotenv from "dotenv";
// import path from "path";

// // Checking for a valid 'NODE_ENV' variable configuration
// let ENV_FILE_PATH = "";
// // eslint-disable-next-line no-console
// console.log(process.env["NODE_ENV"]);
// if (process.env["NODE_ENV"] === "development") {
//   ENV_FILE_PATH = "../../../.env.development";
// } else if (
//   process.env["NODE_ENV"] === "production" ||
//   process.env["NODE_ENV"] === "staging"
// ) {
//   ENV_FILE_PATH = `../../../.env.${process.env["NODE_ENV"]}`;
// } else {
//   /* eslint-disable-next-line no-console */
//   console.error('Invalid configuration for the "NODE_ENV" variable:');
//   /* eslint-disable-next-line no-console */
//   console.error(process.env["NODE_ENV"]);
//   process.exit(1);
// }
// /* eslint-disable-next-line unicorn/prefer-module, no-console */
// console.log(path.resolve(__dirname, ENV_FILE_PATH));
// dotenv.config({
//   debug: true,
//   encoding: "utf8",
//   override: true,
//   /* eslint-disable-next-line unicorn/prefer-module */
//   path: path.resolve(__dirname, ENV_FILE_PATH)
// });

import "reflect-metadata";

import amqp from "amqplib";
import bodyParser from "body-parser";
import config from "config";
import cors from "cors";
import express, { NextFunction } from "express";
import http from "http";
import { DataSource } from "typeorm";
import util from "util";

import { AppConfig } from "../config/types";
import APP_ROUTER from "./routes";
import LOGGER from "./utils/logger";
import { startRabbitMQConnection } from "./utils/rabbitmq";
import {
  closeDBConnection,
  startDBConnection
} from "./utils/typeorm-connection";
import { testTypeORM } from "./utils/typeorm-test";
import { Optional } from "./utils/types";

LOGGER.info("'Config' Internal Object Properties:");
LOGGER.info(util.inspect(process.env, { depth: null }));
LOGGER.trace(util.inspect(config, { depth: null }));

// With Nx, you can only get the "config" package to access environment variables
// if you use the --env-file flag with the "production" script in the "package.json"
// file (and you need a NVM version >= 20.7.0 for this to work).
// REFERENCE #1: https://philna.sh/blog/2023/09/05/nodejs-supports-dotenv/
// REFERENCE #2: https://youtu.be/T_OlUb5YwaU?si=PrUZZjihN4unb6Ev
const appConfig: AppConfig = config.util.toObject(config);
LOGGER.debug(appConfig.backendServerPort);

// TESTING ONLY: "config" package usage
const BACKEND_PORT = config.get<number>("backendServerPort");
LOGGER.info(`Backend Port from "config" package: ${BACKEND_PORT}`);
LOGGER.debug(typeof BACKEND_PORT);
const FRONTEND_PORT = config.get<number>("frontendClientPort");
LOGGER.info(`Frontend Port from "config" package: ${FRONTEND_PORT}`);
LOGGER.debug(typeof FRONTEND_PORT);
const BACKEND_SERVER_URL = config.get<string>("backendServerUrl");
LOGGER.info(`Backend Server URL from "config" package: ${BACKEND_SERVER_URL}`);
LOGGER.debug(typeof BACKEND_SERVER_URL);

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
server.listen(BACKEND_PORT, async () => {
  LOGGER.info(`Server has started on port ${BACKEND_PORT}`);
  LOGGER.info(`Server is running on "${BACKEND_SERVER_URL}"`);
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
