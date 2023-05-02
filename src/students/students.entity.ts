/* eslint-disable prettier/prettier */
import { Tasks } from 'src/tasks/tasks.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Students')
export class Students {
  @ObjectIdColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  stud_id: string;

  @Column()
  stud_name: string;

  @Column()
  stud_roll: number;

  @Column()
  semester: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToMany(() => Tasks, (tasks) => tasks.task_name, { eager: true })
  @Column()
  tasks: Tasks[];

  @Column()
  role: 'student';
}
