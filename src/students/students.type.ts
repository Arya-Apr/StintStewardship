/* eslint-disable prettier/prettier */
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Students')
export class StudentsType {
  @Field(() => ID)
  stud_id: string;

  @Field()
  stud_name: string;

  @Field()
  stud_roll: number;

  @Field()
  semester: number;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field(() => [String])
  tasks: string[];
}
