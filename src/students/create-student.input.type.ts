/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class CreateStudentInput {
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
}
