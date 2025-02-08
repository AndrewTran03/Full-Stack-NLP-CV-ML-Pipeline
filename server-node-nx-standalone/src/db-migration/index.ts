import { BaseDataSourcePropertyOptions } from "../utils/types";
import * as Migration0001 from "./1737054881502-migration_0001";
import * as Migration0002 from "./1737055481500-migration_0002";

export const MIGRATIONS: BaseDataSourcePropertyOptions<"migrations"> = [
  Migration0001.Migration11737054881502,
  Migration0002.Migration21737055481500
];
