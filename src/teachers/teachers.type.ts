/* eslint-disable prettier/prettier */
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Teachers')
export class TeachersType {
  @Field(() => ID)
  teacher_id: string;

  @Field()
  teacher_name: string;

  @Field()
  teacher_subject: string;

  @Field(() => [String])
  assigned_tasks: string[];
}
