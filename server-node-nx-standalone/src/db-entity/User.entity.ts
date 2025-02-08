import "reflect-metadata";

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", default: "" })
  firstName!: string;

  @Column({ type: "text", default: "" })
  lastName!: string;

  @Column({ type: "integer", default: 0 })
  age!: number;

  @Column({ type: "text", default: "" })
  email!: string;

  @Column({ type: "text", default: "" })
  password!: string;

  @Column({ type: "text", default: "" })
  role!: string;

  @Column({ type: "boolean", default: false })
  isActive!: boolean;
}
