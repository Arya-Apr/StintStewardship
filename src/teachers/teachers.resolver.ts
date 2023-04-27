import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeachersService } from './teachers.service';
import { TeachersType } from './teachers.type';
import { Teachers } from './teachers.entity';
import { CreateTeachersInput } from './create-teacher.input';

@Resolver(() => TeachersType)
export class TeachersResolver {
  constructor(private teachersService: TeachersService) {}

  @Mutation(() => TeachersType)
  async createTeacher(
    createTeacherInput: CreateTeachersInput,
  ): Promise<Teachers> {
    return this.teachersService.createTeacher(createTeacherInput);
  }

  @Query(() => [TeachersType])
  async getTeachers(): Promise<Teachers[]> {
    return this.teachersService.getTeachers();
  }
}
