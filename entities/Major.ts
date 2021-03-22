import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("MAJOR", { schema: "moga_db" })
export class Major {
  @PrimaryGeneratedColumn({ type: "int", name: "major_no" })
  majorNo!: number;

  @Column("int", { name: "major_code" })
  majorCode!: number;

  @Column("varchar", { name: "major_code_uv", length: 10 })
  majorCodeUv!: string;

  @Column("varchar", { name: "major_name", length: 20 })
  majorName!: string;
}
