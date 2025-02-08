import { BaseDataSourcePropertyOptions } from "../utils/types";
import { Post } from "./Post.entity";
import { User } from "./User.entity";

export const ENTITIES: BaseDataSourcePropertyOptions<"entities"> = [Post, User];
