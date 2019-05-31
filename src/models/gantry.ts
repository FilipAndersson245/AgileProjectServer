import { Column, Entity, OneToMany } from "typeorm";
import { Passage } from "./passage";

@Entity("gantry", { schema: "AgileDB" })
export class Gantry {
  @Column("char", {
    nullable: false,
    primary: true,
    length: 12,
    name: "id"
  })
  public id!: string;

  @Column("float", {
    nullable: false,
    name: "latitude"
  })
  public latitude!: number;

  @Column("float", {
    nullable: false,
    name: "longitude"
  })
  public longitude!: number;

  @Column("timestamp", {
    nullable: true,
    name: "lastUpdate"
  })
  public lastUpdate: Date | undefined;

  @Column("int", {
    nullable: false,
    name: "price"
  })
  public price!: number;

  @OneToMany((_type) => Passage, (passage) => passage.gantry, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  public passages!: Array<Passage>;
}
