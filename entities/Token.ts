import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("TOKEN", { schema: "moga_db" })
export class Token {
  @PrimaryGeneratedColumn({ type: "int", name: "token_id" })
  tokenId!: number;

  @Column("varchar", { name: "token", length: 200 })
  token!: string;

  @Column("int", { name: "user_no" })
  userNo!: number;

  @Column("varchar", { name: "reg_date", length: 30 })
  regDate!: string;

  @Column("varchar", { name: "user_major", length: 30 })
  userMajor!: string;
}
