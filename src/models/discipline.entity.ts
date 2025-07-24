import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { System } from "./system.entity";

@Entity('disciplines')
export class Discipline {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @OneToMany(() => System, system => system.discipline)
  systems: System[];
}
