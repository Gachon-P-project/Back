import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Freeboard } from "./Freeboard";

@Index("user_no", ["userNo"], {})
@Index("post_no", ["postNo"], {})
@Entity("FREEREPLY", { schema: "moga_db" })
export class Freereply {
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

  @Column("int", { name: "depth", nullable: true, default: () => "'0'" })
  depth!: number | null;

  @Column("int", { name: "bundle_id", nullable: true })
  bundleId!: number | null;

  @Column("int", { name: "is_deleted", nullable: true, default: () => "'0'" })
  isDeleted!: number | null;

  @Column("int", { name: "board_flag", nullable: true })
  boardFlag!: number | null;

  @ManyToOne(() => User, (user) => user.freereplies, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2!: User;

  @ManyToOne(() => Freeboard, (freeboard) => freeboard.freereplies, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "post_no", referencedColumnName: "postNo" }])
  postNo2!: Freeboard;
}
