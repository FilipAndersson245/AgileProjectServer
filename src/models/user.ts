import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "./invoice";
import { Passage } from "./passage";

@Entity("user", { schema: "AgileDB" })
export class User {
  @Column("varchar", {
    nullable: false,
    length: 64,
    name: "username"
  })
  public username!: string;

  @Column("binary", {
    nullable: false,
    length: 60,
    name: "password"
  })
  public password!: Buffer;

  @PrimaryGeneratedColumn({
    type: "int",
    name: "personal_id_number"
  })
  public personalIdNumber!: number;

  @Column("varchar", {
    nullable: false,
    length: 256,
    name: "email"
  })
  public email!: string;

  @Column("varchar", {
    nullable: false,
    length: 512,
    name: "address"
  })
  public address!: string;

  @Column("varchar", {
    nullable: true,
    length: 64,
    name: "first_name"
  })
  public firstName: string | undefined;

  @Column("varchar", {
    nullable: true,
    length: 64,
    name: "last_name"
  })
  public lastName: string | undefined;

  @OneToMany((_type) => Invoice, (invoice) => invoice.userPersonalIdNumber, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  public invoices!: Array<Invoice>;

  @OneToMany((_type) => Passage, (passage) => passage.userPersonalIdNumber, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  public passages!: Array<Passage>;
}
