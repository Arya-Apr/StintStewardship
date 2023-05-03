/* eslint-disable prettier/prettier */
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StudentsType } from 'src/students/students.type';

@ObjectType('Tasks')
export class TasksType {
  @Field(() => ID)
  tasks_id: string;

  @Field()
  task_name: string;

  @Field()
  semester: number;

  @Field()
  subject_code: number;

  @Field(() => [String], { nullable: true })
  alloted_students?: string[];

  @Field(() => [String])
  alloted_teachers: string[];
}
