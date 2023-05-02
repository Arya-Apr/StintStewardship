/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTeachersInput {
  @Field()
  teacher_name: string;

  @Field()
  teacher_subject: string;

  @Field()
  username: string;

  @Field()
  password: string;
}
