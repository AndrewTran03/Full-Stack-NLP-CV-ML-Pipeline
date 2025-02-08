import { DeepPartial } from "typeorm";

import { User } from "../db-entity/User.entity";
import { SQLITE_TYPEORM_CONNECTION } from "../main";

type TypeORMEntity<T> = DeepPartial<T>;

export async function testTypeORM(): Promise<void> {
  const userRepo = SQLITE_TYPEORM_CONNECTION!.getRepository(User);
  const userToInsert: TypeORMEntity<User> = {
    firstName: "John",
    lastName: "Smith",
    age: 26
  };

  const user = userRepo.create(userToInsert);
  await userRepo.save(user);
}
