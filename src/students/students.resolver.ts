import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { StudentsType } from './students.type';
import { StudentsService } from './students.service';
import { CreateStudentInput } from './create-student.input.type';

@Resolver(() => StudentsType)
export class StudentsResolver {
  constructor(private studentsService: StudentsService) {}

  @Mutation(() => StudentsType)
  async createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ) {
    return await this.studentsService.createStudent(createStudentInput);
  }

  @Query(() => [StudentsType])
  getStudents() {
    return this.studentsService.getStudents();
  }
}
