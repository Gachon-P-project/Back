import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("RECENT", { schema: "moga_db" })
export class Recent {
  @PrimaryGeneratedColumn({ type: "int", name: "recent_id" })
  recentId!: number;

  @Column("int", { name: "major_code" })
  majorCode!: number;

  @Column("varchar", { name: "recent_title", length: 70 })
  recentTitle!: string;

  @Column("int", { name: "recent_num" })
  recentNum!: number;
}
