import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user";

@Entity("invoice", { schema: "AgileDB" })
@Index("fk_invoice_user1_idx", ["userPersonalIdNumber"])
export class Invoice {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id"
  })
  public id!: number;

  @Column("int", {
    nullable: true,
    name: "amount"
  })
  public amount: number | undefined;

  @Column("tinyint", {
    nullable: true,
    name: "paid"
  })
  public paid: number | undefined;

  @Column("timestamp", {
    nullable: true,
    name: "due_date"
  })
  public dueDate: Date | undefined;

  @Column("timestamp", {
    nullable: true,
    name: "issue_date"
  })
  public issueDate: Date | undefined;

  @ManyToOne((_type) => User, (user) => user.invoices, {
    nullable: false,
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn({ name: "user_personal_id_number" })
  public userPersonalIdNumber: User | undefined;
}
