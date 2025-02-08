import { DataSource } from "typeorm";

import { ENTITIES } from "../db-entity";
import { MIGRATIONS } from "../db-migration";

/**
 * DataSource for TypeORM.
 *
 * @tutorial [TypeORM-DataSource](https://orkhan.gitbook.io/typeorm/docs/data-source-options)
 * @tutorial [TypeORM-DB-Entities](https://orkhan.gitbook.io/typeorm/docs/entities)
 * @tutorial [TypeORM-DB-Migrations](https://orkhan.gitbook.io/typeorm/docs/migrations)
 */
export const AppDataSourceTypeORM = new DataSource({
  type: "sqlite",
  database: "./src/db/database.sqlite",
  synchronize: false,
  logging: true,
  entities: ENTITIES,
  migrations: MIGRATIONS,
  subscribers: []
});
