import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Board } from "./Board";
import { User } from "./User";

@Index("idx_user_no", ["userNo"], {})
@Index("idx_post_no", ["postNo"], {})
@Entity("REPLY", { schema: "moga_db" })
export class Reply {
  @PrimaryGeneratedColumn({ type: "int", name: "reply_no" })
  replyNo!: number;

  @Column("varchar", { name: "reply_contents", length: 150 })
  replyContents!: string;

  @Column("varchar", { name: "wrt_date", length: 30 })
  wrtDate!: string;

  @Column("int", { name: "user_no" })
  userNo!: number;

  @Column("int", { name: "post_no" })
  postNo!: number;

  @Column("int", { name: "depth", default: () => "'0'" })
  depth!: number;

  @Column("int", { name: "bundle_id", nullable: true })
  bundleId!: number | null;

  @Column("int", { name: "is_deleted", default: () => "'0'" })
  isDeleted!: number;

  @ManyToOne(() => Board, (board) => board.replies, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "post_no", referencedColumnName: "postNo" }])
  postNo2!: Board;

  @ManyToOne(() => User, (user) => user.replies, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2!: User;
}
