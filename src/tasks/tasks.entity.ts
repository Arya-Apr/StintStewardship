/* eslint-disable prettier/prettier */
import { Students } from 'src/students/students.entity';
import { Subject } from 'src/subject/subject.entity';
import { Teachers } from 'src/teachers/teachers.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  ObjectIdColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Tasks')
export class Tasks {
  @ObjectIdColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  tasks_id: string;

  @Column({ unique: true })
  task_name: string;

  @Column()
  semester: number;

  @ManyToOne(() => Subject, (subject) => subject.sub_code, { eager: true })
  @Column()
  subject_code: number;

  // @OneToMany(() => Students, (student) => student.stud_id, { eager: true })
  @Column({ nullable: true })
  alloted_students?: string[];

  @ManyToMany(() => Teachers, (teacher) => teacher.teacher_name, {
    eager: false,
  })
  @Column()
  teachers: Teachers[];
}
