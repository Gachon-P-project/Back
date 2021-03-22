import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Board } from "./Board";

@Index("idx_user_no", ["userNo"], {})
@Index("idx_post_no", ["postNo"], {})
@Entity("SCRAP", { schema: "moga_db" })
export class Scrap {
  @PrimaryGeneratedColumn({ type: "int", name: "scrap_no" })
  scrapNo!: number;

  @Column("int", { name: "user_no" })
  userNo!: number;

  @Column("int", { name: "post_no" })
  postNo!: number;

  @Column("int", { name: "board_flag", nullable: true })
  boardFlag!: number | null;

  @ManyToOne(() => User, (user) => user.scraps, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2!: User;

  @ManyToOne(() => Board, (board) => board.scraps, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "post_no", referencedColumnName: "postNo" }])
  postNo2!: Board;
}
