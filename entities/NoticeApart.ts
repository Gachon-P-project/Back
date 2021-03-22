import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("NOTICE_APART", { schema: "moga_db" })
export class NoticeApart {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id!: number;

  @Column("varchar", { name: "notice_major", length: 20, default: () => "''" })
  noticeMajor!: string;

  @Column("text", { name: "notice_url" })
  noticeUrl!: string;
}
