import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Freereply } from "./Freereply";
import { User } from "./User";

@Index("user_no", ["userNo"], {})
@Entity("FREEBOARD", { schema: "moga_db" })
export class Freeboard {
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

  @Column("int", { name: "user_no" })
  userNo!: number;

  @Column("int", { name: "board_flag" })
  boardFlag!: number;

  @OneToMany(() => Freereply, (freereply) => freereply.postNo2)
  freereplies!: Freereply[];

  @ManyToOne(() => User, (user) => user.freeboards, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  user!: User;
}
