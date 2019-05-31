import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Gantry } from "./gantry";
import { User } from "./user";

@Entity("passage", { schema: "AgileDB" })
@Index("fk_passage_gantry1_idx", ["gantry"])
@Index("fk_passage_user1_idx", ["user"])
export class Passage {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id"
  })
  public id!: number;

  @Column("timestamp", {
    nullable: false,
    name: "time"
  })
  public time!: Date;

  @Column("int", {
    nullable: false,
    name: "price"
  })
  public price!: number;

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

  @ManyToOne((_type) => Gantry, (gantry) => gantry.passages, {
    nullable: false,
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn({ name: "gantry_id" })
  public gantry!: Gantry;

  @ManyToOne((_type) => User, (user) => user.passages, {
    nullable: false,
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn({ name: "user_personal_id_number" })
  public user!: User;

  @Column("varchar", {
    nullable: false,
    length: 64,
    name: "user_personal_id_number"
  })
  public userId!: string;
}
