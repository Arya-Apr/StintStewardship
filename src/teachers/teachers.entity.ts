/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
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

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  teacher_subject: string;

  // @ManyToMany(() => Tasks, (task) => task.task_name, { eager: true })
  @Column({ nullable: true })
  assigned_tasks?: string[];

  @Column()
  role: 'teacher';
}
