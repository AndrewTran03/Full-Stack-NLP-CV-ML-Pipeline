import { DataSource } from "typeorm";

import LOGGER from "./logger";
import { AppDataSourceTypeORM } from "./typeorm-data-source";
import { Optional } from "./types";

async function startDBConnection(): Promise<DataSource> {
  // try {
  //   log.info("Establishing SQLite3 connection (with TypeORM)...");
  //   await AppDataSourceTypeORM.initialize();
  //   if (AppDataSourceTypeORM.isInitialized) {
  //     log.info("Successfully established SQLite3 connection (with TypeORM).");
  //     return AppDataSourceTypeORM;
  //   }
  //   log.debug("Got here");
  //   throw new Error("Failed to establish SQLite3 connection.");
  // } catch (error: unknown) {
  //   const err = error as Error;
  //   log.error("Error starting the server:", err.message);
  //   log.error("Failed to establish SQLite3 connection. Exiting the application.");
  //   process.exit(1);
  // }
  return new Promise((resolve, reject) => {
    LOGGER.info("Establishing SQLite3 connection (with TypeORM)...");
    AppDataSourceTypeORM.initialize()
      .then((dataSource) => {
        LOGGER.info("SQLite3 Database connection established successfully.");
        resolve(dataSource);
      })
      .catch((error) => {
        LOGGER.error("Error connecting to the database:", error);
        reject(error);
      });
  });
}

async function closeDBConnection(
  connection: Optional<DataSource>
): Promise<void> {
  LOGGER.trace(
    `Shutting down the SQLite3 connection (with TypeORM)...${
      connection
        ? "CONNECTION CURRENTLY ACTIVE!"
        : " No connection found currently."
    }`
  );
  await connection?.destroy();
  LOGGER.trace("SQLite3 Database connection closed.");
  process.exit(0);
}

export { closeDBConnection, startDBConnection };
