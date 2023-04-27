/* eslint-disable prettier/prettier */
import { Tasks } from 'src/tasks/tasks.entity';
import {
  Column,
  Entity,
  ObjectIdColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Subject')
export class Subject {
  @ObjectIdColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  subject_id: string;

  @Column()
  sub_name: string;

  @Column({ unique: true })
  sub_code: number;

  @OneToMany(() => Tasks, (tasks) => tasks.task_name, { eager: false })
  @Column()
  tasks: Tasks[];
}
