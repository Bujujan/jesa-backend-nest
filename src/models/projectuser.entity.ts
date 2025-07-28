import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('projectusers')
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne('User', 'projectConnections')
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne('Project', 'users')
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'timestamp' })
  assigned_at: Date;
}