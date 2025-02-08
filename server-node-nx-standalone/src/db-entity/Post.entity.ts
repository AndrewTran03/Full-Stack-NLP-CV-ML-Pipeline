import "reflect-metadata";

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", default: "" })
  title!: string;

  @Column({ type: "text", default: "" })
  content!: string;

  @Column({ type: "text", default: "" })
  author!: string;
}
