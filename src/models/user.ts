import { Column, Entity, OneToMany } from "typeorm";
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

  @Column("varchar", {
    nullable: false,
    primary: true,
    length: 12,
    name: "personal_id_number"
  })
  public personalIdNumber!: string;

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

  @OneToMany((_type) => Invoice, (invoice) => invoice.user, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  public invoices!: Array<Invoice>;

  @OneToMany((_type) => Passage, (passage) => passage.user, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  public passages!: Array<Passage>;
}
