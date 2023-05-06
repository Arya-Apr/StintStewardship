/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Tasks')
export class PersonalTasks {
  @ObjectIdColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  tasks_id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  task_name: string;

  @Column({ nullable: true })
  content: string[];

  @Column({ nullable: true })
  alloted_user?: string;

  @Column({ nullable: true })
  semester?: number;

  @Column({ nullable: true })
  deadline?: Date;
}
