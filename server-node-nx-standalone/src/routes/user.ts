import express from "express";
import { DataSource, QueryRunner } from "typeorm";

import { User } from "../db-entity/User.entity";
import {
  closeDBConnection,
  startDBConnection
} from "../utils/typeorm-connection";
import { Optional } from "../utils/types";
import {
  createExpressResponse,
  getDefaultExpressReturnStatus,
  HTTP_STATUS_CODE
} from "./utils";

const router = express.Router();

router.get("/api/user", async (_, res) => {
  let typeormConnection: Optional<DataSource> = null;
  let returnStatus = getDefaultExpressReturnStatus<User[]>();
  let queryRunner: Optional<QueryRunner> = null;

  try {
    typeormConnection = await startDBConnection();

    queryRunner = typeormConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const users = await queryRunner.manager.find(User, {
      select: ["id", "firstName"]
    });

    await queryRunner.commitTransaction();

    returnStatus = { status: HTTP_STATUS_CODE.OK, message: users };
  } catch (error: unknown) {
    await queryRunner?.rollbackTransaction();

    const err = error as Error;
    returnStatus = {
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: err.message
    };
  } finally {
    await queryRunner?.release();
    await closeDBConnection(typeormConnection);
  }
  return createExpressResponse(res, returnStatus);
});

router.delete("/api/user/:id", async (req, res) => {
  const { id } = req.params as { id: string };
  const parsedParamId = parseInt(id);
  let typeormConnection: Optional<DataSource> = null;
  let returnStatus = getDefaultExpressReturnStatus<User>();
  let queryRunner: Optional<QueryRunner> = null;

  try {
    typeormConnection = await startDBConnection();

    queryRunner = typeormConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userToDelete = await queryRunner.manager.findOne(User, {
      where: { id: parsedParamId }
    });
    if (userToDelete == null) {
      returnStatus = {
        status: HTTP_STATUS_CODE.NOT_FOUND,
        message: `User with ID: ${id} not found.`
      };
    } else {
      await queryRunner.manager.remove(User, userToDelete);
      await queryRunner.commitTransaction();
      returnStatus = { status: HTTP_STATUS_CODE.OK, message: userToDelete };
    }
  } catch (error: unknown) {
    await queryRunner?.rollbackTransaction();

    const err = error as Error;
    returnStatus = {
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: err.message
    };
  } finally {
    await queryRunner?.release();
    await closeDBConnection(typeormConnection);
  }
  return createExpressResponse(res, returnStatus);
});

export { router as USER_ROUTER };
