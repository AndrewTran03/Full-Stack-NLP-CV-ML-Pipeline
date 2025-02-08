import { BaseDataSourceOptions } from "typeorm/data-source/BaseDataSourceOptions";

export type Optional<T> = T | null;

export type BaseDataSourcePropertyOptions<
  T extends keyof BaseDataSourceOptions
> = NonNullable<BaseDataSourceOptions[T]>;
