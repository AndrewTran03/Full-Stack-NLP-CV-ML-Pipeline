import express, { NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import amqp from "amqplib";

import APP_ROUTER from "./routes";
import LOGGER from "./utils/logger";
import { startRabbitMQConnection } from "./utils/rabbitmq";
import assert from "assert";

const BACKEND_HOST = process.env.HOST ?? "localhost";
const BACKEND_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

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

LOGGER.trace("GOT HERE");

const RABBITMQ_URL = "amqp://guest:guest@localhost:5672";

let connection: amqp.Connection | null = null;

const server = http.createServer(app);
server.listen(BACKEND_PORT, BACKEND_HOST, async () => {
  LOGGER.info(`Server is running on "http://${BACKEND_HOST}:${BACKEND_PORT}"`);
  const createdConnection = await startRabbitMQConnection(RABBITMQ_URL);
  connection = createdConnection;
  assert(connection != null, "Connection not created properly");
});
server.on("error", shutdown);

function shutdown(): void {
  connection?.close();
}

export { connection as RABBITMQ_CONNECTION };
