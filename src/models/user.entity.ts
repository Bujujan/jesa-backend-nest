import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Punch } from './punch.entity';
import { ProjectUser } from './projectuser.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar' })
  uuid: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Punch, punch => punch.created_by)
  createdPunches: Punch[];

  @OneToMany(() => Punch, punch => punch.modified_by)
  modifiedPunches: Punch[];

  @OneToMany(() => ProjectUser, pu => pu.user)
  projectConnections: ProjectUser[];
}
