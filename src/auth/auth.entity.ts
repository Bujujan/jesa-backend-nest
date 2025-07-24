import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Auth {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @CreateDateColumn()
  createdAt: Date;
}

export default Auth;