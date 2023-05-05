/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCustomTasksType {
  @Field()
  task_name: string;

  @Field()
  username: string;

  @Field(() => [String], { nullable: true })
  content?: string[];
}
