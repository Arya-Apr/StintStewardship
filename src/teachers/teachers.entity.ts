/* eslint-disable prettier/prettier */
import { Subject } from 'src/subject/subject.entity';
import { Tasks } from 'src/tasks/tasks.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Teachers')
export class Teachers {
  @ObjectIdColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  @Column({ unique: true })
  teacher_id: string;

  @Column()
  teacher_name: string;

  @Column()
  teacher_subject: string;

  @ManyToMany(() => Tasks, (task) => task.task_name, { eager: true })
  @Column()
  assigned_tasks: Tasks[];
}
