import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("subject_code_UNIQUE", ["subjectCode"], { unique: true })
@Entity("SUBJECT", { schema: "moga_db" })
export class Subject {
  @PrimaryGeneratedColumn({ type: "int", name: "subject_no" })
  subjectNo!: number;

  @Column("varchar", { name: "subject_code", unique: true, length: 30 })
  subjectCode!: string;

  @Column("varchar", { name: "subject_name", length: 70 })
  subjectName!: string;

  @Column("varchar", { name: "major_names", length: 100 })
  majorNames!: string;

  @Column("varchar", {
    name: "subject_url",
    nullable: true,
    length: 50,
    default: () => "''",
  })
  subjectUrl!: string | null;

  @Column("varchar", {
    name: "subject_member_code",
    nullable: true,
    length: 30,
  })
  subjectMemberCode!: string | null;
}
