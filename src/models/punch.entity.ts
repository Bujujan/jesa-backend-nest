import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { System } from './system.entity';

export type PunchStatus = 'OPEN' | 'CLOSED';
export type PunchCategory = 'A' | 'B' | 'C' | 'D';

@Entity('punches')
export class Punch {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: ['OPEN', 'CLOSED'] })
  status: PunchStatus;

  @Column({ type: 'enum', enum: ['A', 'B', 'C', 'D'], nullable: true })
  category: PunchCategory;

  @ManyToOne(() => User)
  created_by: User;

  @ManyToOne(() => User)
  modified_by: User;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => System, system => system.punches, { nullable: true })
  system: System;
}