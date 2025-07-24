import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ProjectUser } from './projectuser.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  sector: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ProjectUser, pu => pu.project)
  users: ProjectUser[];
}
