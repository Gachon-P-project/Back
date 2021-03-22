import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("professor_code", ["professorCode"], { unique: true })
@Entity("PROFESSOR", { schema: "moga_db" })
export class Professor {
  @PrimaryGeneratedColumn({ type: "int", name: "professor_no" })
  professorNo!: number;

  @Column("varchar", { name: "professor_code", unique: true, length: 30 })
  professorCode!: string;

  @Column("varchar", { name: "professor_name", length: 30 })
  professorName!: string;

  @Column("varchar", { name: "major_names", length: 100 })
  majorNames!: string;
}
