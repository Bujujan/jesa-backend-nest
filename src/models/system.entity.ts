import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Discipline } from './discipline.entity';
import { Punch } from './punch.entity';
import { Project } from './project.entity';

@Entity('systems')
export class System {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  system_number: string;

  @Column()
  description: string;

  @Column()
  area: string;

  @Column()
  system_type: string;

  @Column()
  contractors: string;

  @ManyToOne(() => Discipline, discipline => discipline.systems)
  discipline: Discipline;

  @OneToMany(() => Punch, punch => punch.system)
  punches: Punch[];

  @ManyToOne(() => Project, project => project.systems)
  project: Project;
}
