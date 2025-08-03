import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';
import { System } from './system.entity';

export enum PunchStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum PunchCategory {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

@Entity('punches')
export class Punch {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: PunchStatus, default: PunchStatus.OPEN })
  status: PunchStatus;

  @Column({ type: 'enum', enum: PunchCategory, nullable: true })
  category: PunchCategory;

  @Column({ nullable: true })
  image_url: string;

  @ManyToOne(() => Project, { nullable: false })
  @JoinColumn({ name: 'projectUuid' })
  project: Project;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  modified_by: User;

  @ManyToOne(() => System, (system) => system.punches)
  @JoinColumn({ name: 'system_id' })
  system: System;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}