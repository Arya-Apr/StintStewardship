/* eslint-disable prettier/prettier */
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
@ObjectType('loginUserObject')
export class UserLoginInput {
  @Field()
  @IsString()
  @MaxLength(30)
  username: string;

  @Field()
  @IsString()
  @MinLength(7)
  password: string;

  @Field({ nullable: true })
  accessToken?: string;

  @Field()
  role: string;
}
