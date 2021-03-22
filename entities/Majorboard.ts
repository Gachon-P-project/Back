import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Majorreply } from "./Majorreply";

@Index("user_no", ["userNo"], {})
@Entity("MAJORBOARD", { schema: "moga_db" })
export class Majorboard {
  @PrimaryGeneratedColumn({ type: "int", name: "post_no" })
  postNo!: number;

  @Column("varchar", { name: "post_title", length: 60 })
  postTitle!: string;

  @Column("varchar", { name: "post_contents", length: 1000 })
  postContents!: string;

  @Column("varchar", { name: "wrt_date", length: 30 })
  wrtDate!: string;

  @Column("varchar", { name: "reply_yn", length: 1 })
  replyYn!: string;

  @Column("varchar", { name: "major_name", length: 30 })
  majorName!: string;

  @Column("int", { name: "user_no" })
  userNo!: number;

  @Column("int", { name: "board_flag" })
  boardFlag!: number;

  @ManyToOne(() => User, (user) => user.majorboards, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2!: User;

  @OneToMany(() => Majorreply, (majorreply) => majorreply.postNo2)
  majorreplies!: Majorreply[];
}
