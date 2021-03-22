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
import { Reply } from "./Reply";
import { Scrap } from "./Scrap";

@Index("idx_user_no", ["userNo"], {})
@Entity("BOARD", { schema: "moga_db" })
export class Board {
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

  @Column("varchar", { name: "subject_name", length: 30 })
  subjectName!: string;

  @Column("varchar", { name: "professor_name", length: 30 })
  professorName!: string;

  @Column("int", { name: "user_no" })
  userNo!: number;

  @Column("int", { name: "board_flag", default: () => "'0'" })
  boardFlag!: number;

  @ManyToOne(() => User, (user) => user.boards, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_no", referencedColumnName: "userNo" }])
  userNo2!: User;

  @OneToMany(() => Reply, (reply) => reply.postNo2)
  replies!: Reply[];

  @OneToMany(() => Scrap, (scrap) => scrap.postNo2)
  scraps!: Scrap[];
}
