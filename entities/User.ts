import { Column, Entity, OneToMany } from "typeorm";
import { Board } from "./Board";
import { Freereply } from "./Freereply";
import { Likeboard } from "./Likeboard";
import { Majorboard } from "./Majorboard";
import { Majorreply } from "./Majorreply";
import { Reply } from "./Reply";
import { Scrap } from "./Scrap";
import { Freeboard } from "./Freeboard";

@Entity("USER", { schema: "moga_db" })
export class User {
  @Column("int", { primary: true, name: "user_no" })
  userNo!: number;

  @Column("varchar", { name: "user_id", length: 20 })
  userId!: string;

  @Column("varchar", { name: "user_name", length: 20 })
  userName!: string;

  @Column("varchar", { name: "nickname", length: 10 })
  nickname!: string;

  @Column("varchar", { name: "user_major", length: 30 })
  userMajor!: string;

  @Column("int", { name: "auth_level" })
  authLevel!: number;

  @OneToMany(() => Board, (board) => board.userNo2)
  boards!: Board[];

  @OneToMany(() => Freereply, (freereply) => freereply.userNo2)
  freereplies!: Freereply[];

  @OneToMany(() => Likeboard, (likeboard) => likeboard.userNo2)
  likeboards!: Likeboard[];

  @OneToMany(() => Majorboard, (majorboard) => majorboard.userNo2)
  majorboards!: Majorboard[];

  @OneToMany(() => Majorreply, (majorreply) => majorreply.userNo2)
  majorreplies!: Majorreply[];

  @OneToMany(() => Reply, (reply) => reply.userNo2)
  replies!: Reply[];

  @OneToMany(() => Scrap, (scrap) => scrap.userNo2)
  scraps!: Scrap[];

  @OneToMany(() => Freeboard, (freeboard) => freeboard.user)
  freeboards!: Freeboard[];
}
