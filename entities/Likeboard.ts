import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("user_no", ["userNo"], {})
@Entity("LIKEBOARD", { schema: "moga_db" })
export class Likeboard {
  @PrimaryGeneratedColumn({ type: "int", name: "like_no" })
  likeNo!: number;

  @Column("int", { name: "post_no" })
  postNo!: number;

  @Column("int", { name: "user_no" })
  userNo!: number;

  @Column("int", { name: "board_flag" })
  boardFlag!: number;

  @ManyToOne(() => User, (user) => user.likeboards, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2!: User;
}
